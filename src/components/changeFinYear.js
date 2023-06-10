import React, { useEffect, useState } from "react";
import AuthHandler from "../Utils/AuthHandler";
import Config from "../Utils/Config";
import { Grid } from "@material-ui/core";
import SmartAutoSuggest from "./smartAutoSuggest";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Notification from "./Notification";
import Controls from "./controls/Controls";
import { NotifyMsg } from "./notificationMsg";
import * as roleService from "../services/roleService";

const initialBranchValues = {
  contactNo: "",
  Mobileno: "",
  // pesticideLicenceNo: "",
  // seedLicenceNo: "",
  acBranchName: "",
  acBranchCode: "",
  Emailid: "",
  GSTno: "",
  pinCode: "",
  adressLine2: "",
  adressLine1: "",
  branchName: "",
  branchCode: "X X X X",
  branchType: "",
  stateCode: 0,
  stateName: "",
  countryName: "",
  districtName: "",
  talukaName: "",
};

const initialValues = {
  defaultYearCode: "X X X X",
  finYear: "",
  yearStartDate: "",
  yearEndDate: "",
  isDefaultYear: "",
  isClosed: "",
};
const userCode = localStorage.getItem("userCode");
const userCompanyCode = localStorage.getItem("userCompanyCode");

export default function ChangeFinyear({ setButtonPopup }) {
  const user = AuthHandler.getUser();
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(user);
  const [records, setRecords] = useState([initialValues]);
  const [branch, setBranch] = useState([initialBranchValues]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  if (loading) {
    function handleRes(response) {
      console.log(response);
      if (response.data.adm_finYear.length !== 0)
        setRecords(response.data.adm_finYear);
      else {
        console.log("no data");
      }
      if (response.data.adm_branch.length !== 0)
        setBranch(response.data.adm_branch);
      else {
        console.log("no data");
      }
    }
    function handleErr(error) {
      setNotify(NotifyMsg(4));
    }

    roleService.axiosGet(Config().usermasterUrl, handleRes, handleErr, () => {
      setLoading(false);
    });
  }
  function findDate(code) {
    let yearObj = records.find((item) => item.yearCode == code);
    return yearObj;
  }
  console.log(branch, records);
  let options = records.map((item) => item.finYear);
  let options1 = branch.map((item) => item.branchName);

  function handleSubmit() {
    console.log(values);
    values.currentYearStart = findDate(values.currentYearCode).yearStartDate;
    values.currentYearEnd = findDate(values.currentYearCode).yearEndDate;

    localStorage.setItem("user", JSON.stringify(values));
    setButtonPopup(false);
    // axios
    //   .patch(
    //     Config().usermasterUrl + query,
    //     { values },
    //     {
    //       headers: {
    //         authorization: "Bearer" + token,
    //       },
    //     }
    //   )
    //   .then(function (response) {})
    //   .catch(function (error) {
    //     setNotify({
    //       isOpen: true,
    //       message: "Unable to connect to servers",
    //       type: "warning",
    //     });
    //   })
    //   .finally(() => {
    //     setButtonPopup(false);
    //   });
  }
  console.log(values);
  return (
    <>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={2}
      >
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SmartAutoSuggest
            style={{ width: "100%" }}
            name1="currentFinYear"
            code1="currentYearCode"
            label="Financial Year"
            name2="finYear"
            code2="yearCode"
            value={values}
            setValue={setValues}
            options1={options}
            options2={records}
          />{" "}
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SmartAutoSuggest
            style={{ width: "100%" }}
            name1="currentBranchName"
            code1="currentBranchCode"
            label="Financial Year"
            name2="branchName"
            code2="branchCode"
            value={values}
            setValue={setValues}
            options1={options1}
            options2={branch}
          />{" "}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Controls.Button onClick={handleSubmit} text="Submit" />
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}
