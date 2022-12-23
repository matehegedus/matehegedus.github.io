import { useState } from "react";

function InputValue(props) {
  const [value, setValue] = useState(props.value ?? 1);

  return (
    <div className="input-value">
      <label className="form-label">{props.text ?? "Value"}:</label>
      <input
        className="form-control"
        type="number"
        value={value}
        onChange={(e) => {
          const newVal = Number(e.target.value);
          setValue(newVal);
          props.onValueChange(newVal);
        }}
      />
    </div>
  );
}

export default InputValue;
