import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@material-ui/core";

export default function RadioGroup(props) {
  const { name, label, value, onChange, items, error, ...other } = props;

  return (
    <FormControl
      size="small"
      {...(error && { error: true, helperText: error })}
      {...other}
    >
      <FormLabel style={{ fontSize: 15 }}>{label}</FormLabel>
      <MuiRadioGroup
        row
        name={name}
        value={value}
        onChange={onChange}
        size="small"
        {...other}
      >
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            size="small"
            value={item.id}
            control={<Radio size="small" />}
            label={item.title}
          />
        ))}
      </MuiRadioGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}
