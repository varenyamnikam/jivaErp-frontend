import React, { useState, useEffect } from "react";
import Controls from "../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";

export default function DisabledInputs1(props) {
  const { values, errors, handleChange } = props;
  console.log(errors);
  // if (values.userCode) {
  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="userCode"
          label="User Code"
          value={values.userCode}
          disabled={true}
          onChange={handleChange}
        />{" "}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="userName"
          label="User Name"
          value={values.userName}
          // error={errors.userName}
          onChange={handleChange}
        />{" "}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="Password"
          label=" Password"
          value={values.Password}
          // error={errors}
          onChange={handleChange}
        />{" "}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          name="RePassword"
          label=" Re-Password"
          value={values.RePassword}
          // error={errors.RePassword}
          onChange={handleChange}
        />{" "}
      </Grid>
    </Grid>
  );
  // } else {
  //   return (
  //     <div>
  //       <Controls.Input
  //         name="userCode"
  //         label="User Code"
  //         value={"X X X X"}
  //         // error={errors.userCode}
  //         onChange={handleChange}
  //         disabled={true}
  //       />
  //       <Controls.Input
  //         name="userName"
  //         label="User Name"
  //         value={values.userName}
  //         error={errors.userName}
  //         onChange={handleChange}
  //       />
  //       <Controls.Input
  //         name="Password"
  //         label=" Password"
  //         value={values.Password}
  //         error={errors.Password}
  //         onChange={handleChange}
  //       />
  //       <Controls.Input
  //         name="RePassword"
  //         label=" Re-Password"
  //         value={values.RePassword}
  //         error={errors.RePassword}
  //         onChange={handleChange}
  //       />
  //     </div>
  //   );
  // }
}
