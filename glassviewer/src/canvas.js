"use strict";

import { m4 } from "./calc.js";
import earcut from "earcut";

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

    this.cameraAngle = 0;
    this.shapesSide = [];

    {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const pathElem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");

      pathElem.setAttribute(
        "d",
        "M 10,10 L 80,10 A 10,10 0,0,1 90,20 L 90,80 A 10,10 0,0,1 80,90  L 60,90 Z"
      );
      pathElem.setAttribute("stroke", "black");
      pathElem.setAttribute("stroke-width", "3");
      pathElem.setAttribute("fill", "none");

      svg.appendChild(pathElem);

      this.toVertex(pathElem, 5);
    }
    //drillhole
    {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const pathElem = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      svg.setAttribute("width", "100");
      svg.setAttribute("height", "100");

      const cx = 50;
      const cy = 40;
      const r = 10;
      pathElem.setAttribute(
        "d",
        ` M ${cx - r} ${cy}
          a ${r},${r} 0 1,0 ${r * 2},0
          a ${r},${r} 0 1,0 ${-(r * 2)},0`
      );
      pathElem.setAttribute("stroke", "black");
      pathElem.setAttribute("stroke-width", "3");
      pathElem.setAttribute("fill", "none");

      svg.appendChild(pathElem);

      this.toCutout(pathElem, 2);
    }
  }

  /**
   * @param {SVG Elem} pathSVG: basically any path (rect, circle, path..)
   * @param {Number} n: distance between 2 vertices
   * @returns vertex buffer;
   */
  toVertex(pathSVG, n) {
    let pathLength = pathSVG.getTotalLength();
    this.coordsFront = [];
    this.coordsBottom = [];
    var i = 0;
    while (i < pathLength) {
      let arr = pathSVG.getPointAtLength(i);

      //push side segments
      if (i > 0)
        this.shapesSide.push([
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          0,
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          -20,
          arr.x,
          arr.y,
          0,
          arr.x,
          arr.y,
          -20,
        ]);

      this.coordsFront.push(arr.x, arr.y, 0);
      this.coordsBottom.push(arr.x, arr.y, -20);

      i += n;
    }
  }
  toCutout(pathSVG, n) {
    let pathLength = pathSVG.getTotalLength();
    var i = 0;
    while (i < pathLength) {
      let arr = pathSVG.getPointAtLength(i);

      //push side segments
      if (i > 0)
        this.shapesSide.push([
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          0,
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          -20,
          arr.x,
          arr.y,
          0,
          arr.x,
          arr.y,
          -20,
        ]);

      this.coordsFront.push(arr.x, arr.y, 0);
      this.coordsBottom.push(arr.x, arr.y, -20);

      i += n;
    }
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
    //this._createObject();

    //construct color
    const colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this._createColor();

    this.posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
    this._createShapeObject();

    //2. rendering phase
    this._drawScene(program, colorBuffer);
  }

  _drawScene(program, colorBuffer) {
    this.gl.enable(this.gl.DEPTH_TEST);

    // Clear the canvas
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
    // this._createShapeIndexes();

    //POSITION
    {
      // Turn on the attribute and bind the position buffer
      this.gl.enableVertexAttribArray(this.posAttribLoc);

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
    /*     {
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
    } */
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
    //Projection
    const aspect = this.canvasW / this.canvasH;
    const zNear = 1;
    const zFar = 2000;
    const fieldOfViewRadians = 45 * (Math.PI / 180);
    let projMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Camera
    const radius = 100;

    let cameraMatrix = m4.rotationY(this.cameraAngle);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    const viewMatrix = m4.inverse(cameraMatrix);

    const viewProjMatrix = m4.multiply(projMatrix, viewMatrix);

    let matrix = m4.translate(
      viewProjMatrix,
      this.translateX,
      this.translateY,
      this.translateZ
    );

    matrix = m4.rotateX(matrix, this.fiX);
    matrix = m4.rotateY(matrix, this.fiY);
    matrix = m4.rotateZ(matrix, this.fiZ);
    matrix = m4.scale(matrix, this.sX, this.sY, this.sZ);
    // set up matrix
    this.gl.uniformMatrix4fv(
      this.matrixAttribLoc,
      false,
      //m4.normalizeM(this.canvasW, this.canvasH, 1)
      matrix
    );

    // draw
    for (let i = 0; i <= 1; ++i) {
      this._createShapeObject(i === 0 ? this.coordsFront : this.coordsBottom);
      this._createShapeIndexes(this.coordsFront);
      const primitiveType = this.gl.TRIANGLES;
      const count = this.indexes.length;
      const indexType = this.gl.UNSIGNED_SHORT;
      this.gl.drawElements(primitiveType, count, indexType, this.indexes);
    }
    //side
    for (let i = 0; i < this.shapesSide.length; ++i) {
      this._createShapeObject(this.shapesSide[i]);
      this._createSideIndexes(this.shapesSide[i]);
      const primitiveType = this.gl.TRIANGLES;
      const count = this.indexes.length;
      const indexType = this.gl.UNSIGNED_SHORT;
      this.gl.drawElements(primitiveType, count, indexType, this.indexes);
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

  _createShapeObject(coords) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(coords),
      this.gl.STATIC_DRAW
    );
  }
  _createShapeIndexes(coords) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.indexes = earcut(coords, null, 3);

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indexes),
      this.gl.STATIC_DRAW
    );
  }

  //they are always rectangles
  _createSideIndexes() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    //prettier-ignore
    this.indexes = [
        0, 1, 2,
        2, 1, 3];

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.indexes),
      this.gl.STATIC_DRAW
    );
  }
}
