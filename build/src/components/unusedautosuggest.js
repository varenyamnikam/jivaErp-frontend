import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";

export default function UnusedAutosuggest(props) {
  const { value, setValue, options, error, name, label } = props;
  const [inputValue, setInputValue] = React.useState("");
  console.log(inputValue);
  return (
    <Autocomplete
      style={{ marginTop: "0px" }}
      value={value[name]}
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, countryName: newValue.countryName });

          setValue({
            ...value,
            [name]: newValue,
          });
          console.log("onchange" + newValue);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        console.log("onInputchange" + newInputValue);
      }}
      id="controllable-states-demo"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label={label}
        />
      )}
    />
  );
}
