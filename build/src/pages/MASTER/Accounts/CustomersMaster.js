import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import Customersform from "./CustomersForm";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Adressform from "./adressForm";
import AdressMaster from "./adressMaster";
const statusItems = [
  { id: "ACTIVE", title: "ACTIVE" },
  { id: "INACTIVE", title: "INACTIVE" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "Type", label: "TYPE " },
  { id: "Name", label: "NAME " },
  { id: "mobNo", label: "MOB NO." },
  { id: "status", label: "STATUS", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));
const initialAdress = {
  // acCode: "",
  acName: "",
  // addressNo: "",
  addressLine2: "",
  countryCode: "",
  stateCode: "",
  regionCode: "",
  districtCode: "",
  talukaName: "",
  villageName: "",
  pincode: "",
  email: "",
  mobileno: "",
  contactNo: "",
  stateName: "",
  countryName: "",
  districtName: "",
  talukaName: "",
};
const initialValues = {
  acCode: "",
  acc: "",
  preFix: "",
  firmType: "",
  acGroup: "",
  acTypeCode: "",
  acName: "",
  fatherName: "",
  propritorName: "",
  tradeName: "",
  creditDays: "",
  creditAmount: "",
  panNo: "",
  aadharNo: "",
  gstNo: "",
  seedLicenNo: "NULL",
  bankName: "NULL",
  ifscCode: "NULL",
  bankAcNo: "NULL",
  acRegMob: "",
  mktArea: "",
  mktAreaCode: "",
  parentAreaCode: "",
  prdAreaCode: "NULL",
  acStatus: "",
  // entryBy: "1001",
  // entryOn: "2022-03-08 10:20:25",
  // editBy: "NULL",
  // editOn: "NULL",
  // deptCode: "0",
};
const OperateItems = [
  { name: "CONTROL", code: "C" },
  { name: "SUB", code: "S" },
];

