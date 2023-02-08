import React, { useEffect, useState } from "react";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import { makeStyles } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Grid, InputAdornment } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import AnimatedSmartAutoSuggest from "../../components/animatedSmartAutoSuggest";
import Calendar from "../../components/calendar";
import NotSmartAutoSuggest from "../../components/haha";
import Divider from "@mui/material/Divider";
import ItemForm from "./generalItems";
import Popup from "../../components/Popup";
import Percent from "../../components/percentageNew";
import Lottie from "react-lottie";
import rupee from "../../components/lotties/105335-rupee-coin.json";
import delivery from "../../components/lotties/31531-truck-shipping.json";
import bill from "../../components/lotties/66365-my-bills.json";
import cashIcon from "../../components/lotties/g5mYcVtWJ1.json";
import CustomerAutoSuggest from "../../components/customerAutoSuggest.js";
import "../../components/reverse-arrow.css";
import SaveIcon from "@mui/icons-material/Save";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DoneIcon from "@mui/icons-material/Done";
import MenuPopupState from "../../components/checkBoxMenu";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import Accordion from "../../components/accordions";
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
  input: {},
}));

export default function CustomerForm(props) {
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
    initialVouItem,
    common,
    itemList,
    setItemList,
    title,
    reference,
    input,
    setInput,
    setTabValue,
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
  const [errors, setErrors] = useState(validateValues);
  const [isPaused, setIsPaused] = useState({
    rate: true,
    itemAmount: true,
    netAmount: true,
    bill: true,
    ship: true,
    cash: true,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: cashIcon,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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
  const addressOptions = adress
    .filter((item) => item.acCode == input.partyCode)
    .map((item) => item.addressLine1);
  console.log(errors);
  function getAccType() {
    let x = "";
    if (
      values.docCode == "PO" ||
      values.docCode == "GR" ||
      values.docCode == "PV" ||
      values.docCode == "PR"
    )
      x = "S";
    else {
      x = "C";
    }
    return x;
  }
  const partyOptions = accounts
    .filter((item) => item.preFix == getAccType())
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
  const play = {
    loop: false,
    autoplay: false,
    animationData: rupee,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const playBill = {
    loop: false,
    autoplay: false,
    animationData: bill,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const playShip = {
    loop: false,
    autoplay: false,
    animationData: delivery,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  const [value, setValue] = React.useState(null);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9} className={classes.input}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} className={classes.input}>
              <Controls.Input
                name="vouNo"
                label="Voucher No"
                value={getVouNo()}
                onChange={handleChange}
                error={errors.vouNo}
                disabled={true}
              />
            </Grid>
            {"manualNo" in settings && (
              <Grid item xs={12} sm={3} className={classes.input}>
                <Controls.Input
                  name="manualNo"
                  label="Manual No"
                  value={input.manualNo}
                  onChange={handleChange}
                  error={errors.manualNo}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4} className={classes.input}>
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
            <Grid item xs={12} sm={4} className={classes.input}>
              <StaticDatePickerLandscape
                name="vouDate"
                size="small"
                label="Voucher Date"
                value={input}
                setValue={setInput}
              />
            </Grid>
            {"manualNo" in settings && (
              <>
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
              </>
            )}
            <Grid item xs={12} sm={12} className={classes.input}>
              <CustomerAutoSuggest
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
                height={28}
                icon="user"
              />{" "}
            </Grid>{" "}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="remark"
            label="Remark"
            value={input.remark}
            onChange={handleChange}
            error={errors.remark}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={8} className={classes.input}>
          <AnimatedSmartAutoSuggest
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            name1="billingAdress"
            code1="billingAdressCode"
            name2="addressLine1"
            code2="addressNo"
            label={"manualNo" in settings ? "Billing Adress" : "Adress"}
            value={input}
            setValue={setInput}
            options1={addressOptions}
            options2={adress}
            error={errors.billingAdress}
            height={50}
            icon="bill"
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input disabled={true} label="country" />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input disabled={true} label="state" />
        </Grid>
        <Grid item xs={12} sm={12} className={classes.input}>
          <Accordion primary="Additional Information" secondary="optional">
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} className={classes.input}>
                  <AnimatedSmartAutoSuggest
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
                    height={60}
                    icon="delivery"
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.input}>
                  <Controls.Input
                    name="partyBillNo"
                    label="Party Bill No"
                    value={input.partyBillNo}
                    onChange={handleChange}
                    error={errors.partyBillNo}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.input}>
                  <StaticDatePickerLandscape
                    style={{ width: "100%" }}
                    name="partyBillDate"
                    label="Party Bill Date"
                    value={input}
                    setValue={setInput}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.input}>
                  <Controls.Input
                    name="partyChallanNo"
                    label="Party Challan No"
                    value={input.partyChallanNo}
                    onChange={handleChange}
                    error={errors.partyChallanNo}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.input}>
                  <StaticDatePickerLandscape
                    style={{ width: "100%" }}
                    name="partyChallanDate"
                    label="Party Challan Date"
                    value={input}
                    setValue={setInput}
                  />
                </Grid>
                <Grid item xs={12} sm={2} className={classes.input}>
                  <AnimatedSmartAutoSuggest
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
                    height={50}
                    icon="pay"
                  />
                </Grid>

                <Grid item xs={12} sm={2} className={classes.input}>
                  <Controls.Input
                    name="transportation"
                    label="Transportation"
                    value={input.transportation}
                    onChange={handleChange}
                    error={errors.transportation}
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
                <Grid item xs={12} sm={2} className={classes.input}>
                  <Controls.Input
                    name="recievedCash"
                    label="Recieved Cash"
                    value={input.recievedCash}
                    onChange={handleChange}
                    error={errors.recievedCash}
                    onFocus={() => {
                      setIsPaused((prev) => ({ ...prev, cash: false }));
                    }}
                    onBlur={() => {
                      setIsPaused((prev) => ({ ...prev, cash: true }));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lottie
                            options={defaultOptions}
                            isStopped={isPaused.cash}
                            height={50}
                            width={30}
                          />
                        </InputAdornment>
                      ),
                    }}
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
                <Grid item xs={12} sm={2} className={classes.input}>
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
              </Grid>
            </>
          </Accordion>
        </Grid>
        <Grid
          container
          spacing={2}
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} sm={2} className={classes.input}>
            <Controls.Input
              name="itemTotal"
              label="Item Total"
              value={input.itemTotal}
              onChange={handleChange}
              error={errors.itemTotal}
              onFocus={() => {
                setIsPaused((prev) => ({ ...prev, itemAmount: false }));
              }}
              onBlur={() => {
                setIsPaused((prev) => ({ ...prev, itemAmount: true }));
              }}
              classname={classes.root}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lottie
                      options={play}
                      height={60}
                      width={30}
                      isStopped={isPaused.itemAmount}
                    />
                  </InputAdornment>
                ),
                classes: { root: classes.inputRoot },
              }}
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
            <SmartAutoSuggest
              name1="agentName"
              code1="agentCode"
              name2="acName"
              code2="acCode"
              label="Payment To"
              value={input}
              setValue={setInput}
              options1={agentOptions}
              options2={accounts}
              error={errors.agentName}
              style={{ height: "40px" }}
            />
          </Grid>

          <Grid item xs={12} sm={2} className={classes.input}>
            <Controls.Input
              name="netAmount"
              label="Net Amount"
              value={input.netAmount}
              onChange={() => {}}
              error={errors.netAmount}
              onFocus={() => {
                setIsPaused((prev) => ({ ...prev, netAmount: false }));
              }}
              onBlur={() => {
                setIsPaused((prev) => ({ ...prev, netAmount: true }));
              }}
              classname={classes.root}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lottie
                      options={play}
                      height={60}
                      width={30}
                      isStopped={isPaused.netAmount}
                    />
                  </InputAdornment>
                ),
                classes: { root: classes.inputRoot },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} className={classes.input}>
            <button
              class="button"
              onClick={() => {
                setTabValue("1");
              }}
            >
              <span>Prev</span>
            </button>{" "}
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.input}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              class="buttonSave"
              onClick={() => {
                setTabValue("1");
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                backgroundColor: "rgb(116, 100, 100)",
              }}
            >
              <LocalPrintshopIcon htmlColor="white" />
              <span>Submit & Print</span>
            </button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            className={classes.input}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              class="buttonSave"
              onClick={() => {
                setTabValue("1");
              }}
              style={{
                backgroundColor: "blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DoneIcon htmlColor="white" style={{ marginRight: "20px" }} />
              <span>Submit</span>
            </button>
          </Grid>
        </Grid>{" "}
      </Grid>
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
// <Grid
// item
// xs={12}
// sm={3}
// className={classes.input}
// style={{
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// }}
// >
// <button
//   class="buttonSave"
//   onClick={() => {
//     setTabValue("1");
//   }}
//   style={{
//     width: "250px",
//     backgroundColor: "green",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   }}
// >
//   <SaveIcon htmlColor="white" />
//   <span> Save & New Form</span>
// </button>
// </Grid>
