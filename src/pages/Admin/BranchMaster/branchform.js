import React, { useState, useEffect } from "react";
import Controls from "../../../components/controls/Controls";
import { Grid, makeStyles } from "@material-ui/core";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import DisabledInputs1 from "./inputs1";
import DisabledInputs2 from "./inputs2";
import AuthHandler from "../../../Utils/AuthHandler";
import States from "../../../components/statesSelect";
import Countries from "../../../components/countrySelect";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import { useNavigate } from "react-router-dom";
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
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
  const company = AuthHandler.getCompany();

  const page = useNavigate();
  const {
    records,
    setRecords,
    values,
    setValues,
    initialFilterValues,
    setButtonPopup,
    setNotify,
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
    const gstConditn = company.gstRegType == "UnRegistered";

    Object.keys(temp).map((x) => {
      x !== "branchCode" && check(x);
    });
    if (!expr.test(fieldValues.GSTno) && !gstConditn) {
      temp.GSTno = "incorrect format";
    } else {
      temp.GSTno = "";
    }
    let x = "branchName";
    let y = "branchCode";
    //same branchName but diff branchcode not allowed
    //i.e while updating, if branchcode is same, same branchname
    //is allowed
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";
    console.log(temp);
    setErrors({
      ...temp,
    });
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));
    console.log(
      fieldValues.branchName,
      hasRight,
      !hasRight && fieldValues.branchName
    );
    if (fieldValues == input)
      return Object.values(temp).every((x) => x == "") && hasRight;
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
      if (item.branchCode == input.branchCode) x = false;

      if (
        item.branchName == input.branchName &&
        item.branchCode !== input.branchCode
      )
        y = false;
    });
    const url = Config.Branch;
    const body = { input };
    function handleErr(err) {
      setNotify(NotifyMsg(4));
      console.log(err);
    }

    if (validate()) {
      if (x && y) {
        //while creating new branch prevent duplicate name

        const handleRes = (response) => {
          const value = response.data.values;
          setRecords([...records, value]);
          setNotify(NotifyMsg(1));
          setButtonPopup(false);
        };
        roleService.axiosPut(url, body, handleRes, handleErr, () => {});

        // scroll.scrollToBottom();
      } else {
        const handleRes = (response) => {
          setNotify(NotifyMsg(2));
          setButtonPopup(false);
        };
        roleService.axiosPatch(url, body, handleRes, handleErr, () => {});

        //   roleService.updateBranch(input);
        const newrecord = records.filter((item) => {
          return item.branchCode !== input.branchCode;
        });
        console.log(newrecord);
        setRecords([...newrecord, input]);
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
        <SmartAutosuggest
          options1={acBranchOptions}
          options2={records}
          setValue={setInput}
          value={input}
          name1="acBranchName"
          code1="acBranchCode"
          name2="branchName"
          code2="branchCode"
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
        style={{ display: "flex", justifyContent: "flex-end" }}
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
///////////////////////////////////////////////////////
// if (input.acBranchName) {
//   console.log("hi...");
//   records.map((item) => {
//     if (
//       input.acBranchName == item.branchName &&
//       input.acBranchCode !== item.branchCode
//     ) {
//       console.log(input.acBranchCode, input.acBranchName);
//       setInput({
//         ...input,
//         acBranchCode: item.branchCode,
//       });
//     }
//   });
// }
// if (!input.acBranchName && input.acBranchCode) {
//   console.log("hi...");
//   records.map((item) => {
//     if (input.acBranchCode == item.branchCode) {
//       setInput({ ...input, acBranchName: item.branchName });
//     }
//   });
// }
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
