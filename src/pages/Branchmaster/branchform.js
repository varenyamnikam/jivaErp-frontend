import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";
import DropDownMenu from "../Usermaster/dropdownmenu";
import BasicSelect from "../Usermaster/basicselect";
import { Link, animateScroll as scroll } from "react-scroll";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import ControllableStates from "../../components/selectsearchstate";
import DisabledInputs1 from "./disabledinputs1";
import DisabledInputs2 from "./disabledinputs2";
import AuthHandler from "../../Utils/AuthHandler";
import GetData from "./data";
import Location from "./location";
import States from "../../components/statesSelect";
import Districts from "../../components/districtSelect";
import Countries from "../../components/countrySelect";
import Talukas from "../../components/talukaSelect";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";

const hello = makeStyles((theme) => ({
  Weddings: {
    padding: "8px",
    margin: "5px",
  },
}));
// user;
const useStyles = makeStyles((theme) => ({
  Weddings: {
    borderRadius: "10px",
    // boxShadow: "0 0 0 40px white",
    padding: "5px",
    paddingRight: "0px",

    border: "1px groove grey",
    margin: "10px",
  },
}));
// const branchTypes = [
//   "PLANT",
//   "PRODUCTION",
//   "PLANT AND PRODUCTION",
//   "SALES OFFICE",
// ];
const branchTypes = ["BRANCH", "Point Of Sale", "Godown"];
const initialLocation = {
  countryCode: "",
  countryName: "",
  stateCode: "",
  stateName: "",
  districtCode: "",
  districtName: "",
  talukaName: "",
};
export default function Branchform(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const page = useNavigate();
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const {
    records,
    setRecords,
    setPage,
    values,
    setValues,
    initialValues,
    initialFilterValues,
    setButtonPopup,
    setNotify,
    count,
    setCount,
    country,
    states,
  } = props;
  const classes = useStyles();
  const acBranchOptions = records.map((item) => {
    return item.branchName;
  });
  const [stateDisable, setStateDisable] = useState(true);
  const [districtDisable, setDistrictDisable] = useState(true);
  const [talukaDisable, setTalukaDisable] = useState(true);
  const [input, setInput] = useState(values);
  const [errors, setErrors] = useState(initialFilterValues);

  console.log(values, records);
  console.log(errors);
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    var expr = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    console.log(expr.test(fieldValues.GSTno));

    Object.keys(temp).map((x) => {
      check(x);
    });
    if (!expr.test(fieldValues.GSTno)) {
      temp.GSTno = "incorrect format";
    } else {
      temp.GSTno = "";
    }
    let x = "branchName";
    let y = "branchCode";

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
  useEffect(() => {
    if (!Object.values(errors).every((x) => x == "")) validate();
  }, [input]);
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
    setValues({
      ...input,
      countryName: "",
      stateName: "",
      talukaName: "",
      districtName: "",
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;
    let y = true;
    records.map((item) => {
      if (item.branchCode == input.branchCode) {
        x = false;
      }
      if (
        item.branchName == input.branchName &&
        item.branchCode !== input.branchCode
      ) {
        y = false;
      }
    });

    if (validate()) {
      if (x) {
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        //while creating new branch prevent duplicate name
        y
          ? axios
              .post(
                Config.Branch + query,
                { input },
                {
                  headers: {
                    authorization: "Bearer" + token,
                  },
                }
              )
              .then((response) => {
                const value = response.data.values;
                setRecords([...records, value]);
                setNotify({
                  isOpen: true,
                  message: "Branch created  successfully",
                  type: "success",
                });
                setButtonPopup(false);
              })
              .catch((error) => {
                setNotify({
                  isOpen: true,
                  message: "Unable to connect to servers",
                  type: "warning",
                });
              })
          : setErrors({ ...errors, branchName: "this name already exists" });

        // scroll.scrollToBottom();
      } else {
        const token = AuthHandler.getLoginToken();
        axios
          .patch(
            Config.Branch + query,
            { input },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            setNotify({
              isOpen: true,
              message: "Branch updated  successfully",
              type: "success",
            });
            setButtonPopup(false);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });

        //   roleService.updateBranch(input);
        const newrecord = records.filter((item) => {
          return item.branchCode !== input.branchCode;
        });
        console.log(newrecord);
        setRecords([...newrecord, input]);
        if (
          input.branchCode ==
          JSON.parse(localStorage.getItem("user")).defaultBranchCode
        ) {
          alert("plz login again");

          page("/");
        }
        // scroll.scrollToBottom();
      }
    }
  };
  // console.log(checkstate);
  if (input.countryName && stateDisable) {
    setStateDisable(false);
  }
  if (input.stateName && districtDisable) {
    setDistrictDisable(false);
  }
  if (input.districtName && talukaDisable) {
    setTalukaDisable(false);
  }
  ///////////////////////////////////////////////////////
  if (input.acBranchName) {
    console.log("hi...");
    records.map((item) => {
      if (
        input.acBranchName == item.branchName &&
        input.acBranchCode !== item.branchCode
      ) {
        console.log(input.acBranchCode, input.acBranchName);
        setInput({
          ...input,
          acBranchCode: item.branchCode,
        });
      }
    });
  }
  if (!input.acBranchName && input.acBranchCode) {
    console.log("hi...");
    records.map((item) => {
      if (input.acBranchCode == item.branchCode) {
        setInput({ ...input, acBranchName: item.branchName });
      }
    });
  }
  // if (input.acBranchName && input.acBranchCode) {
  //   console.log("hi...update name");
  //   records.map((item) => {
  //     if (
  //       input.acBranchCode == item.branchCode &&
  //       input.acBranchName !== item.branchName
  //     ) {
  //       console.log("hi...update ", item);
  //       setInput({ ...input, acBranchName: item.branchName });
  //     }
  //   });
  // }

  return (
    <Grid container spacing={2}>
      <DisabledInputs1
        values={input}
        errors={errors}
        handleChange={handleChange}
      />
      <Grid item xs={12} sm={6}>
        <UnusedAutosuggest
          options={branchTypes}
          setValue={setInput}
          value={input}
          name="branchType"
          label="branchType"
          error={errors.branchType}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <UnusedAutosuggest
          options={acBranchOptions}
          setValue={setInput}
          value={input}
          name="acBranchName"
          label="A.C Branch"
          error={errors.acBranchName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Countries
          value={input}
          setValue={setInput}
          options={country}
          error={errors.countryName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <States
          value={input}
          setValue={setInput}
          options={states}
          countries={country}
          country={input.countryName}
          disable={stateDisable}
          error={errors.stateName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          value={input.districtName}
          name="districtName"
          label="District"
          error={errors.districtName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controls.Input
          value={input.talukaName}
          name="talukaName"
          label="Taluka"
          error={errors.talukaName}
          onChange={handleChange}
        />
      </Grid>
      <DisabledInputs2
        values={input}
        errors={errors}
        handleChange={handleChange}
      />
      <Grid item xs={12} sm={6}></Grid>
      <Grid
        item
        xs={12}
        sm={6}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Controls.Button text="Reset" color="default" onClick={handleReset} />
        <Controls.Button
          type="submit"
          text="Submit"
          onClick={(e) => {
            handleSubmit(e);
          }}
        />
      </Grid>
    </Grid>
  );
}
// <ControllableStates
// options={["India"]}
// setValue={setValues}
// value={values}
// name={"countryName"}
// label={"Country"}
// disable={false}
// getOptionDisabled={(branchCode) => option == stateName[25]}
// />
// <ControllableStates
//   options={stateName}
//   setValue={setValues}
//   value={values}
//   name={"stateName"}
//   label={"STATE"}
//   disable={stateDisable}
// />
// <ControllableStates
//   options={districtName}
//   setValue={setValues}
//   value={values}
//   name={"districtName"}
//   label={"DISTRICT"}
//   disable={disable}
//   // getOptionDisabled={(option) => option == stateName[25]}
// />
// <ControllableStates
//   options={talukaName}
//   setValue={setValues}
//   value={values}
//   name={"talukaName"}
//   label={"TALUKA"}
//   disable={talukaDisable}
//   // getOptionDisabled={(option) => option == stateName[25]}
// />
