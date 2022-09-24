import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";

export default function Countries(props) {
  const { value, setValue, options, error } = props;
  const [inputValue, setInputValue] = React.useState("");
  if (value.countryCode) {
    let found;
    options.map((item) => {
      if (value.countryCode == item.countryCode) found = item.countryName;
    });
    if (value.countryName !== found) {
      setValue({ ...value, countryName: found });
    }
  }
  return (
    <Autocomplete
      style={{ marginTop: "0px" }}
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, countryName: newValue.countryName });

          setValue({
            ...value,
            countryCode: newValue.countryCode,
            stateName: "",
            stateCode: "",
            districtName: "",
            districtCode: "",
            talukaName: "",
            talukaCode: "",
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
      getOptionLabel={(option) => option.countryName}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label="Country"
        />
      )}
    />
  );
}
