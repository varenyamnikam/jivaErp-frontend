import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { NotifyMsg } from "../../../components/notificationMsg";
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
    setNotify,
    setButtonPopup,
  } = props;
  console.log(country, state, District);
  console.log(values);
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
    console.log(temp);
    if ("countryName" in fieldValues) {
      let x = "countryName";
      let found = records.find((item) => item[x] == fieldValues[x]);
      if (fieldValues[x])
        temp[x] = found ? `${found[x]} already exists at ` : "";
      // let y = "countryCode";
      // let founde = records.find((item) => item[y] == fieldValues[y]);
      // if (fieldValues[y])
      //   temp[y] = founde ? `${founde[y]} already exists  ` : "";
    }

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
    if (validate()) {
      console.log(values);
      const url = Config().location;

      const handleErr = (error) => {
        setNotify(NotifyMsg(4));
      };

      let cntry = records.find(
        (item) => item.countryCode == values.countryCode
      );
      console.log(cntry);
      if (!cntry) {
        const handleRes = (response) => {
          setRecords([...records, values]);
          setButtonPopup(false);
          setNotify(NotifyMsg(1));
        };

        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        const handleRes = (response) => {
          const newRecords = records.map((item) =>
            item.countryCode == values.countryCode ? values : item
          );
          setRecords(newRecords);
          setNotify(NotifyMsg(2));

          setButtonPopup(false);
        };

        roleService.axiosPatch(url, values, handleRes, handleErr, () => {});
      }
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item sx={12} sm={6}>
          <Controls.Input
            name="countryCode"
            label="Country Code"
            value={values.countryCode}
            onChange={handleInputChange}
            error={errors.countryCode}
          />
        </Grid>{" "}
        <Grid item sx={12} sm={6}>
          <Controls.Input
            name="countryName"
            label="Country Name"
            value={values.countryName}
            onChange={handleInputChange}
            error={errors.countryName}
          />
        </Grid>{" "}
        <Grid
          item
          sx={12}
          sm={6}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Controls.Button type="submit" text="Submit" onClick={handleSubmit} />
          <Controls.Button text="Reset" color="default" />
        </Grid>
      </Grid>
    </>
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
