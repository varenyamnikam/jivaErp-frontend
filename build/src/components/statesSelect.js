import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";

export default function States(props) {
  const { value, setValue, options, disable, country, countries, error } =
    props;
  const [inputValue, setInputValue] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState("");
  if (value.stateCode) {
    let found;
    options.map((item) => {
      if (value.stateCode == item.stateCode) found = item.stateName;
    });
    if (value.stateName !== found) setValue({ ...value, stateName: found });
    console.log("findimg stateName");
  }
  countries.map((c) => {
    if (c.countryName == country) {
      if (selectedCountry !== c.countryCode) setSelectedCountry(c.countryCode);
    }
  });
  // if (value.stateName && value.countryName) {
  //   options.map((s) => {
  //     if (s.stateCode == value.stateCode) {
  //       if (value.countryCode !== s.countryCode) {
  //         setValue({ ...value, stateCode: "" });
  //         console.log("statenot found");
  //       }
  //     }
  //   });
  // }
  return (
    <Autocomplete
      value={value}
      disabled={disable}
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, stateName: newValue.stateName });
          if (value.districtName) {
            setValue({
              ...value,
              stateCode: newValue.stateCode,
              districtName: "",
              districtCode: "",
              talukaName: "",
              talukaCode: "",
            });
          } else {
            setValue({ ...value, stateCode: newValue.stateCode });
          }
          console.log("onchange" + newValue);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        console.log("onInputchange" + newInputValue);
      }}
      id="controllable-states-demo"
      options={options.filter((item) => {
        return item.countryCode == selectedCountry;
      })}
      getOptionLabel={(option) => option.stateName}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label="State"
        />
      )}
    />
  );
}
