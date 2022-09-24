import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import List from "@mui/material/List";

export default function BasicSelect(props) {
  const { options, setValues, values, name, label } = props;
  console.log(label);
  console.log(values[name], options);
  const handleChange = (event) => {
    let value = event.target.value;
    console.log(value);
    console.log(values[name]);
    // const value = event.target.getAttribute("value");
    setValues({ ...values, [name]: value });
  };
  function getValue(value) {
    if (value[name] == undefined) {
      console.log("undefined");
      return "";
    } else {
      console.log("not undefined", value[name]);
      return value[name];
    }
  }
  console.log(values);
  return (
    <Box>
      <FormControl>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          key={label}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="outlined"
          value={getValue(values)}
          label={label}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <MenuItem key={option} value={option} onClick={handleChange}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
//sx={{ maxWidth: 300 }} autoWidth
//style={{ width: "100%" }}
