"use strict";

let canvas;
let gl;
let programInfo;

const webgl = new WebglUtils();

let objectsToDraw = [];
let objects = [];

let shapes = [];

let fieldOfViewRadians;

function main() {
    canvas = document.querySelector(".canvas");
    gl = canvas.getContext("webgl");

    if (!gl) {
        return;
    }

    const sphereBufferInfo = Shape.createSphere(gl, 10, 120, 60);
    const cubeBufferInfo   = Shape.createCube(gl, 20);
    const coneBufferInfo   = Shape.createCone(gl, 10, 0, 20, 12, 1, true, false);

    shapes = [
        sphereBufferInfo,
        cubeBufferInfo,
        coneBufferInfo,
    ];

    programInfo = webglUtils.createProgramInfo(gl,
        ["vertex-shader-3d", "fragment-shader-3d"]);

    fieldOfViewRadians = degToRad(60);

    objectsToDraw = [];
    objects = [];

    let numObjects = 10;

    /*
    for (let i = 0; i < numObjects; ++i) {
        let object = {
            uniforms: {
                u_colorMult: [rand(.25, .75), rand(.25, .75), rand(.25, .75), 1.],
                u_matrix: Vector4.identity(),
            },
            translation: [rand(-100, 100), rand(-100, 100), rand(-150, -50)],
            xRotationSpeed: rand(0.8, 1.2),
            yRotationSpeed: rand(0.8, 1.2),
        };

        objects.push(object);
        objectsToDraw.push({
            programInfo: programInfo,
            bufferInfo: shapes[i % shapes.length],
            uniforms: object.uniforms,
        });
    }
    */

    requestAnimationFrame(drawScene);

    function drawScene(time) {
        time *= 0.0005;

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = Vector4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        const cameraPosition = [0, 0, 100];
        const target = [0, 0, 0];
        const up = [0, 1, 0];
        const cameraMatrix = Vector4.lookAt(cameraPosition, target, up);

        let viewMatrix = Vector4.inverse(cameraMatrix);

        let viewProjectionMatrix = Vector4.multiply(projectionMatrix, viewMatrix);

        objects.forEach(function(object) {
            object.uniforms.u_matrix = computeMatrix(
                viewProjectionMatrix,
                object.translation,
                object.xRotationSpeed * 1,
                object.yRotationSpeed * 1);
        });

        let lastUsedProgramInfo = null;
        let lastUsedBufferInfo = null;

        objectsToDraw.forEach(function(object) {
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
                webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            }

            webglUtils.setUniforms(programInfo, object.uniforms);

            gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
        });

        requestAnimationFrame(drawScene);
    }
}

function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
    let matrix = Vector4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);

    matrix = Vector4.xRotate(matrix, xRotation);
    matrix = Vector4.yRotate(matrix, yRotation);

    return matrix;
}

function degToRad(d) {
    return d * Math.PI / 180;
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function objectConstructor() {
    let object = {
        uniforms: {
            u_colorMult: [rand(.25, .75), rand(.25, .75), rand(.25, .75), 1],
            u_matrix: Vector4.identity(),
        },
        translation: [0, 0, 0],
        xRotationSpeed: rand(0.8, 1.2),
        yRotationSpeed: rand(0.8, 1.2),
    };

    objects.push(object);
    objectsToDraw.push({
        programInfo: programInfo,
        bufferInfo: shapes[0],
        uniforms: object.uniforms,
    });
}

function removeObject(index) {
    if (index > -1) {
        objectsToDraw.splice(index, 1);
        objects.splice(index, 1)
    }
}

main();
