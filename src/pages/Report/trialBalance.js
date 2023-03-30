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
  TableHead,
  Typography,
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
import DcValues from "../Inventory/D.C/DcValues";
import TbLedger from "./tbForm";
import ExportSwitch from "../../components/controls/Switch";

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
function getD() {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return oneMonthAgo;
}
const initialValues = {
  acGroupCode: "X X X X",
  acGroupName: "",
  acGroupStatus: "",
  childArr: [],
  displayData: {},
  groupType: "Asset",
  parentGroupCode: "",
  status: "",
  userCompanyCode: "all",
};
const initialAccount = {
  acCode: "",
  acName: "",
};

export default function TrialBalance() {
  const headCells = [
    { id: "Grp Code", label: "Grp Code", feild: "acGroupCode" },
    { id: "Grp Name", label: "Grp Name", feild: "acGroupName" },
    { id: "Opening", label: "Opening", feild: "openingBalance" },
    { id: "Current", label: "Current", feild: "monthlyBalance" },
    { id: "Closing", label: "Closing", feild: "closingBalance" },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = user.userCode;
  const userCompanyCode = user.userCompanyCode;
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
  const { getD } = DateCalc(user);
  const { initialVouValues } = DcValues();
  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
  };
  const [filter, setFilter] = useState(initialFilterValues);

  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.acGroupCode !== "") return item;
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
  const [loading1, setLoading1] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialValues]);
  const [accounts, setAccounts] = useState([initialAccount]);
  const [vouchers, setVouchers] = useState([initialVouValues]);
  const [openingClosing, setOpeningClosing] = useState({ open: 0, close: 0 });
  const [showAcc, setShowAcc] = useState(false);
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
  console.log(Config.batch);
  if ((records[0] && records[0].acGroupCode == "X X X X") || refresh) {
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.defaultYearCode}&branchCode=${user.defaultBranchCode}&acCode=${filter.acCode}`;
    const token = AuthHandler.getLoginToken();
    console.log(query);
    axios
      .get(Config.trialBalance + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((res) => {
        let data = res.data.allGrps;
        let acc = res.data.mst_acGroup;
        //data is array of obj having two fields ->{childArr:[...],
        //displayData:{...}} rest of feilds are useLess
        console.log(data, acc);
        data.length !== 0 && setRecords(data);
        refresh && setRefresh(false);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
        console.log(error);
      });
  }

  console.log(records);
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  function getDate(code) {
    const date = new Date(code);
    return (
      String(date.getDate()) +
      "/" +
      String(date.getMonth() + 1) +
      "/" +
      String(date.getFullYear()).slice(-2)
    );
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
            item.acGroupCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acGroupName.toLowerCase().includes(allfields.toLowerCase())
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
  function getAcName(code) {
    let name = "";
    accounts.map((item) => {
      if (item.acCode == code) name = item.acName;
    });
    return name;
  }
  function displayTblRow(obj, feild, space) {
    let item = obj;
    if (feild == "displayData") item = obj[feild];
    console.log(item);
    const num = Math.floor(space / 10);
    function getWeight() {
      console.log(num);
      if (num == 0) {
        return "bolder";
      } else if (num == 1) {
        return "normal";
      } else {
        return "-moz-initial";
      }
    }
    let modifiedHeadCells = headcells;
    if ("acCode" in item) {
      modifiedHeadCells = headcells.map((headcell, i) => {
        if (i == 0) headcell.feild = "acCode";
        else if (i == 1) headcell.feild = "acName";
        return headcell;
      });
    } else {
      modifiedHeadCells = headcells.map((headcell, i) => {
        if (i == 0) headcell.feild = "acGroupCode";
        else if (i == 1) headcell.feild = "acGroupName";
        return headcell;
      });
    }
    return (
      <>
        <TableRow>
          {modifiedHeadCells.map((headcell, i) =>
            headcell.feild == "acGroupCode" ||
            headcell.feild == "acGroupName" ||
            headcell.feild == "acCode" ||
            headcell.feild == "acName" ? (
              <TableCell
                key={headcell.id}
                style={{
                  borderRight: "1px solid rgba(0,0,0,0.2)",
                  paddingLeft: `${space}px`,
                  fontWeight:
                    feild == "displayData" ? getWeight() : "-moz-initial",
                  fontStyle: feild == "displayData" ? "normal" : "italic",
                }}
              >
                {item[headcell.feild]}
              </TableCell>
            ) : Number(item[headcell.feild]) < 0 ? (
              //if -ve then diffrnt column if +ve then diffrnt column
              <>
                <TableCell
                  key={headcell.id}
                  style={{
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {typeof item[headcell.feild] == "number"
                    ? Math.abs(item[headcell.feild].toFixed(2))
                    : item[headcell.feild]}
                </TableCell>
                <TableCell
                  key={headcell.id}
                  style={{
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  0{headcell.feild == "closingBalance"}
                </TableCell>
              </>
            ) : (
              <>
                <TableCell
                  key={headcell.id}
                  style={{
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  0
                </TableCell>
                <TableCell
                  key={headcell.id}
                  style={{
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {typeof item[headcell.feild] == "number"
                    ? Math.abs(item[headcell.feild].toFixed(2))
                    : item[headcell.feild]}
                  {headcell.feild == "closingBalance"}
                </TableCell>
              </>
            )
          )}
        </TableRow>
        {/*//for childGrps*/}
        {"childArr" in obj && obj.childArr.length !== 0 ? (
          obj.childArr.map((item) =>
            //indent if childGrp
            displayTblRow(item, "displayData", space + 10)
          )
        ) : (
          <></>
        )}
        {/*for accountDetails*/}
        {showAcc && "accData" in item && item.accData.length !== 0 ? (
          item.accData.map((item) => displayTblRow(item, "accData", space))
        ) : (
          <></>
        )}
      </>
    );
  }
  function recursivelyCallArr(arr) {
    return arr.map((item) => displayTblRow(item, "displayData", 3));
  }
  console.log(vouchers, openingClosing);
  const accountOptions = accounts.map((item) => item.acName);
  function additionalComponent() {
    return (
      <Grid
        item
        sm={2}
        xs={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExportSwitch
          checked={showAcc}
          onChange={() => {
            setShowAcc((prev) => !prev);
          }}
          label="Details"
        />{" "}
        <Typography>Details</Typography>
      </Grid>
    );
  }

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Trial Balance"
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
                      setFilterIcon={setFilterIcon}
                      initialFilterValues={initialFilterValues}
                      setRefresh={setRefresh}
                      initialFilterFn={initialFilterFn}
                      buttonText="Export Data to Excel"
                      TblContainer={TblContainer}
                      TblHead={TblHead}
                      TblPagination={TblPagination}
                      headCells={headcells}
                      recordsAfterSorting={recordsAfterAndSorting}
                      headcells={headcells}
                      setheadcells={setheadcells}
                      initialHeadCells={headCells}
                      selected={selected}
                      setSelected={setSelected}
                      additionalComponent={additionalComponent}
                    />{" "}
                    <TblContainer>
                      <TableHead>
                        {" "}
                        <TableRow
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.2)",
                            position: "sticky",
                          }}
                          stickyHeader
                        >
                          {headcells.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              // sortDirection={orderBy === headCell.id ? order : false}
                              style={{
                                borderRight: "1px solid rgba(0,0,0,0.2)",
                                borderBottom: "1px solid rgba(0,0,0,0.2)",
                              }}
                              colSpan={
                                headCell.label == "Grp Code" ||
                                headCell.label == "Grp Name"
                                  ? 1
                                  : 2
                              }
                            >
                              {headCell.label}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow stickyHeader>
                          <TableCell />
                          <TableCell />

                          {[...Array(3)].map((e, i) => (
                            <>
                              <TableCell
                                style={{
                                  borderRight: "1px solid rgba(0,0,0,0.2)",
                                }}
                              >
                                Credit
                              </TableCell>
                              <TableCell
                                style={{
                                  borderRight: "1px solid rgba(0,0,0,0.2)",
                                }}
                              >
                                Debit
                              </TableCell>
                            </>
                          ))}
                        </TableRow>
                      </TableHead>

                      {records[0] == "X X X X" ? (
                        <MuiSkeleton />
                      ) : (
                        <TableBody>
                          {recursivelyCallArr(recordsAfterPagingAndSorting())}
                        </TableBody>
                      )}
                    </TblContainer>
                    <TblPagination />
                  </section>
                  <Popup
                    title="Detail"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                  >
                    <TbLedger
                      records={vouchers}
                      openingClosing={openingClosing}
                    />
                  </Popup>
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
                          options1={accountOptions}
                          options2={accounts}
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Controls.Button
                          text="Submit"
                          onClick={() => {
                            setRefresh(true);
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
