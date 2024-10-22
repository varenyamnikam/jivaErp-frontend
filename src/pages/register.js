import React, { useEffect, useState } from "react";
import AuthHandler from "../Utils/AuthHandler";
import axios from "axios";
import * as roleService from "../services/roleService";
import Controls from "../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { Form } from "../components/useForm";
import Countries from "../components/countrySelect";
import States from "../components/statesSelect";
import Districts from "../components/districtSelect";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import BasicSelect from "../components/menu";
import UnusedAutosuggest from "../components/unusedautosuggest";
import TextField from "@mui/material/TextField";
import ImageUpload from "../components/getImages";
import checklist from "../img/Checklist.jpg";
import coolBackground from "../img/cool-background.png";
import Config from "../Utils/Config";
import "../components/css/style.css";
import Settings from "../components/registerSoftwareSettings";
import { NotifyMsg } from "../components/notificationMsg";
import Notification from "../components/Notification";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  padding: "10px",

  // height: 60,
  // lineHeight: "60px",
}));

const gstType = ["UnRegistered", "Regular", "Composition"];

const initialFValues = {
  stateCode: "",
  countryCode: "",
  countryName: "",
  stateName: "",
  companyName: "",
  district: "",
  taluka: "",
  adressLine1: "",
  adressLine2: "",
  contactNo: "",
  pinCode: "",
  ownerName: "",
  email: "",
  gstRegType: "",
  regMobileNo: "",
  gstInNo: "",
  regType: "FREE",
  footer: "",
  declaration: "",
};
const initialValues = {
  userCompanyCode: "X X X X",
  userBatchNo: "",
  useSerialNo: "",
  itemDescription: "",
  useintraStateSale: "",
  usePesticideSale: "",
  useCessitem: "",
  saleStockUpdateUsing: "",
  purcStockUpdateUsing: "",
  color: "blue",
  useAcc: "",
};
export default function RegisterForm() {
  const [values, setValues] = useState(initialFValues);
  const [input, setInput] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({
    countries: [{}],
    districts: [{}],
    states: [{ stateName: "X" }],
    talukas: [{}],
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const validate = (fieldValues = values, settings = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    function checkInput(key) {
      console.log(settings);
      if (key in settings)
        temp[key] = settings[key] ? "" : "This field is required.";
    }

    check("companyName");
    check("ownerName");
    check("regMobileNo");
    check("adressLine1");
    check("adressLine2");
    check("countryName");
    check("stateName");
    check("pinCode");
    check("gstRegType");
    // check("useAcc");
    // check("purcStockUpdateUsing");
    // check("color");
    // check("saleStockUpdateUsing");
    // check("useCessitem");
    // check("usePesticideSale");
    // check("useintraStateSale");
    // check("itemDescription");
    // check("useSerialNo");
    //check("userBatchNo");
    Object.keys(settings).map((x) => {
      console.log(x);
      checkInput(x);
    });

    var expr = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (
      fieldValues.gstRegType !== "UnRegistered" &&
      !expr.test(fieldValues.gstInNo)
    ) {
      temp.gstInNo = "incorrect format";
    } else {
      temp.gstInNo = "";
    }
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };
  useEffect(() => {
    if (location.states[0].stateName == "X") {
      console.log("location set");
      // const token = AuthHandler.getLoginToken();
      // const body = { hello: "hello" };
      // axios
      //   .post(Config().location, body, {
      //     headers: {
      //       authorization: "Bearer" + token,
      //     },
      //   })
      const handleRes = (response) => {
        console.log(response.data);
        setLocation(response.data.location);
      };
      const url = Config().register;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
        console.error(err);
      };
      roleService.axiosGet(url, handleRes, handleErr, () => {});
    }
  });
  const theme = createTheme();
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    color: theme.palette.text.secondary,
    padding: "10px",

    // height: 60,
    // lineHeight: "60px",
  }));

  console.log(values, location);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(errors);
    const a = 1;

    if (validate()) {
      alert(`${values.regMobileNo} is this no. correct?`);
      const urlx = Config().register;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
        console.error(err);
      };
      const handleRes = (res) => {
        console.log(res);
        alert(`UserCompanyCode : ${res.data.companyCode}   
          userCode: ${res.data.userCode}   password:${res.data.password} .
          plz check mobile number (${values.regMobileNo}) for details`);
        localStorage.setItem("adm_softwareSettings", JSON.stringify(input));
        window.location = "/";
      };
      const send = { values, input };
      roleService.axiosPost(urlx, send, handleRes, handleErr);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setValues({
      ...values,
      [name]: value,
    });
  };
  const recentImageDataUrl = localStorage.getItem("recent-image");
  function getImage() {
    if (recentImageDataUrl) {
      return (
        <img
          height={100}
          width={100}
          src={recentImageDataUrl}
          alt=""
          id="img"
          className="img"
        />
      );
    } else
      return (
        <img
          height={100}
          width={100}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          id="img"
          className="img"
        />
      );
  }
  return (
    <ThemeProvider theme={theme}>
      <div>
        <section className="ftco-section">
          <div className="container">
            <div
              className="row justify-content-center"
              style={{ padding: "0px" }}
            >
              <div className="col-md-12 col-lg-10">
                <div className="wrap d-md-flex">
                  <Grid
                    container
                    spacing={2}
                    style={{ marginTop: "20px", padding: "10px" }}
                  >
                    <img
                      src={checklist}
                      alt="Paris"
                      width="100%"
                      className="center"
                    />
                    <Grid item xs={12} sm={12} style={{}}>
                      <h1>Please fill details to become a member</h1>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="companyName"
                        label="Company Name"
                        value={values.companyName}
                        onChange={handleInputChange}
                        error={errors.companyName}
                        fullWidths
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="ownerName"
                        label="Owner Name"
                        value={values.ownerName}
                        onChange={handleInputChange}
                        fullWidth
                        error={errors.ownerName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="regMobileNo"
                        label="Registered Mobile No."
                        value={values.mobileNo}
                        onChange={handleInputChange}
                        error={errors.regMobileNo}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="adressLine1"
                        label="Adress Line 1"
                        value={values.adressLine1}
                        onChange={handleInputChange}
                        fullWidth
                        error={errors.adressLine1}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="adressLine2"
                        label="Adress Line 2"
                        value={values.adressLine2}
                        onChange={handleInputChange}
                        fullWidth
                        error={errors.adressLine2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Countries
                        value={values}
                        setValue={setValues}
                        options={location.countries}
                        error={errors.countryName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <States
                        value={values}
                        setValue={setValues}
                        options={location.states}
                        countries={location.countries}
                        country={values.countryName}
                        error={errors.stateName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="district"
                        label="District"
                        value={values.district}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="taluka"
                        label="Taluka"
                        value={values.taluka}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="pinCode"
                        label="Pincode"
                        value={values.pinCode}
                        onChange={handleInputChange}
                        fullWidth
                        error={errors.pinCode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <UnusedAutosuggest
                        options={gstType}
                        setValue={setValues}
                        value={values}
                        label="GST Registration Type"
                        name="gstRegType"
                        fullWidth
                        error={errors.gstRegType}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="gstInNo"
                        label="GSTin No"
                        value={values.gstInNo}
                        onChange={handleInputChange}
                        fullWidth
                        error={errors.gstInNo}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="contactNo"
                        label="Phone No."
                        value={values.contactNo}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controls.Input
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={12}>
                      <Settings
                        input={input}
                        setInput={setInput}
                        errors={errors}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ImageUpload recentImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Controls.Button
                        type="submit"
                        text="Submit"
                        onClick={handleSubmit}
                      />
                      <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={() => {}}
                      />
                    </Grid>
                  </Grid>
                </div>{" "}
              </div>
            </div>
          </div>
          <Notification notify={notify} setNotify={setNotify} />
        </section>
      </div>
    </ThemeProvider>
  );
}
// <States
// value={values}
// setValue={setValues}
// options={state}
// countries={country}
// country={values.countryName}
// disable={stateDisable}
// />
// <Box
// sx={{
//   dislpay: "flex",
//   marginTop: "55px",
//   height: "500px",
//   width: "800px",
// }}
// >
// <Form onSubmit={handleSubmit}>
//
//   <Item key={2} elevation={5}>
//
//     </Item>
//   </Form>
// </Box>
// <Box
// sx={{
//   marginTop: "55px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   height: "900px",
//   width: "700px",
//   flexGrow: 1,
// }}
// >
// style={{
//   dislpay: "flex",
//   marginTop: "55px",
//   width: "800px",
//   marginTop: "55px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   height: "900px",
//   width: "700px",
// }}
// <Grid
// container
// style={{
//   display: "flex",
//   // justifyContent: "right",
//   // alignItems: "right",
//   // marginRight: "200px",
//   background: "linear-gradient(#FFFFFF,  #87CEEB)",
//   justifyContent: "center",
//   alignItems: "center",
// }}
// >
// height={300}
// width={500}
// style={{ marginLeft: "150px" }}
// marginTop: "55px",
// display: "flex",
// flexDirection: "column",
// alignItems: "center",
// height: "1250px",
// width: "800px",
// <Grid
// container
// style={{
// display: "flex",
// // justifyContent: "right",
// // alignItems: "right",
// // marginRight: "200px",
// background: "linear-gradient(#FFFFFF,  #87CEEB)",
// justifyContent: "center",
// alignItems: "center",
// }}
// >
