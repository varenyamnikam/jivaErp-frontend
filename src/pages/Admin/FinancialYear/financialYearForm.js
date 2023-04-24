import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import { makeStyles } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import { useNavigate } from "react-router-dom";
import { NotifyMsg } from "../../../components/notificationMsg";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const useStyles = makeStyles((theme) => ({
  // input: { minWidth: "200px", flexGrow: 1 },
}));

export default function FinancialYearform(props) {
  const page = useNavigate();
  const {
    records,
    setRecords,
    values,
    setValues,
    initialValues,
    initialFilterValues,
    setButtonPopup,
    setNotify,
    loading,
    setLoading,
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
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    console.log(temp);
    setErrors({
      ...temp,
    });

    if (fieldValues == input)
      return Object.values(temp).every((x) => x == "") && hasRight;
  };
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
      setButtonPopup(false);
      const handleRes = (response) => {
        console.log("hi....", response.data.values);
        if (x) {
          console.log(input);
          setRecords([...records, input]);
          setNotify(NotifyMsg(1));
        } else {
          const newrecord = records.filter((item) => {
            return item.yearCode !== input.yearCode;
          });
          console.log(newrecord);
          setRecords([...newrecord, input]);
          setNotify(NotifyMsg(2));
          if (
            input.yearCode ==
            JSON.parse(localStorage.getItem("user")).defaultYearCode
          ) {
            alert("plz login again");

            page("/");
          }
        }
      };
      const url = Config.finYear;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
        loading && setLoading(false);
      };
      roleService.axiosPost(url, input, handleRes, handleErr, () => {});
    }
  };
  return (
    <Grid container spacing={2}>
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
        <Controls.Button type="submit" text="Submit" onClick={handleSubmit} />
        <Controls.Button text="Reset" color="default" onClick={handleReset} />
      </div>
    </Grid>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
