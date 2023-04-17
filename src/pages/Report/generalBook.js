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
import ExportSwitch from "../../components/controls/Switch";
import DocCodes from "../../components/docCodes";
import UnusedAutosuggest from "../../components/unusedautosuggest";
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
  srNo: "",
  acCode: "",
  credit: 0,
  debit: 0,
  acName: "",
  openingBalance: "",
  closingBalance: "",
  docCode: "",
  vouDate: "",
  narration: "",
};
const initialAccount = {
  acCode: "",
  acName: "",
};
const cashAccGrpNo = "A1018";
const bankAccGrpNo = "A1016";
export default function BankBook({ docCode1, docCode2 }) {
  let headCells = [
    { id: "Vou No", label: "Vou Date", feild: "vouDate" },
    { id: "Vou No", label: "Vou No", feild: "vouNo" },
    { id: "A.C Code", label: "A.C Code", feild: "acCode" },
    { id: "A.C Name", label: "A.C Name", feild: "acName" },
    { id: "Narration", label: "Narration", feild: "narration" },
    { id: "Debit", label: "Payment", feild: "debit" },
    { id: "Credit", label: "Reciept", feild: "credit" },
    {
      id: "Balance",
      label: "Balance",
      feild: "currentBalance",
    },
  ];
  const isDayBook = docCode1 == "DAY";

  isDayBook && headCells.pop();
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = user.userCode;
  const userCompanyCode = user.userCompanyCode;
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
  const { getD } = DateCalc(user);
  const { acTransactnDocCodes, transactnDocCodes } = DocCodes();
  const docCodeOptions = [...acTransactnDocCodes, ...transactnDocCodes];
  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
    docCode: "",
  };
  const openingObj = {
    ...initialValues,
    srNo: 1,
    acName: "OPENING",
  };

  const [filter, setFilter] = useState(initialFilterValues);

  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.srNo !== "") return item;
      });
      console.log(items, filter.acCode, filter.acCode == "");
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
  const [dayWise, setDayWise] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialValues]);
  const [accounts, setAccounts] = useState([initialAccount]);
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
  console.log(records[0], refresh);
  if ((records[0] && records[0].srNo == "") || refresh) {
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.defaultYearCode}&branchCode=${user.defaultBranchCode}&acCode=${filter.acCode}&docCode1=${docCode1}&docCode2=${docCode2}`;
    const token = AuthHandler.getLoginToken();
    console.log(query);
    axios
      .get(Config.bankReport + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((res) => {
        let data = res.data.transactions;
        let acc = res.data.mst_accounts;
        let openingBalance = res.data.openingBalance;
        console.log(res.data);
        let arr = [];
        let credit = 0;
        let debit = 0;
        if (filter.acCode != "" && !isDayBook)
          arr[0] = {
            ...openingObj,
            currentBalance: openingBalance,
          };
        data = data.sort((a, b) => new Date(a.vouDate) - new Date(b.vouDate));
        data.map((item, i) => {
          credit += Number(item.debit);
          debit += Number(item.credit);
          if (
            docCode1 != "DAY" &&
            dayWise &&
            i > 1 &&
            data[i].vouDate &&
            data[i].vouDate !== data[i - 1].vouDate
          ) {
            console.log(arr);
            arr.push({
              ...openingObj,
              acName: "CLOSING",
              currentBalance: arr[arr.length - 1].currentBalance,
            });

            arr.push({
              ...openingObj,
              currentBalance: arr[arr.length - 1].currentBalance,
            });
            console.log(arr);
          }

          arr.push({
            ...item,
            acName: getAcName(item.acCode, acc),
            currentBalance: openingBalance + debit - credit,
            credit: Number(item.debit),
            debit: Number(item.credit),
            narration: item.narration,
            srNo: i + 2,
            vouDate: new Date(item.vouDate).toLocaleDateString(),
            docCode: item.docCode,
          });
        });
        if (acc.length != 0) setAccounts(acc);
        console.log(arr);
        setRecords(arr);
        if (refresh) setRefresh(false);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
        console.log(error);
      })
      .finally(() => {});
  }

  console.log(accounts);
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

  function getAcName(code, arr) {
    let name = "";
    arr.map((item) => {
      if (item.acCode == code) name = item.acName;
    });
    return name;
  }
  const accountOptions = accounts
    .filter((item) => groupCodeCondition(item))
    .map((item) => item.acName);
  function groupCodeCondition(acc) {
    if (
      docCode1 == "CR" &&
      acc.acGroupCode == cashAccGrpNo //only cash acc
    ) {
      return true;
    } else if (
      docCode1 == "BR" &&
      acc.acGroupCode == bankAccGrpNo //only bank acc
    ) {
      return true;
    } else if (isDayBook) {
      //all acc
      return true;
    } else {
      return false;
    }
  }
  function searchFilter() {
    console.log(filter);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        function filterConditnWise(feild) {
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
          console.log(newRecords, feild);
        }
        isDayBook && filter.acCode && filterConditnWise("acCode");
        isDayBook && filter.docCode && filterConditnWise("docCode");
        // newRecords = newRecords.filter((item) => {
        //   if (item.docCode == filter.docCode) return item;
        // });

        return newRecords;
      },
    });
  }
  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        console.log(newRecords);
        newRecords = items.filter((item) => {
          if (
            item.acName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.narration.toLowerCase().includes(allfields.toLowerCase()) ||
            item.vouDate.toLowerCase().includes(allfields.toLowerCase())
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
  const display = recordsAfterPagingAndSorting();
  console.log(display);

  function Switch() {
    docCode1 !== "DAY" ? (
      <>
        {" "}
        <Grid
          item
          sm={2}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ExportSwitch
            checked={dayWise}
            onChange={() => {
              setDayWise((prev) => !prev);
              setRefresh(true);
            }}
          />{" "}
          <Typography>DayWise</Typography>
        </Grid>
      </>
    ) : (
      <></>
    );
  }
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title={`${docCode1} BOOK`}
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
                      additionalComponent={Switch}
                    />
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0] == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {display.map((item, i) => (
                              <>
                                <TableRow>
                                  {headcells.map((headcell, i) => (
                                    <TableCell
                                      key={headcell.id}
                                      // sortDirection={orderBy === headcell.id ? order : false}
                                      style={{
                                        borderRight:
                                          "1px solid rgba(0,0,0,0.2)",
                                      }}
                                    >
                                      {typeof item[headcell.feild] == "number"
                                        ? Math.abs(
                                            item[headcell.feild].toFixed(2)
                                          )
                                        : item[headcell.feild]}
                                      {headcell.feild == "currentBalance"
                                        ? item.currentBalance == 0
                                          ? ""
                                          : item.currentBalance < 0
                                          ? "CR"
                                          : "DR"
                                        : ""}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </>
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
                      <Grid
                        item
                        xs={12}
                        sm={isDayBook ? 6 : 12}
                        className={classes.input}
                      >
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
                      {isDayBook && (
                        <Grid item xs={12} sm={6} className={classes.input}>
                          <UnusedAutosuggest
                            value={filter}
                            setValue={setFilter}
                            options={docCodeOptions}
                            name="docCode"
                            label="Doc code"
                          />
                        </Grid>
                      )}
                      <Grid item xs={6}>
                        <Controls.Button
                          text="Submit"
                          onClick={() => {
                            setRefresh(true);
                            setFilterPopup(false);
                            setFilterIcon(false);
                            searchFilter();
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
// {(
//   i > 1 &&
//   display[i - 1].vouDate &&
//   display[i].vouDate.getDate() !==
//     display[i - 1].vouDate.getDate()
// )(<TableRow>HI</TableRow>)}
