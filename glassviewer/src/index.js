import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";

import CameraController from "./components/gl/camera/cameracontroller.jsx";
import Ground from "./components/gl/object/ground.jsx";
import InputValue from "./components/inputs/inputValue.jsx";
import GlassPane from "./components/gl/object/glassPane.jsx";
import InputCoord from "./components/inputs/inputCoord.jsx";
import SvgShape from "./components/gl/object/svgShape";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [shapeType, setShapeType] = useState("Rectangle");
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(4000);

  const [drillHoles, setDrillHoles] = useState([]);

  return (
    <div className="main">
      <div className="controls">
        <input
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShapeType(shapeType === "Rectangle" ? "Custom" : "Rectangle");
          }}
          value={shapeType}
        />

        {shapeType === "Rectangle" && (
          <div className="controls-rect">
            <InputValue
              text="Width"
              value={width}
              onValueChange={(val) => {
                setWidth(val);
              }}
            />
            <InputValue
              text="Height"
              value={height}
              onValueChange={(val) => {
                setHeight(val);
              }}
            />
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            alert("Under development");
            // else setDrillHoles([{ x: 0, y: 0, r: 0.5 }]);
          }}
        >
          Add drillhole
        </button>
        {drillHoles.length > 0 && (
          <>
            <InputCoord
              x={drillHoles[0].x}
              y={drillHoles[0].y}
              onCoordChange={(coord) => {
                setDrillHoles([{ x: coord.x, y: coord.y, r: drillHoles[0].r }]);
              }}
            />
            <InputValue
              text="radius"
              value={drillHoles[0].r}
              onValueChange={(val) => {
                setDrillHoles([
                  { x: drillHoles[0].x, y: drillHoles[0].y, r: val },
                ]);
              }}
            />
          </>
        )}
      </div>
      <div id="canvas-container" style={{ height: "100vh" }}>
        <Canvas
          height={1500}
          camera={{ fov: 75 }}
          style={{ background: "#acacac" }}
        >
          <ambientLight intensity={0.3} color={"white"} />
          <directionalLight position={[1, 0, 2]} />
          <Ground />
          {shapeType === "Rectangle" ? (
            <GlassPane size={{ width, height }} drillHoles={drillHoles} />
          ) : (
            <SvgShape />
          )}

          <CameraController />
        </Canvas>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
