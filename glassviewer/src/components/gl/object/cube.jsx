import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import React, { useEffect, useRef } from "react";

function Cube(props) {
  const meshRef = useRef();
  const matRef = useRef();

  useEffect(() => {
    console.log("component is created:", meshRef.current);
  }, []);

  return (
    <mesh name="boxMesh" ref={meshRef} position={[0, props.size.height / 2, 0]}>
      <boxGeometry args={[props.size.width, props.size.height, 0.2]} />
      <meshPhysicalMaterial
        metalness={0.1}
        roughness={0.0}
        transmission={0.9}
        ref={matRef}
        color={0x8aa6a6}
      />
    </mesh>
  );
}

export default Cube;
