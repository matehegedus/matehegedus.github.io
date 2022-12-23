import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import CameraController from "./components/gl/camera/cameracontroller.jsx";
import Ground from "./components/gl/object/ground.jsx";
import InputValue from "./components/inputs/inputValue.jsx";
import InputCoord from "./components/inputs/inputCoord.jsx";
import SvgShape from "./components/gl/object/svgShape";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const [drillHoles, setDrillHoles] = useState([]);

  const svgRef = useRef();

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
          shadows={true}
          camera={{ fov: 75 }}
          style={{ background: "#acacac" }}
        >
          <ambientLight intensity={0.99} color={0xffffff} />
          <pointLight
            position={[0, 3, 5]}
            target={svgRef.current}
            intensity={0.5}
            castShadow={true}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <mesh position={[0, 3, 5]}>
            <boxGeometry />
            <meshBasicMaterial color={"white"} />
          </mesh>
          <Ground />
          <SvgShape innerRef={svgRef} drillHoles={drillHoles} />
          <CameraController />
        </Canvas>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
