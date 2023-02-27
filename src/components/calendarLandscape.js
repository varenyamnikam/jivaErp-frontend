import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { makeStyles, IconButton } from "@material-ui/core";
import "./arrows.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root": {
      fontSize: 15,
      color: "#D3D3D3",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue",
    },
    "& .MuiInputLabel-shrink": {
      color: "grey",
    },
    "& .MuiInputBase-input": {
      height: "1.5rem",
    },
    "& .MuiButtonBase-root": {
      visibility: "visible",
      // remove box shadow from calendar icon button
      boxShadow: "none",
    },
    "& .MuiOutlinedInput-root": {
      paddingRight: "50px",
      height: "40px",
    },
  },
  datePicker: {
    "& button": {
      boxShadow: "none",
      backgroundColor: "transparent",
    },
  },
}));

export default function StaticDatePickerLandscape(props) {
  const {
    value,
    setValue,
    name,
    label,
    disabled = false,
    error = null,
  } = props;

  const classes = useStyles();

  return (
    <div className="customDatePickerWidth">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          inputFormat="dd/MM/yyyy"
          className={classes.datePicker}
          label={label}
          value={value[name]}
          onChange={(newValue) => {
            setValue({ ...value, [name]: newValue });
          }}
          wrapperClassName="datepicker"
          containerStyle={{ width: "100%" }}
          // pass fullWidth prop to TextField
          renderInput={(params) => (
            <TextField size="small" fullWidth {...params} />
          )}
          disabled={disabled}
          {...(error && { error: true, helperText: error })}
        />
      </LocalizationProvider>
    </div>
  );
}
