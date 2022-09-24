import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

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
      disablePortal
      id="combo-box-demo"
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
      options={options}
      getOptionLabel={(option) => option.countryName}
      // sx={{ width: 300 }}
      renderInput={(params) => (
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
        />
      )}
    />
  );
}
