import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Input from "../../components/controls/Input";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import { useNavigate } from "react-router-dom";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const useStyles = makeStyles((theme) => ({
  // input: { minWidth: "200px", flexGrow: 1 },
}));

export default function FinancialYearform(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const page = useNavigate();
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const {
    records,
    setRecords,
    values,
    setValues,
    initialValues,
    initialFilterValues,
    setButtonPopup,
    setNotify,
  } = props;
  const [errors, setErrors] = useState({
    ...initialFilterValues,
    yearStartDate: "",
    yearEndDate: "",
  });
  const [input, setInput] = useState(values);
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("yearCode");
    check("finYear");
    check("yearStartDate");
    check("yearEndDate");
    check("isDefaultYear");
    check("isClosed");
    records.map((item) => {
      if (
        item.yearCode == fieldValues.yearCode &&
        item.finYear !== fieldValues.finYear
      ) {
        temp.yearCode = "This yearcode already exists";
      }
    });
    let x = "finYear";
    let y = "yearCode";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";

    console.log(temp);
    setErrors({
      ...temp,
    });

    if (fieldValues == input) return Object.values(temp).every((x) => x == "");
  };
  console.log(input);
  console.log(errors);
  console.log(typeof input.yearStartDate, input.yearStartDate);
  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleReset = (e) => {
    console.log(e.target);
    setInput(initialValues);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;
    records.map((item) => {
      if (item.yearCode == input.yearCode && input.yearCode !== "X X X X") {
        x = false;
      }
    });
    console.log(typeof input.yearStartDate, input.yearStartDate, validate());
    if (validate()) {
      const token = AuthHandler.getLoginToken();
      setButtonPopup(false);
      axios
        .post(
          // Config.addUser,
          Config.finYear + query,
          { input },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          console.log("hi....", response.data.values);
          if (x) {
            console.log(input);
            setRecords([...records, input]);
            setNotify({
              isOpen: true,
              message: "Financial Year created  successfully",
              type: "success",
            });
          } else {
            //   roleService.updateuser(input);
            const newrecord = records.filter((item) => {
              return item.yearCode !== input.yearCode;
            });
            console.log(newrecord);
            setRecords([...newrecord, input]);
            setNotify({
              isOpen: true,
              message: "Financial Year updated  successfully",
              type: "success",
            });
            if (
              input.yearCode ==
              JSON.parse(localStorage.getItem("user")).defaultYearCode
            ) {
              alert("plz login again");

              page("/");
            }
          }
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Unable to connect to servers",
            type: "warning",
          });
        });
    }
  };
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sm={6}
          className={classes.input}
          style={{ flexGrow: 1 }}
        >
          <Controls.Input
            name="yearCode"
            label="Year Code"
            placeholder="eg 2223"
            value={input.yearCode}
            onChange={handleChange}
            error={errors.yearCode}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <Controls.Input
            name="finYear"
            label="Financial Year"
            placeholder="eg 2022-23"
            value={input.finYear}
            onChange={handleChange}
            error={errors.finYear}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <StaticDatePickerLandscape
            name="yearStartDate"
            label="Start Year From-"
            value={input}
            setValue={setInput}
            error={errors.yearStartDate}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <StaticDatePickerLandscape
            name="yearEndDate"
            label="To-"
            value={input}
            setValue={setInput}
            error={errors.yearEndDate}
          />
        </Grid>

        <Grid item xs={12} sm={6} className={classes.input}>
          <Controls.RadioGroup
            name="isDefaultYear"
            label="Is Default Year"
            value={input.isDefaultYear}
            onChange={handleChange}
            items={menuRightsItems}
            error={errors.isDefaultYear}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <Controls.RadioGroup
            name="isClosed"
            label="Is closed"
            value={input.isClosed}
            onChange={handleChange}
            items={menuRightsItems}
            error={errors.isClosed}
          />
        </Grid>
        <div className={{ marginTop: "25px" }}>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={handleReset} />
        </div>
      </Grid>
    </Form>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
