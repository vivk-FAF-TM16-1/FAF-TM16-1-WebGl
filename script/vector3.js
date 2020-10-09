"use strict";

class vector3{
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static zero() {
        return new this(
            0, 0, 0
        );
    }

    static one() {
        return new this(
            1, 1, 1
        );
    }
}
