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
// import BasicSelect from "./Usermaster/basicselect";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import BasicSelect from "../components/menu";
import DropDownMenu from "./Usermaster/dropdownmenu";
import UnusedAutosuggest from "../components/unusedautosuggest";
import TextField from "@mui/material/TextField";
import ImageUpload from "../components/getImages";
import checklist from "../img/Checklist.jpg";
import coolBackground from "../img/cool-background.png";
import Config from "../Utils/Config";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  padding: "10px",

  // height: 60,
  // lineHeight: "60px",
}));

const Firms = [
  "N.A.",
  "Proprietary",
  "Private Limited",
  "Limited",
  "Co-Operative",
  "Co-Operative Limited",
];

const initialFValues = {
  stateCode: "",
  countryCode: "",
  countryName: "",
  stateName: "",
  companyName: "",
  companyType: "",
  district: "",
  taluka: "",
  adressLine1: "",
  adressLine2: "",
  phoneNo: "",
  phoneStdCode: "",
  mobileNo: "",
  pincode: "",
  contactPerson: "",
  email: "",
};
const gridStyle = {
  display: "flex",
  paddingLeft: "50px",
  paddingRight: "40px",
  marginTop: "20px",
};
const gridLeft = {
  display: "flex",
  alignItems: "left",
  justifyContent: "left",
  paddingLeft: "40px",
  paddingRight: "50px",
  marginTop: "20px",
};

export default function RegisterForm() {
  const [values, setValues] = useState(initialFValues);
  const [stateDisable, setStateDisable] = useState(true);
  const [districtDisable, setDistrictDisable] = useState(true);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({
    country: [{}],
    districts: [{}],
    states: [{}],
    talukas: [{}],
  });
  useEffect(() => {
    if (location.states.length == 1) {
      console.log("location set");
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(Config.location, body, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          setLocation(response.data);
        });
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
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("countryName" in fieldValues)
      temp.countryName = fieldValues.countryName
        ? ""
        : "This field is required.";
    if ("countryCode" in fieldValues)
      temp.countryCode = fieldValues.countryCode
        ? ""
        : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      roleService.insertLocation({ ...values, countryStatus: "ACTIVE" });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setValues({
      ...values,
      [name]: value,
    });
    console.log(values);
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
      <div style={{}}>
        <Grid
          container
          style={{
            display: "flex",
            // justifyContent: "right",
            // alignItems: "right",
            // marginRight: "200px",
            background: "linear-gradient(#FFFFFF,  #87CEEB)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginTop: "55px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "1250px",
              width: "800px",
            }}
          >
            <Paper elevation={5}>
              <img
                src={checklist}
                height={300}
                width={500}
                style={{ marginLeft: "150px" }}
              />{" "}
              <h1 style={{ marginLeft: "60px", marginTop: "20px" }}>
                Please fill details to become a member
              </h1>
              <Grid container style={{ width: "800px", marginTop: "20px" }}>
                <Grid item xs={12} style={gridStyle}>
                  {" "}
                  <Controls.Input
                    name="companyName"
                    label="Company Name"
                    value={values.companyName}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="adressLine1"
                    label="Adress Line 1"
                    value={values.adressLine1}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridLeft}>
                  <Controls.Input
                    name="adressLine2"
                    label="Adress Line 2"
                    value={values.adressLine2}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Countries
                    value={values}
                    setValue={setValues}
                    options={location.country}
                  />
                </Grid>{" "}
                <Grid item xs={6} style={gridLeft}>
                  <States
                    value={values}
                    setValue={setValues}
                    options={location.states}
                    countries={location.country}
                    country={values.countryName}
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="district"
                    label="District"
                    value={values.district}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>{" "}
                <Grid item xs={6} style={gridLeft}>
                  <Controls.Input
                    name="taluka"
                    label="Taluka"
                    value={values.taluka}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="pincode"
                    label="Pincode"
                    value={values.pincode}
                    onChange={handleInputChange}
                    fullWidth
                  />{" "}
                </Grid>
                <Grid item xs={6} style={gridLeft}>
                  <UnusedAutosuggest
                    options={Firms}
                    setValue={setValues}
                    value={values}
                    label="Company Type"
                    name="companyType"
                    fullWidth
                  />{" "}
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="contactPerson"
                    label="Contact Person"
                    value={values.contactPerson}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridLeft}>
                  <Controls.Input
                    name="mobileNo"
                    label="Mobile No."
                    value={values.mobileNo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="phoneStdCode"
                    label="Phone Std Code"
                    value={values.phoneStdCode}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridLeft}>
                  <Controls.Input
                    name="phoneNo"
                    label="Phone No."
                    value={values.phoneNo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <ImageUpload />
                </Grid>
                <Grid item xs={6} style={gridStyle}>
                  <Controls.Input
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <div
                  style={{
                    marginTop: "25px",
                    marginLeft: "500px",
                    marginBottom: "25px",
                  }}
                >
                  <Controls.Button
                    type="submit"
                    text="Submit"
                    onClick={() => {
                      window.location = "/home";
                    }}
                  />
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={() => {}}
                  />
                </div>
              </Grid>{" "}
            </Paper>
          </Box>{" "}
        </Grid>
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
//   {" "}
//   <Item key={2} elevation={5}>
//     {" "}
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
