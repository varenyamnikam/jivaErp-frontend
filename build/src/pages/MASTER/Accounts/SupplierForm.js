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
const Firms = [
  "N.A.",
  "Proprietary",
  "Private Limited",
  "Limited",
  "Co-Operative",
  "Co-Operative Limited",
];
const supplierType = ["GENRAL"];
export default function Suppliersform(props) {
  const {
    values,
    setValues,
    records,
    setRecords,
    groupTypes,
    statusItems,
    marketArea,
    validate,
    getChild,
    changeTab,
    submit,
    setSubmit,
    setNotify,
    notify,
  } = props;
  console.log("values =>", values);
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
  const [input, setInput] = useState(values);
  const [buttonPopup, setButtonPopup] = useState(false);
  console.log("input =>", input);
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
  // useEffect(() => {
  //   setValues({ ...values, ...input });
  // }, [input]);
  if (values.mktAreaCode) {
    marketArea.map((item) => {
      if (
        item.mktAreaCode == input.mktAreaCode &&
        item.mktArea !== input.mktArea
      )
        setInput({ ...input, mktArea: item.mktArea });
    });
  }
  if (
    input.acTypeCode !== values.customerType ||
    input.firmType !== values.firmType
  ) {
    setSubmit(false);
  }
  function valuesForAccode() {
    console.log(
      "incaccode",
      "S" +
        (
          parseInt(records[records.length - 1].acCode.match(/(\d+)/)[0]) + 1
        ).toString()
    );
    setValues({
      ...input,
      acCode:
        "S" +
        (
          parseInt(records[records.length - 1].acCode.match(/(\d+)/)[0]) + 1
        ).toString(),
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate(input)) {
      let x = true;
      records.map((item, index) => {
        if (item.acCode == values.acCode) {
          console.log(values.acCode, { ...input });
          const updatedRecords = records.map((p) =>
            p.acCode === values.acCode ? { ...input } : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          setValues(input);
          x = false;
        }
      });
      console.log(x);
      if (x) {
        console.log({
          ...input,
        });
        setRecords([
          ...records,
          {
            // ...values,
            ...input,
            acCode:
              "S" +
              (
                parseInt(records[records.length - 1].acCode.match(/(\d+)/)[0]) +
                1
              ).toString(),
          },
        ]);
        valuesForAccode();
        // console.log(
        //   "GL" +
        //     (
        //       parseInt(records[records.length - 1].acCode.match(/(\d+)/)[0]) + 1
        //     ).toString()
        // );
      }
      setNotify({
        isOpen: true,
        message: "Supplier details submitted successfully",
        type: "success",
      });

      changeTab();
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
  //          <Grid container item xs={6} justifyContent="flex-end">
  function getButton() {
    if (!submit) {
      return (
        <>
          {" "}
          <Button
            variant="contained"
            // color="success"
            onClick={(e) => {
              handleSubmit(e);
              setSubmit(true);
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
              value={values.acCode}
              onChange={handleInputChange}
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
          <Grid item xs={6}>
            <Controls.Input
              name="acRegMob"
              label="Reg. Mobile no."
              value={input.acRegMob}
              onChange={handleChange}
              // error={errors.stateCode}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="propritorName"
              label="Propritor Name"
              value={input.propritorName}
              onChange={handleChange}
              // error={errors.stateCode}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="tradeName"
              label="Trade Name"
              value={input.tradeName}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>{" "}
          <div style={{ marginRight: 40 }}>
            <Grid item container xs={6} alignItems="center">
              <BasicSelect
                name="acTypeCode"
                label="Supplier Type"
                values={input}
                setValues={setInput}
                options={supplierType}
              />{" "}
            </Grid>
          </div>
          <Grid item xs={6}>
            <Controls.Input
              name="panNo"
              label="PAN No"
              value={getValue(input.panNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="aadharNo"
              label="Aadhar No"
              value={getValue(input.aadharNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="gstNo"
              label="GST Number"
              value={getValue(input.gstNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="seedLicenNo"
              label="Seed Licen No"
              value={getValue(input.seedLicenNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="bankName"
              label="Bank Name"
              value={getValue(input.bankName)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="bankAcNo"
              label="Bank A/c No"
              value={getValue(input.bankAcNo)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="ifscCode"
              label="IFSC Code"
              value={getValue(input.ifscCode)}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="creditDays"
              label="Credit Days"
              value={input.creditDays}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              name="creditAmount"
              label="Credit Limit (Amount)"
              value={input.creditAmount}
              onChange={handleChange}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <BasicSelect
              name="firmType"
              label="Firm Type"
              values={input}
              setValues={setInput}
              options={Firms}
            />{" "}
          </Grid>
          <Grid item container xs={4} justifyContent={"flex-end"}>
            <Controls.Input
              name=""
              label="Marketing Area"
              value={input.mktArea}
              onChange={() => {}}
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={2}>
            <div style={{ marginTop: 20 }}>
              <Stack spacing={2} direction="row">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setButtonPopup(true);
                  }}
                >
                  choose
                </Button>
              </Stack>
            </div>
          </Grid>
          <Grid item xs={5}>
            <Controls.RadioGroup
              name="acStatus"
              label="Status"
              value={input.acStatus}
              onChange={handleChange}
              items={statusItems}
            />{" "}
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
      </Form>
      <div>{getButton()}</div>
    </>
  );
}
// <Controls.Button text="Reset" color="default" />
// <Controls.Button type="submit" text="Submit" />
//
