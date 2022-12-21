import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GridHelper } from "three";
function CameraController(props) {
  const { camera, scene, gl } = useThree();

  useEffect(() => {
    const targetObj = scene.getObjectByName("paneMesh");
    const targetSize = targetObj.geometry.parameters;
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.enableDamping = true;

    camera.position.set(-3, 3, 5);
    controls.target.set(0, 2, 0);
    controls.update();

    // 1 - grid
    const size = 100;
    const divisions = 100;
    const gridHelper = new GridHelper(size, divisions);
    scene.add(gridHelper);

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
}

export default CameraController;
