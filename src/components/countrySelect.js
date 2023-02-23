import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    // "& .MuiFormLabel-root": {
    //   fontSize: 15,
    //   color: "#D3D3D3",
    //   position: "absolute",
    //   // p: 5,
    //   // right: 40,
    //   // bottom: 5,
    // },
    // "& .MuiFormLabel-root.Mui-focused": {
    //   color: "blue", // or black
    // },
    // "& .MuiFormLabel-root": {
    //   fontSize: 15,
    //   color: "#D3D3D3",
    // },
    // "& .MuiFormLabel-root.Mui-focused": {
    //   color: "blue", // or black
    // },
    // "& .MuiInputLabel-shrink": {
    //   color: "grey", // or black
    // },
  },
}));

const tfStyle = {
  // "& .MuiOutlinedInput-root": {
  //   // probably the width of your search IconButton or more if needed
  //   // color: "red",
  //   paddingTop: "10px",
  //   top: 5,
  // },
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    // visibility: "visible",
    boxShadow: "none",
    // position: "absolute",
    // p: 0,
    // right: 40,
    // top: 5,
    //"calc(50% - 12px)"
  },
  "& .MuiButtonBase-root.MuiAutocomplete-popupIndicator": {
    // visibility: "visible",
    boxShadow: "none",
    // position: "absolute",
    // p: 0,
    // right: 10,
    // top: 5,
  },
  // "& .MuiOutlinedInput-root.MuiAutocomplete-endAdornment": {
  //   // probably the width of your search IconButton or more if needed
  // },
};

export default function Countries(props) {
  const { value, setValue, options, error } = props;
  const [inputValue, setInputValue] = React.useState("");
  const classes = useStyles();
  // if (value.countryCode) {
  //   let found;
  //   options.map((item) => {
  //     if (value.countryCode == item.countryCode) found = item.countryName;
  //   });
  //   if (value.countryName !== found) {
  //     setValue({ ...value, countryName: found });
  //   }
  // }
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      style={{ marginTop: "0px", width: "100%", top: 5 }}
      classes={classes.root}
      value={value}
      size="small"
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, countryName: newValue.countryName });

          setValue({
            ...value,
            countryCode: newValue.countryCode,
            countryName: newValue.countryName,
            stateName: "",
            stateCode: "",
            districtName: "",
            districtCode: "",
            talukaName: "",
            talukaCode: "",
          });
          console.log(
            "onchange" + newValue,
            newValue.countryCode,
            newValue.countryName
          );
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        console.log("onInputchange" + newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => option.countryName}
      // sx={{ width: 300 }}
      renderInput={(params, InputLabelProps) => (
        <TextField
          {...params}
          {...(error && { error: true, helperText: error })}
          label="Country"
          sx={tfStyle}
          InputProps={{
            ...params.InputProps,
            sx: {
              // this is necessary if you don't want to input value to be
              // placed under the icon at the end
              "&&&": { pr: "70px" },
            },
          }}
          InputLabelProps={{
            shrink: true,
            ...InputLabelProps,
          }}
        />
      )}
    />
  );
}
