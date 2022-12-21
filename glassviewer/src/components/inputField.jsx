import { useState } from "react";

function InputField(props) {
  const [value, setValue] = useState(props.value ?? 1);

  return (
    <label>
      {props.text ?? "Value"}:
      <input
        type="number"
        value={value}
        step={0.1}
        onChange={(e) => {
          const newVal = Number(e.target.value);
          setValue(newVal);
          props.onValueChange(newVal);
        }}
      />
    </label>
  );
}

export default InputField;
