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
import ItemForm from "./itemDesign";
import Popup from "../../components/Popup";
import Percent from "../../components/percentageNew";
import Lottie from "react-lottie";
import rupee from "../../components/lotties/105335-rupee-coin.json";
import delivery from "../../components/lotties/31531-truck-shipping.json";
import bill from "../../components/lotties/66365-my-bills.json";
import cashIcon from "../../components/lotties/g5mYcVtWJ1.json";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import icon1 from "../../components/lotties/7031-colourfull-number-1.json";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import CustomerForm from "./customerDesign";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
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
    values,
    initialValues,
    accounts,
    adress,
    payTerms,
    products,
    setCommon,
    initialVouItem,
    common,
    itemList,
    setItemList,
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
  const [tabValue, setTabValue] = useState("1");
  const prodOptions = products.map((item) => item.prodName);

  return (
    <>
      {" "}
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
            }}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              label="Item Details"
              value="1"
              icon={
                tabValue == 1 ? (
                  <ListAltIcon color="primary" />
                ) : (
                  <CheckCircleIcon color="success" />
                )
              }
              iconPosition="start"
            />
            <Tab
              label="Customer Details"
              value="2"
              disabled={!Number(values.netAmount) == 0}
              icon={<PersonIcon color="primary" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <TabPanel value="1" sx={{ height: "90%" }}>
          <ItemForm
            itemList={itemList}
            setItemList={setItemList}
            records={records}
            products={products}
            prodOptions={prodOptions}
            initialVouItem={initialVouItem}
            input={input}
            setCommon={setCommon}
            common={common}
            setTabValue={setTabValue}
          />
        </TabPanel>{" "}
        <TabPanel value="2">
          <CustomerForm
            records={records}
            values={values}
            initialValues={initialValues}
            accounts={accounts}
            adress={adress}
            payTerms={payTerms}
            products={products}
            setCommon={setCommon}
            initialVouItem={initialVouItem}
            common={common}
            itemList={itemList}
            setItemList={setItemList}
            reference={reference}
            input={input}
            setInput={setInput}
            setTabValue={setTabValue}
          />
        </TabPanel>
      </TabContext>
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
