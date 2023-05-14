import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { memo } from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {},
}));

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
  "& .MuiOutlinedInput-root": {
    // probably the width of your search IconButton or more if needed
    // color: "red",
    paddingTop: "10px",
    top: 5,
  },
  // ".MuiInputBase-input": {
  //   height: "1.5rem",
  //   p: 0,
  //   right: 10,
  //   bottom: 5,
  // },
  "& .MuiAutocomplete-inputRoot": {
    // color: "purple",
    // p: 0,
    // right: 10,
    // bottom: 5,
    // paddingTop: "10px",

    //   // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      // paddingTop: "10px",
    },
    //   "& .MuiOutlinedInput-notchedOutline": {
    //     // borderColor: "green",
    //   },
    //   "&:hover .MuiOutlinedInput-notchedOutline": {
    //     // borderColor: "dark grey",
    //   },
    //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //     // borderColor: "purple",
    //   },
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
  const classes = useStyles();
  let inputRef;

  return (
    <Autocomplete
      style={{ marginTop: "0px", width: "100%" }}
      value={value}
      disabled={disable}
      classes={{
        clearIndicatorDirty: classes.clearIndicator,
        popupIndicator: classes.popupIndicator,
      }}
      size="small"
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, stateName: newValue.stateName });
          setValue({
            ...value,
            stateCode: newValue.stateCode,
            stateName: newValue.stateName,
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
      options={options.filter((item) => {
        return item.countryCode == selectedCountry;
      })}
      getOptionLabel={(option) => option.stateName}
      // sx={{ width: 300 }}
      renderInput={(params, InputLabelProps) => (
        <TextField
          className={classes.root}
          {...params}
          {...(error && { error: true, helperText: error })}
          label="State"
          InputProps={{
            ...params.InputProps,
            sx: {
              // this is necessary if you don't want to input value to be
              // placed under the icon at the end
              // "&&&": { pr: "70px" },
            },
          }}
          InputLabelProps={{
            shrink: true,
            ...InputLabelProps,
          }}
          sx={tfStyle}
          inputRef={(input) => {
            inputRef = input;
          }}
        />
      )}
    />
  );
}
export default memo(States);
