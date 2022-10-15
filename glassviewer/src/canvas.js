"use strict";

import { m4 } from "./calc.js";

let canvasW = 400;
let canvasH = 400;

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

  console.log("create program fail", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export function setupCanvas(gl, w, h) {
  canvasW = w;
  canvasH = h;
  //1. init phase
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

  //construct vertex array
  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

  var positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //2. rendering phase
  drawScene(gl, program, posAttribLoc, posBuffer);
}

function drawScene(gl, program, posAttribLoc, posBuffer) {
  // Clear the canvas
  gl.clearColor(0.3, 0.3, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(posAttribLoc);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(posAttribLoc, size, type, normalize, stride, offset);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}
