import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";

import CameraController from "./components/gl/camera/cameracontroller.jsx";
import Cube from "./components/gl/object/cube.jsx";
import Ground from "./components/gl/object/ground.jsx";
import InputField from "./components/inputField.jsx";

function App() {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(4);

  return (
    <div className="main">
      <div className="controls">
        <InputField
          text="Width"
          value={width}
          onValueChange={(val) => {
            setWidth(val);
          }}
        />
        <InputField
          text="Height"
          value={height}
          onValueChange={(val) => {
            setHeight(val);
          }}
        />
        <button
          onClick={() => {
            // console.log(box);
          }}
        >
          test
        </button>
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
          <Cube size={{ width, height }} pos={{ x: 0.0, y: 2, z: 0.0 }} />
          <CameraController />
        </Canvas>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
