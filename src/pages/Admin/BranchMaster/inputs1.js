import React, { useState, useEffect } from "react";
import Controls from "../../../components/controls/Controls";
import BasicSelect from "../../Usermaster/basicselect";
import { Grid } from "@material-ui/core";

export default function DisabledInputs1(props) {
  const { values, errors, handleChange } = props;
  console.log(values);
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="branchCode"
          label="Branch Code"
          value={values.branchCode ? values.branchCode : "N E W"}
          error={errors.branchCode}
          onChange={handleChange}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="branchName"
          label="Branch Name"
          value={values.branchName}
          error={errors.branchName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="adressLine1"
          label="Adress Line 1"
          value={values.adressLine1}
          error={errors.adressLine1}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="adressLine2"
          label=" Adress Line 2"
          value={values.adressLine2}
          error={errors.adressLine2}
          onChange={handleChange}
        />
      </Grid>
    </>
  );
}
