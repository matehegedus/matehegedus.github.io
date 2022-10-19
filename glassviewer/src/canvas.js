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
    this.colorAttribLoc = this.gl.getAttribLocation(program, "a_color");
    this.matrixAttribLoc = this.gl.getUniformLocation(program, "u_matrix");

    //construct vertex array
    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    this._createObject();

    //construct color
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this._createColor();

    //2. rendering phase
    this._drawScene(program, posBuffer, colorBuffer);
  }

  _drawScene(program, posBuffer, colorBuffer) {
    this.gl.enable(this.gl.DEPTH_TEST);

    // Clear the canvas
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program);

    // Turn on the attribute and bind the position buffer
    this.gl.enableVertexAttribArray(this.posAttribLoc);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);

    //POSITION
    {
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
    }

    //COLOR
    {
      this.gl.enableVertexAttribArray(this.colorAttribLoc);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
      const size = 3;
      const type = this.gl.UNSIGNED_BYTE;
      const normalize = true;
      const stride = 0;
      const offs = 0;

      this.gl.vertexAttribPointer(
        this.colorAttribLoc,
        size,
        type,
        normalize,
        stride,
        offs
      );
    }

    const aspect = this.canvasW / this.canvasH;
    const zNear = 1;
    const zFar = 2000;
    const fieldOfViewRadians = 45 * (Math.PI / 180);
    let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

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
    {
      var primitiveType = this.gl.TRIANGLES;
      var offset = 0;
      var count = 18;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }

  _createColor() {
    //prettier-ignore
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array([
         //front
         250, 0, 0,
         250, 0,  0,
         250, 0, 0,

         //left
         0, 0, 100,
         0, 0, 100,
         0, 0, 100,
         //right
         0, 100, 50,
         0, 100, 50,
         0, 100, 50,
         //rear
         100, 100, 50,
         100, 100, 50,
         100, 100, 50,
         
         //bottom
         200, 100, 150,
         200, 100, 150,
         200, 100, 150,
         200, 100, 150,
         200, 100, 150,
         200, 100, 150,
    ]), this.gl.STATIC_DRAW);
  }

  _createObject() {
    //prettier-ignore
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            //front
            250, 0, 100,
            0, 250,  0,
            500, 250, 0,

            //left
            250, 0, 100,
            0, 250,  0,
            0, 250, 200,

            //right
            250, 0, 100,
            500, 250,  0,
            500, 250, 200,

            //rear
            250, 0, 100,
            0, 250, 200,
            500, 250, 200,

            //bottom
            0, 250, 0,
            0, 250, 200,
            500, 250, 200,
            0, 250, 0,
            500, 250, 0,
            500, 250, 200,


          ]), this.gl.STATIC_DRAW);
  }
}
