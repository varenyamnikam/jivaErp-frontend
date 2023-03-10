import * as React from "react";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

export default function Password(props) {
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
  const [showPassword, setShowPassword] = React.useState(false);
  const classes = useStyles();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <TextField
      size="small"
      id="outlined-adornment-password"
      type={showPassword ? "text" : "password"}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      className={classes.root}
      {...other}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              style={{ boxShadow: "none" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>{" "}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      {...(error && { error: true, helperText: error })}
      disabled={disabled}
    />
  );
}
