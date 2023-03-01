import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Popup from "../../components/Popup";
import FinancialYearform from "./financialYearForm";
import { Grid } from "@material-ui/core";
import ControlledAccordions from "../../components/accordions";
import ViewsDatePicker from "../../components/yearSelector";
import { useForm, Form } from "../../components/useForm";
import IconButton from "@material-ui/core/IconButton";
import { reactLocalStorage } from "reactjs-localstorage";
import Table from "@mui/material/Table";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Filter from "../../components/filterButton";
import StaticDatePickerLandscape from "../../components/calendarLandscape";

const headCells = [
  { id: "Code", label: "YearCode" },
  { id: "name", label: "Financial Year" },
  { id: "Status", label: "Default Year" },
  { id: "EDIT", label: "EDIT" },
];

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
    // right: "10px",
  },
  Y: {
    padding: "5px",
    borderRadius: "5px",
    color: "green",
    backgroundColor: "rgba(0, 128, 0, 0.151)",
  },
  N: {
    padding: "5px",
    borderRadius: "5px",
    color: "goldenrod",
    backgroundColor: "rgba(189, 189, 3, 0.103)",
  },
}));
const aHundredYearBeforeNow = new Date();
aHundredYearBeforeNow.setFullYear(2000);

const aHundredYearFromNow = new Date();
aHundredYearFromNow.setFullYear(2099);
console.log(aHundredYearFromNow);
const initialFilterValues = {
  yearCode: "",
  finYear: "",
  yearStartDate: aHundredYearBeforeNow,
  yearEndDate: aHundredYearFromNow,
  isDefaultYear: "",
  isClosed: "",
  entryBy: "",
  entryOn: "",
  editBy: "",
  editOn: "",
  allFields: "",
};

const aYearFromNow = new Date();
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

const initialValues = {
  yearCode: "X X X X",
  finYear: "",
  yearStartDate: new Date(),
  yearEndDate: aYearFromNow,
  isDefaultYear: "",
  isClosed: "",
};
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.yearCode !== "") return item;
    });
    console.log(newRecords);
    return newRecords;
  },
};

export default function FinancialYearMaster(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const [records, setRecords] = useState([initialValues]);
  const [filter, setFilter] = useState(initialFilterValues);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);

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
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  console.log("filter=>", filter);
  React.useEffect(() => {
    const token = AuthHandler.getLoginToken();
    if (records[0].yearCode && records[0].yearCode == "X X X X") {
      axios
        .get(Config.finYear + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          if (response.data.adm_finYear[0])
            setRecords(response.data.adm_finYear);
          else {
            setRecords([initialFilterValues]);
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
  }, []);
  console.log(records);
  function onDelete(item) {
    // roleService.deleteBranch(item);
    let newRecord = [];
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const token = AuthHandler.getLoginToken();
    axios
      .patch(
        Config.finYear + query,
        { item },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {
        newRecord = records.filter((record) => {
          return record.yearCode !== item.yearCode;
        });
        setRecords(newRecord);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  console.log(initialValues.yearStartDate.getFullYear());

  // console.log(count);
  function searchFilter() {
    console.log(filter);
    setFilterFn({
      fn: (items) => {
        let newRecords = items.filter((item) => {
          console.log(
            new Date(item.yearStartDate).getFullYear(),
            new Date(item.yearEndDate).getFullYear()
          );
          // console.log(
          //   item.yearStartDate.getFullYear(),
          //   filter.yearStartDate.getFullYear(),
          //   item.yearEndDate.getFullYear(),
          //   filter.yearEndDate.getFullYear()
          // );
          if (
            new Date(item.yearStartDate).getFullYear() >=
              filter.yearStartDate.getFullYear() &&
            new Date(item.yearEndDate).getFullYear() <=
              filter.yearEndDate.getFullYear()
          )
            return item;
        });
        console.log(newRecords);

        if (filter.yearCode) {
          console.log("yearCode", filter.yearCode);
          newRecords = newRecords.filter((item) => {
            if (item.yearCode == filter.yearCode) return item;
          });
          console.log(newRecords);
        }
        return newRecords;
      },
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
          console.log(item, allfields);
          if (
            item.yearCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.finYear.toLowerCase().includes(allfields.toLowerCase())
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
              title="Financial Year Master"
              icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />
            <section className="content">
              <div className="card">
                <div className="card-body">
                  <section className="content">
                    <Toolbar>
                      <Grid container style={{ display: "flex", flexGrow: 1 }}>
                        <Grid
                          item
                          xs={12}
                          sm={8}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
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
                          sm={1}
                          xs={4}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Filter
                            filterIcon={filterIcon}
                            setFilterPopup={setFilterPopup}
                            setFilter={setFilter}
                            setFilterFn={setFilterFn}
                            setFilterIcon={setFilterIcon}
                            initialFilterValues={initialFilterValues}
                          />
                        </Grid>
                        <Grid
                          item
                          sm={3}
                          xs={8}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Controls.Button
                            text="Add New"
                            size="medium"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              setButtonPopup(true);
                              setValues({ ...initialValues, yearCode: "" });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0].yearCode == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {recordsAfterPagingAndSorting().map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.yearCode}</TableCell>
                                <TableCell>{item.finYear}</TableCell>
                                <TableCell>
                                  <span className={classes[item.isDefaultYear]}>
                                    {item.isDefaultYear}
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
                    <TblPagination />
                  </section>
                  <Popup
                    title="Financial Year form"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    // size="md"
                  >
                    <FinancialYearform
                      records={records}
                      setRecords={setRecords}
                      values={values}
                      setValues={setValues}
                      initialValues={initialValues}
                      initialFilterValues={initialFilterValues}
                      setButtonPopup={setButtonPopup}
                      setNotify={setNotify}
                    />
                  </Popup>
                  <Popup
                    title="Filter"
                    openPopup={filterPopup}
                    setOpenPopup={setFilterPopup}
                    // size="md"
                  >
                    {" "}
                    <Grid container style={{ marginTop: "10px" }} spacing={2}>
                      <Grid item xs={6} style={{ flexGrow: 1 }}>
                        <Controls.Input
                          name="yearCode"
                          label="Year Code"
                          value={filter.yearCode}
                          onChange={(e) => {
                            setFilter({
                              ...filter,
                              yearCode: e.target.value,
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} style={{ flexGrow: 1 }}>
                        <StaticDatePickerLandscape
                          name="yearStartDate"
                          label="Start Year From-"
                          value={filter}
                          setValue={setFilter}
                        />
                      </Grid>
                      <Grid item xs={6} style={{ flexGrow: 1 }}>
                        <StaticDatePickerLandscape
                          name="yearEndDate"
                          label="To-"
                          value={filter}
                          setValue={setFilter}
                        />
                      </Grid>

                      <Grid item xs={3} style={{ flexGrow: 1 }}>
                        <Controls.Button
                          text="Reset"
                          color="inherit"
                          onClick={(e) => {
                            e.preventDefault();
                            setFilter(initialFilterValues);
                          }}
                        />
                      </Grid>
                      <Grid item xs={3} style={{ flexGrow: 1 }}>
                        <Controls.Button
                          type="submit"
                          text="Submit"
                          onClick={(e) => {
                            e.preventDefault();
                            searchFilter();
                            setFilterPopup(false);
                            setFilterIcon(false);
                          }}
                        />
                      </Grid>
                    </Grid>
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
}
