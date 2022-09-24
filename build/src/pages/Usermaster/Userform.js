import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";
import DropDownMenu from "./dropdownmenu";
import ColorCheckboxes from "./checkboxes";
// import BasicSelect from "./selectusemaster";
import NewCheckboxes from "./newcheckboxes";
import BasicSelect from "./basicselect";
import { Link, animateScroll as scroll } from "react-scroll";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import DisabledInputs1 from "./userinputs1";
import DisabledInputs2 from "./userinputs2";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import "./table.scss";

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
    width: "350px",
    borderRadius: "10px",
    // boxShadow: "0 0 0 40px white",
    padding: "5px",
    paddingRight: "0px",

    border: "1px solid #d3d3d3",
    margin: "10px",
  },
}));
const roleOptions = [
  "  Accounts Users",
  "Administrator",
  "HR Users",
  "Inventory Users",
  "Logistic Users",
  "Marketing User",
  "Processing Users",
  "Production User",
  "Purchase Users",
  "QC Users",
];

export default function Userform(props) {
  const {
    records,
    setRecords,
    setPage,
    values,
    setValues,
    initialValues,
    branchNames,
    count,
    setCount,
  } = props;
  console.log(branchNames);
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  console.log(values);
  console.log(errors);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("userCode" in fieldValues)
    //   temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    if ("userName" in fieldValues)
      temp.userName = fieldValues.userName ? "" : "This field is required.";
    if ("Emailid" in fieldValues)
      temp.Emailid = /$^|.+@.+..+/.test(fieldValues.Emailid)
        ? ""
        : "Email is not valid.";
    if ("RePassword" in fieldValues) {
      if (fieldValues.RePassword == "")
        temp.RePassword = fieldValues.RePassword
          ? ""
          : "This field is required.";
    }
    if (fieldValues.RePassword !== "") {
      temp.RePassword =
        fieldValues.RePassword == fieldValues.Password
          ? ""
          : "plz enter the same password";
    }
    if ("Mobileno" in fieldValues) {
      temp.Mobileno =
        fieldValues.Mobileno.length == 10
          ? ""
          : "mobile no. shouldnot be  10 digit";
    }
    console.log(fieldValues.Mobileno.length);
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

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
    records.filter((item) => {
      return item.userCode !== values.userCode;
    });
    records.map((item) => {
      if (item.userCode == values.userCode) {
        x = false;
      }
    });
    if (validate()) {
      if (x) {
        setCount(parseInt(count) + 1);
        console.log(values, count);
        setRecords([...records, values]);
        // const Uvalue = roleService.Insertnewuser(values);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .post(
            Config.addUser,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setRecords([...records, response.data.values]);
          });

        scroll.scrollToBottom();
      } else {
        roleService.updateuser(values);
        const newrecord = records.filter((item) => {
          return item.userCode !== values.userCode;
        });
        setRecords([...newrecord, values]);
        scroll.scrollToBottom();
      }
    }
  };
  const options = branchNames.map((item) => {
    return item.spacedOption;
  });
  ///////////////code=>name || name=>code///////////////

  if (values.DefaultBranchName) {
    console.log("hi...");
    branchNames.map((item) => {
      if (
        (values.DefaultBranchName == item.spacedOption) &
        (values.DefaultBranchOptions !== item.option)
      ) {
        console.log(values.DefaultBranchOptions, values.DefaultBranchName);
        setValues({
          ...values,
          DefaultBranchOptions: item.option,
        });
      }
    });
  }
  if (!values.DefaultBranchName && values.DefaultBranchOptions) {
    console.log("hi...");
    branchNames.map((item) => {
      if (values.DefaultBranchOptions == item.option) {
        setValues({ ...values, DefaultBranchName: item.spacedOption });
      }
    });
  }
  /////////////////////////////////////////////////////////////
  console.log(options);
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid item xs={6}>
          <Controls.Input
            name="userCode"
            label="User Code"
            value={values.userCode}
            disabled={true}
            onChange={handleChange}
          />
        </Grid>{" "}
        <Grid item xs={6}>
          <Controls.Input
            name="userName"
            label="User Name"
            value={values.userName}
            // error={errors.userName}
            onChange={handleChange}
          />{" "}
        </Grid>{" "}
        <Grid item xs={6}>
          <Controls.Input
            name="Password"
            label=" Password"
            value={values.Password}
            // error={errors}
            onChange={handleChange}
          />{" "}
        </Grid>{" "}
        <Grid item xs={6}>
          <Controls.Input
            name="RePassword"
            label=" Re-Password"
            value={values.RePassword}
            // error={errors.RePassword}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} style={{ paddingRight: "85px" }}>
          <BasicSelect
            name="Role"
            label="Role"
            values={values}
            setValues={setValues}
            options={roleOptions}
          />{" "}
        </Grid>{" "}
        <Grid item xs={6}>
          <Controls.Input
            name="Mobileno"
            label="Mobile no."
            value={values.Mobileno}
            error={errors.Mobileno}
            onChange={handleChange}
          />{" "}
        </Grid>
        <Grid item xs={6}>
          <Controls.Input
            name="Emailid"
            label="Email id"
            value={values.Emailid}
            error={errors.Emailid}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6} style={{ paddingRight: "85px" }}>
          <BasicSelect
            name="DefaultBranchName"
            label="Branch Name"
            values={values}
            setValues={setValues}
            options={options}
          />
        </Grid>
        <Grid item xs={6}>
          <div className={classes.Weddings}>
            <Controls.RadioGroup
              name="DefaultYear"
              label="Default Year"
              value={values.DefaultYear}
              onChange={handleChange}
              items={defaultYearItems}
            />
            <Controls.RadioGroup
              name="AllowYearChange"
              label="Allow Year Change"
              value={values.AllowYearChange}
              onChange={handleChange}
              items={menuRightsItems}
            />
            <Controls.RadioGroup
              name="AllowBranchChange"
              label="Allow Branch Change"
              value={values.AllowBranchChange}
              onChange={handleChange}
              items={menuRightsItems}
            />
            <Controls.RadioGroup
              name="Status"
              label="Status"
              value={values.Status}
              onChange={handleChange}
              items={statusItems}
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <NewCheckboxes
            options={branchNames}
            setValues={setValues}
            values={values}
            records={records}
          />{" "}
        </Grid>
        <Grid item xs={6}>
          {" "}
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "70px",
          }}
        >
          {" "}
          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button
              text="Reset"
              color="default"
              onClick={handleReset}
            />
          </div>
        </Grid>
      </Grid>
    </Form>
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
// label="DefaultBranchOptions ▼"
// name="DefaultBranchOptions"
// />
// <DropDownMenu
// options={defaultBranchOptions}
// setValues={setValues}
// values={values}
// label="Default Branch Options ▼"
// name="DefaultBranchOptions"
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
