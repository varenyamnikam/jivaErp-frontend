import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import * as roleService from "../../services/roleService";
import { Grid } from "@material-ui/core";

const initialFValues = {
  id: 0,
  roleCode: "",
  roleName: "",
};

export default function RoleForm(props) {
  const { addOrEdit } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("roleCode" in fieldValues)
      temp.roleCode = fieldValues.roleCode ? "" : "This field is required.";
    if ("roleName" in fieldValues)
      temp.roleName = fieldValues.roleName ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addOrEdit(values);
      console.log(values);
    }
  };
  const resetForm = (e) => {
    setValues(initialFValues);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Controls.Input
          name="roleCode"
          label="Role Code"
          value={values.roleCode}
          onChange={handleInputChange}
          error={errors.roleCode}
        />

        <Controls.Input
          name="roleName"
          label="Role Name"
          value={values.roleName}
          onChange={handleInputChange}
          error={errors.roleName}
        />

        <div>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={resetForm} />
        </div>
      </Grid>
    </Form>
  );
}
