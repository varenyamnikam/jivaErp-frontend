import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core";
// import { Handlesubmenuchange } from "../pages/Rolemaster/handleSubmenuchange";

export function useForm(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});
  // const [form, setForm] = useState({ form: "X" });
  const inputRef = useRef();
  // const { resetForm, form } = Handlesubmenuchange();

  console.log(values);
  // console.log(form);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    console.log(values);
    setValues({
      ...values,
      [name]: value,
    });
    console.log(values);

    if (validateOnChange) validate({ [name]: value });
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    // subMenu,
    // setSubMenu,
    inputRef,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
