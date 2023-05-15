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
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import { NotifyMsg } from "../../../components/notificationMsg";
import { useNavigate } from "react-router-dom";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const useStyles = makeStyles((theme) => ({
  right: { display: "flex", justifyContent: "flex-end" },
}));

export default function RightsForm(props) {
  const {
    userCode,
    setUserRights,
    userRights,
    right,
    setNotify,
    setPopup,
    userCodeOptions,
  } = props;
  const initialUserRights = {
    userCode: userCode,
    copyUserRights: "",
    screenCode: "",
    screenName: "",
    menuRight: "N",
    editRight: "N",
    addRight: "N",
    deleteRight: "N",
  };

  const classes = useStyles();
  const page = useNavigate();

  const [values, setValues] = React.useState(initialUserRights);
  const [errors, setErrors] = React.useState({});
  console.log(values, right);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("userCode" in fieldValues)
      temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    if ("screenName" in fieldValues && !fieldValues.copyUserRights)
      temp.screenName = fieldValues.screenName ? "" : "This field is required.";
    setErrors({
      ...temp,
    });
    const hasRight = AuthHandler.canEdit();
    console.log(hasRight);
    if (!hasRight)
      fieldValues.userCode ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    if (fieldValues == values)
      return Object.values(temp).every((x) => x == "") && hasRight;
  };
  console.log(userRights);

  const handleSubmit = (e) => {
    console.log(userRights);
    e.preventDefault();
    if (validate()) {
      let x = true;
      function remove(arr) {
        let newArr = arr.filter((item) => item !== values.screenCode);
        return newArr;
      }
      function add(arr) {
        if (!arr.includes(values.screenCode)) arr.push(values.screenCode);
        return arr;
      }
      let newUserRights;

      if (values.copyUserRights) {
        let found = userRights.find(
          (item) => item.userCode == values.copyUserRights
        );
        newUserRights = found ? found : right;
        newUserRights.userCode = userCode;
        console.log(userRights, newUserRights);

        if (!found) {
          setNotify(NotifyMsg(5));
          x = false;
        }
      } else {
        newUserRights = {
          userCode: userCode,
          menuRight:
            values.menuRight == "Y"
              ? add(right.menuRight)
              : remove(right.menuRight),
          editRight:
            values.editRight == "Y"
              ? add(right.editRight)
              : remove(right.editRight),
          addRight:
            values.addRight == "Y"
              ? add(right.addRight)
              : remove(right.addRight),
          deleteRight:
            values.deleteRight == "Y"
              ? add(right.deleteRight)
              : remove(right.deleteRight),
        };
      }
      console.log(userRights);
      let updatedRights = userRights.filter(
        (item) => item.userCode !== newUserRights.userCode
      );
      updatedRights.push(newUserRights);
      console.log(newUserRights, updatedRights);

      // if (!x) setUserRights(updatedRights);
      const token = AuthHandler.getLoginToken();
      // const body = { hello: "hello" };
      if (x) {
        const handleRes = (response) => {
          console.log("hi....", values);
          setNotify(NotifyMsg(2));
          setPopup(false);
          setUserRights(updatedRights);
          if (userCode == JSON.parse(localStorage.getItem("user")).userCode) {
            alert("plz login again");
            localStorage.clear();
            page("/");
          }
        };

        const url = Config.userRightsUrl;
        const handleErr = (err) => {
          console.log(err);
          setNotify(NotifyMsg(4));
        };
        roleService.axiosPost(
          url,
          { newUserRights },
          handleRes,
          handleErr,
          () => {},
          token
        );
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
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
  console.log(right);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <ControlledTreeView
            values={values}
            setValues={setValues}
            right={right}
            initialUserRights={initialUserRights}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Controls.Input
                name="userCode"
                label="User Code"
                value={values.userCode}
                onChange={handleInputChange}
                error={errors.userCode}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controls.Input
                name="screenName"
                label="Screen Name"
                value={values.screenName}
                onChange={handleInputChange}
                error={errors.screenName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UnusedAutosuggest
                name="copyUserRights"
                label="Copy Rights From-"
                value={values}
                setValue={setValues}
                options={userCodeOptions}
                error={errors.copyUserRights}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controls.RadioGroup
                name="menuRight"
                label="Display In Menu"
                value={values.menuRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls.RadioGroup
                name="editRight"
                label="Rights for Edit Records"
                value={values.editRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controls.RadioGroup
                name="addRight"
                label="Rights for Add Record"
                value={values.addRight}
                onChange={handleInputChange}
                items={menuRightsItems}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                <Controls.Button
                  type="submit"
                  text="Submit"
                  onClick={(e) => {
                    console.log(userRights);
                    handleSubmit(e);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
