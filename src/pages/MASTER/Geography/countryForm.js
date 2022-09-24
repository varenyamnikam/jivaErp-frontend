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

export default function CountryForm(props) {
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
  const [errors, setErrors] = useState({});
  console.log(values);
  console.log(errors);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("userCode" in fieldValues)
    //   temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    if ("countryName" in fieldValues)
      temp.countryName = fieldValues.countryName
        ? ""
        : "This field is required.";
    if ("countryCode" in fieldValues)
      temp.countryCode = fieldValues.countryCode
        ? ""
        : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      roleService.insertLocation({ ...values, countryStatus: "ACTIVE" });
      setRecords([...records, { ...values, countryStatus: "ACTIVE" }]);
    }
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
  console.log(values.countryName);
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Controls.Input
          name="countryCode"
          label="Country Code"
          value={values.countryCode}
          onChange={handleInputChange}
          error={errors.countryCode}
        />

        <Controls.Input
          name="countryName"
          label="Country Name"
          value={values.countryName}
          onChange={handleInputChange}
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
// <States
// value={values}
// setValue={setValues}
// options={state}
// countries={country}
// country={values.countryName}
// disable={stateDisable}
// />
