import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { Box3, GridHelper } from "three";
import * as THREE from "three";

function CameraController(props) {
  const { camera, scene, gl } = useThree();

  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  useEffect(() => {
    const targetObj = scene.getObjectByName("paneMesh");
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.enableDamping = true;

    camera.position.set(-2, 3, 8);

    if (targetObj.children.length > 0) {
      controls.target.set(0, 3, 0);
    }
    controls.update();

    // 1 - grid
    const size = 100;
    const divisions = 100;
    const gridHelper = new GridHelper(size, divisions);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
}

export default CameraController;
