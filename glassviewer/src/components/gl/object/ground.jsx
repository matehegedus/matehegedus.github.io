import { MeshBasicMaterial } from "three";

function Ground() {
  return (
    <mesh
      position={[0, -0.1, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow={true}
    >
      <planeGeometry args={[100, 100]} />
      <meshPhysicalMaterial color={"#d6ac58"} roughness={0.02} />
    </mesh>
  );
}

export default Ground;
