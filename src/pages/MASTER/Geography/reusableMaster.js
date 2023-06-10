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
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import ReuseTable from "./reusableTable";
import Popup from "../../../components/Popup";
import ReuseForm from "./reusableForm";
import StateForm from "./stateForm";
import Talukaform from "./talukaForm";
import CountryForm from "./countryForm";
import { NotifyMsg } from "../../../components/notificationMsg";
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

const Reusemaster = (props) => {
  const {
    headCells,
    initialValues,
    records,
    setRecords,
    title,
    country,
    state,
    District,
    m2,
  } = props;
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [branchNames, setBranchNames] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  console.log(District);
  console.log(records, recordsAfterPagingAndSorting());
  // React.useEffect(() => {
  //   const token = AuthHandler.getLoginToken();
  //   const body = { hello: "hello" };
  //   axios
  //     .post(Config().location, body, {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  // .then((response) => {
  // const branchOption = [];
  // response.data.adm_branch.map((item) => {
  //   branchOption.push({
  //     option: item.branchValue,
  //     spacedOption: item.branchName,
  //     disabled: false,
  //   });
  // });
  // setBranchNames(branchOption);
  //       setRecords(response.data.country);
  //       console.log(response.data.country);
  //       console.log("hi....", records, response.data);
  //     });
  // }, []);
  console.log(records);

  function onDelete(item) {
    const url = Config().location;
    function handleRes(res) {
      let newRecord = [];
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false,
      });

      newRecord = records.filter((record) => {
        return record[m2] !== item[m2];
      });
      setRecords(newRecord);
      setNotify(NotifyMsg(3));
    }
    const handleErr = (error) => {
      setNotify(NotifyMsg(4));
    };
    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
  }
  function getForm() {
    if (title == "STATE") {
      return (
        <ReuseForm
          title={title}
          values={values}
          setValues={setValues}
          records={records}
          setRecords={setRecords}
          country={country}
          state={state}
          District={District}
          setNotify={setNotify}
          setButtonPopup={setButtonPopup}
        />
      );
    }
    if (title == "DISTRICT") {
      return (
        <StateForm
          title={title}
          values={values}
          setValues={setValues}
          records={records}
          setRecords={setRecords}
          country={country}
          state={state}
          District={District}
        />
      );
    }
    if (title == "TALUKA") {
      return (
        <Talukaform
          title={title}
          values={values}
          setValues={setValues}
          records={records}
          setRecords={setRecords}
          country={country}
          state={state}
          District={District}
        />
      );
    }
    if (title == "COUNTRY") {
      return (
        <CountryForm
          title={title}
          values={values}
          setValues={setValues}
          records={records}
          setRecords={setRecords}
          country={country}
          state={state}
          District={District}
          setNotify={setNotify}
          setButtonPopup={setButtonPopup}
        />
      );
    }
  }
  // console.log(count);
  return (
    <>
      <PageHeader
        title={title}
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <section className="content">
        <div className="card">
          <div className="card-body">
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
                  <ReuseTable
                    title={title}
                    setValues={setValues}
                    setButtonPopup={setButtonPopup}
                    setConfirmDialog={setConfirmDialog}
                    recordsAfterPagingAndSorting={recordsAfterPagingAndSorting}
                    onDelete={onDelete}
                    setNotify={setNotify}
                  />
                </TableBody>
              </TblContainer>
              <TblPagination />
            </section>
            <Popup
              title="User form"
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
            >
              {getForm()}
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
export default Reusemaster;
// <Usermasterpopup
// title="User form"
// openPopup={buttonPopup}
// setOpenPopup={setButtonPopup}
// count={count}
// setCount={setCount}
// values={values}
// records={records}
// ></Usermasterpopup>
//
// <ReuseForm
// title={title}
// values={values}
// setValues={setValues}
// records={records}
// setRecords={setRecords}
// country={country}
// state={state}
// District={District}
// />
