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

    static computeGraphics(gl, objects, computeMatrix, camera, degToRad) {

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
            object.uniforms.u_matrix = computeMatrix(
                viewProjectionMatrix,
                object,
                degToRad
            );
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

    static computeMatrix(viewProjectionMatrix, object, degToRad) {
        let matrix = matrix4.translate(
            viewProjectionMatrix,
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

        const degToRad = canvasController.degToRad;

        utils.resizeCanvasToDisplaySize(gl.canvas);

        canvasController.setupGl(gl);

        canvasController.computeGraphics(gl, objects, computeMatrix, camera, degToRad)
        canvasController.updateGraphics(gl, objects);

        requestAnimationFrame(canvasController.update);
    }

    static construct() {
        const canvas = document.querySelector(".canvas");
        const gl = canvas.getContext("webgl");

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

        canvasController.camera = {
            position: new vector3(0, 0, 100),
            rotation: new vector3(0, 0, 0),

            targetSub: new vector3(0, 0, -100),
            up: new vector3(0, 1, 0),
            v3Zero: vector3.zero(),

            fieldOfView: 60,
            zNear: 1,
            zFar: 500
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