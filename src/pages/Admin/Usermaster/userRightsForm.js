import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../../components/useForm";
import Controls from "../../../components/controls/Controls";
import * as roleService from "../../../services/roleService";
import { Grid, makeStyles } from "@material-ui/core";
import ControlledTreeView from "./userRightsTree";
import AuthHandler from "../../../Utils/AuthHandler";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Config from "../../../Utils/Config";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const useStyles = makeStyles((theme) => ({
  right: { display: "flex", justifyContent: "flex-end" },
}));

export default function RightsForm(props) {
  const usrCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${usrCode}`;
  const { userCode, setUserRights, userRights, setNotify, setPopup } = props;
  const initialUserRights = {
    id: 0,
    userCode: userCode,
    screenCode: "",
    screenName: "",
    menuRight: "Y",
    editRight: "Y",
    addRight: "Y",
    deleteRight: "Y",
  };
  const classes = useStyles();
  let data = AuthHandler.getMenuItem();
  const [values, setValues] = React.useState(initialUserRights);
  const [errors, setErrors] = React.useState({});
  console.log(values);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("userCode" in fieldValues)
      temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    if ("screenName" in fieldValues)
      temp.screenName = fieldValues.screenName ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  // console.log(new Date(new Date().getFullYear() + 1, 2, 31));
  const start =
    String(Array.from(String(new Date().getFullYear()), Number)[2]) +
    String(Array.from(String(new Date().getFullYear()), Number)[3]);
  const end =
    String(Array.from(String(new Date().getFullYear() + 1), Number)[2]) +
    String(Array.from(String(new Date().getFullYear() + 1), Number)[3]);

  console.log(
    start + end,
    "20" + start + "-" + end,
    new Date(new Date().getFullYear() + 1, 3, 1),
    new Date(new Date().getFullYear(), 2, 31)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      let x = true;
      const updatedRights = userRights.map((item) => {
        console.log(item);
        if (
          values.screenCode == item.screenCode &&
          values.userCode == item.userCode
        ) {
          x = false;
          return values;
        } else {
          return item;
        }
      });
      console.log(updatedRights);
      if (!x) setUserRights(updatedRights);
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(
          Config.userRightsUrl + query,
          { values },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          console.log("hi....", values);
          if (x) setUserRights([...userRights, values]);
          setNotify({
            isOpen: true,
            message: "User rights updated  successfully",
            type: "success",
          });
          setPopup(false);
        })
        .catch(function (error) {
          console.log(error);
          setNotify({
            isOpen: true,
            message: "Unable to connect to servers",
            type: "warning",
          });
        });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  function findScreenCode(name) {
    let y = "";
    let x;
    data.map((item) => {
      if (!"subnav" in item) {
        x = recursiveSearch(item.subNav, name);
        if (x) y = x;
      }
    });
    console.log(y);
    return y;
  }
  const recursiveSearch = (nodes, name) => {
    // if (nodes.screenName == name) {
    //   console.log("hi");
    //   return nodes.screenCode;
    // } else {
    // if (Array.isArray(nodes.subNav)) {
    //   nodes.subNav.map((node) => recursiveSearch(node, name));
    // }
    // }
    let x = "";
    nodes.map((item) => {
      if (item.screenName == name) {
        x = item.screenCode;
        console.log("hi");
      }
    });
    return x;
  };
  const resetForm = (e) => {
    setValues(initialUserRights);
  };
  console.log(userRights);
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <ControlledTreeView
            values={values}
            setValues={setValues}
            userRights={userRights}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.Input
                name="userCode"
                label="User Code"
                value={values.userCode}
                onChange={handleInputChange}
                error={errors.userCode}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.Input
                name="screenName"
                label="Screen Name"
                value={values.screenName}
                onChange={handleInputChange}
                error={errors.screenName}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.RadioGroup
                name="menuRight"
                label="Display In Menu"
                value={values.menuRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.RadioGroup
                name="editRight"
                label="Rights for Edit Records"
                value={values.editRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.RadioGroup
                name="addRight"
                label="Rights for Add Record"
                value={values.addRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.right}>
              <Controls.RadioGroup
                name="deleteRight"
                label="Rights for Delete Records"
                value={values.deleteRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6}></Grid>

            <Grid item xs={12} sm={6} className={classes.right}>
              <div>
                <Controls.Button
                  text="Reset"
                  color="default"
                  onClick={resetForm}
                />
                <Controls.Button type="submit" text="Submit" />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}
