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
          Math.cos(rad), Math.sin(rad),    0, 0,
          -Math.sin(rad),  Math.cos(rad),  0, 0,
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
