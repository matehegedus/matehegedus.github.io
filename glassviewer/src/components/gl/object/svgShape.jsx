import React, { useMemo, useRef } from "react";
import { Box3, ExtrudeGeometry, Mesh, MeshPhysicalMaterial } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

function SvgShape() {
  const groupRef = useRef();

  const loader = new SVGLoader();

  useMemo(() => {
    loader.load("./shape.svg", (data) => {
      const path = data.paths[0];

      const group = groupRef.current;
      group.scale.y = -1;

      const shapes = SVGLoader.createShapes(path);
      const material = new MeshPhysicalMaterial({
        color: 0x8aa6a6,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.9,
        side: 2,
      });

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new ExtrudeGeometry(shape);
        const mesh = new Mesh(geometry, material);

        mesh.scale.set(0.01, 0.01, 0.01);
        group.add(mesh);
      }

      //set offset for Y
      const box = new Box3().setFromObject(group);
      const yOffset = box.min.y;
      group.children.forEach((item) => (item.position.y = yOffset));
    });
  });

  return <group name="paneMesh" ref={groupRef}></group>;
}
export default SvgShape;
