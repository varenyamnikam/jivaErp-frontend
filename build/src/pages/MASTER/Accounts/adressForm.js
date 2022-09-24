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
  // const [input, setInput] = useState({
  //   acName: values.acName,
  //   acRegMob: values.acRegMob,
  //   propritorName: values.propritorName,
  //   tradeName: values.tradeName,
  //   aadharNo: values.aadharNo,
  //   panNo: values.panNo,
  //   gstNo: values.gstNo,
  //   seedLicenNo: values.seedLicenNo,
  //   bankName: values.bankName,
  //   bankAcNo: values.bankAcNo,
  //   ifscCode: values.ifscCode,
  //   creditDays: values.creditDays,
  //   creditAmount: values.creditAmount,
  //   acStatus: values.acStatus,
  // });
  // if (acCode !== values.acCode) {
  //   records.map((item) => {
  //     if (item.acCode == acCode) {
  //       setValues({ ...item, acName: acName });
  //       setInput({ ...item, acName: acName });
  //     }
  //   });
  // }
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

  // if (currentAdress._id && input.acName == "") {
  //   setInput(currentAdress);
  // }
  function handleChange(e) {
    const { value, name } = e.target;
    console.log(name, ":", value);
    setInput({ ...input, [name]: value });
    setSave({ ...save, [Index]: false });
  }
  console.log("input=>", input);
  // function handleSubmit(e) {
  //   e.preventDefault();
  //   let x = true;
  //   const updatedAdresses = adresses.map((p, index) => {
  //     if (index == Index) {
  //       x = false;
  //       return input;
  //     } else {
  //       return p;
  //     }
  //   });
  //   setSave({ ...save, [Index]: false });
  //   setAdresses(updatedAdresses);
  //   setRecords([...records, { ...input }]);
  //   const updatedData = adressData.filter(
  //     (item) => item.acCode == input.acCode && item.adressNo == input.adressNo
  //   );
  //   setAdressData([...updatedData, input]);
  // }

  // if (!input.acCode) {
  //   console.log(acCode);
  //   console.log({ acCode: acCode, acName: acName, ...currentAdress });
  //   setInput({ acCode: acCode, acName: acName, ...currentAdress });
  // }
  function handleSubmit(e) {
    e.preventDefault();
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
    setSave({ ...save, [Index]: false });
    setAdresses(updatedAdresses);
    setRecords([...records, { ...input }]);
    const updatedData = adressData.filter(
      (item) => item.acCode == input.acCode && item.adressNo == input.adressNo
    );
    setAdressData([...updatedData, input]);
    roleService.insertAcAdress(input);
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
              setSave({ ...save, [Index]: true });
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
        <Grid container alignContent="flex-end">
          <Grid item xs={6}>
            <Controls.Input
              name="acCode"
              label="Code"
              value={acCode}
              onChange={() => {}}
              disabled={true}
              // error={errors.stateCode}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="acName"
              label="Customer Name"
              value={input.acName}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid container item xs={11} justifyContent={"center"}>
            <Controls.Input
              name="addressLine1"
              label="Address Line 1"
              value={input.addressLine1}
              onChange={handleChange}
              // error={errors.stateCode}
            />
          </Grid>
          <Grid container item xs={11} justifyContent={"center"}>
            <Controls.Input
              name="addressLine2"
              label="Address Line 2"
              value={input.addressLine2}
              onChange={handleChange}
              // error={errors.stateCode}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="email"
              label="Email"
              value={input.email}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>{" "}
          <Grid item xs={6}>
            <Controls.Input
              name="pincode"
              label="Pincode"
              value={getValue(input.pincode)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="mobileno"
              label="Mobile No"
              value={getValue(input.mobileno)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="contactNo"
              label="Contact No"
              value={getValue(input.contactNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
        </Grid>
        <Grid container xs={11} spacing={2}>
          <div style={{ marginLeft: 50, marginBottom: 25 }}>
            <Countries value={input} setValue={setInput} options={country} />
          </div>
          <div style={{ marginLeft: 50, marginBottom: 25 }}>
            <States
              value={input}
              setValue={setInput}
              options={states}
              countries={country}
              country={input.countryName}
            />{" "}
          </div>
          <div style={{ marginLeft: 50, marginBottom: 25 }}>
            <Districts
              value={input}
              setValue={setInput}
              options={districts}
              states={states}
              state={input.stateName}
            />{" "}
          </div>
          <div style={{ marginLeft: 50, marginBottom: 25 }}>
            <Talukas
              value={input}
              setValue={setInput}
              options={talukas}
              districts={districts}
              district={input.districtName}
            />{" "}
          </div>
        </Grid>
        <div style={{ marginLeft: 705, marginBottom: 25 }}>
          <div>{getButton()}</div>
        </div>
      </Form>
    </>
  );
}
