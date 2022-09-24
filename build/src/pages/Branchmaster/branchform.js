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
const branchTypes = [
  "PLANT",
  "PRODUCTION",
  "PLANT AND PRODUCTION",
  "SALES OFFICE",
];
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
  const classes = useStyles();
  const [stateDisable, setStateDisable] = useState(true);
  const [districtDisable, setDistrictDisable] = useState(true);
  const [talukaDisable, setTalukaDisable] = useState(true);
  const {
    records,
    setRecords,
    setPage,
    values,
    setValues,
    initialValues,
    count,
    setCount,
    country,
    states,
    districts,
    talukas,
  } = props;
  // states: states,
  // districts: districts,
  // talukas: talukas,
  // country
  console.log(country, states, districts);

  // if (!values.talukaName) {
  //   console.log(District, state, Taluka);
  //   let x = [];
  //   const checkstate = [];
  //   District.map((item) => {
  //     checkstate.push(item.stateCode);
  //   });
  //   const uniq = [...new Set(checkstate)];
  //   console.log(checkstate, uniq, District);
  //   state.map((item) => {
  //     uniq.map((code) => {
  //       if (item.stateCode == code) {
  //         x.push(item.stateName);
  //       }
  //     });
  //   });
  //   console.log(x);
  //   if (x[0] !== stateName[0]) setStatenames(x);
  //   if (values.countryName) {
  //     if (stateDisable) setStateDisable(false);
  //   }
  //   if (values.stateName) {
  //     let stateCode;
  //     //find statecode if selected
  //     state.map((item) => {
  //       if (item.stateName == values.stateName) {
  //         stateCode = item.stateCode;
  //         console.log("hi..");
  //       }
  //     });
  //     console.log(stateCode);
  //     //find districts with respective statecode
  //     const newDistrict = District.filter((item) => {
  //       return item.stateCode == stateCode;
  //     });
  //     console.log(newDistrict);
  //     if (districto[0].stateCode !== newDistrict[0].stateCode) {
  //       console.log("if...");
  //       setDistricto(newDistrict);
  //     }
  //     if (disable) setDisable(false);
  //   }
  //   if (values.districtName) {
  //     let districtCode;
  //     District.map((item) => {
  //       if (item.districtName == values.districtName) {
  //         districtCode = item.districtCode;
  //         console.log(item.districtCode);
  //       }
  //     });
  //     let newTaluka = [{ districtCode: 546 }];
  //     newTaluka = Taluka.filter((item) => {
  //       return item.districtCode == districtCode;
  //     });
  //     console.log(newTaluka, districtCode);

  //     if (taluko[0].districtCode !== newTaluka[0].districtCode) {
  //       console.log("if...");
  //       setTaluko(newTaluka);
  //     }
  //     let Tnames = [];
  //     taluko.map((item) => {
  //       Tnames.push(item.talukaName);
  //     });
  //     console.log(Tnames, taluko);
  //     if (Tnames[0] !== talukaName[0]) setTalukanames(Tnames);
  //     if (talukaDisable) setTalukaDisable(false);
  //   }
  // } else {
  //   // console.log(District, state, Taluka);
  // }

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
    setValues({
      ...values,
      countryName: "",
      stateName: "",
      talukaName: "",
      districtName: "",
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;
    records.filter((item) => {
      return item.branchCode !== values.branchCode;
    });
    records.map((item) => {
      if (item.branchCode == values.branchCode) {
        x = false;
      }
    });

    if (x) {
      // setCount(parseInt(count) + 1);
      // console.log(values, count);
      // setRecords([...records, { ...values, branchCode: parseInt(count) + 1 }]);
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(
          Config.addBranch,
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
      // scroll.scrollToBottom();
      // } else {
      //   roleService.updateBranch(values);
      //   const newrecord = records.filter((item) => {
      //     return item.branchCode !== values.branchCode;
      //   });
      // console.log(newrecord);
      // setRecords([...newrecord, values]);
      // scroll.scrollToBottom();
    }
  };
  // console.log(checkstate);
  if (values.countryName && stateDisable) {
    setStateDisable(false);
  }
  if (values.stateName && districtDisable) {
    setDistrictDisable(false);
  }
  if (values.districtName && talukaDisable) {
    setTalukaDisable(false);
  }

  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <Grid container>
        <DisabledInputs1
          values={values}
          // errors={errors}
          handleChange={handleChange}
        />
        <BasicSelect
          options={branchTypes}
          setValues={setValues}
          values={values}
          name={"branchType"}
          label="branchType"
        />
        <Grid container xs={15} spacing={2}>
          <Countries value={values} setValue={setValues} options={country} />
          <States
            value={values}
            setValue={setValues}
            options={states}
            countries={country}
            country={values.countryName}
            disable={stateDisable}
          />
          <Districts
            value={values}
            setValue={setValues}
            options={districts}
            states={states}
            state={values.stateName}
            disable={districtDisable}
          />
          <Talukas
            value={values}
            setValue={setValues}
            options={talukas}
            districts={districts}
            district={values.districtName}
            disable={talukaDisable}
          />
        </Grid>
        <DisabledInputs2
          values={values}
          // errors={errors}
          handleChange={handleChange}
        />

        <div className={hello.Weddings}>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={handleReset} />
        </div>
      </Grid>
    </Form>
  );
}
// <ControllableStates
// options={["India"]}
// setValue={setValues}
// value={values}
// name={"countryName"}
// label={"Country"}
// disable={false}
// getOptionDisabled={(option) => option == stateName[25]}
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
