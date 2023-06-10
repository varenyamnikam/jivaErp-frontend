import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import PopupMarketingArea from "./popupTreeView";
import Popup from "../../../components/Popup";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/Config";
import Divider from "@mui/material/Divider";
import { NotifyMsg } from "../../../components/notificationMsg";
import * as roleService from "../../../services/roleService";
export default function Generalform(props) {
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

    let x = "acName";
    let y = "acCode";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";
    console.log(temp);
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "") && hasRight;
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
      let x;
      setValues(input);
      x = records.find((item) => item.acGroupCode == input.acGroupCode);
      const url = Config().accounts;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
      };

      if (!x) {
        const handleRes = (response) => {
          console.log("hi....", response.data.values);
          setValues(response.data.values);
          setRecords([...records, response.data.values]);
          setNotify(NotifyMsg(1));
          setSubmit(true);
          changeTab();
        };

        roleService.axiosPut(url, input, handleRes, handleErr, () => {});
      } else {
        const handleRes = (response) => {
          const updatedRecords = records.map((p) =>
            p.acCode === input.acCode ? input : p
          );
          setRecords(updatedRecords);
          setValues(input);
          setNotify(NotifyMsg(2));
          setSubmit(true);
          changeTab();
        };

        roleService.axiosPatch(url, input, handleRes, handleErr, () => {});
      }
    }
  }
  // function getValue(value) {
  //   if (value == "NULL") {
  //     console.log("undefined");
  //     return "";
  //   } else {
  //     console.log("not undefined", value);
  //     return value;
  //   }
  // }
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Controls.Input
            name="acCode"
            label="Code"
            value={input.acCode ? values.acCode : "N E W"}
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
            value={input.panNo}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="aadharNo"
            label="Aadhar No"
            value={input.aadharNo}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="gstNo"
            label="GST Number"
            value={input.gstNo}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>{" "}
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="bankName"
            label="Bank Name"
            value={input.bankName}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="bankAcNo"
            label="Bank A/c No"
            value={input.bankAcNo}
            onChange={handleChange}
            // error={errors.stateCode}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controls.Input
            name="ifscCode"
            label="IFSC Code"
            value={input.ifscCode}
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
            value={input.seedLicenNo}
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
          <div>
            {" "}
            <Button
              variant={submit ? "text" : "contained"} // color="success"
              onClick={(e) => {
                !submit && handleSubmit(e);
              }}
              endIcon={submit && <DoneIcon />}
            >
              {submit ? "Submitted" : "Submit"}
            </Button>
          </div>
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
