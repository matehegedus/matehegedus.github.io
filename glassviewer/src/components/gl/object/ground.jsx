import { MeshBasicMaterial } from "three";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color={"#d6ac58"} />
    </mesh>
  );
}

export default Ground;
