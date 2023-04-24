import * as React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { makeStyles, IconButton } from "@material-ui/core";
import { format } from "date-fns";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
      // paddingRight: "50px",
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
  console.log(value[name]);
  function isValidDate(date) {
    if (typeof date === "string") {
      // Check if the input is in "DD/MM/YYYY" format
      const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      if (regex.test(date)) {
        // If the input is in "DD/MM/YYYY" format, try to parse it as a date
        const timestamp = Date.parse(date);
        return isNaN(timestamp) === false;
      } else {
        // If the input is not in "DD/MM/YYYY" format, return false
        return false;
      }
    } else if (date instanceof Date) {
      // Check if the date object is valid
      return isNaN(date.getTime()) === false;
    } else {
      // If the input is neither a string nor a date object, return false
      return false;
    }
  }

  console.log(dayjs().toDate(), new Date());
  return (
    <div className="customDatePickerWidth">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          format="DD/MM/YYYY"
          className={classes.root}
          label={label}
          value={dayjs(value[name])}
          onChange={(newValue) => {
            if (newValue) setValue({ ...value, [name]: newValue.toDate() });
          }}
          sx={{ width: "100%" }}
          // pass fullWidth prop to TextField
          disabled={disabled}
          {...(error && { error: true, helperText: error })}
        />
      </LocalizationProvider>
    </div>
  );
}
