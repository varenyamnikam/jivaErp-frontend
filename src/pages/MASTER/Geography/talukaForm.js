import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import Countries from "../../../components/countrySelect";
import States from "../../../components/statesSelect";
import Districts from "../../../components/districtSelect";
const initialFValues = {
  id: 0,
  roleCode: "",
  roleName: "",
};

export default function Talukaform(props) {
  const {
    title,
    values,
    setValues,
    records,
    setRecords,
    country,
    state,
    District,
  } = props;
  console.log(country, state, District);
  console.log(values);
  const [stateDisable, setStateDisable] = useState(true);
  const [districtDisable, setDistrictDisable] = useState(true);
  const [errors, setErrors] = useState({ countryName: "" });
  console.log(errors);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("userCode" in fieldValues)
    //   temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    if ("countryName" in fieldValues)
      temp.countryName = fieldValues.countryName
        ? ""
        : "This field is required.";
    if ("stateName" in fieldValues)
      temp.stateName = fieldValues.stateName ? "" : "This field is required.";
    if ("districtName" in fieldValues)
      temp.districtName = fieldValues.districtName
        ? ""
        : "This field is required.";
    if ("talukaName" in fieldValues)
      temp.talukaName = fieldValues.talukaName ? "" : "This field is required.";

    if ("talukaCode" in fieldValues)
      temp.talukaCode = fieldValues.talukaCode ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate())
      country.map((c) => {
        if (c.countryName == values.countryName) {
          state.map((s) => {
            if (s.stateName == values.stateName) {
              roleService.insertLocation({
                ...values,
                talukaStatus: "ACTIVE",
                countryCode: c.countryCode,
                stateCode: s.stateCode,
              });
              setRecords([
                ...records,
                {
                  ...values,
                  talukaStatus: "ACTIVE",
                  countryCode: c.countryCode,
                  stateCode: s.stateCode,
                },
              ]);
            }
          });
          console.log("uff..", c.countryCode);
        }
      });

    console.log(values);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setValues({
      ...values,
      [name]: value,
    });
    console.log(values);
  };
  if (values.countryName && stateDisable) {
    setStateDisable(false);
  }
  if (values.stateName && districtDisable) {
    setDistrictDisable(false);
  }
  useEffect(() => {
    validate();
  }, [values]);
  console.log(values.countryName);
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Controls.Input
          name="talukaName"
          label="Taluka Name"
          value={values.talukaName}
          onChange={handleInputChange}
          error={errors.talukaName}
        />
        <Countries
          value={values}
          setValue={setValues}
          options={country}
          error={errors.countryName}
        />
        <States
          value={values}
          setValue={setValues}
          options={state}
          countries={country}
          country={values.countryName}
          disable={stateDisable}
          error={errors.stateName}
        />
        <Districts
          value={values}
          setValue={setValues}
          options={District}
          states={state}
          state={values.stateName}
          disable={districtDisable}
          error={errors.districtName}
        />
      </Grid>
      <div>
        <Controls.Button type="submit" text="Submit" />
        <Controls.Button text="Reset" color="default" onClick={() => {}} />
      </div>
    </Form>
  );
}
// <States
// value={values}
// setValue={setValues}
// options={state}
// countries={country}
// country={values.countryName}
// disable={stateDisable}
// />
