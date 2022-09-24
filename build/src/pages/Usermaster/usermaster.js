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
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
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
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import "./table.scss";
const initialValues = {
  AllowBranchChange: "",
  AllowYearChange: "",
  BranchRights: "",
  DefaultBranchOptions: "",
  DefaultYear: "",
  Emailid: "",
  Mobileno: "",
  Password: "",
  RePassword: "",
  Role: "",
  Status: "",
  userName: "",
  userCode: "X X X X",
  ChopdaBranch: false,
  GubbaColdStoragePvtLtd: false,
  Jalgaon: false,
  PALDHIBRANCH: false,
};

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
const headCells = [
  { id: "roleCode", label: "CODE" },
  { id: "Role", label: "ROLE" },
  { id: "Name", label: "NAME", disableSorting: true },
  { id: "Status", label: "STATUS" },
  { id: "EDIT", label: "EDIT" },
];

const Usermaster = (props) => {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
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
  const [records, setRecords] = useState([initialValues]);
  const [count, setCount] = useState(records[records.length - 1].userCode);
  // console.log(records);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(recordsAfterPagingAndSorting());
  if (!records[0].usercode) {
    console.log("empty");
  } else {
    console.log("not empty");
  }
  React.useEffect(() => {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.usermasterUrl, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        const branchOption = [];
        response.data.adm_branch.map((item) => {
          branchOption.push({
            option: item.branchValue,
            spacedOption: item.branchName,
            disabled: false,
          });
        });
        setBranchNames(branchOption);
        setRecords(response.data.adm_usermaster);
        console.log("hi....");
      });
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
    setRecords(newRecord);
  }

  console.log(count);
  return (
    <>
      <PageHeader
        title="User Master"
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
                    setValues(initialValues);
                  }}
                />
              </Toolbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.userCode}</TableCell>
                      <TableCell>{item.Role}</TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>
                        <span className={item.Status}>{item.Status}</span>
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
                                console.log("records:" + records);
                              },
                            });
                            e.preventDefault();
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </Controls.ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </section>
          </Paper>
          <Usermasterpopup
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
            />
          </Usermasterpopup>
          <Notification notify={notify} setNotify={setNotify} />
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </div>
      </div>
    </>
  );
};

export default Usermaster;
