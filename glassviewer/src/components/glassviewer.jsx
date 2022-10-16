import React, { useState, useEffect } from "react";
import { CanvasDrawer } from "../canvas";

function GlassViewer(props) {
  const canvas = React.useRef();
  const [translateX, setTranslateX] = useState(50);
  const [translateY, setTranslateY] = useState(50);
  const [rotateX, setRotateX] = useState(45);
  const [rotateY, setRotateY] = useState(45);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(1);
  let drawer;

  useEffect(() => {
    const gl = canvas.current.getContext("webgl");
    drawer = new CanvasDrawer(gl, props.width, props.height);
    drawer.translate(translateX, translateY, 0);
    drawer.rotate(rotateX, rotateY, rotateZ);
    drawer.scale(scale, scale, 1);
    drawer.setupCanvas();
  });

  return (
    <div className="glassViewer">
      <div className="canvas--controller">
        <h3>Translate</h3>
        <div className="sliderGroup">
          <p>X:</p>
          <input
            type="range"
            min="0"
            max={props.width}
            value={translateX}
            onChange={(e) => {
              setTranslateX(e.target.value);
            }}
          />
        </div>
        <div className="sliderGroup">
          <p>Y:</p>
          <input
            type="range"
            min="0"
            max={props.height}
            value={translateY}
            onChange={(e) => {
              setTranslateY(e.target.value);
            }}
          />
        </div>
        <div className="sliderGroup">
          <p>Z:</p>
          <input
            type="range"
            min="0"
            max="100"
            value="0"
            disabled={true}
            onChange={(e) => {
              console.log("changed:", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="canvas--controller">
        <h3>Rotate</h3>
        <div className="sliderGroup">
          <p>X:</p>
          <input
            type="range"
            min="0"
            max="360"
            value={rotateX}
            onChange={(e) => {
              setRotateX(e.target.value);
            }}
          />
        </div>
        <div className="sliderGroup">
          <p>Y:</p>
          <input
            type="range"
            min="0"
            max="360"
            value={rotateY}
            onChange={(e) => {
              setRotateY(e.target.value);
            }}
          />
        </div>
        <div className="sliderGroup">
          <p>Z:</p>
          <input
            type="range"
            min="0"
            max="260"
            value={rotateZ}
            onChange={(e) => {
              setRotateZ(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="canvas--controller">
        <h3>Scale</h3>
        <div className="sliderGroup">
          <p>X,Y,Z</p>
          <input
            type="range"
            min="-2"
            max="2"
            value={scale}
            step={0.1}
            onChange={(e) => {
              setScale(e.target.value);
              setScale(e.target.value);
            }}
          />
        </div>
      </div>
      <canvas ref={canvas} height={props.height} width={props.width}></canvas>
    </div>
  );
}

export default GlassViewer;
