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
import DoneIcon from "@mui/icons-material/Done";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Divider from "@mui/material/Divider";

export default function Customersform(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const {
    values,
    setValues,
    records,
    setRecords,
    groupTypes,
    statusItems,
    marketArea,
    getChild,
    changeTab,
    submit,
    setSubmit,
    setNotify,
    notify,
    setAcCodeHook,
    acCodeHook,
    acTypeFor,
    acTypeOptions,
    firmTypeOptions,
    acGroupData,
    setAcGroup,
  } = props;
  const acGroupOptions = acGroupData
    .filter((item) => item.acGroupStatus == "Active")
    .map((item) => {
      return item.acGroupName;
    });
  console.log(acTypeOptions, firmTypeOptions, acGroupOptions);
  console.log("values =>", values);
  const [input, setInput] = useState(values);
  const [buttonPopup, setButtonPopup] = useState(false);
  console.log("input =>", input);
  const [errors, setErrors] = useState({});
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("acName");
    check("acGroupName");
    check("acType");
    if (values.preFix == "E") check("mktArea");
    if (values.preFix != "E") check("firmType");
    check("acStatus");
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
    setSubmit(false);
  }
  function handleChange(e) {
    const { value, name } = e.target;
    setInput({ ...input, [name]: value });
    setSubmit(false);
    // validate(input);
  }
  if (values.mktAreaCode) {
    marketArea.map((item) => {
      if (
        item.mktAreaCode == input.mktAreaCode &&
        item.mktArea !== input.mktArea
      )
        setInput({ ...input, mktArea: item.mktArea });
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      let x = true;
      setValues(input);
      records.map((item, index) => {
        if (item.acCode == input.acCode) {
          const updatedRecords = records.map((p) =>
            p.acCode === input.acCode ? input : p
          );
          setRecords(updatedRecords);
          setValues(input);
          x = false;
        }
      });
      console.log(x);
      if (x) {
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .put(
            Config.accounts + query,
            { input },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setValues(response.data.values);
            setRecords([...records, response.data.values]);
            setNotify({
              isOpen: true,
              message: "Account created  successfully",
              type: "success",
            });
            setSubmit(true);
            changeTab();
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        const token = AuthHandler.getLoginToken();
        console.log("updated");
        axios
          .patch(
            Config.accounts + query,
            { input },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setNotify({
              isOpen: true,
              message: "Account updated  successfully",
              type: "success",
            });
            setSubmit(true);
            changeTab();
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
            console.log(error);
          });
      }
    }
  }
  function getValue(value) {
    if (value == "NULL") {
      console.log("undefined");
      return "";
    } else {
      console.log("not undefined", value);
      return value;
    }
  }
  if (input.acGroupName) {
    console.log("hi...");
    acGroupData.map((item) => {
      if (
        input.acGroupName == item.acGroupName &&
        input.acGroupCode !== item.acGroupCode
      ) {
        console.log(input.acGroupCode, input.acGroupName);
        setInput({
          ...input,
          acGroupCode: item.acGroupCode,
        });
      }
    });
  }
  if (!input.acGroupName && input.acGroupCode) {
    console.log("hi...");
    acGroupData.map((item) => {
      if (input.acGroupCode == item.acGroupCode) {
        setInput({ ...input, acGroupName: item.acGroupName });
      }
    });
  }
  // if (input.acGroupName && input.acGroupCode) {
  //   console.log("hi...update name");
  //   acGroupData.map((item) => {
  //     if (
  //       input.acGroupCode == item.acGroupCode &&
  //       input.acGroupName !== item.acGroupName
  //     ) {
  //       console.log("hi...update ", item);
  //       setInput({ ...input, acGroupName: item.acGroupName });
  //     }
  //   });
  // }
  function getButton() {
    if (!submit) {
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
        <Grid item xs={12} sm={4}>
          <Controls.Input
            name="acCode"
            label="Code"
            value={input.acCode}
            onChange={handleInputChange}
            disabled={true}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controls.Input
            name="acName"
            label="Name"
            value={input.acName}
            onChange={handleChange}
            error={errors.acName}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Controls.Input
            name="acRegMob"
            label="Reg. Mobile no."
            value={input.acRegMob}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Controls.Input
            name="panNo"
            label="PAN No"
            value={getValue(input.panNo)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="aadharNo"
            label="Aadhar No"
            value={getValue(input.aadharNo)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="gstNo"
            label="GST Number"
            value={getValue(input.gstNo)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>{" "}
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="bankName"
            label="Bank Name"
            value={getValue(input.bankName)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="bankAcNo"
            label="Bank A/c No"
            value={getValue(input.bankAcNo)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="ifscCode"
            label="IFSC Code"
            value={getValue(input.ifscCode)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        {values.preFix != "E" && (
          <>
            <Grid item xs={12} sm={3}>
              <Controls.Input
                name="propritorName"
                label="Propritor Name"
                value={input.propritorName}
                onChange={handleChange}
                // error={errors.stateCode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controls.Input
                name="tradeName"
                label="Trade Name"
                value={input.tradeName}
                onChange={handleChange}
                // error={errors.stateCode}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="seedLicenNo"
            label="Seed Licen No"
            value={getValue(input.seedLicenNo)}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>{" "}
        <Grid item xs={12} sm={12}>
          <Divider
            variant="middle"
            color="blue"
            sx={{ borderBottomWidth: 2 }}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <UnusedAutosuggest
            name="acType"
            label="A C Type "
            value={input}
            setValue={setInput}
            options={acTypeOptions}
            error={errors.acType}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <UnusedAutosuggest
            name="acGroupName"
            label="A C Group "
            value={input}
            setValue={setInput}
            options={acGroupOptions}
            error={errors.acGroupName}
          />
        </Grid>
        {values.preFix != "E" && (
          <>
            <Grid item sm={4} xs={12}>
              <UnusedAutosuggest
                name="firmType"
                label="Firm type"
                value={input}
                setValue={setInput}
                options={firmTypeOptions}
                error={errors.firmType}
              />
            </Grid>{" "}
            <Grid item xs={12} sm={3}>
              <Controls.Input
                name="creditDays"
                label="Credit Days"
                value={input.creditDays}
                onChange={handleChange}
                // error={errors.stateCode}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controls.Input
                name="creditAmount"
                label="Credit Limit (Amount)"
                value={input.creditAmount}
                onChange={handleChange}
                // error={errors.stateCode}
              />
            </Grid>
          </>
        )}
        {values.preFix == "E" && (
          <>
            <Grid
              item
              xs={3}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Controls.Input
                name=""
                label="Marketing Area"
                value={input.mktArea}
                onChange={() => {}}
                error={errors.mktArea}
              />
            </Grid>
            <Grid
              item
              xs={1}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setButtonPopup(true);
                }}
              >
                choose
              </Button>
            </Grid>
          </>
        )}{" "}
        <Grid item xs={5} style={{ display: "flex", justifyContent: "center" }}>
          <Controls.RadioGroup
            name="acStatus"
            label="Status"
            value={input.acStatus}
            onChange={handleChange}
            items={statusItems}
            error={errors.acStatus}
          />
        </Grid>{" "}
        <Grid
          item
          xs={12}
          sm={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <div>{getButton()}</div>
        </Grid>
      </Grid>
      <Popup
        title="Customer form"
        openPopup={buttonPopup}
        setOpenPopup={setButtonPopup}
        size={"md"}
      >
        <PopupMarketingArea
          setButtonPopup={setButtonPopup}
          setValue={setInput}
          value={input}
        />
      </Popup>
    </>
  );
}
// <Controls.Button text="Reset" color="default" />
// <Controls.Button type="submit" text="Submit" />
//
