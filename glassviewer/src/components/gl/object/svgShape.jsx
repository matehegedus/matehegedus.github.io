import React, { useMemo, useRef, useState } from "react";
import { Box3, ExtrudeGeometry, Mesh, MeshPhysicalMaterial, Path } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

function SvgShape(props) {
  const groupRef = useRef();

  const loader = new SVGLoader();

  useMemo(() => {
    loader.load("./shape.svg", (data) => {
      const path = data.paths[0];

      const group = groupRef.current;
      group.clear();
      group.scale.y = -1;

      const shape = SVGLoader.createShapes(path)[0];
      const material = new MeshPhysicalMaterial({
        color: 0x8aa6a6,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.9,
        side: 2,
      });

      props.drillHoles.forEach((dh) => {
        const drillHole = new Path();
        drillHole.ellipse(dh.x + dh.r, dh.y, dh.r, dh.r, 0, Math.PI * 2);
        shape.holes.push(drillHole);
      });

      const geometry = new ExtrudeGeometry(shape);
      const mesh = new Mesh(geometry, material);

      mesh.scale.set(0.01, 0.01, 0.01);
      group.add(mesh);

      //align shape to the middle
      const box = new Box3().setFromObject(group);
      const yOffset = box.min.y;
      const xOffset = -box.max.x / 2;
      group.children.forEach((item) => {
        item.position.y = yOffset;
        item.position.x = xOffset;
      });
      props.onShapeAdded();
    });
  });

  return <group name="paneMesh" ref={groupRef}></group>;
}
export default SvgShape;
