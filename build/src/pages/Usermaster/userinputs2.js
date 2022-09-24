import React, { useState, useEffect } from "react";
import Controls from "../../components/controls/Controls";

export default function DisabledInputs2(props) {
  const { values, errors, handleChange } = props;
  console.log(values);
  return (
    <div>
      <Controls.Input
        name="Mobileno"
        label="Mobile no."
        value={values.Mobileno}
        error={errors.Mobileno}
        onChange={handleChange}
      />
      <Controls.Input
        name="Emailid"
        label="Email id"
        value={values.Emailid}
        error={errors.Emailid}
        onChange={handleChange}
      />
    </div>
  );
}
