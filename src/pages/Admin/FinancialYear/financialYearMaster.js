import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
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
  TableContainer,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import FinancialYearform from "./financialYearForm";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Filter from "../../../components/filterButton";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import { NotifyMsg } from "../../../components/notificationMsg";
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
  yearCode: "",
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
  const [loading, setLoading] = useState(true);

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

  const url = Config.finYear;
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
  };

  React.useEffect(() => {
    if (loading) {
      const handleRes = (response) => {
        if (response.data.adm_finYear.length !== 0)
          setRecords(response.data.adm_finYear);
      };

      roleService.axiosGet(url, handleRes, handleErr, () => {});
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
    const handleRes = (response) => {
      const newRecord = records.filter((record) => {
        return record.yearCode !== item.yearCode;
      });
      setNotify(NotifyMsg(3));
      setRecords(newRecord);
    };

    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
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
  return (
    <>
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
                    sm={1}
                    xs={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Filter setFilterPopup={setFilterPopup} />
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
                        setValues(initialValues);
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
                            <Controls.EditButton
                              handleClick={() => {
                                setValues(item);
                                setButtonPopup(true);
                              }}
                            />
                            <Controls.DeleteButton
                              handleConfirm={(e) => {
                                AuthHandler.canDelete()
                                  ? onDelete(item)
                                  : setNotify(NotifyMsg(8));
                              }}
                              setConfirmDialog={setConfirmDialog}
                            />
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
                loading={loading}
                setLoading={setLoading}
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
    </>
  );
}
