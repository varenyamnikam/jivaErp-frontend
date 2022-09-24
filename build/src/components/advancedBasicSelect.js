import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import List from "@mui/material/List";

export default function AdvancedSelect(props) {
  const { options, setValues, values, name, dataName, label, code, dataCode } =
    props;
  console.log(values[name]);

  const handleChange = (event) => {
    let value = event.target.value;
    console.log(value);
    console.log(values[name]);
    // const value = event.target.getAttribute("value");
    if (value)
      setValues({
        ...values,
        [name]: value[dataName],
      });
  };
  console.log(values);
  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl style={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          key={label}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={values[name]}
          label={label}
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option[dataName]}
              value={option}
              onClick={handleChange}
            >
              {option[dataName]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
