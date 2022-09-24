import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { memo } from "react";
const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    visibility: "visible",
    boxShadow: "none",
    position: "absolute",
    p: 0,
    right: 40,
    top: 5,
    //"calc(50% - 12px)"
  },
  "& .MuiButtonBase-root.MuiAutocomplete-popupIndicator": {
    visibility: "visible",
    boxShadow: "none",
    position: "absolute",
    p: 0,
    right: 10,
    top: 5,
  },
  "& .MuiOutlinedInput-root.MuiAutocomplete-endAdornment": {
    // probably the width of your search IconButton or more if needed
  },
};

function States(props) {
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
      style={{ marginTop: "0px" }}
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
      // sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label="State"
          sx={tfStyle}
          InputProps={{
            ...params.InputProps,
            sx: {
              // this is necessary if you don't want to input value to be
              // placed under the icon at the end
              "&&&": { pr: "70px" },
            },
          }}
        />
      )}
    />
  );
}
export default memo(States);
