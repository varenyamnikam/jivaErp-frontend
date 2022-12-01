import React, { useEffect, useState } from "react";
import AuthHandler from "../Utils/AuthHandler";
import axios from "axios";
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
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(user);
  const [records, setRecords] = useState([initialValues]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  if (loading) {
    const token = AuthHandler.getLoginToken();
    const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
    axios
      .get(Config.finYear + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.adm_finYear.length !== 0)
          setRecords(response.data.adm_finYear);
        else {
          setRecords([initialValues]);
        }
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function findDate(code) {
    let date = null;
    records.map((item) => {
      if (item.yearCode == code) date = item.yearStartDate;
    });
    console.log(code, date);
    return date;
  }
  let options = records.map((item) => item.finYear);
  function handleSubmit() {
    const token = AuthHandler.getLoginToken();
    const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
    console.log(values);
    values.defaultYearStart = findDate(values.defaultYearCode);

    localStorage.setItem("user", JSON.stringify(values));
    setButtonPopup(false);
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
      .then(function (response) {})
      .catch(function (error) {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      })
      .finally(() => {
        setButtonPopup(false);
      });
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
          height: "100px",
          width: "250px",
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SmartAutoSuggest
            style={{ width: "100%" }}
            name1="defaultFinYear"
            code1="defaultYearCode"
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
          sm={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            to={Config.logoutPageUrl}
            style={{ backgroundColor: "white" }}
            onClick={() => {
              localStorage.clear();
            }}
          >
            <Controls.Button onClick={handleSubmit} text="Submit" />
          </Link>
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}
