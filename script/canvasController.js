"use strict";

class canvasController {

    static gl;
    static programInfo;

    static degToRad = Math.PI / 180;

    static objects = [];

    static camera;

    static setupGl(gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    static setupShapes(gl) {
        const sphereBufferInfo = shapesInfo.createSphere(gl, 10, 120, 60);
        const cubeBufferInfo   = shapesInfo.createCube(gl, 20);
        const coneBufferInfo   = shapesInfo.createCone(gl, 10, 0, 20, 12, 1, true, false);

        canvasController.shapes = {
            "sphere": sphereBufferInfo,
            "cube"  : cubeBufferInfo,
            "cone"  : coneBufferInfo
        };

        Object.freeze(canvasController.shapes);
    }

    static computeGraphics(gl, objects, computeMatrix, camera, degToRad, firstLight, secondLight) {

        const fov = camera.fieldOfView * degToRad;
        const zNear = camera.zNear;
        const zFar = camera.zFar;

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = matrix4.perspective(fov, aspect, zNear, zFar);

        const cPosition = camera.position;
        const cTarget = new vector3(
            camera.position.x + camera.targetSub.x,
            camera.position.y + camera.targetSub.y,
            camera.position.z + camera.targetSub.z
        );
        const up = vector3.copy(camera.up);

        cTarget.xRotateAround(camera.rotation.x * degToRad, cPosition);
        cTarget.yRotateAround(camera.rotation.y * degToRad, cPosition);
        up.zRotateAround(camera.rotation.z * degToRad, camera.v3Zero);

        const cameraMatrix = matrix4.lookAt(
            cPosition.toArray(), cTarget.toArray(), up.toArray()
        );

        let viewMatrix = matrix4.inverse(cameraMatrix);

        let viewProjectionMatrix = matrix4.multiply(projectionMatrix, viewMatrix);

        objects.forEach(function(object) {
            object.uniforms.u_world = computeMatrix(
                matrix4.identity(),
                object,
                degToRad
            );

            object.uniforms.u_matrix = matrix4.multiply(
                viewProjectionMatrix,
                object.uniforms.u_world
            );

            object.uniforms.u_worldInverse = matrix4.inverse(
                object.uniforms.u_world
            );

            object.uniforms.u_worldInverse = matrix4.transpose(
                object.uniforms.u_worldInverse
            )

            object.uniforms.u_ambientColor = [
                camera.ambientColor.x,
                camera.ambientColor.y,
                camera.ambientColor.z
            ];

            object.uniforms.u_firstLightPosition = [
                firstLight.position.x,
                firstLight.position.y,
                firstLight.position.z
            ];

            object.uniforms.u_firstLightColor = [
                firstLight.color.x,
                firstLight.color.y,
                firstLight.color.z
            ];

            object.uniforms.u_firstLightShininess = firstLight.shininess;
            object.uniforms.u_firstLightAttenuation = firstLight.attenuation;

            object.uniforms.u_secondLightPosition = [
                secondLight.position.x,
                secondLight.position.y,
                secondLight.position.z
            ];

            object.uniforms.u_secondLightColor = [
                secondLight.color.x,
                secondLight.color.y,
                secondLight.color.z
            ];

            object.uniforms.u_secondLightShininess = secondLight.shininess;
            object.uniforms.u_secondLightAttenuation = secondLight.attenuation;
        });
    }

    static updateGraphics(gl, objects) {
        let lastUsedProgramInfo = null;
        let lastUsedBufferInfo = null;

        objects.forEach(function(object) {
            let programInfo = object.programInfo;
            let bufferInfo = object.bufferInfo;
            let bindBuffers = false;

            if (programInfo !== lastUsedProgramInfo) {
                lastUsedProgramInfo = programInfo;
                gl.useProgram(programInfo.program);

                bindBuffers = true;
            }

            if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
                lastUsedBufferInfo = bufferInfo;
                utils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            }

            utils.setUniforms(programInfo, object.uniforms);

            gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
        });

    }