export default function Customers() {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [acCodeHook, setAcCodeHook] = useState(values.acCode);
  const [value, setValue] = useState("1");
  const [records, setRecords] = useState([initialValues]);
  const [errors, setErrors] = useState({});
  const [adressData, setAdressData] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [submit, setSubmit] = useState(true);
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  const [marketArea, setMarketArea] = useState([
    {
      mktAreaCode: "",
      parrentAreaCode: "",
      mktArea: "",
      assignTo: "",
      mktAreaStatus: "",
    },
  ]);

  const handleChange = (event, newValue) => {
    // if (!Object.values(errors).every((x) => x == "")) {
    //   setValue(newValue);
    // } else {
    //   setNotify({
    //     isOpen: true,
    //     message: "plz complete the customer form",
    //     type: "error",
    //   });
    // }
    setValue(newValue);
    getAdress();
  };
  function getAdress() {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getacadress, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log("req sent Config.getacadress");
        setAdressData(response.data.acadress);
      });
  }
  // if (records.length)
  if (records.length == 1) {
    // console.log(records);
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getaccounts, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log("req sent");
        // console.log(
        //   response.data.mst_accounts.filter((item) => {
        //     return item.acGroup == "ORDINARY";
        //   })
        // );
        setRecords(
          response.data.mst_accounts.filter((item) => {
            return item.acGroup == "CUSTOMER";
          })
        );
      });
  }
  if (marketArea.length == 1) {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getmktArea, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log("req sent");
        // console.log(
        //   response.data.mst_accounts.filter((item) => {
        //     return item.acGroup == "ORDINARY";
        //   })
        // );
        console.log(response.data.mktArea);
        setMarketArea(response.data.mktArea);
      });
  }
  // if (adressData.length == 1) {
  //   const token = AuthHandler.getLoginToken();
  //   const body = { hello: "hello" };
  //   axios
  //     .post(Config.getacadress, body, {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  //     .then((response) => {
  //       console.log("req sent Config.getacadress");
  //       // console.log(
  //       //   response.data.mst_accounts.filter((item) => {
  //       //     return item.acGroup == "ORDINARY";
  //       //   })
  //       // );
  //       setAdressData(response.data.acadress);
  //     });
  // }
  const [location, setLocation] = useState({ states: [{}] });
  useEffect(() => {
    if (location.states.length == 1) {
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(Config.location, body, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          if (response.data.states.length !== location.states.length)
            setLocation(response.data);
        });
    }
  });

  console.log(marketArea);
  function onDelete(item) {
    // roleService.deleteBranch(item);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  }
  // console.log("GL" + (parseInt("G105".match(/(\d+)/)[0]) + 1).toString());
  function getTitle() {
    if (value == "1") {
      return "CustomerForm";
    } else {
      return "Address Master";
    }
  }
  // recordsAfterPagingAndSorting().map((item) => {
  //   console.log(getGlGroupName(item.glGroupCode));
  // });
  function check(field, hook) {
    let temp = { ...errors };

    temp[field] = hook[field] ? "" : "This field is required.";
    console.log(hook[field]);
    return temp[field];
  }
  const validate = (fieldValues) => {
    console.log(fieldValues.acName);
    let temp = { ...errors };
    temp.acName = check("acName", fieldValues);

    // let temp = { ...errors };
    // if ("userCode" in fieldValues)
    //   temp.userCode = fieldValues.userCode ? "" : "This field is required.";
    // if ("acName" in fieldValues)
    //   temp.acName = fieldValues.acName ? "" : "This field is required.";
    // if ("Emailid" in fieldValues)
    //   temp.Emailid = /$^|.+@.+..+/.test(fieldValues.Emailid)
    //     ? ""
    //     : "Email is not valid.";
    // if ("RePassword" in fieldValues) {
    //   if (fieldValues.RePassword == "")
    //     temp.RePassword = fieldValues.RePassword
    //       ? ""
    //       : "This field is required.";
    // }
    // if (fieldValues.RePassword !== "") {
    //   temp.RePassword =
    //     fieldValues.RePassword == fieldValues.Password
    //       ? ""
    //       : "plz enter the same password";
    // }
    // if ("Mobileno" in fieldValues) {
    //   temp.Mobileno =
    //     fieldValues.Mobileno.length == 10
    //       ? ""
    //       : "mobile no. shouldnot be  10 digit";
    // }
    setErrors({
      ...temp,
    });
    console.log(temp);
    return Object.values(temp).every((x) => x == "");
  };
  function changeTab() {
    setValue("2");
  }
  console.log(errors);
  console.log(Object.values(errors).every((x) => x == ""));
  return (
    <>
      <PageHeader
        title="Customers"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <div className="wrapper">
        <div className="content-wrapper">
          <br></br>
          <Paper className={classes.pageContent}>
            <section className="content">
              <Toolbar>
                <Controls.Input
                  label="Search Role Name"
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onChange={() => {}}
                />
                <Controls.Button
                  text="Add New"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  className={classes.newButton}
                  onClick={(e) => {
                    setButtonPopup(true);
                    setValue("1");
                    getAdress();
                    setValues({
                      ...initialValues,
                    });
                    setSubmit(false);
                  }}
                />
              </Toolbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.acCode}</TableCell>
                      <TableCell>{item.acTypeCode}</TableCell>
                      <TableCell>{item.acName}</TableCell>
                      <TableCell>{item.acRegMob}</TableCell>
                      <TableCell>{item.acStatus}</TableCell>
                      <TableCell>
                        <Controls.ActionButton
                          color="primary"
                          onClick={() => {
                            setValue("1");
                            setValues(item);
                            setButtonPopup(true);
                            getAdress();
                            setSubmit(true);
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </Controls.ActionButton>
                        <Controls.ActionButton
                          color="secondary"
                          onClick={(e) => {
                            console.log(item);
                            setConfirmDialog({
                              isOpen: true,
                              title: "Are you sure to delete this record?",
                              subTitle: "You can't undo this operation",
                              onConfirm: (e) => {
                                onDelete(item);
                                e.preventDefault();
                              },
                            });
                            e.preventDefault();
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </Controls.ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}{" "}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title={getTitle()}
            openPopup={buttonPopup}
            setOpenPopup={setButtonPopup}
            size="md"
          >
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    {" "}
                    <Tab label="Customer" value="1" />
                    <Tab label="Adress" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {" "}
                  <Customersform
                    values={values}
                    setValues={setValues}
                    records={records}
                    setRecords={setRecords}
                    statusItems={statusItems}
                    marketArea={marketArea}
                    validate={validate}
                    changeTab={changeTab}
                    submit={submit}
                    setSubmit={setSubmit}
                    notify={notify}
                    setNotify={setNotify}
                  />
                </TabPanel>
                <TabPanel value="2">
                  {" "}
                  <AdressMaster
                    adressData={adressData}
                    setAdressData={setAdressData}
                    initialAdress={initialAdress}
                    acCode={values.acCode}
                    acName={values.acName}
                    location={location}
                    getAdress={getAdress}
                    values={values}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </Popup>

          <Notification notify={notify} setNotify={setNotify} />
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </div>
      </div>
    </>
  );
}
