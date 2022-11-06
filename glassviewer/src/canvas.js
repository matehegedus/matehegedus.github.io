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

    this.lightSourceX = 0;
    this.lightSourceY = 0;
    this.lightSourceZ = 20;

    this.cameraRight = 0;
    this.cameraUp = 0;
    this.cameraPos = 0;
    this.shapeSideElems = [];
    this.normSideElems = [];

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
      pathElem.setAttribute("stroke-width", "5");
      pathElem.setAttribute("fill", "none");

      svg.appendChild(pathElem);

      this.toCutout(pathElem, 1);
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
    this.coordsRear = [];
    this.normalFront = [];
    this.normalRear = [];
    var i = 0;

    const p = pathSVG.getPointAtLength(0);

    let xMin = p.x;
    let xMax = p.x;
    let yMin = p.y;
    let yMax = p.y;

    while (i < pathLength) {
      let p = pathSVG.getPointAtLength(i);

      //push side segments
      if (i > 0)
        this.shapeSideElems.push([
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          0,
          this.coordsFront[this.coordsFront.length - 3],
          this.coordsFront[this.coordsFront.length - 2],
          -20,
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          -20,
        ]);

      xMin = Math.min(p.x, xMin);
      yMin = Math.min(p.y, yMin);
      xMax = Math.max(p.x, xMax);
      yMax = Math.max(p.y, yMax);
      this.coordsFront.push(p.x, p.y, 0);
      this.coordsRear.push(p.x, p.y, -20);

      i += n;
    }
    this.shapeW = xMax - xMin;
    this.shapeH = yMax - yMin;

    this.genNormals();
  }

  toCutout(pathSVG, n) {
    let pathLength = pathSVG.getTotalLength();
    var i = 1;
    while (i < pathLength) {
      let arr = pathSVG.getPointAtLength(i);

      //push side segments
      if (i > 0)
        this.shapeSideElems.push([
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
      this.coordsRear.push(arr.x, arr.y, -20);

      i += n;
    }
    this.genNormals();
  }

  genNormals() {
    this.normalFront = [];
    this.normalRear = [];
    this.normSideElems = [];

    for (let i = 0; i < this.coordsFront.length; ++i) {
      const p0 = {
        x: this.coordsFront[i++],
        y: this.coordsFront[i++],
        z: this.coordsFront[i++],
      };
      const p1 = {
        x: this.coordsFront[i++],
        y: this.coordsFront[i++],
        z: this.coordsFront[i++],
      };
      const p2 = {
        x: this.coordsFront[i++],
        y: this.coordsFront[i++],
        z: this.coordsFront[i],
      };
      const v1 = m4.normalizeV(m4.createV(p1, p0));
      const v2 = m4.normalizeV(m4.createV(p1, p2));
      const norm = m4.cross(v1, v2);
      this.normalFront.push(norm.x, norm.y, norm.z);
      this.normalFront.push(norm.x, norm.y, norm.z);
      this.normalFront.push(norm.x, norm.y, norm.z);
      this.normalRear.push(-norm.x, -norm.y, -norm.z);
      this.normalRear.push(-norm.x, -norm.y, -norm.z);
      this.normalRear.push(-norm.x, -norm.y, -norm.z);
    }

    for (let i = 0; i < this.shapeSideElems.length; ++i) {
      const p0 = {
        x: this.shapeSideElems[i][0],
        y: this.shapeSideElems[i][1],
        z: this.shapeSideElems[i][2],
      };
      const p1 = {
        x: this.shapeSideElems[i][3],
        y: this.shapeSideElems[i][4],
        z: this.shapeSideElems[i][5],
      };
      const p2 = {
        x: this.shapeSideElems[i][6],
        y: this.shapeSideElems[i][7],
        z: this.shapeSideElems[i][8],
      };
      const v1 = m4.normalizeV(m4.createV(p1, p0));
      const v2 = m4.normalizeV(m4.createV(p1, p2));
      const norm = m4.cross(v1, v2);
      //prettier-ignore
      this.normSideElems.push([
        norm.x, norm.y, norm.z,
        norm.x, norm.y, norm.z,
        norm.x, norm.y, norm.z,
      ]);
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

  setCamera(right, up, pos) {
    this.cameraRight = right;
    this.cameraUp = up;
    this.cameraPos = pos;
  }

  setLightSource(x, y, z) {
    this.lightSourceX = x;
    this.lightSourceY = y;
    this.lightSourceZ = z;
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
    this.normalAttribLoc = this.gl.getAttribLocation(program, "a_normal");
    this.u_ModelViewProjection = this.gl.getUniformLocation(
      program,
      "u_modelViewProjection"
    );
    this.u_model = this.gl.getUniformLocation(program, "u_model");
    this.modelInverseTranspose = this.gl.getUniformLocation(
      program,
      "u_modelInverseTranspose"
    );
    this.u_lightColor = this.gl.getUniformLocation(program, "u_lightColor");

    this.u_lightWorldPos = this.gl.getUniformLocation(
      program,
      "u_lightWorldPos"
    );
    this.u_viewWorldPos = this.gl.getUniformLocation(program, "u_viewWorldPos");

    this.u_shininess = this.gl.getUniformLocation(program, "u_shininess");

    this.posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.indexBuffer = this.gl.createBuffer();

    //2. rendering phase
    this._drawScene(program);
  }

  _drawScene(program) {
    this.gl.enable(this.gl.DEPTH_TEST);

    // Clear the canvas
    this.gl.clearColor(0.3, 0.3, 0.3, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(program);

    //POSITION
    {
      // Turn on the attribute and bind the position buffer
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posBuffer);
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
    //NORMAL
    {
      //    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
      this.gl.enableVertexAttribArray(this.normalAttribLoc);

      var size = 3; // 3 components per iteration
      var type = this.gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer
      this.gl.vertexAttribPointer(
        this.normalAttribLoc,
        size,
        type,
        normalize,
        stride,
        offset
      );
    }

    //MODEL-VIEW-PROJECTION matrices
    //1. model (basically just the transformations we applied to our model)
    let model_M = m4.translate(
      m4.identity(),
      this.translateX,
      this.translateY,
      this.translateZ
    );

    model_M = m4.multiply(
      m4.multiply(
        m4.translate(m4.identity(), 0, this.shapeH / 2, 0),
        m4.rotateX(model_M, this.fiX)
      ),
      m4.translate(m4.identity(), 0, -this.shapeH / 2, 0)
    );

    model_M = m4.multiply(
      m4.multiply(
        m4.translate(m4.identity(), this.shapeW / 2, 0, 0),
        m4.rotateY(model_M, this.fiY)
      ),
      m4.translate(m4.identity(), -this.shapeW / 2, 0, 0)
    );

    model_M = m4.rotateZ(model_M, this.fiZ);
    model_M = m4.scale(model_M, this.sX, this.sY, this.sZ);

    // 2. view
    const camera = {
      x: 0 - this.cameraRight, //this.translateX,
      y: 0 - this.cameraUp, //this.translateY,
      z: -200 + 100 - this.cameraPos, //this.translateZ + 200 - this.cameraAngle,
    };

    const target = {
      x: this.translateX,
      y: this.translateY,
      z: this.translateZ,
    };
    const tmpUp = { x: 0, y: 1, z: 0 };
    const viewMatrix = m4.lookAt(camera, target, tmpUp);

    //3. Projection (= make it perspective)
    const aspect = this.canvasW / this.canvasH;
    const zNear = 1;
    const zFar = 2000;
    const fieldOfViewRadians = 45 * (Math.PI / 180);

    const projMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    const viewProjMatrix = m4.multiply(projMatrix, viewMatrix);
    const MVP_Matrix = m4.multiply(viewProjMatrix, model_M);

    this.gl.uniformMatrix4fv(this.u_ModelViewProjection, false, MVP_Matrix);
    this.gl.uniformMatrix4fv(this.u_model, false, model_M);
    this.gl.uniform3fv(this.u_lightColor, [1, 1, 1]);

    var modelInverseMatrix = m4.inverse(model_M);
    var modelInverseTransposeMatrix = m4.transpose(modelInverseMatrix);
    this.gl.uniformMatrix4fv(
      this.modelInverseTranspose,
      false,
      modelInverseTransposeMatrix
    );

    this.gl.uniform3fv(this.u_lightWorldPos, [
      this.lightSourceX,
      this.lightSourceY,
      this.lightSourceZ,
    ]);
    this.gl.uniform3fv(this.u_viewWorldPos, [camera.x, camera.y, camera.z]);
    this.gl.uniform1f(this.u_shininess, 300);

    // draw
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    for (let i = 0; i <= 1; ++i) {
      this._createShapeObject(i === 0 ? this.coordsFront : this.coordsRear);
      this._createNormals(i === 0 ? this.normalFront : this.normalRear);
      this._createShapeIndexes(this.coordsFront);
      const primitiveType = this.gl.TRIANGLES;
      const count = this.indexes.length;
      const indexType = this.gl.UNSIGNED_SHORT;
      this.gl.drawElements(primitiveType, count, indexType, this.indexes);
    }
    //side
    for (let i = 0; i < this.shapeSideElems.length; ++i) {
      this._createShapeObject(this.shapeSideElems[i]);
      this._createNormals(this.normSideElems[i]);
      this._createSideIndexes(this.shapeSideElems[i]);
      const primitiveType = this.gl.TRIANGLES;
      const count = this.indexes.length;
      const indexType = this.gl.UNSIGNED_SHORT;
      this.gl.drawElements(primitiveType, count, indexType, this.indexes);
    }
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

  _createNormals(coords) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(coords),
      this.gl.STATIC_DRAW
    );
  }
}
