import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/Config";
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
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Excel from "../../../components/useExcel";
import Print from "../../../components/print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MultipleSelectCheckmarks from "../../../components/multiSelect";
import Filter from "../../../components/filterButton";
import DateCalc from "../../../components/dateCalc";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import StockLedger from "./stockLedger";
import * as roleService from "../../../services/roleService";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
import { NotifyMsg } from "../../../components/notificationMsg";
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
  srNo: 0,
  prodCode: "0",
  openingStock: "0",
  inward: 0,
  outward: 0,
  closingStock: 0,
  reorderLevel: "0",
};
const initialProducts = {
  prodCode: "",
  barcode: "",
  itemType: "",
  prodCompany: "",
  prodName: "",
  prodDesc: "",
  UOM: "",
  MRP: "",
  HSNNo: "",
  reorderLevel: "",
  maintainStock: "",
  useBatchNo: "",
  prodStatus: "",
  userCompanyCode: "",
};

export default function ExpiryReport({ title = "Expiry Report" }) {
  const headCells = [
    { id: "Product Code", label: "Product Code", feild: "prodCode" },
    { id: "Product", label: "Product", feild: "prodName" },
    { id: "batch", label: "Batch", feild: "batchNo" },
    { id: "UOM", label: "UOM", feild: "UOM" },
    { id: "Expiry Date", label: "Expiry Date", feild: "batchExpDate" },

    { id: "Closing", label: "Closing", feild: "closingStock" },
    { id: "Reorder Level", label: "Reorder Level", feild: "reorderLevel" },
  ];
  const filterFields = [
    { feild: "prodName", label: "Product Name" },
    { feild: "expDateString()", label: "Expiry Date" },
  ];

  const user = AuthHandler.getUser();
  const useBatch = AuthHandler.getSettings().userBatchNo;
  const { getD } = DateCalc(user);

  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
    expDate: roleService.getEndDate(),
    "expDateString()": function () {
      return roleService.date(this.expDate);
    },
  };
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.prodCode) return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };

  const [expired, setExpired] = useState(false);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
  const [loading1, setLoading1] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialValues]);
  const [filter, setFilter] = useState(initialFilterValues);
  const [products, setProducts] = useState([initialProducts]);
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
  const setting = AuthHandler.getSettings();
  const initialkeepOpen = setting.keepBatchWiseStockOpen
    ? setting.keepBatchWiseStockOpen
    : false;

  const [loading, setLoading] = useState(true);
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  console.log(Config().batch);
  if (useBatch == "Yes") {
    let found = headcells.find((item) => item.id == "batch");
    if (!found) {
      setheadcells(headCells);
    }
  } else {
    let found = headcells.find((item) => item.id == "batch");
    if (found) {
      let arr = headCells.filter((item) => item.id !== "batch");
      console.log(arr);
      setheadcells(arr);
    }
  }

  if (loading || refresh) {
    let batchWiseStock = "NO";
    if (useBatch == "Yes") batchWiseStock = "Yes";
    console.log(batchWiseStock);
    let query = `&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.currentYearCode}&branchCode=${user.currentBranchCode}&useBatch=${batchWiseStock}`;
    const url = Config().stockReport + query;
    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
    };
    const handleRes = (res) => {
      let data = res.data.records;
      let stk = res.data.stock;
      console.log(data, stk);
      mountStockData(data, stk);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {
      loading && setLoading(false);
    });
  }
  function mountStockData(data, stk) {
    console.log(data, stk);
    let arr = [];

    data.map((item, i) => {
      let inward = item.currentStock.inward;
      let outward = item.currentStock.outward;

      let obj = {
        srNo: i + 1,
        prodCode: item.prodCode,
        closingStock: item.openingStock + inward - outward,
        reorderLevel: item.reorderLevel,
        prodName: item.prodName,
        UOM: item.UOM,
        batchNo: item.batchNo,
        batchExpDate: roleService.date(item.batchExpDate),
      };
      obj.closingStock > 0 && arr.push(obj);

      console.log(arr);
    });
    setRecords(arr);
    if (refresh) setRefresh(false);
  }
  console.log(products, records);
  function handleFilter(e) {
    console.log("hi..");
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
            item.prodCode.includes(allfields) ||
            item.prodName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.UOM.toLowerCase().includes(allfields.toLowerCase())
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
  function handleFilterSubmit() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        console.log(newRecords, filter);
        function dynamicFilterFn(feild) {
          console.log(feild, filter, filter[feild]);
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
        }
        Number(filter.prodCode) && dynamicFilterFn("prodCode");
        console.log(newRecords);
        return newRecords;
      },
    });
  }

  const finalRecords = recordsAfterPagingAndSorting().filter(
    (item) =>
      new Date(item.batchExpDate).setUTCHours(0, 0, 0, 0) <=
      new Date(filter.expDate).setUTCHours(0, 0, 0, 0)
  );
  console.log(finalRecords.length, recordsAfterPagingAndSorting().length);
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
                <Grid
                  container
                  spacing={2}
                  style={{ display: "flex", flexGrow: 1 }}
                >
                  <Grid
                    item
                    xs={8}
                    sm={5}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Controls.Input
                      label="Search"
                      className={classes.searchInput}
                      value={filter.allFields}
                      onChange={handleFilter}
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
                    />
                  </Grid>{" "}
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
                      setRefresh={setRefresh}
                      initialFilterFn={initialFilterFn}
                    />
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid container style={{ width: "100%" }}>
                      <Excel
                        title={title}
                        buttonText="Export Data to Excel"
                        headCells={headcells}
                        recordsAfterSorting={recordsAfterAndSorting}
                        filterFields={filterFields}
                      />
                      <Print
                        title={title}
                        buttonText="Export Data to Excel"
                        headCells={headcells}
                        recordsAfterSorting={recordsAfterAndSorting}
                        filter={filter}
                        filterFields={filterFields}
                      />
                      <MultipleSelectCheckmarks
                        headcells={headcells}
                        setheadcells={setheadcells}
                        initialHeadCells={headCells}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </Grid>{" "}
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <StaticDatePickerLandscape
                      size="small"
                      name="expDate"
                      label="Expiry Before"
                      value={filter}
                      setValue={setFilter}
                      style={{ top: 20 }}
                    />
                  </Grid>
                </Grid>
              </Toolbar>{" "}
              <TableContainer>
                <TblContainer>
                  <TblHead />
                  {loading ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {finalRecords.map((item, index) => (
                        <TableRow>
                          {headcells.map((headcell, i) => (
                            <TableCell
                              key={headcell.id}
                              // sortDirection={orderBy === headcell.id ? order : false}
                              style={{
                                borderRight: "1px solid rgba(0,0,0,0.2)",
                              }}
                            >
                              {
                                //all this for not repeat same prodName & prodCode
                                (headcell.feild == "prodCode" ||
                                  headcell.feild == "prodName") &&
                                index !== 0 //cant compare with prev element if 0
                                  ? item[headcell.feild] ==
                                    finalRecords[index - 1][headcell.feild]
                                    ? ""
                                    : item[headcell.feild]
                                  : item[headcell.feild]
                              }
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
                </Grid>{" "}
                <Grid item xs={6}>
                  <SmartAutosuggest
                    name1="prodName"
                    code1="prodCode"
                    name2="prodName"
                    code2="prodCode"
                    options1={[
                      ...new Set(records.map((item) => item.prodName)),
                    ]}
                    options2={records}
                    label="Product"
                    value={filter}
                    setValue={setFilter}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controls.Button
                    text="Submit"
                    onClick={(e) => {
                      handleFilterSubmit(e);
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
      \{" "}
    </>
  );
}
