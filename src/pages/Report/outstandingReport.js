import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import {
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
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Popup from "../../components/Popup";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Excel from "../../components/useExcel";
import Print from "../../components/print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MultipleSelectCheckmarks from "../../components/multiSelect";
import Filter from "../../components/filterButton";
import DateCalc from "../../components/dateCalc";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import CmnToolBar from "../../components/CommonToolBar";
import Outer from "../../components/outer";
import { NotifyMsg } from "../../components/notificationMsg";
import * as roleService from "../../services/roleService";

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
const initialValues = {
  srNo: "",
  acCode: "0",
  credit: 0,
  debit: 0,
  acName: "",
  openingBalance: "",
  closingBalance: "",
};

export default function OutstandingReport({ title = "Outstanding Report" }) {
  const headCells = [
    { id: "A.C Code", label: "A.C Code", feild: "acCode" },
    { id: "A.C Name", label: "A.C Name", feild: "acName" },
    {
      id: "Opening",
      label: "Opening",
      feild: "openingBalance",
    },

    { id: "Debit", label: "Debit", feild: "debit" },
    { id: "Credit", label: "Credit", feild: "credit" },
    {
      id: "Closing",
      label: "Closing",
      feild: "closingBalance",
    },
  ];
  const filterFields = [
    { feild: "docCode", label: "Document Code" },
    { feild: "acName", label: "Account Name" },
  ];

  const user = AuthHandler.getUser();

  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
  };
  const [filter, setFilter] = useState(initialFilterValues);

  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.srNo !== "") return item;
      });
      console.log(items, filter.acCode, filter.acCode == "0");
      console.log(newRecords);
      return newRecords;
    },
  };
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialValues]);
  const [accounts, setAccounts] = useState([
    {
      acCode: "",
      acName: "",
    },
  ]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    Stock: "",
    subTitle: "",
  });
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  if (loading) {
    const query = `&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.currentYearCode}&branchCode=${user.currentBranchCode}&acCode=${filter.acCode}`;
    console.log(query);
    const url = Config().acReport + query;

    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.error(err);
    };
    const handleRes = (res) => {
      const data = res.data.acReport;
      const acc = res.data.accounts;
      console.log(data);
      if (data.length !== 0) setRecords(data);
      if (acc.length != 0) setAccounts(acc);
    };
    roleService.axiosPut(url, { body: "bpody" }, handleRes, handleErr, () => {
      loading && setLoading(false);
    });
  }

  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }

  console.log(filter);
  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (
            item.acCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acName.toLowerCase().includes(allfields.toLowerCase())
          )
            return item;
          // item.talukaName == filter.allfields ||
          // item.branchName == filter.allfields
        });
        function dynamicFilterFn(feild) {
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
        }
        filter.acCode && dynamicFilterFn("acCode");

        console.log(newRecords);
        return newRecords;
      },
    });
  }
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
              <CmnToolBar
                filterIcon={filterIcon}
                filter={filter}
                handleFilter={handleFilter}
                setFilterPopup={setFilterPopup}
                setFilter={setFilter}
                setFilterFn={setFilterFn}
                initialFilterFn={initialFilterFn}
                buttonText="Export Data to Excel"
                headCells={headCells}
                recordsAfterSorting={recordsAfterAndSorting}
                headcells={headcells}
                setheadcells={setheadcells}
                initialHeadCells={headCells}
                selected={selected}
                setSelected={setSelected}
                initialFilterValues={initialFilterValues}
                filterFields={filterFields}
                title={title}
              />
              <TableContainer>
                <TblContainer>
                  <TblHead />
                  {loading ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow>
                          {headcells.map((headcell, i) => (
                            <TableCell
                              key={headcell.id}
                              // sortDirection={orderBy === headcell.id ? order : false}
                              style={{
                                borderRight: "1px solid rgba(0,0,0,0.2)",
                              }}
                            >
                              {typeof item[headcell.feild] == "number"
                                ? Math.abs(item[headcell.feild])
                                : item[headcell.feild]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </TblContainer>
              </TableContainer>
              <TblPagination />
            </section>

            <Popup
              title="Filter"
              openPopup={filterPopup}
              setOpenPopup={setFilterPopup}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StaticDatePickerLandscape
                    size="small"
                    name="startDate"
                    label=" From-"
                    value={filter}
                    setValue={setFilter}
                    style={{ top: 20 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StaticDatePickerLandscape
                    size="small"
                    name="endDate"
                    label="To-"
                    value={filter}
                    setValue={setFilter}
                  />
                </Grid>
                <Grid item xs={12} sm={12} className={classes.input}>
                  <SmartAutoSuggest
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    name1="acName"
                    code1="acCode"
                    name2="acName"
                    code2="acCode"
                    label="Account"
                    value={filter}
                    setValue={setFilter}
                    options1={accounts.map((item) => item.acName)}
                    options2={accounts}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controls.Button
                    text="Submit"
                    onClick={() => {
                      setLoading(true);
                      setFilterPopup(false);
                      setFilterIcon(false);
                      search("");
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
