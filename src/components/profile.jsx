import React, { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import "./profile.scss";
import { Grid } from "@material-ui/core";
import Controls from "./controls/Controls";
import AuthHandler from "../Utils/AuthHandler";
import axios from "axios";
import Countries from "./countrySelect";
import States from "./statesSelect";
import Config from "../Utils/Config";
import UnusedAutosuggest from "./specialAutoSuggest";
import NormalAutoSuggest from "./normalAutoSuggest";
import ButtonLoader from "./loading";
import ImageUpload from "./getImages";
const Profile = () => {
  const recentImageDataUrl = localStorage.getItem("recent-image");
  let company = JSON.parse(reactLocalStorage.get("company"));
  const userCode = localStorage.getItem("userCode");
  const query = `?userCompanyCode=${company.companyCode}&userCode=${userCode}`;
  const userCompanyName = reactLocalStorage.get("userCompanyName");
  const [values, setValues] = useState(company);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({
    country: [{}],
    districts: [{}],
    states: [{ stateName: "X X X X" }],
    talukas: [{}],
  });
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(true);

  const gstType = ["UnRegistered", "Regular", "Composition"];
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
    // !save && setSave(true);
  }
  useEffect(() => {
    if (location.states[0].stateName == "X X X X") {
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

  function getImage() {
    if (recentImageDataUrl) {
      return recentImageDataUrl;
    } else
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }
  const handleSubmit = () => {
    setLoading(true);
    setSave(false);

    reactLocalStorage.set("company", JSON.stringify(values));
    const token = AuthHandler.getLoginToken();
    axios
      .patch(
        Config.register + query,
        { values: values },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setValues(values);
      });
  };
  useEffect(() => {
    !save && setSave(true);
  }, [values]);

  return (
    <>
      <div>
        <div>
          <Grid container>
            <Grid Item xs={12} sm={4}>
              <ImageUpload recentImage={getImage()} />
            </Grid>
            <Grid Item xs={12} sm={8} style={{ justifyContent: "left" }}>
              <Grid container spacing={2}>
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
              </Grid>
            </Grid>
            <Grid Item xs={12} sm={12} style={{ justifyContent: "left" }}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Countries
                    value={values}
                    setValue={setValues}
                    options={location.country}
                    error={errors.countryName}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <States
                    value={values}
                    setValue={setValues}
                    options={location.states}
                    countries={location.country}
                    country={values.countryName}
                    error={errors.stateName}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="district"
                    label="District"
                    value={values.district}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="taluka"
                    label="Taluka"
                    value={values.taluka}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="pincode"
                    label="Pincode"
                    value={values.pincode}
                    onChange={handleInputChange}
                    fullWidth
                    error={errors.pincode}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="regMobileNo"
                    label="Registered Mobile No."
                    value={values.mobileNo}
                    onChange={handleInputChange}
                    error={errors.regMobileNo}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <NormalAutoSuggest
                    style={{ display: "flex", alignItems: "center" }}
                    options={gstType}
                    setValue={setValues}
                    value={values}
                    label="GST Registration Type"
                    name="gstRegType"
                    fullWidth
                    error={errors.gstRegType}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="gstInNo"
                    label="GSTin No"
                    value={values.gstInNo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="contactNo"
                    label="Phone No."
                    value={values.contactNo}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controls.Input
                    name="email"
                    label="Email"
                    value={values.email}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  sm={4}
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                ></Grid>
                <Grid
                  item
                  sm={4}
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ButtonLoader
                    style={{ width: "50%" }}
                    loading={loading}
                    setLoading={setLoading}
                    onClick={handleSubmit}
                    save={save}
                    setSave={setSave}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};
export default Profile;
