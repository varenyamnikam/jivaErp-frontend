import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "../../../Utils/Config";
import AuthHandler from "../../../Utils/AuthHandler";
import { makeStyles } from "@material-ui/core";
export default function GetData() {
  const token = AuthHandler.getLoginToken();
  const body = { hello: "hello" };
  // const [location, setLocation] = React.useState({ states: [{}] });
  // useEffect(() => {
  //   const token = AuthHandler.getLoginToken();
  //   const body = { hello: "hello" };
  //   axios
  //     .post(Config.location, body, {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  //     .then((response) => {
  //       setLocation(response.data);
  //     });
  // });
  // console.log(location);
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.branchCode !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };

  const initialFilterValues = {
    pesticideLicenceNo: "",
    seedLicenceNo: "",
    GSTno: "",
    pinCode: "",
    adressLine2: "",
    adressLine1: "",
    branchName: "",
    branchCode: "",
    branchType: "",
    // talukaName: "",
    allFields: "",
    stateName: "",
    countryName: "",
    acBranchName: "",
    acBranchCode: "",
  };

  const initialBranchValues = {
    contactNo: "",
    Mobileno: "",
    // pesticideLicenceNo: "",
    // seedLicenceNo: "",
    acBranchName: "",
    acBranchCode: "",
    Emailid: "",
    GSTno: "",
    pinCode: "",
    adressLine2: "",
    adressLine1: "",
    branchName: "",
    branchCode: "",
    branchType: "",
    stateCode: 0,
    stateName: "",
    countryName: "",
    districtName: "",
    talukaName: "",
  };

  const useStyles = makeStyles((theme) => ({
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
    searchInput: {
      width: "100%",
    },
    newButton: {
      // position: "absolute",
      // margin: "15px",
      // right: "10px",
    },
  }));
  const headCells = [
    { id: "Code", label: "CODE" },
    { id: "Name", label: "NAME" },
    { id: "Type", label: "TYPE", disableSorting: true },
    { id: "Taluka", label: "Ac Branch" },
    { id: "Edit", label: "EDIT" },
  ];
  const defaultValue = {
    states: [
      {
        stateCode: "27",
        countryCode: "91",
        stateName: "MAHARASHTRA",
        stateStatus: "ACTIVE",
      },
    ],
    country: [
      {
        countryCode: "91",
        countryName: "INDIA",
        countryStatus: "ACTIVE",
      },
    ],
  };
  return {
    initialFilterFn,
    initialBranchValues,
    initialFilterValues,
    useStyles,
    headCells,
    defaultValue,
    // location,
  };
}
