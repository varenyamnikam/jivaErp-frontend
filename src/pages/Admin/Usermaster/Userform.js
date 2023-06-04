import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../../components/useForm";
import Controls from "../../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import Config from "../../../Utils/Config";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import "./table.scss";
import { useNavigate } from "react-router-dom";
import * as roleService from "../../../services/roleService";
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const defaultYearItems = [
  { id: "2021-22", title: "2021-22" },
  { id: "2022-23", title: "2022-23" },
];
const useStyles = makeStyles((theme) => ({
  Weddings: {
    // border: "1px",
    // borderColor: "#d3d3d3",
    // borderRightColor: "#d3d3d3",
    // width: "350px",
    width: "90%",
    borderRadius: "10px",
    // boxShadow: "0 0 0 40px white",
    padding: "5px",
    // paddingRight: "0px",

    border: "1px solid #d3d3d3",
    margin: "10px",
  },
}));

export default function Userform(props) {
  const {
    records,
    setRecords,
    setPage,
    values,
    setValues,
    initialValues,
    branchNames,
    setButtonPopup,
    initialFilterValues,
    finYear,
    setNotify,
  } = props;
  console.log(branchNames);
  const classes = useStyles();
  const page = useNavigate();
  const [errors, setErrors] = useState(initialFilterValues);
  console.log(values);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(temp).map((x) => {
      x !== "userCode" && check(x);
    });
    if ("Emailid" in fieldValues && fieldValues.Emailid !== "")
      temp.Emailid = /$^|.+@.+..+/.test(fieldValues.Emailid)
        ? ""
        : "Email is not valid.";

    if ("RePassword" in fieldValues && fieldValues.RePassword !== "") {
      temp.RePassword =
        fieldValues.Password == fieldValues.RePassword
          ? ""
          : "Password and RePassword should be same";
    }
    if ("Mobileno" in fieldValues) {
      temp.Mobileno =
        fieldValues.Mobileno.length == 10
          ? ""
          : "mobile no. should be  10 digit";
    }

    let found = records.find(
      (item) =>
        item.userName == fieldValues.userName &&
        item.userCode !== fieldValues.userCode
    );
    if (fieldValues.userName)
      temp.userName = found
        ? `${found.userName} already exists at ${found.userCode}`
        : "";
    const hasRight = fieldValues.userCode
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues.userCode ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));
    console.log(temp);
    setErrors(temp);

    return Object.values(temp).every((x) => x == "" || x == null) && hasRight;
  };
  // useEffect(() => {
  //   if (!Object.values(errors).every((x) => x == "")) validate();
  // }, [values]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleReset = (e) => {
    console.log(e.target);
    setValues(initialValues);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;

    records.map((item) => {
      if (item.userCode == values.userCode) {
        x = false;
      }
    });
    console.log(values);

    if (validate()) {
      const url = Config.usermasterUrl;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
      };
      if (x) {
        const handleRes = (response) => {
          console.log("hi....", response.data.values);
          setRecords([...records, response.data.values]);
          setNotify(NotifyMsg(1));
          setButtonPopup(false);
        };
        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        const handleRes = (response) => {
          setNotify(NotifyMsg(2));
          console.log(response.data.err);
          const newrecord = records.filter((item) => {
            return item.userCode !== values.userCode;
          });
          setRecords([...newrecord, values]);
          setButtonPopup(false);
        };

        roleService.axiosPatch(url, values, handleRes, handleErr, () => {});
        if (values.userCode == AuthHandler.getUser().userCode) {
          alert("plz login again");
          // localStorage.clear();
          page("/");
        }
      }
    }
  };
  const options = branchNames.map((item) => {
    return item.spacedOption;
  });
  const finOptions = finYear.map((item) => {
    return item.finYear;
  });

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="userCode"
          label="User Code"
          value={values.userCode ? values.userCode : "N E W"}
          disabled={true}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="userName"
          label="User Name"
          value={values.userName}
          error={errors.userName}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Password
          name="Password"
          label=" Password"
          value={values.Password}
          error={errors.Password}
          onChange={handleChange}
          autoComplete="new-password"
          fullWidth
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Password
          name="RePassword"
          label=" Re-Password"
          value={values.RePassword}
          error={errors.RePassword}
          onChange={handleChange}
          autoComplete="new-password"
          fullWidth
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="Mobileno"
          label="Mobile no."
          value={values.Mobileno}
          error={errors.Mobileno}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="Emailid"
          label="Email id"
          value={values.Emailid}
          error={errors.Emailid}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12} style={{ margin: "0px" }}>
        <SmartAutosuggest
          label="Branch Name"
          name1="defaultBranchName"
          code1="defaultBranchCode"
          name2="spacedOption"
          code2="option"
          value={values}
          setValue={setValues}
          options1={options}
          options2={branchNames}
          error={errors.defaultBranchName}
        />
      </Grid>
      <Grid item sm={6} xs={12} style={{ margin: "0px" }}>
        <SmartAutosuggest
          label="Financial Year"
          name1="defaultFinYear"
          code1="defaultYearCode"
          name2="finYear"
          code2="yearCode"
          value={values}
          setValue={setValues}
          options1={finOptions}
          options2={finYear}
          error={errors.defaultFinYear}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="AllowYearChange"
          label="Allow Year Change"
          value={values.AllowYearChange}
          onChange={handleChange}
          items={menuRightsItems}
          error={errors.AllowYearChange}
        />{" "}
      </Grid>{" "}
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="AllowBranchChange"
          label="Allow Branch Change"
          value={values.AllowBranchChange}
          onChange={handleChange}
          items={menuRightsItems}
          error={errors.AllowBranchChange}
        />{" "}
      </Grid>{" "}
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="Status"
          label="Status"
          value={values.Status}
          onChange={handleChange}
          items={statusItems}
          error={errors.Status}
        />{" "}
      </Grid>
      <Grid
        item
        sm={6}
        xs={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "70px",
        }}
      >
        <div>
          <Controls.Button type="submit" text="Submit" onClick={handleSubmit} />
          <Controls.Button text="Reset" color="default" onClick={handleReset} />
        </div>
      </Grid>
    </Grid>
  );
}
// <BasicSelect
//   options={roleOptions}
//   setValues={setValues}
//   values={values}
//   name="Role"
//   label="Role ▼"
// />
// <BasicSelect
//   name="Role"
//   label="Role"
//   options={roleOptions}
//   setValues={setValues}
//   values={values}
// />

