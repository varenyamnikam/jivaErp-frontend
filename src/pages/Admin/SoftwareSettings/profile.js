import React, { useState, useEffect } from "react";
import "../../../components/profile.scss";
import { Grid } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Countries from "../../../components/countrySelect";
import States from "../../../components/statesSelect";
import Config from "../../../Utils/Config";
import UnusedAutosuggest from "../../../components/specialAutoSuggest";
import NormalAutoSuggest from "../../../components/normalAutoSuggest";
import ButtonLoader from "../../../components/loading";
import ImageUpload from "../../../components/getImages";
import { NotifyMsg } from "../../../components/notificationMsg";
import * as roleService from "../../../services/roleService";
const Profile = ({ setNotify }) => {
  const recentImageDataUrl = AuthHandler.getImage();
  let company = AuthHandler.getCompany();
  console.log(company);
  const [values, setValues] = useState(company);
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState({
    countries: [{ countryName: "" }],
    districts: [{}],
    states: [{ stateName: "" }],
    talukas: [{}],
  });
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [save, setSave] = useState(true);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(values).map((x) => {
      check(x);
    });
    const hasRight = AuthHandler.canEdit();
    console.log(hasRight);
    if (!hasRight) setNotify(NotifyMsg(7));

    setErrors({
      ...temp,
    });
    console.log(temp);
    return Object.values(temp).every((x) => x == "") && hasRight;
  };

  const gstType = ["UnRegistered", "Regular", "Composition"];
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
    // !save && setSave(true);
  }
  const url = Config.register;

  const handleErr = (error) => {
    setNotify(NotifyMsg(4));
    setLoading(false);
  };

  if (loading) {
    const handleRes = (response) => {
      let company = response.data.company;
      let location = response.data.location;

      console.log(response.data);
      if (location) setLocation(location);
      if (company) {
        setValues(company);
        AuthHandler.setCompany(company);
      }
    };

    roleService.axiosGet(url, handleRes, handleErr, () => {
      setLoading(false);
    });
  }
  function getImage() {
    if (recentImageDataUrl) {
      return recentImageDataUrl;
    } else
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }
  const handleSubmit = () => {
    if (validate()) {
      setButtonLoading(true);
      setSave(false);
      console.log("hi");
      AuthHandler.setCompany(values);
      const url = Config.register;
      const handleRes = (response) => {
        setButtonLoading(false);
        setValues(values);
      };
      roleService.axiosPatch(url, values, handleRes, handleErr, () => {});
    }
  };
  useEffect(() => {
    !save && setSave(true);
  }, [values]);

  return (
    <>
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
              fullWidth
              disabled={true}
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
              options={location.countries}
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
              countries={location.countries}
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
          <Grid item xs={12} sm={4}>
            <Controls.Input
              name="declaration"
              label="Invoice Declaration"
              value={values.declaration}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>{" "}
          <Grid item xs={12} sm={4}>
            <Controls.Input
              name="footer"
              label="Invoice Footer"
              value={values.footer}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>{" "}
          <Grid
            item
            sm={12}
            xs={6}
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ButtonLoader
              loading={buttonLoading}
              setLoading={setButtonLoading}
              onClick={handleSubmit}
              save={save}
              setSave={setSave}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default Profile;
