"use strict";

import { m4 } from "./calc.js";

export class CanvasDrawer {
  constructor(gl, w, h) {
    this.canvasW = w;
    this.canvasH = h;
    this.gl = gl;

    this.translateX = 0;
    this.translateY = 0;
    this.translateZ = 0;
    this.fiX = 0;
    this.fiY = 0;
    this.fiZ = 0;
    this.sX = 1;
    this.sY = 1;
    this.sZ = 1;
  }

  translate(tx, ty, tz) {
    this.translateX = tx;
    this.translateY = ty;
    this.translateZ = tz;
  }

  rotate(fiX, fiY, fiZ) {
    this.fiX = fiX;
    this.fiY = fiY;
    this.fiZ = fiZ;
  }

  scale(sX, sY, sZ) {
    this.sX = sX;
    this.sY = sY;
    this.sZ = sZ;
  }

  _createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }

  _createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    this.gl.linkProgram(program);

    const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) return program;

    console.log("create program fail", this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }

  setupCanvas() {
    //1. init phase
    if (this.gl === null) {
      alert(
        "Unable to initialize webGL. Your browser or machine may not support it."
      );
      return;
    }

    // 1.a Set up shaders
    const vertexShaderSrc = document.querySelector("#vertex-shader-2d").text;
    const fragmentShaderSrc = document.querySelector(
      "#fragment-shader-2d"
    ).text;

    const vertexShader = this._createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSrc
    );
    const fragmentShader = this._createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSrc
    );

    // 1.b create program
    const program = this._createProgram(vertexShader, fragmentShader);

    //1.c supply data to our program
    this.posAttribLoc = this.gl.getAttribLocation(program, "a_position");
    this.matrixAttribLoc = this.gl.getUniformLocation(program, "u_matrix");

    //construct vertex array
    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);

    this._createObject();

    //2. rendering phase
    this._drawScene(program, posBuffer);
  }

  _drawScene(program, posBuffer) {
    // Clear the canvas
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program);

    // Turn on the attribute and bind the position buffer
    this.gl.enableVertexAttribArray(this.posAttribLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3; // 3 components per iteration
    var type = this.gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    this.gl.vertexAttribPointer(
      this.posAttribLoc,
      size,
      type,
      normalize,
      stride,
      offset
    );

    let matrix = m4.projection(this.canvasW, this.canvasH, 1000);
    matrix = m4.translate(
      matrix,
      this.translateX,
      this.translateY,
      this.translateZ
    );
    matrix = m4.rotateX(matrix, this.fiX);
    matrix = m4.rotateY(matrix, this.fiY);
    matrix = m4.rotateZ(matrix, this.fiZ);
    matrix = m4.scale(matrix, this.sX, this.sY, this.sZ);
    // set up matrix
    this.gl.uniformMatrix4fv(this.matrixAttribLoc, false, matrix);

    // draw
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    this.gl.drawArrays(primitiveType, offset, count);
  }

  _createObject() {
    //prettier-ignore
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            250, 0, 0,
            0, 250,  0,
            500, 250, 0
          ]), this.gl.STATIC_DRAW);
  }
}
