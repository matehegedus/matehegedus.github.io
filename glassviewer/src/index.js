import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";

import CameraController from "./components/gl/camera/cameracontroller.jsx";
import Cube from "./components/gl/object/cube.jsx";
import Ground from "./components/gl/object/ground.jsx";
import InputValue from "./components/inputs/inputValue.jsx";
import GlassPane from "./components/gl/object/glassPane.jsx";
import InputCoord from "./components/inputs/inputCoord.jsx";

function App() {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(4);

  const [drillHoles, setDrillHoles] = useState([]);

  return (
    <div className="main">
      <div className="controls">
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
        <button
          onClick={() => {
            setDrillHoles([{ x: 0, y: 0, r: 0.5 }]);
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
          {/* <Cube size={{ width, height }} /> */}
          <GlassPane size={{ width, height }} drillHoles={drillHoles} />
          <CameraController />
        </Canvas>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
