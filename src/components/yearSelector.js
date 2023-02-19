import * as React from "react";
import TextField from "@mui/material/TextField";

export default function ViewsDatePicker(props) {
  const { value, setValue, name, label } = props;
  console.log(value[name]);
  return <TextField label={label} />;
}
