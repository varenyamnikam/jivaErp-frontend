import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import Controls from "../../../components/controls/Controls";
import Button from "@mui/material/Button";
import Countries from "../../../components/countrySelect";
import States from "../../../components/statesSelect";
import DoneIcon from "@mui/icons-material/Done";
import * as roleService from "../../../services/roleService";
import { useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { NotifyMsg } from "../../../components/notificationMsg";
import Config from "../../../Utils/Config";
import AuthHandler from "../../../Utils/AuthHandler";
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
    records,
    setAdresses,
    adresses,
    Index,
    save,
    setSave,
    setAdressData,
    adressData,
    setNotify,
  } = props;
  console.log(records);
  console.log(adressData);
  console.log(adresses);
  console.log(currentAdress);
  let history = useNavigate();

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
      const handleRes = (response) => {
        console.log(response);
        setNotify(NotifyMsg(1));
        console.log(updatedAdresses);
        setAdresses(updatedAdresses);
        const updatedData = adressData.filter(
          (item) => item.acCode !== input.acCode
        );
        console.log(updatedData);
        setAdressData([...updatedData, ...updatedAdresses]);
      };

      const handleErr = (error) => {
        setNotify(NotifyMsg(4));
        console.log(error);
      };

      const url = Config().acadress;
      console.log(input);
      roleService.axiosPatch(url, input, handleRes, handleErr);
      let newParty = AuthHandler.getNewParty();
      if (newParty.partyOpen) {
        newParty.partyOpen = false;
        AuthHandler.setNewParty(newParty);
        history(newParty.path);
      }
    }
  }
  //
  function getButton() {
    if (!save[Index]) {
      return (
        <>
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controls.Input
            name="acCode"
            label="Code"
            value={input.acCode ? input.acCode : "N E W"}
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
          />
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
        <Grid item xs={12} sm={12}>
          <Divider
            variant="middle"
            color="blue"
            sx={{ borderBottomWidth: 2 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controls.Input
            name="email"
            label="Email"
            value={input.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controls.Input
            name="pincode"
            label="Pincode"
            value={input.pincode}
            onChange={handleChange}
            error={errors.pincode}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controls.Input
            name="mobileno"
            label="Mobile No"
            value={input.mobileno}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controls.Input
            name="gstNo"
            label="Gst No"
            value={input.gstNo}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Controls.Input
            name="contactNo"
            label="Contact No"
            value={input.contactNo}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Countries
            value={input}
            setValue={setInput}
            options={country}
            error={errors.countryName}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <States
            value={input}
            setValue={setInput}
            options={states}
            countries={country}
            country={input.countryName}
            error={errors.stateName}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="districtName"
            label="District"
            value={input.districtName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="talukaName"
            label="Taluka"
            value={input.talukaName}
            onChange={handleChange}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div style={{ marginTop: "20px" }}>{getButton()}</div>
        </Grid>
      </Grid>
    </>
  );
}
// <Controls.Input
// value={input.district}
// setValue={setInput}
// options={districts}
// states={states}
// state={input.stateName}
// />
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
