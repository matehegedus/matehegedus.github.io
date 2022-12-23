import { useRef } from "react";
import { Brush, Subtraction } from "@react-three/csg";
import { DoubleSide } from "three";

function GlassPane(props) {
  const shapeW = props.size.width / 1000;
  const shapeH = props.size.height / 1000;

  return (
    <mesh name="paneMesh" position={[shapeW / 2, shapeH / 2, 0]}>
      {props.drillHoles && props.drillHoles.length > 0 ? (
        <>
          <Subtraction>
            <Brush a>
              <boxGeometry args={[shapeW, shapeH, 0.04]} />
            </Brush>
            {
              <Brush
                b
                position={[
                  props.drillHoles[0].x / 1000,
                  props.drillHoles[0].y / 1000,
                  0,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry
                  args={[
                    props.drillHoles[0].r / 100,
                    props.drillHoles[0].r / 100,
                    1,
                    30,
                  ]}
                />
              </Brush>
            }
          </Subtraction>
          <meshPhysicalMaterial
            side={DoubleSide}
            metalness={0.1}
            roughness={0.0}
            transmission={0.9}
            transparent={true}
            opacity={0.9}
            color={0x8aa6a6}
          />
        </>
      ) : (
        <>
          <boxGeometry args={[shapeW, shapeH, 0.04]} />
          <meshPhysicalMaterial
            side={DoubleSide}
            metalness={0.1}
            roughness={0.0}
            transmission={0.9}
            transparent={true}
            opacity={0.9}
            color={0x8aa6a6}
          />
        </>
      )}
    </mesh>
  );
}

export default GlassPane;
