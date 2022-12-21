import { useState } from "react";
import InputValue from "./inputValue.jsx";

function InputCoord(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  return (
    <>
      <InputValue
        text="X"
        value={props.x}
        onValueChange={(val) => {
          props.onCoordChange({ x: val, y: props.y });
        }}
      />
      <InputValue
        text="Y"
        value={props.y}
        onValueChange={(val) => {
          props.onCoordChange({ x: props.x, y: val });
        }}
      />
    </>
  );
}

export default InputCoord;
