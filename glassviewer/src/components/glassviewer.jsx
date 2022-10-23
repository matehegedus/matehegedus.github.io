import React, { useState, useEffect } from "react";
import { CanvasDrawer } from "../canvas";

function GlassViewer(props) {
  const canvas = React.useRef();
  const [translateX, setTranslateX] = useState(-30);
  const [translateY, setTranslateY] = useState(40);
  const [translateZ, setTranslateZ] = useState(-250);
  const [rotateX, setRotateX] = useState(180);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [cameraAngle, setCameraAngle] = useState(0);
  let drawer;

  useEffect(() => {
    const gl = canvas.current.getContext("webgl");
    drawer = new CanvasDrawer(gl, props.width, props.height);
    drawer.translate(translateX, translateY, translateZ);
    drawer.rotate(rotateX, rotateY, rotateZ);
    drawer.scale(scale, scale, scale);
    drawer.cameraAngle = cameraAngle;
    drawer.setupCanvas();
  });

  return (
    <div className="glassViewer">
      <div className="canvas--controller--mainGrp">
        <div className="canvas--controller--grp">
          <div className="canvas--controller">
            <h3>Translate</h3>
            <div className="sliderGroup">
              <p>X:</p>
              <input
                type="range"
                min={-props.width}
                max={props.width}
                value={translateX}
                onChange={(e) => {
                  setTranslateX(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Y:</p>
              <input
                type="range"
                min={-props.height}
                max={props.height}
                value={translateY}
                onChange={(e) => {
                  setTranslateY(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Z:</p>
              <input
                type="range"
                min="-1500"
                max="650"
                value={translateZ}
                onChange={(e) => {
                  setTranslateZ(Number(e.target.value));
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
                max="360"
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
                }}
              />
            </div>
          </div>
        </div>
        <div className="canvas--controller--grp">
          <div className="canvas--controller">
            <h3>Camera</h3>
            <div className="sliderGroup">
              <p>Angle</p>
              <input
                type="range"
                min="0"
                max="360"
                value={cameraAngle}
                step={0.1}
                onChange={(e) => {
                  setCameraAngle(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvas} height={props.height} width={props.width}></canvas>
    </div>
  );
}

export default GlassViewer;
