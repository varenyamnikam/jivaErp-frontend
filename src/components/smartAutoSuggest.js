import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { makeStyles, IconButton } from "@material-ui/core";
import Lottie from "react-lottie";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root": {
      fontSize: 15,
      // color: "#D3D3D3",
      position: "absolute",
      p: 5,
      right: 40,
      bottom: 5,
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue", // or black
    },
    // "& .MuiFormLabel-root": {
    //   fontSize: 15,
    //   color: "#D3D3D3",
    // },
    // "& .MuiFormLabel-root.Mui-focused": {
    //   color: "blue", // or black
    // },
    "& .MuiInputLabel-shrink": {
      color: "grey", // or black
    },
  },
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
    paddingTop: "0px",
    height: "40px",
  },
  ".MuiInputBase-input": {
    height: "1.5rem",
    p: 0,
    right: 10,
    bottom: 5,
  },
  "& .MuiAutocomplete-inputRoot": {
    // color: "purple",
    p: 0,
    // right: 10,
    top: 5,

    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingTop: "0px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: "green",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      // borderColor: "dark grey",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      // borderColor: "purple",
    },
  },
};

export default function UnusedAutosuggest(props) {
  const {
    value,
    setValue,
    options1,
    options2,
    name1,
    label,
    code1,
    name2,
    code2,
    error = null,

    ...other
  } = props;
  const [inputValue, setInputValue] = React.useState("");

  console.log(options1, options2);
  const classes = useStyles();

  console.log(value[name1]);
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
        size="small"
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
            className={classes.root}
            {...params}
            {...(error && { error: true, helperText: error })}
            label={label}
            sx={tfStyle}
            InputProps={{
              ...params.InputProps,
              sx: {
                // this is necessary if you don't want to input value to be
                // placed under the icon at the end
                // "&&&": { pr: "70px" },
              },
            }}
            inputRef={(input) => {
              inputRef = input;
            }}
            {...other}
          />
        )}
      />
    </>
  );
}
