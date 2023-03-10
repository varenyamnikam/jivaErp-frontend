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
  const {
    name,
    label,
    value,
    onChange,
    items,
    error,
    position = "top",
    ...other
  } = props;

  return (
    <FormControl
      size="small"
      {...(error && { error: true, helperText: error })}
      {...other}
      style={
        position !== "top"
          ? {
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }
          : {}
      }
    >
      <FormLabel style={{ fontSize: 15 }} labelPlacement={position}>
        {label}
      </FormLabel>
      <div>
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
      </div>
    </FormControl>
  );
}
