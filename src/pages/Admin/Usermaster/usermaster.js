import React, { useEffect, useState } from "react";
import { getUser, removeUserSession } from "../../../Utils/Common";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
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
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import "./table.scss";
import { Grid } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import MuiSkeleton from "../../../components/skeleton";
import ControlledTreeView from "./userRightsTree";
import RightsForm from "./userRightsForm";
import Popup from "../../../components/Popup.js";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { NotifyMsg } from "../../../components/notificationMsg";

const initialValues = {
  AllowBranchChange: "",
  AllowYearChange: "",
  // BranchRights: "",
  defaultBranchCode: "",
  defaultBranchName: "",
  defaultYearCode: "",
  defaultFinYear: "",
  Emailid: "",
  Mobileno: "",
  Password: "",
  RePassword: "",
  Status: "",
  userName: "",
  userCode: "",
};
const initialUserRights = {
  userCode: "",
  menuRight: [""],
  editRight: [""],
  addRight: [""],
  deleteRight: [""],
};

const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => item.userCode);
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
    fontSize: "14px",
    color: "rgb(0, 119, 128)",
    backgroundColor: "rgba(0, 119, 128, 0.363)",
    boxShadow: "none",
    height: "25px",
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
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [popup, setPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [branchNames, setBranchNames] = useState([]);
  const [userRights, setUserRights] = useState([initialUserRights]);
  const [right, setRights] = useState(initialUserRights);
  const [loading, setLoading] = useState(true);
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
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(userRights);

  const url = Config().usermasterUrl;
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    loading && setLoading(false);
  };

  if (loading) {
    const handleRes = (response) => {
      console.log(response);
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
      response.data.adm_usermaster.length !== 0 &&
        setRecords(response.data.adm_usermaster);

      response.data.adm_userrights &&
        setUserRights(response.data.adm_userrights);
      loading && setLoading(false);
    };

    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }

  console.log(records);
  function onDelete(item) {
    const handleRes = (response) => {
      let newRecord = [];
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });

      newRecord = records.filter((record) => {
        return record.userCode !== item.userCode;
      });
      newRecord.length == 0
        ? setRecords([initialValues])
        : setRecords(newRecord);
      setNotify(NotifyMsg(3));
    };
    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
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
  const userCodeOptions = records
    .filter((item) => item.userCode !== values.userCode)
    .map((item) => item.userCode);
  return (
    <>
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
                        endAdornment: filter.allFields && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                setFilter(initialFilterValues);
                                setFilterFn(initialFilterFn);
                              }}
                              style={{ boxShadow: "none" }}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
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
                  {loading ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.userCode}</TableCell>
                          <TableCell>
                            {Number(item.userCode) !== 1001 && (
                              <IconButton
                                className={classes.rights}
                                aria-label="Example"
                                size="small"
                                onClick={() => {
                                  setValues(item);
                                  setPopup(true);
                                  console.log(userRights);
                                  let x = userRights.find(
                                    (right) => right.userCode == item.userCode
                                  );
                                  console.log(x);
                                  x
                                    ? setRights(x)
                                    : setRights(initialUserRights);
                                }}
                              >
                                <AdminPanelSettingsIcon />
                                Rights
                              </IconButton>
                            )}
                          </TableCell>
                          <TableCell>{item.userName}</TableCell>
                          <TableCell>
                            <span className={item.Status}>{item.Status}</span>
                          </TableCell>
                          <TableCell>
                            <Controls.EditButton
                              handleClick={() => {
                                setValues(item);
                                setButtonPopup(true);
                              }}
                            />{" "}
                            {Number(item.userCode) !== 1001 && (
                              <Controls.DeleteButton
                                handleConfirm={(e) => {
                                  AuthHandler.canDelete()
                                    ? onDelete(item)
                                    : setNotify(NotifyMsg(8));
                                }}
                                setConfirmDialog={setConfirmDialog}
                              />
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
                right={right}
                userCodeOptions={userCodeOptions}
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
    </>
  );
};

export default Usermaster;
