import React, { useState, useEffect } from "react";
import { setupCanvas } from "../canvas";

function GlassViewer(props) {
  const canvas = React.useRef();
  let gl;
  useEffect(() => {
    gl = canvas.current.getContext("webgl");
    setupCanvas(gl, props.width, props.height);
  });

  return (
    <div>
      <p>Glass viewer</p>
      <canvas ref={canvas} height={props.height} width={props.width}></canvas>
    </div>
  );
}

export default GlassViewer;
