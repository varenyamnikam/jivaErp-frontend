import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { memo } from "react";

function Districts(props) {
  const { value, setValue, options, disable, state, states, error } = props;
  const [inputValue, setInputValue] = React.useState("");
  const [selectedState, setSelectedState] = React.useState("");
  //find name using code
  if (value.districtCode) {
    let found;
    options.map((item) => {
      if (value.districtCode == item.districtCode) found = item.districtName;
    });
    if (value.districtName !== found)
      setValue({ ...value, districtName: found });
    console.log("findimg districtName");
  }
  states.map((c) => {
    if (c.stateName == state) {
      if (selectedState !== c.stateCode) setSelectedState(c.stateCode);
    }
  });
  // if (value.districtCode == "0" && inputValue !== "N.A.") {
  //   setInputValue("N.A.");
  // }
  // if (inputValue == "undefined") {
  //   setInputValue("");
  // }
  console.log(
    selectedState,
    options.filter((item) => {
      return item.stateCode == selectedState;
    })
  );
  return (
    <Autocomplete
      value={value}
      disabled={disable}
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, districtName: newValue.districtName });
          setValue({ ...value, districtCode: newValue.districtCode });
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
        return item.stateCode == selectedState;
      })}
      getOptionLabel={(option) => option.districtName}
      // sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label="District"
        />
      )}
    />
  );
}
export default memo(Districts);
