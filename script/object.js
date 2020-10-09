"use strict";

class object {
    constructor(uniforms, position, rotation, scale, programInfo, bufferInfo) {
        this.uniforms    = uniforms;
        this.position    = position;
        this.rotation    = rotation;
        this.scale       = scale;

        this.programInfo = programInfo;
        this.bufferInfo  = bufferInfo;
    }
}