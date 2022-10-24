export const m4 = {
  multiply: function (b, a) {
    //prettier-ignore
    const [
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33,
      ] = a;

    //prettier-ignore
    const [
        b00, b01, b02, b03,
        b10, b11, b12, b13,
        b20, b21, b22, b23,
        b30, b31, b32, b33,
      ] = b;

    //prettier-ignore
    return [(a00*b00) + (a01*b10) + (a02*b20) + (a03*b30),
              (a00*b01) + (a01*b11) + (a02*b21) + (a03*b31),
              (a00*b02) + (a01*b12) + (a02*b22) + (a03*b32),
              (a00*b03) + (a01*b13) + (a02*b23) + (a03*b33),
              (a10*b00) + (a11*b10) + (a12*b20) + (a13*b30),
              (a10*b01) + (a11*b11) + (a12*b21) + (a13*b31),
              (a10*b02) + (a11*b12) + (a12*b22) + (a13*b32),
              (a10*b03) + (a11*b13) + (a12*b23) + (a13*b33),
              (a20*b00) + (a21*b10) + (a22*b20) + (a23*b30),
              (a20*b01) + (a21*b11) + (a22*b21) + (a23*b31),
              (a20*b02) + (a21*b12) + (a22*b22) + (a23*b32),
              (a20*b03) + (a21*b13) + (a22*b23) + (a23*b33),
              (a30*b00) + (a31*b10) + (a32*b20) + (a33*b30),
              (a30*b01) + (a31*b11) + (a32*b21) + (a33*b31),
              (a30*b02) + (a31*b12) + (a32*b22) + (a33*b32),
              (a30*b03) + (a31*b13) + (a32*b23) + (a33*b33),
              ]
  },

  perspective: function (fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);
    //prettier-ignore
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  translation: function (x, y, z) {
    //prettier-ignore
    return [
          1, 0, 0, 0,   
          0, 1, 0, 0,   
          0, 0, 1, 0,
          x, y, z, 1,
      ];
  },

  rotationZ: function (fi) {
    const rad = fi * (Math.PI / 180);

    //prettier-ignore
    return [
          Math.cos(rad), -Math.sin(rad),    0, 0,
          Math.sin(rad),  Math.cos(rad),  0, 0,
          0,              0,              1,  0,
          0,              0,              0,  1
      ];
  },
  rotationX: function (fi) {
    const rad = fi * (Math.PI / 180);

    //prettier-ignore
    return [
          1,      0,              0,          0,
          0, Math.cos(rad),   Math.sin(rad),  0,
          0, -Math.sin(rad),  Math.cos(rad),  0, 
          0,              0,          0,      1,
      ];
  },
  rotationY: function (fi) {
    const rad = fi * (Math.PI / 180);

    //prettier-ignore
    return [
          Math.cos(rad),  0,   -Math.sin(rad),    0,
              0,          1,          0,          0,
          Math.sin(rad),  0,   Math.cos(rad),     0, 
              0,          0,          0,          1,
      ];
  },

  scaling: function (sx, sy, sz) {
    //prettier-ignore
    return [
          sx, 0,  0,  0,
          0,  sy, 0,  0,
          0,  0,  sz, 0,
          0,  0,  0,  1
      ];
  },

  identity: function () {
    //prettier-ignore
    return [
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
      ]
  },

  lookAt: function (camPos, target, up) {
    const camDir = this.normalizeV(this.createV(target, camPos));
    const camRight = this.normalizeV(this.cross(up, camDir)); //right axis
    const camUp = this.normalizeV(this.cross(camDir, camRight)); //up axis

    //prettier-ignore
    /*     return m4.multiply([
      camRight.x, camRight.y, camRight.z, 0,
      camUp.x,    camUp.y,    camUp.z,    0,
      camDir.x,   camDir.y,   camDir.z,   0,
      0,          0,          0,          1
    ],[
      1, 0, 0, -camPos.x,
      0, 1, 0, -camPos.y,
      0, 0, 1, -camPos.y,
      0, 0, 0, 1,
    ]); */

    //OLD rubbish from the web
    //prettier-ignore
    return [
       camRight.x,  camRight.y, camRight.z, 0,
       camUp.x,     camUp.y,    camUp.z,    0,
       camDir.x,    camDir.y,   camDir.z,   0,
       camPos.x,    camPos.y,   camPos.z,   1,
    ];
  },

  transpose: function (m) {
    //prettier-ignore
    return [
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15],
    ];
  },

  inverse: function (m) {
    const m00 = m[0]; // m[0][0]
    const m01 = m[1]; // m[0][1]
    const m02 = m[2]; // m[0][2]
    const m03 = m[3]; // m[0][3]
    const m10 = m[4]; // m[1][0]
    const m11 = m[5]; // m[1][1]
    const m12 = m[6]; // m[1][2]
    const m13 = m[7]; // m[1][3]
    const m20 = m[8]; // m[2][0]
    const m21 = m[9]; // m[2][1]
    const m22 = m[10]; // m[2][2]
    const m23 = m[11]; // m[2][3]
    const m30 = m[12]; // m[3][0]
    const m31 = m[13]; // m[3][1]
    const m32 = m[14]; // m[3][2]
    const m33 = m[15]; // m[3][3]

    const tmp_0 = m22 * m33;
    const tmp_1 = m32 * m23;
    const tmp_2 = m12 * m33;
    const tmp_3 = m32 * m13;
    const tmp_4 = m12 * m23;
    const tmp_5 = m22 * m13;
    const tmp_6 = m02 * m33;
    const tmp_7 = m32 * m03;
    const tmp_8 = m02 * m23;
    const tmp_9 = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    //prettier-ignore
    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    //prettier-ignore
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    //prettier-ignore
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    //prettier-ignore
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    //prettier-ignore
    return [
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ];
  },

  normalizeM: function (w, h, depth) {
    //prettier-ignore
    return [
      2/w, 0, 0, 0,
      0, 2/h, 0, 0,
      0, 0, 1/depth, 0,
      -1, 0.5, 0, 1
    ];
  },

  createV: function (p0, p1) {
    return { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
  },

  normalizeV: function (v) {
    const magn = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

    return { x: v.x / magn, y: v.y / magn, z: v.z / magn };
  },

  cross: function (va, vb) {
    const i = va.y * vb.z - va.z * vb.y;
    const j = va.x * vb.z - va.z * vb.x;
    const k = va.x * vb.y - va.y * vb.x;
    return { x: i, y: -j, z: k };
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, this.translation(tx, ty, tz));
  },
  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, this.scaling(sx, sy, sz));
  },
  rotateX: function (m, fi) {
    return m4.multiply(m, this.rotationX(fi));
  },
  rotateY: function (m, fi) {
    return m4.multiply(m, this.rotationY(fi));
  },
  rotateZ: function (m, fi) {
    return m4.multiply(m, this.rotationZ(fi));
  },
};
