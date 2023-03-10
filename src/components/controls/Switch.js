import React, { useState } from "react";
import { Switch } from "@material-ui/core";

function ExportSwitch({ checked, setChecked, label = "Keep Open", onChange }) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      name="checked"
      color="primary"
      size="small"
      label={label}
    />
  );
}

export default ExportSwitch;