// <BasicSelect
// options={defaultBranchOptions}
// setValues={setValues}
// values={values}
// label="defaultBranchCode ▼"
// name="defaultBranchCode"
// />
// <DropDownMenu
// options={defaultBranchOptions}
// setValues={setValues}
// values={values}
// label="Default Branch Options ▼"
// name="defaultBranchCode"
// />
// <ColorCheckboxes
// options={defaultBranchOptions}
// setValues={setValues}
// values={values}
// records={records}
// />
// <Controls.Input
// name="userCode"
// label="User Code"
// value={values.userCode}
// error={errors.userCode}
// onChange={handleChange}
// />
// <Controls.Input
// name="userName"
// label="User Name"
// value={values.userName}
// error={errors.userName}
// onChange={handleChange}
// />
// <Controls.Input
// name="Password"
// label=" Password"
// value={values.Password}
// // error={errors}
// onChange={handleChange}
// />
// <Controls.Input
// name="RePassword"
// label=" Re-Password"
// value={values.RePassword}
// error={errors.RePassword}
// onChange={handleChange}
// />
// <Controls.Input
// name="Mobileno"
// label="Mobile no."
// value={values.Mobileno}
// error={errors.Mobileno}
// onChange={handleChange}
// />
// <Controls.Input
// name="Emailid"
// label="Email id"
// value={values.Emailid}
// error={errors.Emailid}
// onChange={handleChange}
// />
// <Grid item sm={6} xs={12}>
// <NewCheckboxes
//   options={branchNames}
//   setValues={setValues}
//   values={values}
//   records={records}
// />
// </Grid>
