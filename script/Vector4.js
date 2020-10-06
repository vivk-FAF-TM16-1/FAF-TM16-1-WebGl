"use strict";

let ArrayType = Float32Array;

let mi0 = 4 * 0;
let mi1 = 4 * 1;
let mi2 = 4 * 2;
let mi3 = 4 * 3;

let Vector4 = class {
    // region Math

    static normalize(v, dst) {
        dst = dst || new ArrayType(3);

        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

        if (length > 0.00001) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }

        return dst;
    }

    static cross(a, b, dst) {
        dst = dst || new ArrayType(3);

        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];

        return dst;
    }

    static subtractVectors(a, b, dst) {
        dst = dst || new ArrayType(3);

        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];

        return dst;
    }

    static multiply(a, b, dst) {
        dst = dst || new ArrayType(16);

        for (let i = 0; i < 16; ++i) {
            let base_i = Math.trunc(i / 4);
            let base = base_i * 4;
            let reminder = i % 4;

            dst[i] = b[base + 0] * a[mi0 + reminder]
                + b[base + 1] * a[mi1 + reminder]
                + b[base + 2] * a[mi2 + reminder]
                + b[base + 3] * a[mi3 + reminder];
        }

        return dst;
    }


    static inverse(m, dst) {
        dst = dst || new ArrayType(16);

        // f*k math
        dst[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] +
            m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];

        dst[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] -
            m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];

        dst[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] +
            m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];

        dst[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] -
            m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];

        dst[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] -
            m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];

        dst[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] +
            m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];

        dst[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] -
            m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];

        dst[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] +
            m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];

        dst[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] +
            m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];

        dst[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] -
            m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];

        dst[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] +
            m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];

        dst[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] -
            m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];

        dst[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] -
            m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];

        dst[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] +
            m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];

        dst[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] -
            m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];

        dst[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] +
            m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];

        let det = m[0] * dst[0] + m[1] * dst[4] + m[2] * dst[8] + m[3] * dst[12];
        for (let i = 0; i < 16; ++i) {
            dst[i] /= det;
        }

        return dst;
    }

    // endregion

    static identity(dst) {
        dst = dst || new ArrayType(16);

        dst[0] = 1;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = 1;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static translate(m, tx, ty, tz, dst) {
        dst = dst || new ArrayType(16);

        if (m !== dst) {
            for (let i = 0; i < 4; ++i) {
                dst[mi0 + i] = m[mi0 + i];
                dst[mi1 + i] = m[mi1 + i];
                dst[mi2 + i] = m[mi2 + i];
            }
        }

        for (let i = 0; i < 4; ++i) {
            dst[mi3 + i] = m[mi0 + i] * tx + m[mi1 + i] * ty + m[mi2 + i] * tz + m[mi3 + i];
        }

        return dst;
    }

    static perspective(fieldOfViewInRadians, aspect, near, far, dst) {
        dst = dst || new ArrayType(16);

        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        dst[0] = f / aspect;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = f;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = (near + far) * rangeInv;
        dst[11] = -1;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = near * far * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }

    static lookAt(cameraPosition, target, up, dst) {
        dst = dst || new ArrayType(16);

        const zAxis = Vector4.normalize(Vector4.subtractVectors(cameraPosition, target));
        const xAxis = Vector4.normalize(Vector4.cross(up, zAxis));
        const yAxis = Vector4.normalize(Vector4.cross(zAxis, xAxis));

        dst[0] = xAxis[0];
        dst[1] = xAxis[1];
        dst[2] = xAxis[2];
        dst[3] = 0;
        dst[4] = yAxis[0];
        dst[5] = yAxis[1];
        dst[6] = yAxis[2];
        dst[7] = 0;
        dst[8] = zAxis[0];
        dst[9] = zAxis[1];
        dst[10] = zAxis[2];
        dst[11] = 0;
        dst[12] = cameraPosition[0];
        dst[13] = cameraPosition[1];
        dst[14] = cameraPosition[2];
        dst[15] = 1;

        return dst;
    }

    // region Rotation
    static xRotation(angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        dst[0] = 1;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = c;
        dst[6] = s;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = -s;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static yRotation(angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        dst[0] = c;
        dst[1] = 0;
        dst[2] = -s;
        dst[3] = 0;
        dst[4] = 0;
        dst[5] = 1;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = s;
        dst[9] = 0;
        dst[10] = c;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }

    static zRotation(angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        dst[0] = c;
        dst[1] = s;
        dst[2] = 0;
        dst[3] = 0;
        dst[4] = -s;
        dst[5] = c;
        dst[6] = 0;
        dst[7] = 0;
        dst[8] = 0;
        dst[9] = 0;
        dst[10] = 1;
        dst[11] = 0;
        dst[12] = 0;
        dst[13] = 0;
        dst[14] = 0;
        dst[15] = 1;

        return dst;
    }
    // endregion

    // region Rotate
    static xRotate(m, angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        for (let i = 0; i < 4; ++i) {
            dst[mi1 + i] = c * m[mi1 + i] + s * m[mi2 + i];
            dst[mi2 + i] = c * m[mi2 + i] - s * m[mi1 + i];
        }

        if (m !== dst) {
            for (let i = 0; i < 4; ++i) {
                dst[mi0 + i] = m[mi0 + i];
                dst[mi3 + i] = m[mi3 + i];
            }
        }

        return dst;
    }


    static yRotate(m, angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        for (let i = 0; i < 4; ++i) {
            dst[mi0 + i] = c * m[mi0 + i] - s * m[mi2 + i];
            dst[mi2 + i] = c * m[mi2 + i] + s * m[mi0 + i];
        }

        if (m !== dst) {
            for (let i = 0; i < 4; ++i) {
                dst[mi1 + i] = m[mi1 + i];
                dst[mi3 + i] = m[mi3 + i];
            }
        }

        return dst;
    }

    static zRotate(m, angleInRadians, dst) {
        dst = dst || new ArrayType(16);

        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        for (let i = 0; i < 4; ++i) {
            dst[mi0 + i] = c * m[mi0 + i] + s * m[mi1 + i];
            dst[mi1 + i] = c * m[mi1 + i] - s * m[mi0 + i];
        }

        if (m !== dst) {
            for (let i = 0; i < 4; ++i){
                dst[mi2 + i] = m[mi2 + i];
                dst[mi3 + i] = m[mi3 + i];
            }
        }

        return dst;
    }
    // endregion
};