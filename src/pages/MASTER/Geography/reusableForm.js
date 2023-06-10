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
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutoSuggest from "../../../components/smartAutoSuggest";
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
    setNotify,
    setButtonPopup,
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
    if ("stateName" in fieldValues)
      temp.stateName = fieldValues.stateName ? "" : "This field is required.";
    if ("stateCode" in fieldValues)
      temp.stateCode = fieldValues.stateCode ? "" : "This field is required.";

    if ("stateName" in fieldValues) {
      let x = "stateName";
      let found = records.find((item) => item[x] == fieldValues[x]);
      if (fieldValues[x]) temp[x] = found ? `${found[x]} already exists ` : "";
      // let y = "stateCode";
      // let founde = records.find(
      //   (item) => item[y] == fieldValues[y]
      // );
      // if (fieldValues[y])
      //   temp[y] = founde ? `${founde[y]} already exists  ` : "";
    }

    console.log(temp);

    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let cntry = country.find((c) => c.countryName == values.countryName);

    if (validate() && cntry) {
      const url = Config().location;

      const handleErr = (error) => {
        setNotify(NotifyMsg(4));
      };

      let state = records.find((item) => item.stateCode == values.stateCode);
      if (!state) {
        const handleRes = (response) => {
          setRecords([
            ...records,
            {
              ...values,
              stateStatus: "ACTIVE",
              countryCode: cntry.countryCode,
            },
          ]);
          setButtonPopup(false);
          setNotify(NotifyMsg(1));
          console.log({
            ...values,
            stateStatus: "ACTIVE",
            countryCode: cntry.countryCode,
          });
        };

        roleService.axiosPut(
          url,
          {
            ...values,
            stateStatus: "ACTIVE",
            countryCode: cntry.countryCode,
          },
          handleRes,
          handleErr,
          () => {}
        );
      } else {
        const handleRes = (response) => {
          const newRecords = records.map((item) =>
            item.stateCode == values.stateCode
              ? {
                  ...values,
                  stateStatus: "ACTIVE",
                  countryCode: cntry.countryCode,
                }
              : item
          );
          setRecords(newRecords);
          setButtonPopup(false);
          setNotify(NotifyMsg(1));
        };

        roleService.axiosPatch(
          url,
          {
            ...values,
            stateStatus: "ACTIVE",
            countryCode: cntry.countryCode,
          },
          handleRes,
          handleErr,
          () => {}
        );
      }
    }
    if (!cntry) setNotify(NotifyMsg(5));
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
  const cntryOptions = country.map((item) => item.countryName);
  if (title == "STATE") {
    return (
      <Grid container spacing={2}>
        <Grid item sx={12} sm={6}>
          <Controls.Input
            name="stateCode"
            label="State Code"
            value={values.stateCode}
            onChange={handleInputChange}
            error={errors.stateCode}
          />
        </Grid>{" "}
        <Grid item sx={12} sm={6}>
          <Controls.Input
            name="stateName"
            label="State Name"
            value={values.stateName}
            onChange={handleInputChange}
            error={errors.stateName}
          />
        </Grid>{" "}
        <Grid item sx={12} sm={6}>
          <SmartAutoSuggest
            value={values}
            setValue={setValues}
            name1="countryName"
            code1="countryCode"
            name2="countryName"
            code2="countryCode"
            options1={cntryOptions}
            options2={country}
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
        </Grid>{" "}
      </Grid>
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
