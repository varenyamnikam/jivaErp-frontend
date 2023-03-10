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
const initialFValues = {
  id: 0,
  roleCode: "",
  roleName: "",
};

export default function ReuseForm(props) {
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
    if ("stateCode" in fieldValues)
      temp.stateCode = fieldValues.stateCode ? "" : "This field is required.";

    if ("countryName" in fieldValues) {
      let x = "countryName";
      let found = records.find((item) => item[x] == fieldValues[x]);
      if (fieldValues[x])
        temp[x] = found ? `${found[x]} already exists at ` : "";
      let y = "countryCode";
      let founde = records.find((item) => item[y] == fieldValues[y]);
      if (fieldValues[y])
        temp[y] = founde ? `${founde[y]} already exists  ` : "";
    }
    if ("stateName" in fieldValues) {
      let x = "stateName";
      let found = records.find((item) => item[x] == fieldValues[x]);
      if (fieldValues[x]) temp[x] = found ? `${found[x]} already exists ` : "";
      let y = "stateCode";
      let founde = records.find((item) => item[y] == fieldValues[y]);
      if (fieldValues[y])
        temp[y] = founde ? `${founde[y]} already exists  ` : "";
    }

    console.log(temp);

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
          console.log("uff..", c.countryCode);
          roleService.insertLocation({
            ...values,
            stateStatus: "ACTIVE",
            countryCode: c.countryCode,
          });
          setRecords([
            ...records,
            {
              ...values,
              stateStatus: "ACTIVE",
              countryCode: c.countryCode,
            },
          ]);
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
  if (title == "STATE") {
    return (
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Controls.Input
            name="stateCode"
            label="State Code"
            value={values.stateCode}
            onChange={handleInputChange}
            error={errors.stateCode}
          />

          <Controls.Input
            name="stateName"
            label="State Name"
            value={values.stateName}
            onChange={handleInputChange}
            error={errors.stateName}
          />
          <Countries
            value={values}
            setValue={setValues}
            options={country}
            error={errors.countryName}
          />
        </Grid>
        <div>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={() => {}} />
        </div>
      </Form>
    );
  }
}
// <States
// value={values}
// setValue={setValues}
// options={state}
// countries={country}
// country={values.countryName}
// disable={stateDisable}
// />