    static computeMatrix(matrix, object, degToRad) {
        matrix = matrix4.translate(
            matrix,
            object.position.x,
            object.position.y,
            object.position.z
        );

        matrix = matrix4.rotate(
            matrix,
            object.rotation.x * degToRad,
            object.rotation.y * degToRad,
            object.rotation.z * degToRad
        );

        matrix = matrix4.scale(
            matrix,
            object.scale.x,
            object.scale.y,
            object.scale.z
        );

        return matrix;
    }

    static update() {
        const objects = canvasController.objects;
        const gl = canvasController.gl;

        const computeMatrix = canvasController.computeMatrix;
        const camera = canvasController.camera;

        const firstLight = canvasController.firstLight;
        const secondLight = canvasController.secondLight;

        const degToRad = canvasController.degToRad;

        utils.resizeCanvasToDisplaySize(gl.canvas);

        canvasController.setupGl(gl);

        canvasController.computeGraphics(gl, objects, computeMatrix, camera, degToRad, firstLight, secondLight)
        canvasController.updateGraphics(gl, objects);

        requestAnimationFrame(canvasController.update);
    }

    static construct() {
        const canvas = document.querySelector(".canvas");
        let gl = canvas.getContext("webgl");

        canvasController.gl = gl;

        if (!gl) {
            return;
        }


        canvasController.setupShapes(gl, this)

        canvasController.programInfo = utils.createProgramInfo(
            gl,
            [
                "vertex-shader-3d",
                "fragment-shader-3d"
            ],
            [
                "VERTEX_SHADER",
                "FRAGMENT_SHADER",
            ]
        );

        canvasController.fieldOfView = 60 * canvasController.degToRad;

        canvasController.objects = [];

        canvasController.lightPosition = gl.getUniformLocation(
            canvasController.programInfo.program,
            "u_lightPosition"
        );

        canvasController.lightTarget = gl.getUniformLocation(
            canvasController.programInfo.program,
            "u_lightTarget"
        );

        canvasController.camera = {
            position: new vector3(0, 0, 100),
            rotation: new vector3(0, 0, 0),

            targetSub: new vector3(0, 0, -100),
            up: new vector3(0, 1, 0),
            v3Zero: vector3.zero(),

            fieldOfView: 60,
            zNear: 1,
            zFar: 500,

            ambientColor: new vector3(.2, .2, .2)
        }

        canvasController.firstLight = {
            position: new vector3(0, 0, 20),
            color: new vector3(1, 1, 1),

            shininess: 20,
            attenuation: .2
        }


        canvasController.secondLight = {
            position: new vector3(0, 20, 0),
            color: new vector3(1, 1, 1),

            shininess: 20,
            attenuation: .2
        }

        requestAnimationFrame(canvasController.update);
    }

    static createObject(shape) {
        const rand = utils.rand;
        const uniforms = {
            u_colorMult: [
                rand(.25, .75), rand(.25, .75), rand(.25, .75), 1
            ],
            u_matrix: matrix4.identity(),
            u_world: matrix4.one(),
            u_worldInverse: matrix4.one(),

            u_ambientColor: [.2, .2, .2],

            u_firstLightPosition: [0, 0, 20],
            u_firstLightColor: [1, 1, 1],
            u_firstLightShininess: 20,
            u_firstLightAttenuation: .2,

            u_secondLightPosition: [-20, 0, 0],
            u_secondLightColor: [1, 1, 1],
            u_secondLightShininess: 20,
            u_secondLightAttenuation: .2,
    }

        const position = vector3.zero();
        const rotation = vector3.zero();
        const scale = vector3.one();

        const programInfo = this.programInfo;

        const o = new object(
            uniforms,
            position,
            rotation,
            scale,
            programInfo,
            shape
        );

        this.objects.push(o)
    }

    static removeObject(index) {
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }
}