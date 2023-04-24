import React, { useState, useEffect } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import GetData from "../pages/Admin/BranchMaster/initialValues";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: theme.palette.primary.contrastText,
  },
  popupIndicator: {
    color: theme.palette.primary.contrastText,
  },
  root: {
    padding: `0 ${theme.spacing(1)}px`,
  },
}));

export default function ControllableStates(props) {
  const { value, setValue, name, label, disable, options } = props;
  const [newOptions, setNewOptions] = useState([
    {
      stateName: "haha",
      countryName: "haha",
      districtName: "haha",
      talukaName: "haha",
    },
  ]);
  const classes = useStyles();
  console.log(name, value, newOptions, options);
  const [inputValue, setInputValue] = React.useState(value[name]);
  console.log(value[name], inputValue);
  return (
    <div>
      <br />
      <Autocomplete
        fullWidth={true}
        // getOptionDisabled={getOptionDisabled}
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue, event.target);
          if (newValue) {
            setValue({ ...value, [name]: newValue[name] });
          }
          // if (!newValue) {
          //   setValue({ ...value, [name]: "" });
          // }
          // setInputValue(value[name]);if (newValue)
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          // if (newInputValue) {
          //   setValue({ ...value, [name]: newInputValue });
          //   console.log("heheh");
          // }
          if (newInputValue) {
            setInputValue(newInputValue);
          } else {
            setInputValue("");
          }

          console.log("onInputChange" + newInputValue + label);
          // setValue({ ...value, [name]: newInputValue[name] });
          // console.log(inputValue, value[name]);
        }}
        getOptionLabel={(option) => option[name]}
        id="controllable-states-demo"
        options={options}
        sx={{ width: 400 }}
        renderInput={(params) => (
          <TextField {...params} value={value[name]} label={label} />
        )}
      />
    </div>
  );
}
