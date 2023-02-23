import React, { useEffect, useState } from "react";
import { getUser, removeUserSession } from "../../Utils/Common";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import Userform from "./Userform";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  TableCell,
  makeStyles,
  TableBody,
  TableRow,
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
import "./table.scss";
import { Grid } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import MuiSkeleton from "../../components/skeleton";
import ControlledTreeView from "./userRightsTree";
import RightsForm from "./userRightsForm";
import Popup from "../../components/Popup.js";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
const initialValues = {
  AllowBranchChange: "",
  AllowYearChange: "",
  // BranchRights: "",
  defaultBranchCode: "",
  defaultBranchName: "",
  defaultYearCode: "",
  defaultYearEnd: null,
  defaultYearStart: null,
  defaultFinYear: "",
  Emailid: "",
  Mobileno: "",
  Password: "",
  RePassword: "",
  Status: "",
  userName: "",
  userCode: "X X X X",
};
const initialUserRights = {
  id: 0,
  userCode: "",
  screenName: "",
  menuRight: "Y",
  editRight: "Y",
  addRight: "Y",
  deleteRight: "Y",
};

const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.userCode !== "") return item;
    });
    console.log(newRecords);
    return newRecords;
  },
};

const initialFilterValues = {
  ...initialValues,
  userCode: "",
  allfields: "",
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
    position: "absolute",
    right: "10px",
  },
  rights: {
    padding: "5px",
    borderRadius: "5px",
    fontSize: "15px",
    color: "rgb(0, 119, 128)",
    backgroundColor: "rgba(0, 119, 128, 0.363)",
    boxShadow: "none",
    height: "30px",
    // width: "32px",
  },
}));
const headCells = [
  { id: "roleCode", label: "CODE" },
  { id: "Role", label: "ROLE" },
  { id: "Name", label: "NAME", disableSorting: true },
  { id: "Status", label: "STATUS" },
  { id: "EDIT", label: "EDIT" },
];
// const userCompanyCode = AuthHandler.getUserCompanyCode();
const Usermaster = (props) => {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");

  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  console.log(query, userCompanyCode, userCode);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  console.log(filter);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [popup, setPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [branchNames, setBranchNames] = useState([]);
  const [userRights, setUserRights] = useState([initialUserRights]);
  const [finYear, setFinYear] = useState([]);
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
  const [records, setRecords] = useState([initialValues]);
  const [count, setCount] = useState(records[records.length - 1].userCode);
  // console.log(records);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(recordsAfterPagingAndSorting());
  React.useEffect(() => {
    const token = AuthHandler.getLoginToken();
    console.log(Config.usermasterUrl);
    const body = { hello: "hello" };
    console.log(records[0].userCode);
    if (records[0] && records[0].userCode == "X X X X") {
      console.log(query);
      axios
        .get(Config.usermasterUrl + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          const branchOption = [];
          response.data.adm_branch.map((item) => {
            branchOption.push({
              option: item.branchCode,
              spacedOption: item.branchName,
              disabled: false,
            });
          });
          setBranchNames(branchOption);
          setFinYear(response.data.adm_finYear);
          if (response.data.adm_usermaster.length !== 0) {
            console.log("hi....");
            setRecords(response.data.adm_usermaster);
          } else {
            console.log("hi....0 users");
            setRecords([initialFilterValues]);
          }
          if (response.data.adm_userrights)
            setUserRights(response.data.adm_userrights);
        })
        .catch(function (error) {
          setNotify({
            isOpen: true,
            message: "Unable to connect to servers",
            type: "warning",
          });
        });
    }
  }, []);
  useEffect(() => {
    setCount(records[records.length - 1].userCode);
    console.log("hi....", records[records.length - 1].userCode);
  }, [records]);
  console.log(records);
  function onDelete(item) {
    roleService.deleteuser(item);
    let newRecord = [];
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    newRecord = records.filter((record) => {
      return record.userCode !== item.userCode;
    });
    if (newRecord.length == 0) {
      setRecords([initialValues]);
    } else {
      setRecords(newRecord);
    }
  }
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  console.log(filter.allfields);
  console.log(finYear);

  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (
            item.Role.toLowerCase().includes(allfields.toLowerCase()) ||
            item.userCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.userName.toLowerCase().includes(allfields.toLowerCase())
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
  function getCancel() {
    if (filter.allFields) {
      return (
        <InputAdornment position="end">
          <IconButton
            onClick={() => {
              setFilter({ initialFilterValues, allFields: "" });
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
              title="User Master"
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
                        </Grid>
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
                              setValues(initialValues);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>

                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0].userCode == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {recordsAfterPagingAndSorting().map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.userCode}</TableCell>
                                <TableCell
                                  onClick={() => {
                                    setValues(item);
                                    setPopup(true);
                                  }}
                                >
                                  {Number(item.userCode) !== 1001 && (
                                    <IconButton
                                      className={classes.rights}
                                      aria-label="Example"
                                    >
                                      <AdminPanelSettingsIcon />
                                      Rights
                                    </IconButton>
                                  )}
                                </TableCell>
                                <TableCell>{item.userName}</TableCell>
                                <TableCell>
                                  <span className={item.Status}>
                                    {item.Status}
                                  </span>
                                </TableCell>
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
                                  {Number(item.userCode) !== 1001 && (
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
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      </TblContainer>
                    </TableContainer>
                    <TblPagination />
                  </section>
                  <Popup
                    title="User form"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    count={count}
                    setCount={setCount}
                    values={values}
                    records={records}
                  >
                    <Userform
                      records={records}
                      setRecords={setRecords}
                      values={values}
                      setValues={setValues}
                      initialValues={initialValues}
                      branchNames={branchNames}
                      count={count}
                      setCount={setCount}
                      setButtonPopup={setButtonPopup}
                      initialFilterValues={initialFilterValues}
                      finYear={finYear}
                      setNotify={setNotify}
                    />
                  </Popup>
                  <Popup
                    size="md"
                    title="Usermaster Form"
                    openPopup={popup}
                    setOpenPopup={setPopup}
                  >
                    <RightsForm
                      userCode={values.userCode}
                      userRights={userRights}
                      setUserRights={setUserRights}
                      setNotify={setNotify}
                      setPopup={setPopup}
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
    </>
  );
};

export default Usermaster;
