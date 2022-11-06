import React, { useState, useEffect } from "react";
import { CanvasDrawer } from "../canvas";

function GlassViewer(props) {
  const canvas = React.useRef();
  const [translateX, setTranslateX] = useState(-40);
  const [translateY, setTranslateY] = useState(0);
  const [translateZ, setTranslateZ] = useState(-200);
  const [rotateX, setRotateX] = useState(180);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [cameraRight, setCameraRight] = useState(0);
  const [cameraUp, setCameraUp] = useState(0);
  const [cameraPos, setCameraPos] = useState(0);
  const [lightSourceX, setLightSourceX] = useState(100);
  const [lightSourceY, setLightSourceY] = useState(0);
  const [lightSourceZ, setLightSourceZ] = useState(-200);
  let drawer;

  useEffect(() => {
    const gl = canvas.current.getContext("webgl");
    drawer = new CanvasDrawer(gl, props.width, props.height);
    drawer.translate(translateX, translateY, translateZ);
    drawer.rotate(rotateX, rotateY, rotateZ);
    drawer.scale(scale, scale, scale);
    drawer.setLightSource(lightSourceX, lightSourceY, lightSourceZ);
    drawer.setCamera(cameraRight, cameraUp, cameraPos);
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
                min={-100}
                max={100}
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
                min={-200}
                max={200}
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
                min="-360"
                max="360"
                value={rotateX}
                onChange={(e) => {
                  setRotateX(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Y:</p>
              <input
                type="range"
                min="-360"
                max="360"
                value={rotateY}
                onChange={(e) => {
                  setRotateY(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Z:</p>
              <input
                type="range"
                min="-360"
                max="360"
                value={rotateZ}
                onChange={(e) => {
                  setRotateZ(Number(e.target.value));
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
                  setScale(Number(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
        <div className="canvas--controller--grp">
          <div className="canvas--controller">
            <h3>Camera</h3>
            <div className="sliderGroup">
              <p>X</p>
              <input
                type="range"
                min="-200"
                max="200"
                value={cameraRight}
                onChange={(e) => {
                  setCameraRight(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Y</p>
              <input
                type="range"
                min="-200"
                max="200"
                value={cameraUp}
                onChange={(e) => {
                  setCameraUp(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Z</p>
              <input
                type="range"
                min="-200"
                max="200"
                value={cameraPos}
                onChange={(e) => {
                  setCameraPos(Number(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="canvas--controller">
            <h3>Light source</h3>
            <div className="sliderGroup">
              <p>X</p>
              <input
                type="range"
                min={-props.width}
                max={props.width}
                value={lightSourceX}
                onChange={(e) => {
                  setLightSourceX(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Y</p>
              <input
                type="range"
                min={-props.height}
                max={props.height}
                value={lightSourceY}
                onChange={(e) => {
                  setLightSourceY(Number(e.target.value));
                }}
              />
            </div>
            <div className="sliderGroup">
              <p>Z</p>
              <input
                type="range"
                min="-1500"
                max="500"
                value={lightSourceZ}
                step={1}
                onChange={(e) => {
                  setLightSourceZ(Number(e.target.value));
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
