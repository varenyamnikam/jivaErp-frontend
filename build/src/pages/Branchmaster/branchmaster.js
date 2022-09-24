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
const initialBranchValues = {
  contactNo: "",
  Mobileno: "",
  pesticideLicenceNo: "",
  seedLicenceNo: "",
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
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
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
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
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
  const [count, setCount] = useState(records[records.length - 1].branchCode);
  console.log(records[records.length - 1].branchCode);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(recordsAfterPagingAndSorting());
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
        setRecords(response.data.adm_branch);
        console.log("hi....", records);
      });
  }, []);
  const [location, setLocation] = useState({ states: [{}] });
  useEffect(() => {
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
  });

  console.log(values);
  const { states, districts, talukas, country } = location;
  console.log(location, states, districts, talukas, country);

  console.log(records);
  function onDelete(item) {
    roleService.deleteBranch(item);
    let newRecord = [];
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    newRecord = records.filter((record) => {
      return record.branchCode !== item.branchCode;
    });
    setRecords(newRecord);
  }

  console.log(count);
  return (
    <>
      <PageHeader
        title="Branch Master"
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
                    setValues(initialBranchValues);
                  }}
                />
              </Toolbar>
              <TblContainer>
                <TblHead />
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
            <Branchform
              records={records}
              setRecords={setRecords}
              values={values}
              setValues={setValues}
              initialValues={initialBranchValues}
              branchNames={branchNames}
              count={count}
              setCount={setCount}
              country={location.country}
              states={location.states}
              districts={location.districts}
              talukas={location.talukas}
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

export default Branchmaster;
