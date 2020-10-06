class WebglUtils {
    constructor() {

    }

    resizeCanvasToDisplaySize(canvas) {
        const width  = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== width ||  canvas.height !== height) {
            canvas.width  = width;
            canvas.height = height;
            return true;
        }

        return false;
    }

    createProgramFromScripts(gl, shaderScriptIds, shaderScriptTypes) {
        const shaders = [];
        for (let i = 0; i < shaderScriptIds.length; ++i) {
            shaders.push(this.createShaderFromScript(gl, shaderScriptIds[i], gl[shaderScriptTypes[i]]));
        }

        return this.createProgram(gl, shaders);
    }

    createShaderFromScript(gl, scriptId, shaderType) {
        let shaderSource = '';
        const shaderScript = document.getElementById(scriptId);

        if (!shaderScript) {
            throw ('*** Error: unknown script element' + scriptId);
        }

        if (!shaderType)
        {
            throw ('*** Error: unknown script type' + scriptId);
        }

        shaderSource = shaderScript.text;

        return this.loadShader(gl, shaderSource, shaderType)
    }

    loadShader(gl, shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            const lastError = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw ('*** Error compiling shader \'' + shader + '\':' + lastError);
        }

        return shader;
    }

    createProgram(gl, shaders) {
        const program = gl.createProgram();

        shaders.forEach(function(shader) {
            gl.attachShader(program, shader);
        });

        gl.linkProgram(program);

        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            const lastError = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);

            throw ('Error in program linking:' + lastError);
        }

        return program;
    }

    setUniforms(setters, ...values) {
        setters = setters.uniformSetters || setters;
        for (const uniforms of values) {
            Object.keys(uniforms).forEach(function(name) {
                const setter = setters[name];
                if (setter) {
                    setter(uniforms[name]);
                }
            });
        }
    }
}
