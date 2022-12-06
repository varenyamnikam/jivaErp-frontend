import React, { useEffect, useState } from "react";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import { makeStyles } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import Calendar from "../../components/calendar";
import NotSmartAutoSuggest from "../../components/haha";
import Divider from "@mui/material/Divider";
import ItemForm from "./generalItems";
import Popup from "../../components/Popup";
import Percent from "../../components/percentageNew";
const cash = [
  { id: "Cash", title: "Cash" },
  { id: "Credit", title: "Credit" },
];
const clear = [
  { id: "Clear", title: "Clear" },
  { id: "Cancel", title: "Cancel" },
];

const docOptions = ["DC", "QT", "GR", "SI"];
const useStyles = makeStyles((theme) => ({
  // input: { minWidth: "200px", flexGrow: 1 },
}));

export default function GeneralForm(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const {
    records,
    setRecords,
    values,
    setValues,
    initialValues,
    initialFilterValues,
    setButtonPopup,
    setNotify,
    accounts,
    adress,
    payTerms,
    products,
    voucherItems,
    setCommon,
    openPopup,
    setOpenPopup,
    handleSubmit,
    vouItems,
    common,
    itemList,
    setItemList,
    title,
    reference,
  } = props;
  const validateValues = {
    ...initialValues,
    vouNo: "",
    docCode: "",
    finYear: "",
    branchCode: "",
    vouDate: "",
    partyBillDate: "",
    partyChallanDate: "",
  };
  const [input, setInput] = useState(values);
  const [errors, setErrors] = useState(validateValues);
  function Validate(fieldValues = input) {
    console.log(fieldValues);
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    function check0(key) {
      if (key in fieldValues)
        temp[key] =
          Number(fieldValues[key]) > 0 ? "" : "This should be more than 0";
    }

    check("partyCode");
    check0("itemTotal");
    setErrors({
      ...temp,
    });
    console.log(temp);
    return Object.values(temp).every((x) => x == "");
  }
  adress.filter((item) => item.acCode == input.partyCode);
  console.log(adress);
  const refOptions = reference
    .filter((item) => input.docCode !== item.docCode)
    .map((item) => item.vouNo);
  const payOptions = payTerms.map((item) => item.paymentTerms);
  const prodOptions = products.map((item) => item.prodName);
  const addressOptions = adress
    .filter((item) => item.acCode == input.partyCode)
    .map((item) => item.addressLine1);
  console.log(errors);
  const partyOptions = accounts
    .filter((item) => item.preFix == "C")
    .map((item) => {
      return item.acName;
    });
  console.log(itemList);
  // if (input.vouNo.length > 8) {
  //   let arr = [];
  //   arr = voucherItems.filter((item) => item.vouNo == input.vouNo);
  //   console.log(arr, voucherItems, itemList);
  //   if (arr.length !== 0) {
  //     console.log(arr);
  //     if (arr[arr.length - 1].vouNo !== itemList[itemList.length - 1].vouNo)
  //       setItemList(arr);
  //   }
  // }
  const agentOptions = accounts
    .filter((item) => item.preFix == "E")
    .map((item) => {
      return item.acName;
    });
  console.log(input);
  const classes = useStyles();
  const ad1 = adress
    .filter(
      (item) => item.acCode == input.partyCode && Number(item.addressNo) == 1
    )
    .map((item) => item.addressLine1);
  if (input.partyCode && !input.billingAdress && !input.shippingAdress) {
    setInput({ ...input, billingAdress: ad1, shippingAdress: ad1 });
  }
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
  if (!input.vouNo.includes(input.branchCode + input.docCode + input.finYear))
    setInput({
      ...input,
      vouNo: input.branchCode + input.docCode + input.finYear,
    });

  let x = 0;
  itemList.map((item) => {
    x = Number(x) + Number(item.itemAmount);
  });
  const amt = x;
  if (amt.toFixed(2) !== input.itemTotal) {
    setInput({ ...input, itemTotal: amt.toFixed(2) });
  }
  let k =
    Number(input.itemTotal) + Number(input.fright) - Number(input.billDis);

  if (Number(input.netAmount) !== Math.round(k)) {
    setInput({ ...input, netAmount: Math.round(k) });
  }
  console.log(
    Number(input.roundOff),
    (k.toFixed(2) - Math.round(k)).toFixed(2)
  );
  if (
    Number(input.roundOff).toFixed(2) !==
    (k.toFixed(2) - Math.round(k)).toFixed(2)
  ) {
    setInput({ ...input, roundOff: (k.toFixed(2) - Math.round(k)).toFixed(2) });
  }
  let y = true;
  records.map((item) => {
    if (item.vouNo == input.vouNo) {
      console.log(item);
      y = false;
    }
  });

  function getVouNo() {
    if (y) {
      return " NEW ";
    } else {
      return input.vouNo;
    }
  }

  return (
    <>
      <Grid container style={{ marginBottom: "10px" }} spacing={2}>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="vouNo"
            label="Voucher No"
            value={getVouNo()}
            onChange={handleChange}
            error={errors.vouNo}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="manualNo"
            label="Manual No"
            value={input.manualNo}
            onChange={handleChange}
            error={errors.manualNo}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            style={{ width: "100%" }}
            name="docCode"
            label="Doc Code"
            value={input.docCode}
            onChange={handleChange}
            disabled={true}
            // error={errors.docCode}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <StaticDatePickerLandscape
            name="vouDate"
            size="small"
            label="Voucher Date"
            value={input}
            setValue={setInput}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="refType"
            label="RefType"
            value={input}
            setValue={setInput}
            options={["DC", "QT"]}
            error={errors.refType}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={classes.input}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="refNo"
            label="Ref No"
            value={input}
            setValue={setInput}
            options={refOptions}
            error={errors.refNo}
          />
        </Grid>
        <Grid item xs={12} sm={5} className={classes.input}>
          <Controls.Input
            name="remark"
            label="Remark"
            value={input.remark}
            onChange={handleChange}
            error={errors.remark}
          />
        </Grid>
        <Grid item xs={12} sm={12} className={classes.input}>
          <SmartAutoSuggest
            style={{ width: "100%" }}
            name1="partyName"
            code1="partyCode"
            label="Party"
            name2="acName"
            code2="acCode"
            value={input}
            setValue={setInput}
            options1={partyOptions}
            options2={accounts}
            error={errors.partyCode}
          />{" "}
        </Grid>{" "}
        <Grid item xs={12} sm={6} className={classes.input}>
          <SmartAutoSuggest
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            name1="billingAdress"
            code1="billingAdressCode"
            name2="addressLine1"
            code2="addressNo"
            label="Billing Adress"
            value={input}
            setValue={setInput}
            options1={addressOptions}
            options2={adress}
            error={errors.billingAdress}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <SmartAutoSuggest
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            name1="shippingAdress"
            code1="shippingAdressCode"
            name2="addressLine1"
            code2="addressNo"
            label="Shipping Adress"
            value={input}
            setValue={setInput}
            options1={addressOptions}
            options2={adress}
            error={errors.shippingAdress}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="partyBillNo"
            label="Party Bill No"
            value={input.partyBillNo}
            onChange={handleChange}
            error={errors.partyBillNo}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <StaticDatePickerLandscape
            style={{ width: "100%" }}
            name="partyBillDate"
            label="Party Bill Date"
            value={input}
            setValue={setInput}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="partyChallanNo"
            label="Party Challan No"
            value={input.partyChallanNo}
            onChange={handleChange}
            error={errors.partyChallanNo}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <StaticDatePickerLandscape
            style={{ width: "100%" }}
            name="partyChallanDate"
            label="Party Challan Date"
            value={input}
            setValue={setInput}
          />
        </Grid>{" "}
        <Grid item xs={12} sm={6} className={classes.input}>
          <SmartAutoSuggest
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            name1="paymentTerms"
            code1="paymentTermsCode"
            name2="paymentTerms"
            code2="paymentTermsCode"
            label="Payment Terms"
            value={input}
            setValue={setInput}
            options1={payOptions}
            options2={payTerms}
            error={errors.payTerm}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="transportation"
            label="Transportation"
            value={input.transportation}
            onChange={handleChange}
            error={errors.transportation}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="truckNo"
            label="Truck No"
            value={input.truckNo}
            onChange={handleChange}
            error={errors.truckNo}
          />
        </Grid>
      </Grid>
      <Divider variant="middle" color="blue" sx={{ borderBottomWidth: 2 }} />
      <ItemForm
        itemList={itemList}
        setItemList={setItemList}
        records={records}
        products={products}
        prodOptions={prodOptions}
        vouItems={vouItems}
        input={input}
        setCommon={setCommon}
        common={common}
      />
      <Divider variant="middle" color="blue" sx={{ borderBottomWidth: 2 }} />
      <Grid container spacing={2} style={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="itemTotal"
            label="Item Total"
            value={input.itemTotal}
            onChange={handleChange}
            error={errors.itemTotal}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="fright"
            label="Fright"
            value={input.fright}
            onChange={handleChange}
            error={errors.fright}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Percent
            name1="billDis"
            name2="billDisPer"
            name3="itemTotal"
            label="Discount"
            value={input}
            setValue={setInput}
            onChange={handleChange}
            error={errors.billDis}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="roundOff"
            label="Round Off"
            value={input.roundOff}
            onChange={() => {}}
            error={errors.roundOff}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="netAmount"
            label="Net Amount"
            value={input.netAmount}
            onChange={() => {}}
            error={errors.netAmount}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="recievedCash"
            label="Recieved Cash"
            value={input.recievedCash}
            onChange={handleChange}
            error={errors.recievedCash}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="returnCash"
            label="Return Cash"
            value={input.returnCash}
            onChange={handleChange}
            error={errors.returnCash}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={classes.input}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="recievedBy"
            label="Recieved By"
            value={input}
            setValue={setInput}
            options={[
              "CASH",
              "Phone Pay",
              "Google Pay",
              "Paytm",
              "Amazon Pay",
              "Whatsapp",
            ]}
            error={errors.recievedBy}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="cashCredit"
            label="Cash/Credit"
            value={input}
            setValue={setInput}
            options={["Cash", "Credit"]}
            error={errors.cashCredit}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.input}>
          <SmartAutoSuggest
            name1="agentName"
            code1="agentCode"
            name2="acName"
            code2="acCode"
            label="Agent"
            value={input}
            setValue={setInput}
            options1={agentOptions}
            options2={accounts}
            error={errors.agentName}
          />
        </Grid>

        <Grid item xs={12} sm={6} className={classes.input}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "50px",
              marginTop: "40px",
            }}
          >
            <Controls.Button
              type="submit"
              text="Submit"
              onClick={(e) => {
                if (Validate()) handleSubmit(input, itemList);
                console.log(Validate());
              }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
