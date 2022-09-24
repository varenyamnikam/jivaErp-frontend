import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AirlineSeatIndividualSuiteSharp } from "@material-ui/icons";
import { SliderValueLabelUnstyled } from "@mui/base";
import { memo } from "react";

function Talukas(props) {
  const { value, setValue, options, disable, district, districts, error } =
    props;
  const [inputValue, setInputValue] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  if (value.talukaCode) {
    let found;
    options.map((item) => {
      if (value.talukaCode == item.talukaCode) found = item.talukaName;
    });
    if (value.talukaName !== found) setValue({ ...value, talukaName: found });
    console.log("findimg talukaName");
  }
  districts.map((c) => {
    if (c.districtName == district) {
      if (selectedDistrict !== c.districtCode)
        setSelectedDistrict(c.districtCode);
    }
  });
  return (
    <Autocomplete
      value={value}
      disabled={disable}
      onChange={(event, newValue) => {
        if (newValue) {
          // setValue({ ...value, talukaName: newValue.talukaName });
          setValue({
            ...value,
            talukaCode: newValue.talukaCode,
            talukaName: newValue.talukaName,
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
        return item.districtCode == selectedDistrict;
      })}
      getOptionLabel={(option) => option.talukaName}
      // sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...params}
          {...(error && { error: true, helperText: error })}
          label="Taluka"
        />
      )}
    />
  );
}
export default memo(Talukas);
