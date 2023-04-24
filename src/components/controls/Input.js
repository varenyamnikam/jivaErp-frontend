import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    //top: 5,
    "& .MuiFormLabel-root": {
      fontSize: 15,
      // color: "#D3D3D3",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue", // or black
    },
    "& .MuiInputLabel-shrink": {
      color: "grey", // or black
    },
  },
}));

export default function Input(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    disabled,
    InputLabelProps = {},
    ...other
  } = props;
  const classes = useStyles();

  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      // style={{ width: "100%" }}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      className={classes.root}
      {...other}
      {...(error && { error: true, helperText: error })}
      disabled={disabled}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
    />
  );
}
