import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import {
  makeStyles,
  IconButton,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { Grid } from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root": {
      fontSize: 15,
      color: "#D3D3D3",
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
    "& .MuiOutlinedInput-notchedOutline": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
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
    // paddingTop: "0px",
  },
  ".MuiInputBase-input": {
    height: "1.5rem",
    p: 0,
    right: 10,
    // bottom: 5,
  },
  "& .MuiAutocomplete-inputRoot": {
    // color: "purple",
    // p: 0,
    // right: 10,
    // top: 5,

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

export default function ButtonAutosuggest(props) {
  const {
    value,
    setValue,
    options,
    error,
    name,
    label,
    disabled = false,
    callback = () => {},
    onClick,
    ...rest
  } = props;
  const [inputValue, setInputValue] = React.useState("");
  const classes = useStyles();
  console.log(inputValue);
  let inputRef;

  return (
    <>
      {" "}
      <Grid container>
        <Grid Item sm={9} xs={12}>
          <Autocomplete
            id="combo-box-demo"
            classes={{
              clearIndicatorDirty: classes.clearIndicator,
              popupIndicator: classes.popupIndicator,
            }}
            size="small"
            onClose={() => {
              inputRef.focus();
            }}
            {...rest}
            value={value[name]}
            onChange={(event, newValue, reason) => {
              inputRef.focus();
              if (newValue) {
                if (reason === "clear") document.activeElement.blur();
                if (reason === "reset") {
                  console.log("reset*****************", reason);
                  setInputValue("");
                } else {
                  setValue({
                    ...value,
                    [name]: newValue,
                  });
                  console.log("onchange" + newValue);
                }
              }
              callback(newValue);
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
                  [name]: "",
                });
              }
            }}
            options={options}
            disabled={disabled}
            renderInput={(params, InputLabelProps) => (
              <TextField
                className={classes.root}
                {...params}
                {...(error && { error: true, helperText: error })}
                label={label}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    // this is necessary if you don't want to input value to be
                    // placed under the icon at the end
                    // "&&&": { pr: "70px" },
                  },
                }}
                sx={tfStyle}
                inputRef={(input) => {
                  inputRef = input;
                }}
                InputLabelProps={{
                  shrink: true,
                  ...InputLabelProps,
                }}
              />
            )}
          />
        </Grid>
        <Grid Item sm={3} xs={12}>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            startIcon={<KeyboardDoubleArrowDownIcon />}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              // top: 5,
              height: "100%",
              width: "100%",
            }}
            onClick={onClick}
          >
            Pull
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
