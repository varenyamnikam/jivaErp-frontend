import React, { useState, useEffect } from "react";
import { Grid, TextField, makeStyles } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import SubMenu from "../../components/SubMenu";
import AuthHandler from "../../Utils/AuthHandler";
import Varenyam from "./varenyam";
import Popupsidemenu from "./popupsidemenu";
import * as roleService from "../../services/roleService";
import axios from "axios";
import Config from "../../Utils/Config";

import { Handlesubmenuchange } from "./handleSubmenuchange";
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

export default function RolemasterForm(props) {
  const {
    values,
    setValues,
    records,
    setRecords,
    recordForEdit,
    addOrEditRights,
    recordsRights,
    setRecordsRights,
  } = props;

  const SidebarData = AuthHandler.getMenuItem();
  console.log(SidebarData);
  let [SubMenu, setSubMenu] = useState("SubMenu");
  const [nest, SetNest] = useState([
    {
      screenName: "bla bla",
      subNav: [{ screenName: "bla bla", subNav: [] }],
      hasChild: "N",
    },
  ]);
  const [fix, statefix] = useState({
    roleName: "",
    addRight: "",
    deleteRight: "",
    editRight: "",
    menuRight: "",
  });

  const [subNav, setSubNav] = useState("subNav");
  const [last, setLast] = useState([
    { screenName: "bla bla", subNav: [], hasChild: "N" },
  ]);
  let x = true;
  console.log(nest);
  console.log(nest.subNav);
  console.log(SubMenu);
  console.log(subNav);
  console.log(last);
  if (nest.screenName !== SubMenu)
    SidebarData.map((item) => {
      if (item.screenName === SubMenu) {
        // console.log(item.subNav[0]);
        console.log("hi........");
        SetNest(item);
      }
    });
  if (nest.hasChild == "Y") {
    console.log(nest.subNav);

    if (last.screenName !== subNav)
      nest.subNav.map((item) => {
        if (item.screenName === subNav) {
          // console.log(item.subNav[0]);
          console.log("hi........");
          setLast(item);
        }
      });
  }
  if (last.hasChild == "Y") {
    x = false;
  }

  //
  console.log(recordsRights);
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

  const { errors, setErrors, handleInputChange } = useForm(
    initialFValues,
    true,
    validate
  );
  const handleSubmitRights = (e) => {
    e.preventDefault();
    if (validate()) {
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(
          Config.userRightsUrl,
          { values },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then(function (response) {});
      console.log(
        recordsRights.filter(
          (item) =>
            item.roleCode == values.roleCode && item.roleName == values.roleName
        )
      );
      const newRecords = recordsRights.filter(
        (item) =>
          item.roleCode !== values.roleCode || item.roleName !== values.roleName
      );
      console.log(newRecords);
      setRecordsRights([...newRecords, values]);
    }
  };
  // recordsRights.map((item) => {
  //   console.log(item.roleCode, values.roleCode, item.roleName, values.roleName);
  //   console.log(
  //     item.roleCode !== values.roleCode,
  //     item.roleName !== values.roleName
  //   );
  //   console.log(
  //     item.roleCode !== values.roleCode && item.roleName !== values.roleName
  //   );
  // });
  // console.log(
  //   recordsRights.filter(
  //     (item) =>
  //       item.roleCode !== values.roleCode && item.roleName !== values.roleName
  //   )
  // );
  const resetForm = (e) => {
    // console.log(e.target.value);
    // console.log(fix);
    const id = fix.id;
    // const roleCode = fix.roleCode;
    // const roleName = subNav;
    const yelo = { roleCode: fix.roleCode, roleName: subNav };
    console.log(yelo);
    // setRecordsRights((prev) => {
    //   console.log("delete:");
    //   return prev.filter(function (item) {
    //     if (item._id !== id) {
    //       return item;
    //     } else {
    //       console.log(item);
    //     }
    //   });
    // });
    // setValues({});
    // statefix({});
    // roleService.deleteUserRights(yelo);
  };

  useEffect(() => {
    console.log(subNav);
    let x = true;

    if (values.roleName !== subNav) {
      recordsRights.map((recordsRight) => {
        if (
          recordsRight.roleCode == values.roleCode &&
          recordsRight.roleName == subNav
        ) {
          setValues(recordsRight);
          console.log(recordsRight);
          x = false;
        }
      });
      if (x)
        setValues({
          ...initialFValues,
          roleName: subNav,
          roleCode: values.roleCode,
        });
    }
  }, [subNav]);
  ////////////////////////////////////////////////////////////////////
  if (x) {
    return (
      <Form onSubmit={handleSubmitRights}>
        <Grid container>
          <Grid item xs={3}>
            <div className="sidebar">
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  <Popupsidemenu
                    data={SidebarData}
                    setSubMenu={setSubMenu}
                  ></Popupsidemenu>
                </ul>
              </nav>
            </div>
          </Grid>

          <Grid item xs={3}>
            <h3>{SubMenu} ▼</h3>
            <Popupsidemenu
              data={nest.subNav}
              setSubMenu={setSubNav}
            ></Popupsidemenu>
          </Grid>

          <Grid item xs={5}>
            <h3>
              {values.roleCode}'s right of {subNav}
            </h3>

            <Varenyam
              errors={errors.roleName}
              values={values}
              setValues={setValues}
              recordsRights={recordsRights}
              data={SidebarData}
              SubMenu={SubMenu}
              nest={nest}
              SetNest={SetNest}
              subNav={subNav}
              fix={fix}
              statefix={statefix}
            />

            <div>
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button
                value="Hello World"
                text="Reset"
                color="default"
                onClick={resetForm}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    );
  } else {
    return (
      <Form onSubmit={handleSubmitRights}>
        <Grid container>
          <Grid item xs={3}>
            <div className="sidebar">
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  <Popupsidemenu
                    data={SidebarData}
                    setSubMenu={setSubMenu}
                  ></Popupsidemenu>
                </ul>
              </nav>
            </div>
          </Grid>

          <Grid item xs={3}>
            <h3>{SubMenu} ▼</h3>
            <Popupsidemenu
              data={nest.subNav}
              setSubMenu={setSubNav}
            ></Popupsidemenu>
          </Grid>
          <Grid item xs={3}>
            <h3>{last.screenName} ▼</h3>

            <Popupsidemenu
              data={last.subNav}
              setSubMenu={setSubNav}
            ></Popupsidemenu>
          </Grid>

          <Grid item xs={5}>
            <h3>
              {values.roleCode}'s right of {subNav}
            </h3>

            <Varenyam
              errors={errors.roleName}
              values={values}
              setValues={setValues}
              recordsRights={recordsRights}
              data={SidebarData}
              SubMenu={SubMenu}
              nest={nest}
              SetNest={SetNest}
              subNav={subNav}
              fix={fix}
              statefix={statefix}
            />

            <div>
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button
                value="Hello World"
                text="Reset"
                color="default"
                onClick={resetForm}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    );
  }
}
