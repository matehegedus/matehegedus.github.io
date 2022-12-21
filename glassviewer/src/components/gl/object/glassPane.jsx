import { useEffect, useRef } from "react";
import { Brush, Subtraction } from "@react-three/csg";

function GlassPane(props) {
  const paneRef = useRef();

  useEffect(() => {
    const pane = paneRef.current;
    console.log("pane is created:", paneRef.current);
    //   pane.updateMatrix();
  }, []);

  return (
    <mesh
      ref={paneRef}
      name="paneMesh"
      position={[0, props.size.height / 2, 0]}
    >
      {props.drillHoles && props.drillHoles.length > 0 ? (
        <>
          <Subtraction>
            <Brush a>
              <boxGeometry args={[props.size.width, props.size.height, 0.2]} />
            </Brush>
            <Brush
              b
              position={[props.drillHoles[0].x, props.drillHoles[0].y, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry
                args={[props.drillHoles[0].r, props.drillHoles[0].r, 1, 30]}
              />
            </Brush>
          </Subtraction>
          <meshPhysicalMaterial
            metalness={0.1}
            roughness={0.0}
            transmission={0.9}
            color={0x8aa6a6}
          />
        </>
      ) : (
        <>
          <boxGeometry args={[props.size.width, props.size.height, 0.2]} />
          <meshPhysicalMaterial
            metalness={0.1}
            roughness={0.0}
            transmission={0.9}
            color={0x8aa6a6}
          />
        </>
      )}
    </mesh>
  );
}

export default GlassPane;
