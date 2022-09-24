import React, { useState, useEffect } from "react";
import Controls from "../../components/controls/Controls";
import BasicSelect from "../Usermaster/basicselect";

export default function DisabledInputs1(props) {
  const { values, errors, handleChange } = props;
  console.log(values);
  if (values.branchCode) {
    return (
      <div>
        {" "}
        <Controls.Input
          name="branchCode"
          label="Branch Code"
          value={values.branchCode}
          // error={errors.branchCode}
          onChange={handleChange}
        />
        <Controls.Input
          name="branchName"
          label="Branch Name"
          value={values.branchName}
          // error={errors.branchName}
          onChange={handleChange}
        />
        <Controls.Input
          name="adressLine1"
          label="Adress Line 1"
          value={values.adressLine1}
          // error={errors}
          onChange={handleChange}
        />
        <Controls.Input
          name="adressLine2"
          label=" Adress Line 2"
          value={values.adressLine2}
          // error={errors.adressLine1}
          onChange={handleChange}
        />
      </div>
    );
  } else {
    return (
      <div>
        <Controls.Input
          name="branchCode"
          label="Branch Code"
          value="X X X X"
          // error={errors.branchCode}
          onChange={handleChange}
          disabled={true}
        />
        <Controls.Input
          name="branchName"
          label="Branch Name"
          value={values.branchName}
          // error={errors.branchName}
          onChange={handleChange}
        />
        <Controls.Input
          name="adressLine1"
          label="Adress Line 1"
          value={values.adressLine1}
          // error={errors}
          onChange={handleChange}
        />
        <Controls.Input
          name="adressLine2"
          label=" Adress Line 2"
          value={values.adressLine2}
          // error={errors.adressLine1}
          onChange={handleChange}
        />
      </div>
    );
  }
}
