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
    top: 5,
    "& .MuiFormLabel-root": {
      fontSize: 15,
      color: "#D3D3D3",
      // position: "absolute",
      // left: 0,
      // top: 5,
      // p: 5,
      // // right: 40,

      // paddingBottom: "10px",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue", // or black
    },
    "& .MuiInputLabel-shrink": {
      color: "grey", // or black
    },
    "& .MuiInputBase-input": {
      // height: "1.5rem",
      // paddingTop: "0px",
    },
    "& .MuiButtonBase-root": {
      visibility: "visible",
      boxShadow: "none",
      // position: "absolute",
      // p: 0,
      // right: 40,
      // top: 5,
      //"calc(50% - 12px)"
    },
    "& .MuiOutlinedInput-root": {
      // probably the width of your search IconButton or more if needed
      // color: "red",
      paddingRight: "50px",
      height: "40px",
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
  // const {value, setValue} = React.useState(new Date());
  console.log(value[name]);
  const classes = useStyles();

  return (
    <div className="customDatePickerWidth">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          inputFormat="dd/MM/yyyy"
          label={label}
          value={value[name]}
          onChange={(newValue) => {
            setValue({ ...value, [name]: newValue });
          }}
          wrapperClassName="datepicker"
          // style={{ borderRadius: "10px" }}
          containerStyle={{ width: "100%" }}
          renderInput={(params) => (
            <TextField className={classes.root} size="small" {...params} />
          )}
          disabled={disabled}
          {...(error && { error: true, helperText: error })}
        />
      </LocalizationProvider>
    </div>
  );
}
// import * as React from "react";
// import TextField from "@mui/material/TextField";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// export default function BasicDatePicker() {
//   const [value, setValue] = React.useState(null);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <DatePicker
//         label="Basic example"
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue);
//         }}
//         renderInput={(params) => <TextField size="small" {...params} />}
//       />
//     </LocalizationProvider>
//   );
// }
