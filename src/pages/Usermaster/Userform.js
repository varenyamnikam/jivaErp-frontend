import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";
import DropDownMenu from "./dropdownmenu";
import ColorCheckboxes from "./checkboxes";
// import BasicSelect from "./selectusemaster";
import NewCheckboxes from "./newcheckboxes";
import BasicSelect from "./basicselect";
import UnusedAutosuggest from "../../components/unusedautosuggest";
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
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");

  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
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
    setButtonPopup,
    initialFilterValues,
    finYear,
    setNotify,
  } = props;
  console.log(branchNames);
  const classes = useStyles();
  const [errors, setErrors] = useState(initialFilterValues);
  console.log(values);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(temp).map((x) => {
      console.log(x);
      check(x);
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
    console.log(fieldValues.Mobileno.length);
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  useEffect(() => {
    if (!Object.values(errors).every((x) => x == "")) validate();
  }, [values]);

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
    console.log(values);
    if (validate()) {
      if (x) {
        setCount(parseInt(count) + 1);
        console.log(values, count);
        setRecords([...records, values]);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .post(
            Config.usermasterUrl + query,
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
            setNotify({
              isOpen: true,
              message: "User created  successfully",
              type: "success",
            });
            setButtonPopup(false);
          })
          .catch(function (error) {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        const token = AuthHandler.getLoginToken();
        axios
          .patch(
            Config.usermasterUrl + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then(function (response) {
            if (response.data.auth) {
              console.log(response.data.err);
            }
          })
          .catch(function (error) {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
        const newrecord = records.filter((item) => {
          return item.userCode !== values.userCode;
        });
        setNotify({
          isOpen: true,
          message: "User updated  successfully",
          type: "success",
        });
        setRecords([...newrecord, values]);
        setButtonPopup(false);
      }
    }
  };
  const options = branchNames.map((item) => {
    return item.spacedOption;
  });
  const finOptions = finYear.map((item) => {
    return item.finYear;
  });

  ///////////////code=>name || name=>code///////////////

  if (values.defaultBranchName) {
    console.log("hi...");
    branchNames.map((item) => {
      if (
        values.defaultBranchName == item.spacedOption &&
        values.defaultBranchCode !== item.option
      ) {
        console.log(values.defaultBranchCode, values.defaultBranchName);
        setValues({
          ...values,
          defaultBranchCode: item.option,
        });
      }
    });
  }
  if (!values.defaultBranchName && values.defaultBranchCode) {
    console.log("hi...");
    branchNames.map((item) => {
      if (values.defaultBranchCode == item.option) {
        setValues({ ...values, defaultBranchName: item.spacedOption });
      }
    });
  }
  if (values.defaultFinYear) {
  }
  // if (values.defaultBranchName && values.defaultBranchCode) {
  //   console.log("hi...update name");
  //   branchNames.map((item) => {
  //     if (
  //       values.defaultBranchCode == item.option &&
  //       values.defaultBranchName !== item.spacedOption
  //     ) {
  //       console.log("hi...update ", item);
  //       setValues({ ...values, defaultBranchName: item.spacedOption });
  //     }
  //   });
  // }

  /////////////////////////////////////////////////////////////
  ///////////////code=>name || name=>code///////////////

  if (values.defaultFinYear) {
    console.log("hi...");
    finYear.map((item) => {
      if (
        (values.defaultFinYear == item.finYear) &
        (values.defaultYearCode !== item.yearCode)
      ) {
        console.log(values.defaultYearCode, values.defaultFinYear);
        setValues({
          ...values,
          defaultYearCode: item.yearCode,
          defaultYearStart: item.yearStartDate,
          defaultYearEnd: item.yearEndDate,
        });
      }
    });
  }
  if (!values.defaultFinYear && values.defaultYearCode) {
    console.log("hi...");
    finYear.map((item) => {
      if (values.defaultYearCode == item.yearCode) {
        setValues({ ...values, defaultFinYear: item.finYear });
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
        <Grid item sm={6} xs={12}>
          <Controls.Input
            name="userCode"
            label="User Code"
            value={values.userCode}
            disabled={true}
            onChange={handleChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controls.Input
            name="userName"
            label="User Name"
            value={values.userName}
            error={errors.userName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controls.Input
            name="Password"
            label=" Password"
            value={values.Password}
            error={errors.Password}
            onChange={handleChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Controls.Input
            name="RePassword"
            label=" Re-Password"
            value={values.RePassword}
            error={errors.RePassword}
            onChange={handleChange}
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
          <UnusedAutosuggest
            name="defaultBranchName"
            label="Branch Name"
            value={values}
            setValue={setValues}
            options={options}
            error={errors.defaultBranchName}
          />
        </Grid>
        <Grid item sm={6} xs={12} style={{ margin: "0px" }}>
          <UnusedAutosuggest
            name="defaultFinYear"
            label="Financial Year"
            value={values}
            setValue={setValues}
            options={finOptions}
            error={errors.defaultFinYear}
          />
        </Grid>

        <Grid item sm={6} xs={12}>
          <div className={classes.Weddings}>
            <Controls.RadioGroup
              name="AllowYearChange"
              label="Allow Year Change"
              value={values.AllowYearChange}
              onChange={handleChange}
              items={menuRightsItems}
              error={errors.AllowYearChange}
            />
            <Controls.RadioGroup
              name="AllowBranchChange"
              label="Allow Branch Change"
              value={values.AllowBranchChange}
              onChange={handleChange}
              items={menuRightsItems}
              error={errors.AllowBranchChange}
            />
            <Controls.RadioGroup
              name="Status"
              label="Status"
              value={values.Status}
              onChange={handleChange}
              items={statusItems}
              error={errors.Status}
            />
          </div>
        </Grid>
        <Grid item sm={6} xs={12}></Grid>
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
