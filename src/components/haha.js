import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { makeStyles, IconButton } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "yellow",
  },
  // clearIndicator: {
  //   backgroundColor: "gray",
  //   boxShadow: "white",
  //   "& span": {
  //     "& svg": {
  //       "& path": {
  //         d: "path('M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z')", // your svg icon path here
  //       },
  //     },
  //   },
  // },
  // popupIndicator: {
  //   backgroundColor: "blue",
  // },
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
  "& .MuiOutlinedInput-root.MuiAutocomplete-endAdornment": {
    // probably the width of your search IconButton or more if needed
  },
};

export default function UnusedAutosuggest(props) {
  const {
    value,
    setValue,
    options1,
    options2,
    error,
    name1,
    label,
    code1,
    name2,
    code2,
  } = props;
  const [inputValue, setInputValue] = React.useState("");
  const classes = useStyles;
  if (value[name1]) {
    options2.map((item) => {
      if (value[name1] == item[name2] && value[code1] !== item[code2]) {
        setValue({
          ...value,
          [code1]: item[code2],
        });
      }
    });
  }
  if (!value[name1] && value[code1]) {
    console.log("hi", value);
    options2.map((item) => {
      if (value[code1] == item[code2]) {
        setValue({ ...value, [name1]: item[name2] });
      }
    });
  }
  let inputRef;
  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        classes={{
          clearIndicatorDirty: classes.clearIndicator,
          popupIndicator: classes.popupIndicator,
        }}
        onClose={() => {
          inputRef.focus();
        }}
        style={{ width: "100%" }}
        value={value[name1]}
        onChange={(event, newValue, reason) => {
          inputRef.focus();
          if (newValue) {
            if (reason === "reset") {
              console.log("reset*****************", reason);
              setInputValue("");
            } else {
              setValue({
                ...value,
                [name1]: newValue,
              });
              console.log("onchange" + newValue);
            }
          }
          console.log("onchange" + newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          inputRef.focus();
          setInputValue(newInputValue);
          console.log("onInputchange" + newInputValue);
          if (newInputValue == "") {
            console.log("@hi**");
            setInputValue("");
            setValue({
              ...value,
              [name1]: "",
            });
          }
        }}
        options={options1}
        renderInput={(params) => (
          <TextField
            {...params}
            {...(error && { error: true, helperText: error })}
            label={label}
            sx={tfStyle}
            InputProps={{
              ...params.InputProps,
              sx: {
                // this is necessary if you don't want to input value to be
                // placed under the icon at the end
                "&&&": { pr: "70px" },
              },
            }}
            inputRef={(input) => {
              inputRef = input;
            }}
          />
        )}
      />
    </>
  );
}
