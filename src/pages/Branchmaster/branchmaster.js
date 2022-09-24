import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import Branchform from "./branchform";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Popup from "../../components/Popup";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import { Grid, Card } from "@material-ui/core";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import "../../components/home.scss";
import Table from "@mui/material/Table";
import MuiSkeleton from "../../components/skeleton";

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
  branchCode: "X X X X",
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
  { id: "Taluka", label: "TALUKA" },
  { id: "Edit", label: "EDIT" },
];

const Branchmaster = (props) => {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialBranchValues);
  const [branchNames, setBranchNames] = useState([]);
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
  const [records, setRecords] = useState([initialBranchValues]);
  const [count, setCount] = useState(records[records.length - 1]);
  const [location, setLocation] = useState({
    states: [""],
    country: [""],
  });
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(recordsAfterPagingAndSorting());
  if (records[0] && records[0].branchCode == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.Branch + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.adm_branch.length !== 0) {
          console.log("hi....", records[0].branchCode);
          setRecords(response.data.adm_branch);
        } else {
          console.log("hello....", records[0].branchCode);
          setRecords([{ ...initialBranchValues, branchCode: "" }]);
        }
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  if (!location.states[0] && !location.country[0]) {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.location + query, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (
          response.data.states.length !== 0 &&
          response.data.country.length !== 0
        )
          setLocation(response.data);
        else {
          setLocation({
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
          });
        }
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }

  console.log(values);
  const { states, districts, talukas, country } = location;
  // console.log(location, states, districts, talukas, country);
  console.log(states, country);

  console.log(records);
  function onDelete(item) {
    const token = AuthHandler.getLoginToken();
    axios
      .put(
        Config.Branch + query,
        { item },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.branchCode !== item.branchCode;
    });
    console.log(newRecord);
    if (newRecord.length == 0) {
      setRecords([initialBranchValues]);
    } else {
      setRecords(newRecord);
    }

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  }
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  console.log(filter.allFields);
  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item.branchType, allfields);
          if (
            item.branchType.toLowerCase().includes(allfields.toLowerCase()) ||
            item.branchCode.includes(allfields.toLowerCase()) ||
            item.talukaName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.branchName.toLowerCase().includes(allfields.toLowerCase())
          )
            return item;
          // item.talukaName == filter.allfields ||
          // item.branchName == filter.allfields
        });
        console.log(newRecords);
        return newRecords;
      },
    });
  }
  console.log(count);
  function getCancel() {
    if (filter.allFields) {
      return (
        <InputAdornment position="end">
          <IconButton
            onClick={() => {
              setFilter(initialFilterValues);
              setFilterFn({
                fn: (items) => {
                  return items;
                },
              });
            }}
            style={{ boxShadow: "none" }}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      );
    } else {
      return <></>;
    }
  }
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Branch Master"
              icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <section className="content">
              <div className="card">
                <div className="card-body">
                  <section className="content">
                    <Toolbar>
                      <Grid container style={{ display: "flex", flexGrow: 1 }}>
                        <Grid item xs={12} sm={8}>
                          <Controls.Input
                            label="Search Role Name"
                            className={classes.searchInput}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search />
                                </InputAdornment>
                              ),
                              endAdornment: getCancel(),
                            }}
                            value={filter.allFields}
                            onChange={handleFilter}
                          />
                        </Grid>{" "}
                        <Grid
                          item
                          sm={4}
                          xs={12}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Controls.Button
                            text="Add New"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              setButtonPopup(true);
                              setValues(initialBranchValues);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>

                    <Grid container>
                      <TableContainer>
                        <TblContainer>
                          <TblHead />
                          {records[0].branchCode == "X X X X" ? (
                            <MuiSkeleton />
                          ) : (
                            <TableBody>
                              {recordsAfterPagingAndSorting().map((item) => (
                                <TableRow key={item._id}>
                                  <TableCell>{item.branchCode}</TableCell>
                                  <TableCell>{item.branchName}</TableCell>
                                  <TableCell>{item.branchType}</TableCell>
                                  <TableCell>{item.talukaName}</TableCell>
                                  <TableCell>
                                    <Controls.ActionButton
                                      color="primary"
                                      onClick={() => {
                                        setValues(item);
                                        setButtonPopup(true);
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
                                          title:
                                            "Are you sure to delete this record?",
                                          subTitle:
                                            "You can't undo this operation",
                                          onConfirm: (e) => {
                                            onDelete(item);
                                            e.preventDefault();
                                            console.log("records:" + records);
                                          },
                                        });
                                        e.preventDefault();
                                      }}
                                    >
                                      <DeleteIconOutline fontSize="small" />
                                    </Controls.ActionButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          )}
                        </TblContainer>
                      </TableContainer>
                    </Grid>
                    <TblPagination />
                  </section>
                  <Popup
                    title="Branch form"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    size="md"
                  >
                    <Branchform
                      records={records}
                      setRecords={setRecords}
                      values={values}
                      setValues={setValues}
                      initialValues={initialBranchValues}
                      initialFilterValues={initialFilterValues}
                      branchNames={branchNames}
                      count={count}
                      setCount={setCount}
                      country={location.country}
                      states={location.states}
                      setButtonPopup={setButtonPopup}
                      setNotify={setNotify}
                    />
                  </Popup>
                  <Notification notify={notify} setNotify={setNotify} />
                  <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Branchmaster;
// <Usermasterpopup
// title="User form"
// openPopup={buttonPopup}
// setOpenPopup={setButtonPopup}
// count={count}
// setCount={setCount}
// values={values}
// records={records}
// >
