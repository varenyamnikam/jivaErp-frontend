import * as React from "react";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { makeStyles } from "@material-ui/core";
import dayjs from "dayjs"; // import dayjs library

const useStyles = makeStyles((theme) => ({
  datePicker: {
    "& button": {
      boxShadow: "none",
      backgroundColor: "transparent",
    },
  },
}));

export default function Calendar(props) {
  const { name, label, value, setValue, error = null } = props;
  const classes = useStyles();
  console.log(error);

  const handleChange = (newValue) => {
    const formattedDate = dayjs(newValue).format("DD/MM/YYYY"); // format the date to the desired format
    const dateObject = new Date(formattedDate); // convert the formatted date string to a Date object
    setValue({ ...value, [name]: dateObject });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value[name]}
        onChange={handleChange} // pass the handleChange function to onChange event
        className={classes.datePicker}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            format="DD/MM/YYYY"
            {...(error && { error: true, helperText: error })}
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  );
}
