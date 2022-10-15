"use strict";

import { m4 } from "./glassviewer/src/calc.js";

const canvasW = 1366;
const canvasH = 768;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  //1. init phase
  const canvas = document.querySelector("#glCanvas");

  canvas.width = canvasW;
  canvas.height = canvasH;
  const gl = canvas.getContext("webgl");

  if (gl === null) {
    alert(
      "Unable to initialize webGL. Your browser or machine may not support it."
    );
    return;
  }

  // 1.a Set up shaders
  const vertexShaderSrc = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSrc = document.querySelector("#fragment-shader-2d").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSrc
  );

  // 1.b create program
  const program = createProgram(gl, vertexShader, fragmentShader);

  //1.c supply data to our program
  const posAttribLoc = gl.getAttribLocation(program, "a_position");
  const colorAttrLoc = gl.getAttribLocation(program, "a_color");
  const matrixLoc = gl.getUniformLocation(program, "u_matrix");

  //construct vertex array
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

  setLetterF(gl);

  //construct color
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  //2. rendering phase
  drawScene(
    gl,
    program,
    posAttribLoc,
    colorAttrLoc,
    matrixLoc,
    colorBuffer,
    posBuffer
  );
}

function drawScene(
  gl,
  program,
  posAttribLoc,
  colorAttrLoc,
  matrixLoc,
  colorBuffer,
  posBuffer
) {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // set background
  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //tell it to use our program
  gl.useProgram(program);

  /////// POSITION ////////
  {
    //1. turn on position attrib, then bind pos buffer
    gl.enableVertexAttribArray(posAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

    //tell the attribute how to get the data of pos buffer
    const size = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offs = 0;

    gl.vertexAttribPointer(posAttribLoc, size, type, normalize, stride, offs);
  }

  //////// COLOR ////////
  {
    //1. turn on color attrib, then bind the color buffer
    gl.enableVertexAttribArray(colorAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    //tell the attribute how to get the data of pos buffer
    const size = 3;
    const type = gl.UNSIGNED_BYTE;
    const normalize = true;
    const stride = 0;
    const offs = 0;

    gl.vertexAttribPointer(colorAttrLoc, size, type, normalize, stride, offs);
  }

  //////// DRAW THE GEOMETRY ////////

  //set up transformation
  let matrix = m4.projection(canvasW, canvasH, 400);
  //matrix = m4.translate(matrix, 30, 50, 0);
  //matrix = m4.scale(matrix, 1, 1, 1);
  //matrix = m4.rotateX(matrix, 15);
  // matrix = m4.rotateY(matrix, 45);

  gl.uniformMatrix4fv(matrixLoc, false, matrix);

  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 16 * 6; //16 rect construct the 3D F
  gl.drawArrays(primitiveType, offset, count);
}

function setColors(gl) {
  //prettier-ignore
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([    // left column front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // top rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // middle rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,

      // left column back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // top rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // middle rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

      // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,

      // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,

      // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,

      // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,

      // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,

      // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,

      // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,

      // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,

      // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,

      // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220
    ]), gl.STATIC_DRAW
  );
}

function setLetterF(gl) {
  //prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       // left column front
       0,   0,  0,
       0, 150,  0,
       30,   0,  0,
        0, 150,  0,
       30, 150,  0,
       30,   0,  0,

      // top rung front
       30,   0,  0,
       30,  30,  0,
      100,   0,  0,
       30,  30,  0,
       100,  30,  0,
      100,   0,  0,

      // middle rung front
       30,  60,  0,
       30,  90,  0,
       67,  60,  0,
       30,  90,  0,
       67,  90,  0,
       67,  60,  0,

      // left column back
        0,   0,  30,
        0, 150,  30,
        30,   0,  30,
        0, 150,  30,
        30, 150,  30,
       30,   0,  30,

      // top rung back
       30,   0,  30,
       30,  30,  30,
      100,   0,  30,
       30,  30,  30,
      100,  30,  30,
      100,   0,  30,

      // middle rung back
       30,  60,  30,
       30,  90,  30,
       67,  60,  30,
       30,  90,  30,
       67,  90,  30,
       67,  60,  30,

      // top
        0,   0,   0,
      100,   0,   0,
      100,   0,  30,
        0,   0,   0,
      100,   0,  30,
        0,   0,  30,

      // top rung right
      100,   0,   0,
      100,  30,   0,
      100,  30,  30,
      100,   0,   0,
      100,  30,  30,
      100,   0,  30,

      // under top rung
      30,   30,   0,
      100,  30,  30,
      30,   30,  30,
      30,   30,   0,
      100,  30,   0,
      100,  30,  30,

      // between top rung and middle
      30,   30,   0,
      30,   60,  30,
      30,   30,  30,
      30,   30,   0,
      30,   60,   0,
      30,   60,  30,

      // top of middle rung
      30,   60,   0,
      67,   60,  30,
      30,   60,  30,
      30,   60,   0,
      67,   60,   0,
      67,   60,  30,

      // right of middle rung
      67,   60,   0,
      67,   90,  30,
      67,   60,  30,
      67,   60,   0,
      67,   90,   0,
      67,   90,  30,

      // bottom of middle rung.
      30,   90,   0,
      67,   90,  30,
      30,   90,  30,
      30,   90,   0,
      67,   90,   0,
      67,   90,  30,

      // right of bottom
      30,   90,   0,
      30,  150,  30,
      30,   90,  30,
      30,   90,   0,
      30,  150,   0,
      30,  150,  30,

      // bottom
      0,   150,   0,
      30,  150,  30,
      0,   150,  30,
      0,   150,   0,
      30,  150,   0,
      30,  150,  30,

      // left side
      0,   0,   0,
      0, 150,  30,
      0,   0,  30,
      0,   0,   0,
      0, 150,   0,
      0, 150,  30,
    ]), gl.STATIC_DRAW)
}

window.onload = main;
