import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import BasicSelect from "../../Usermaster/basicselect";
import Controls from "../../../components/controls/Controls";
import AdvancedSelect from "../../../components/advancedBasicSelect";
import ControllableStates from "../../../components/selectsearchstate";
import PopupMarketingArea from "./popupTreeView";
import Popup from "../../../components/Popup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Countries from "../../../components/countrySelect";
import States from "../../../components/statesSelect";
import Districts from "../../../components/districtSelect";
import Talukas from "../../../components/talukaSelect";
import DoneIcon from "@mui/icons-material/Done";
import * as roleService from "../../../services/roleService";

const Firms = [
  "N.A.",
  "Proprietary",
  "Private Limited",
  "Limited",
  "Co-Operative",
  "Co-Operative Limited",
];
const customerType = ["DEALER", "DISTRIBUTOR", "RETAILER"];
export default function Adressform(props) {
  const {
    initialAdress,
    acCode,
    acName,
    currentAdress,
    country,
    states,
    districts,
    talukas,
    records,
    setRecords,
    imitate,
    setImitate,
    setAdresses,
    adresses,
    Index,
    save,
    setSave,
    setAdressData,
    adressData,
  } = props;
  console.log(records);
  console.log(adressData);
  console.log(adresses);
  console.log(currentAdress);

  // const [input, setInput] = useState({
  //   acCode: acCode,
  //   acName: acName,
  //   ...currentAdress,
  // });
  const [input, setInput] = useState({
    ...currentAdress,
    addressNo: Index + 1,
  });
  const [errors, setErrors] = useState({});

  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("addressLine2");
    check("addressLine1");
    check("countryName");
    check("stateName");
    check("pincode");
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  function handleChange(e) {
    const { value, name } = e.target;
    console.log(name, ":", value);
    setInput({ ...input, [name]: value });
    setSave({ ...save, [Index]: false });
  }
  console.log("input=>", input, currentAdress);
  if (currentAdress._id && !input._id) {
    setInput({
      ...currentAdress,
      addressNo: Index + 1,
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      setSave({ ...save, [Index]: true });

      let x = true;
      const updatedAdresses = adresses.map((p, index) => {
        if (index == Index) {
          x = false;
          return input;
        } else {
          return p;
        }
      });

      // setAdressData([...adressData, input]);
      // setSave({ ...save, [Index]: false });
      console.log(updatedAdresses);
      setAdresses(updatedAdresses);
      const updatedData = adressData.filter(
        (item) => item.acCode !== input.acCode
      );
      console.log(updatedData);
      setAdressData([...updatedData, ...updatedAdresses]);
      roleService.insertAcAdress(input);
    }
  }
  //
  function getValue(value) {
    if (value == "NULL") {
      return "";
    } else {
      return value;
    }
  }
  function getButton() {
    if (!save[Index]) {
      return (
        <>
          {" "}
          <Button
            variant="contained"
            // color="success"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="text" endIcon={<DoneIcon />}>
            Submitted
          </Button>
        </>
      );
    }
  }
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="acCode"
              label="Code"
              value={acCode}
              onChange={() => {}}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="acName"
              label="Name"
              value={acName}
              disabled={true}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="addressLine1"
              label="Address Line 1"
              value={input.addressLine1}
              onChange={handleChange}
              error={errors.addressLine1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="addressLine2"
              label="Address Line 2"
              value={input.addressLine2}
              onChange={handleChange}
              error={errors.addressLine2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="email"
              label="Email"
              value={input.email}
              onChange={handleChange}
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="pincode"
              label="Pincode"
              value={getValue(input.pincode)}
              onChange={handleChange}
              error={errors.pincode}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="mobileno"
              label="Mobile No"
              value={getValue(input.mobileno)}
              onChange={handleChange}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="contactNo"
              label="Contact No"
              value={getValue(input.contactNo)}
              onChange={handleChange}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Countries
              value={input}
              setValue={setInput}
              options={country}
              error={errors.countryName}
            />
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            <States
              value={input}
              setValue={setInput}
              options={states}
              countries={country}
              country={input.countryName}
              error={errors.stateName}
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="districtName"
              label="District"
              value={input.districtName}
              onChange={handleChange}
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="talukaName"
              label="Taluka"
              value={input.talukaName}
              onChange={handleChange}
            />{" "}
          </Grid>{" "}
          <Grid item xs={12} sm={6}></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ marginTop: "20px" }}>{getButton()}</div>
          </Grid>
        </Grid>
      </Form>
    </>
  );
}
// <Controls.Input
// value={input.district}
// setValue={setInput}
// options={districts}
// states={states}
// state={input.stateName}
// />{" "}
// if (x) {
// let x = true;
// adresses.map((item, index) => {
//   if (item.acCode == "") {
//     const updatedAdresses = adresses.map((p) => {
//       if (p.acCode == "") {
//         x = false;
//         return input;
//       } else {
//         return p;
//       }
//     });
//     console.log(updatedAdresses);
//     setAdresses(updatedAdresses);
//   }
// });

// console.log(adresses);
// setAdresses([
//   ...adresses,
//   {
//     ...input,
//   },
// ]);
// setRecords([
//   ...records,
//   {
//     ...input,
//   },
// ]);
// }
