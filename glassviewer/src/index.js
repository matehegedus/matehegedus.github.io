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
  const [drillHoles, setDrillHoles] = useState([]);

  const drillHolesW = () => {
    const listItems = drillHoles.map((elem, idx) => {
      return (
        <li key={`dh_${idx}`}>
          <InputCoord
            x={elem.x}
            y={elem.y}
            onCoordChange={(coord) => {
              const dhs = [...drillHoles];
              const dh = { ...dhs[idx], x: coord.x, y: coord.y };
              dhs[idx] = dh;
              setDrillHoles(dhs);
            }}
          />
          <InputValue
            text="radius"
            value={elem.r}
            onValueChange={(val) => {
              const dhs = [...drillHoles];
              const dh = { ...dhs[idx], r: val };
              dhs[idx] = dh;
              setDrillHoles(dhs);
            }}
          />
        </li>
      );
    });

    return <ul>{listItems}</ul>;
  };

  return (
    <div className="main">
      <div className="controls">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setDrillHoles([...drillHoles, { x: 250, y: 250, r: 15 }]);
          }}
        >
          Add drillhole
        </button>
        {drillHolesW()}
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
          <SvgShape drillHoles={drillHoles} />
          <CameraController />
        </Canvas>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
