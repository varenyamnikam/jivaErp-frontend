import React, { useState, useEffect } from "react";
import Controls from "../../components/controls/Controls";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
const useStyles = makeStyles((theme) => ({
  Weddings: {},
}));
export default function DisabledInputs2(props) {
  const { values, errors, handleChange } = props;
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="pinCode"
          label="Pincode"
          value={values.pinCode}
          error={errors.pinCode}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="GSTno"
          label="GST no."
          value={values.GSTno}
          error={errors.GSTno}
          onChange={handleChange}
        />{" "}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="Emailid"
          label="Email id"
          value={values.Emailid}
          // error={errors.Emailid}
          onChange={handleChange}
        />{" "}
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="contactNo"
          label="Contact no."
          value={values.contactNo}
          // error={errors.Mobileno}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}
// <Grid item xs={12} sm={6}>
// <Controls.Input
//   name="pesticideLicenceNo"
//   label="Pesticide Licence No."
//   value={values.pesticideLicenceNo}
//   // error={errors.Mobileno}
//   onChange={handleChange}
// />
// </Grid>

// <Grid item xs={12} sm={6}>
// <Controls.Input
//   name="Mobileno"
//   label="Mobile no."
//   value={values.Mobileno}
//   // error={errors.Mobileno}
//   onChange={handleChange}
// />{" "}
// </Grid>
// <Grid item xs={12} sm={6}>
// <Controls.Input
//   name="seedLicenceNo"
//   label="Seed Licence No."
//   value={values.seedLicenceNo}
//   // error={errors.Mobileno}
//   onChange={handleChange}
// />
// </Grid>
