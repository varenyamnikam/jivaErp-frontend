import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import GetData from "./initialValues";
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

export default function Location(props) {
  const { state, District, Taluka } = GetData();
  const { value, setValue, options, name, label, disable } = props;
  const [inputValue, setInputValue] = React.useState("");
  const classes = useStyles();
  console.log(value, options, inputValue);
  return (
    <>
      <div>
        <br />
        <Autocomplete
          fullWidth={true}
          disabled={disable}
          // getOptionDisabled={getOptionDisabled}
          value={value.countryName}
          onChange={(event, newValue) => {
            setValue({ ...value, countryName: newValue });
            console.log(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            console.log("onInputChange" + newInputValue + label);
          }}
          id="controllable-states-demo"
          options={["india"]}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label={"Country"} />}
        />
      </div>{" "}
      <div>
        <br />
        <Autocomplete
          fullWidth={true}
          disabled={disable}
          // getOptionDisabled={getOptionDisabled}
          value={value.stateName}
          onChange={(event, newValue) => {
            setValue({ ...value, stateName: newValue });
            console.log(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            console.log("onInputChange" + newInputValue + label);
          }}
          id="controllable-states-demo"
          options={state}
          getOptionLabel={(option) => option.stateName}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label={"state"} />}
        />
      </div>
    </>
  );
}
