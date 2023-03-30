import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Grid, InputAdornment } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import AnimatedSmartAutoSuggest from "../../components/animatedSmartAutoSuggest";
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
import MenuPopupState from "../../components/checkBoxMenu";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import Accordion from "../../components/accordions";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ButtonAutosuggest from "../../components/buttonAutosuggest";
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
    adressData,
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
    getVouNo,
    setItem,
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
  let adress = adressData.filter((item) => item.acCode == input.partyCode);
  console.log(adress, reference);
  const refOptions = reference
    .filter((item) => input.refType == item.docCode)
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
      values.docCode == "PR" ||
      values.docCode == "CN" ||
      values.docCode == "DN"
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
  const partyData = accounts.filter((item) => item.preFix == getAccType());

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
  // const ad2 = adress
  //   .filter(
  //     (item) => item.acCode == input.partyCode && Number(item.addressNo) == 2
  //   )
  //   .map((item) => item.addressLine2);

  let cntry = adress.find(
    (item) => item.acCode == input.partyCode && Number(item.addressNo) == 1
  );
  let cntryName = cntry ? cntry.countryName : "";
  let state = adress.find(
    (item) => item.acCode == input.partyCode && Number(item.addressNo) == 1
  );
  let stName = state ? state.stateName : "";

  function autoAdress(code) {
    console.log("hi");
    const ad1 = adressData.find(
      (item) => item.acCode == code && Number(item.addressNo) == 1
    );
    console.log(ad1, adressData, code);
    const adress1 = ad1.addressLine1 ? ad1.addressLine1 : null;
    if (
      adress1 &&
      input.billingAdress !== adress1 &&
      input.shippingAdress !== adress1
    ) {
      console.log(input.billingAdress, input.shippingAdress, {
        billingAdress: adress1,
        shippingAdress: adress1,
      });
      setInput({
        ...input,
        billingAdress: adress1,
        shippingAdress: adress1,
      });
    }
  }
  // }
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setInput({
      ...input,
      [name]: value,
    });
    if (name == "refNo" && value) {
      const ref = reference.find((item) => item.vouNo == value);
      console.log("hi");
      setInput({ ...input, partyCode: ref.partyCode });
    }
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
  function getOptionsForRef() {
    if (initialValues.docCode == "PV") {
      return ["GR", "PO"];
    }

    if (initialValues.docCode == "GR") {
      return ["PO"];
    }
    if (initialValues.docCode == "SI") {
      return ["DC", "QT"];
    }
    if (initialValues.docCode == "DC") {
      return ["QT", "SO"];
    } else return [""];
  }
  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ display: "flex", alignContent: "flex-end" }}
      >
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
            </Grid>{" "}
            <Grid item xs={12} sm={4} className={classes.input}>
              <StaticDatePickerLandscape
                name="vouDate"
                size="small"
                label="Voucher Date"
                value={input}
                setValue={setInput}
              />
            </Grid>{" "}
            {"manualNo" in settings && (
              <Grid item xs={12} sm="auto" className={classes.input}>
                <Controls.Input
                  name="manualNo"
                  label="Manual No"
                  value={input.manualNo}
                  onChange={handleChange}
                  error={errors.manualNo}
                />
              </Grid>
            )}
            {getOptionsForRef()[0] && (
              <>
                <Grid item xs={12} sm={4} className={classes.input}>
                  <UnusedAutosuggest
                    style={{ width: "100%" }}
                    name="refType"
                    label="RefType"
                    value={input}
                    setValue={setInput}
                    options={getOptionsForRef()}
                    error={errors.refType}
                  />
                </Grid>
                <Grid item xs={12} sm={8} className={classes.input}>
                  <ButtonAutosuggest
                    style={{ width: "100%", borderRadius: "0px" }}
                    onClick={() => {
                      const refInput = reference.find(
                        (item) => item.vouNo == input.refNo
                      );
                      const refItemList = common.voucherItems.filter(
                        (item) => item.vouNo == input.refNo
                      );

                      console.log("refInput", refInput);
                      refInput &&
                        setInput({
                          ...refInput,
                          vouNo: input.refNo,
                          vouDate: input.vouDate,
                          docCode: input.docCode,
                          refNo: input.refNo,
                          refType: input.refType,
                        });
                      refItemList.length !== 0 && setItemList(refItemList);
                    }}
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
                options2={partyData}
                getAccType={getAccType}
                error={errors.partyCode}
                itemList={itemList}
                height={28}
                autoAdress={autoAdress}
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
            AnimatedSmartAutoSuggest
            onChange={handleChange}
            error={errors.remark}
            multiline
            rows={getOptionsForRef()[0] ? 6 : 3}
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
          <Controls.Input disabled={true} label="country" value={cntryName} />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input disabled={true} label="state" value={stName} />
        </Grid>
        <Grid item xs={12} sm={12} className={classes.input}>
          <Accordion
            primary="Additional Information"
            secondary="optional"
            feildInLocalStorage="keepTransactionAccordionOpen"
          >
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} className={classes.input}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptLongIcon style={{ color: "#3b3b3b4d" }} />
                        </InputAdornment>
                      ),
                    }}
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptIcon style={{ color: "#3b3b3b4d" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.input}>
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
                  <StaticDatePickerLandscape
                    style={{ width: "100%" }}
                    name="partyChallanDate"
                    label="Party Challan Date"
                    value={input}
                    setValue={setInput}
                  />
                </Grid>

                <Grid item xs={12} sm={2} className={classes.input}>
                  <Controls.Input
                    name="transportation"
                    label="Transportation"
                    value={input.transportation}
                    onChange={handleChange}
                    error={errors.transportation}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalShippingIcon style={{ color: "#3b3b3b4d" }} />
                        </InputAdornment>
                      ),
                    }}
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
                <Grid item xs={12} sm={3} className={classes.input}>
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
          <Grid
            Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "bottom",
            }}
            xs={12}
            sm={12}
          >
            {" "}
            <button
              class="buttonNext"
              onClick={() => {
                setItem((prev) => ({
                  ...prev,
                  cgstP: "",
                  sgstP: "",
                  cessP: "",
                  igstP: "",
                }));
                setTabValue("2");
              }}
            >
              <span>Next</span>
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
