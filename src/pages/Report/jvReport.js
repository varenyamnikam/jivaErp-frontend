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
  vouNo: "",
  vouDate: "",
  acCode: "",
  acName: "",
  credit: 0,
  debit: 0,
  narration: "",
  docCode: "",
};
const initialAccount = {
  acCode: "",
  acName: "",
};

export default function JvReport() {
  const headCells = [
    { id: "Vou No", label: "Vou No", feild: "vouNo" },
    { id: "Vou Date", label: "Vou Date", feild: "vouDate" },
    { id: "A.C Name", label: "A.C Name", feild: "acName" },
    { id: "Debit", label: "Debit", feild: "debit" },
    { id: "Credit", label: "Credit", feild: "credit" },
    {
      id: "Narration",
      label: "Narration",
      feild: "narration",
    },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = user.userCode;
  const userCompanyCode = user.userCompanyCode;
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
  const { getD } = DateCalc(user);

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
        if (item.vouNo !== "" && item.vouNo !== "X X X X") return item;
      });
      console.log(items, filter.acCode, filter.acCode == "0");
      console.log(newRecords);
      return newRecords;
    },
  };
  const initialDocCodes = [
    "QT",
    "SO",
    "PI",
    "DC",
    "SI",
    "SR",
    "PO",
    "GR",
    "PV",
    "PR",
    "CN",
    "DN",
  ];
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
  const [docCodes, setDocCodes] = useState([]);

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
  if ((records[0] && records[0].vouNo == "") || refresh) {
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.defaultYearCode}&branchCode=${user.defaultBranchCode}&acCode=${filter.acCode}`;
    const token = AuthHandler.getLoginToken();
    console.log(query);

    axios
      .patch(
        Config.acReport + query,
        {
          docCodes: filter.docCode ? filter.docCode : initialDocCodes,
        },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((res) => {
        let data = res.data.acLedger;
        let acc = res.data.mst_accounts;
        let mountData = data.map((item) => ({
          ...item,
          acName: getAcName(item.acCode, acc),
        }));
        if (acc.length != 0) setAccounts(acc);
        console.log(acc, mountData);
        mountData.length != 0
          ? setRecords(mountData)
          : setRecords([{ ...initialValues, vouNo: "X X X X" }]);
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

  console.log(filter);
  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (item.refNo.toLowerCase().includes(allfields.toLowerCase()))
            return item;
          // item.talukaName == filter.allfields ||
          // item.branchName == filter.allfields
        });
        console.log(newRecords);
        return newRecords;
      },
    });
  }
  function getAcName(code, arr) {
    let name = "";
    arr.map((item) => {
      if (item.acCode == code) name = item.acName;
    });
    return name;
  }
  const accountOptions = accounts.map((item) => item.acName);
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="J.V Report"
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
                    />
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0] == "X X X X" ? (
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
                                    {headcell.id == "Debit" ||
                                    headcell.id == "Credit"
                                      ? Math.abs(Number(item[headcell.feild]))
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
                        <UnusedAutosuggest
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          name="docCode"
                          label="Doc Code"
                          value={filter}
                          setValue={setFilter}
                          options={initialDocCodes}
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
