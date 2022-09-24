import React, { useState, useEffect } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import SubMenu from "../../components/SubMenu";
import AuthHandler from "../../Utils/AuthHandler";
import Select from "../../components/controls/Select";
import {
  SettingsBrightnessTwoTone,
  SettingsEthernet,
  SignalWifiStatusbarConnectedNoInternet4Rounded,
} from "@mui/icons-material";
import { formatDistanceStrict } from "date-fns/esm";
import Popupsidemenu from "./popupsidemenu";

const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const initialFValues = {
  id: 0,
  roleCode: "",
  roleName: "",
  menuRight: "",
  editRight: "",
  addRight: "",
  deleteRight: "",
};

let fix = {
  id: 0,
  roleCode: "",
  roleName: "",
  menuRight: "Y",
  editRight: "Y",
  addRight: "Y",
  deleteRight: "Y",
};

export default function Varenyam(props) {
  const {
    values,
    handleChange,
    recordsRights,
    errors,
    hi,
    SubMenu,
    data = [],
    nest,
    SetNest,
    subNav,
    hasChild,
    fix,
    statefix,
  } = props;

  console.log(fix);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("roleCode" in fieldValues)
      temp.roleCode = fieldValues.roleCode ? "" : "This field is required.";
    if ("roleName" in fieldValues)
      temp.roleName = fieldValues.roleName ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const {
    // values,
    setValues,
    // errors,
    setErrors,
    // handleInputChange,
    inputRef,
  } = useForm(initialFValues, true, validate);
  let x = true;
  console.log(values);
  console.log(recordsRights);
  console.log(values.roleCode, subNav);
  recordsRights.map((recordsRight) => {
    if (
      recordsRight.roleCode == values.roleCode &&
      recordsRight.roleName == subNav
    ) {
      console.log(recordsRight);

      x = false;
      setFix(recordsRight, x);
    }
  });
  function setFix(recordsRight) {
    if (
      recordsRight.roleCode == values.roleCode &&
      recordsRight.roleName !== fix.roleName
      // recordsRight._id !== fix.id
      // recordsRight.menuRight !== fix.menuRight &&
      // recordsRight.addRight !== fix.addRight &&
      // recordsRight.deleteRight !== fix.deleteRight &&
      // recordsRight.editRight !== fix.editRight
    ) {
      console.log("fixed");
      console.log(recordsRight);

      statefix({
        id: recordsRight._id,
        roleCode: recordsRight.roleCode,
        roleName: recordsRight.roleName,
        addRight: recordsRight.addRight,
        deleteRight: recordsRight.deleteRight,
        editRight: recordsRight.editRight,
        menuRight: recordsRight.menuRight,
      });
    } else {
      console.log(x);
      console.log(recordsRight._id, fix.id);
    }
  }

  if (x) {
    console.log("values");
    return (
      <div>
        <Controls.Input
          name="roleCode"
          label="Role Code"
          value={values.roleCode}
          // value={{ roleCode: values.roleCode }}
          error={errors}
          onChange={handleChange}
        />{" "}
        <Controls.Input
          name="roleName"
          // label="Role Code"
          value={subNav}
          error={errors}
          onClick={handleChange}
        />
        <Controls.RadioGroup
          name="menuRight"
          label="Display In Menu"
          value={values.menuRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="editRight"
          label="Rights for Edit Records"
          value={values.editRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="addRight"
          label="Rights for Add Record"
          value={values.addRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="deleteRight"
          label="Rights for Delete Record"
          value={values.deleteRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
      </div>
    );
  } else {
    console.log(fix);

    return (
      <div>
        <Controls.Input
          name="roleCode"
          label="Role Code"
          value={values.roleCode}
          error={errors}
          onChange={handleChange}
        />
        <Controls.Input
          name="roleName"
          label="Role Name"
          value={subNav}
          error={errors}
        />
        <Controls.RadioGroup
          name="menuRight"
          label="Rights for Edit Records"
          value={fix.menuRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="editRight"
          label="Rights for Edit Records"
          value={fix.editRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="addRight"
          label="Rights for Edit Records"
          value={fix.addRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
        <Controls.RadioGroup
          name="deleteRight"
          label="Rights for Edit Records"
          value={fix.deleteRight}
          onChange={handleChange}
          items={menuRightsItems}
        />
      </div>
      // <h1>hello world!</h1>
    );
  }
}
// <p>
//   {values.roleCode}'s right of {subNav}
// </p>
// <Popupsidemenu
//   data={nest.subNav}
//   setSubMenu={setSubNav}
// ></Popupsidemenu>
// <h5>menuRight</h5>
// <p>🔴 {fix.menuRight}</p>
// <h5>editRight</h5>
// <Controls.RadioGroup
//   name="editRight"
//   label="Rights for Edit Records"
//   value={fix.editRight}
//   onChange={handleChange}
//   items={menuRightsItems}
// />
// <p>🔴 {fix.editRight}</p>
// <h5>addRight</h5>
// <p>🔴 {fix.addRight}</p>
// <h5>deleteRight</h5>
// <p>🔴 {fix.deleteRight}</p>
