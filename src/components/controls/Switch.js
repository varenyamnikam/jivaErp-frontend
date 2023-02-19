import React, { useState } from "react";
import { Switch } from "@material-ui/core";

function ToggleSwitch({ checked, setChecked, label = "Keep Open" }) {
  const handleChange = (event) => {
    setChecked(event.target.checked);
    const prevSetting = JSON.parse(
      localStorage.getItem("adm_softwareSettings")
    );
    const newSetting = {
      ...prevSetting,
      keepTransactionAccordionOpen: event.target.checked,
    };
    localStorage.setItem("adm_softwareSettings", JSON.stringify(newSetting));
  };
  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      name="checked"
      color="primary"
      size="small"
      label={label}
    />
  );
}

export default ToggleSwitch;
