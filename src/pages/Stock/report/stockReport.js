import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
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
import ExportSwitch from "../../../components/controls/Switch";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
import * as roleService from "../../../services/roleService";

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
  srNo: "0",
  prodCode: "0",
  openingStock: "0",
  inward: "0",
  outward: "0",
  closingStock: "0",
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
const initialStock = {
  prodCode: "",
  batchNo: "",
  inwardQty: "",
  outwardQty: "",
  rate: "",
  refType: "",
  refNo: "",
  expDate: "",
  vouDate: null,
};
const initialLedgerValues = {
  vouNo: "",
  rec: "",
  cumRec: "",
  issue: "",
  cumIssue: "",
  cumStock: "",
  prodCode: "",
  prodName: "",
};

export default function StockMaster({ title = "Stock Report" }) {
  const headCells = [
    { id: "Product Code", label: "Product Code", feild: "prodCode" },
    { id: "Product", label: "Product", feild: "prodName" },
    { id: "batch", label: "Batch", feild: "batchNo" },
    { id: "UOM", label: "UOM", feild: "UOM" },
    { id: "Opening Stock", label: "Opening Stock", feild: "openingStock" },
    { id: "Inward", label: "Inward", feild: "inward" },
    { id: "Outward", label: "Outward", feild: "outward" },
    { id: "Closing", label: "Closing", feild: "closingStock" },
    { id: "Reorder Level", label: "Reorder Level", feild: "reorderLevel" },
    { id: "Ledger", label: "Ledger" },
  ];
  const filterFields = [{ feild: "prodName", label: "Product Name" }];

  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  const { getD } = DateCalc(user);

  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
  };
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.refNo !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };

  const [ledger, setLedger] = useState([initialLedgerValues]);
  const [stock, setStock] = useState(initialStock);
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
  const setting = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  const initialkeepOpen = setting.keepBatchWiseStockOpen
    ? setting.keepBatchWiseStockOpen
    : false;

  const [batchWise, setBatchWise] = useState(initialkeepOpen);
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
  console.log("ledger=>", ledger);
  console.log(Config.batch);
  if (useBatch == "Yes" && batchWise) {
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
    if (useBatch == "Yes" && batchWise) batchWiseStock = "Yes";
    console.log(batchWiseStock);
    let query = `&startDate=${filter.startDate}&endDate=${filter.endDate}&yearCode=${user.defaultYearCode}&branchCode=${user.defaultBranchCode}&useBatch=${batchWiseStock}`;
    const token = AuthHandler.getLoginToken();
    console.log(query);
    axios
      .get(Config.stockReport + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setLoading(false);
        let data = response.data.records;
        let stk = response.data.stock;
        console.log(data, stk);
        mountStockData(data, stk);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      })
      .finally(() => {});
  }
  function mountStockData(data, stk) {
    if (stk.length != 0) setStock(stk);
    console.log(data, stk);
    let arr = [];

    data.map((item, i) => {
      let inward = item.currentStock.inward;
      let outward = item.currentStock.outward;

      let obj = {
        srNo: i + 1,
        prodCode: item.prodCode,
        openingStock: item.openingStock,
        inward: inward,
        outward: outward,
        closingStock: item.openingStock + inward - outward,
        reorderLevel: item.reorderLevel,
        prodName: item.prodName,
        UOM: item.UOM,
        batchNo: item.batchNo,
        stockOfTheMonth: item.stockOfTheMonth,
      };

      arr.push(obj);

      console.log(arr);
    });
    setRecords(arr);
    if (refresh) setRefresh(false);
  }
  console.log(products);
  function handleFilter(e) {
    console.log("hi..");
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  function handleSwitchChange(event) {
    setLoading(true);
    setBatchWise(event.target.checked);
    setRefresh(true);

    const prevSetting = JSON.parse(
      localStorage.getItem("adm_softwareSettings")
    );
    const newSetting = {
      ...prevSetting,
      keepBatchWiseStockOpen: event.target.checked,
    };
    localStorage.setItem("adm_softwareSettings", JSON.stringify(newSetting));
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

  function getEntry(entry) {
    let itemStock = entry.stockOfTheMonth;
    itemStock.sort((a, b) => {
      return new Date(a.vouDate).getTime() - new Date(b.vouDate).getTime();
    });
    console.log(itemStock);
    if (itemStock.length != 0) {
      let arr = [];
      let totIn = 0;
      let totOut = 0;
      let opening = 0;
      console.log(entry.openingStock);
      itemStock.map((item, i) => {
        opening =
          Number(entry.openingStock) +
          Number(item.inwardQty) -
          Number(item.outwardQty);
        totIn += Number(item.inwardQty);
        totOut += Number(item.outwardQty);
        arr[0] = {
          vouNo: "OPENING",
          rec: "",
          issue: "",
          cumRec: "",
          cumIssue: "",
          cumStock: entry.openingStock,
          prodCode: entry.prodCode,
          prodName: entry.prodName,
          vouDate: "",
        };

        let obj = {
          vouNo: item.refNo,
          rec: Number(item.inwardQty),
          issue: Number(item.outwardQty),
          cumRec: totIn,
          cumIssue: totOut,
          cumStock: entry.openingStock + totIn - totOut,
          prodCode: entry.prodCode,
          prodName: entry.prodName,
          vouDate: roleService.date(item.vouDate),
          batchNo: item.batchNo,
        };

        arr.push(obj);
      });
      if (useBatch == "Yes" && !batchWise) {
        // compress multiple objects with same vouNo into one object by
        // adding issue and rec of all the objects into final one
        console.log();
        let allUnique = [];
        let duplicate = [];
        //find duplicate entries
        arr.map((item) => {
          if (!allUnique.find((x) => item.vouNo == x)) {
            allUnique.push(item.vouNo);
          } else {
            if (!duplicate.find((x) => item.vouNo == x))
              duplicate.push(item.vouNo);
          }
        });

        console.log(duplicate);
        //add their fields into one object one by one for all duplicate
        // objects
        let compressed = duplicate.map((dup) => {
          //first duplicate
          let obj = arr.find((item) => item.vouNo == dup);
          //find all the duplicate obj
          let temp = arr.filter((item) => item.vouNo == dup);
          // add duplicates into one (first one)
          temp.map((item, i) => {
            if (i !== 0) {
              console.log(obj);
              obj.rec += item.rec;
              obj.issue += item.issue;
              obj.cumRec = item.cumRec;
              obj.cumIssue = item.cumIssue;
              obj.cumStock = item.cumStock;
              console.log(obj);
            }
          });
          return obj;
        });
        //now we have compressed(array of compressed obj)
        console.log(arr);
        console.log(compressed);
        //replace duplicates obj by compressed obj
        arr = arr.filter((item) => !duplicate.find((i) => i == item.vouNo));
        console.log(arr);
        compressed.map((item) => {
          arr.push(item);
        });
        // breathe in breathe out!
        console.log(arr);
      }
      arr.sort((a, b) => new Date(a.voudate) - new Date(b.voudate));
      console.log(arr);
      setLedger(
        arr.sort((a, b) => {
          const dateA = a.vouDate ? new Date(a.vouDate) : new Date(0);
          const dateB = b.vouDate ? new Date(b.vouDate) : new Date(0);
          return dateA - dateB;
        })
      );

      return arr;
    } else {
      console.log("empty");
      return [initialLedgerValues];
    }
  }
  function handleFilterSubmit() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        function dynamicFilterFn(feild) {
          console.log(feild, filter, filter[feild]);
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
        }
        Number(filter.prodCode) && dynamicFilterFn("prodCode");
        return newRecords;
      },
    });
  }
  const finalRecords = recordsAfterPagingAndSorting();
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
                  {useBatch == "Yes" && (
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
                      <ExportSwitch
                        checked={batchWise}
                        setChecked={setBatchWise}
                        onChange={handleSwitchChange}
                      />{" "}
                      <Typography>Batch Wise Stock</Typography>
                    </Grid>
                  )}
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
                              {headcell.label == "Ledger" ? (
                                <>
                                  <Controls.LoadingActionButton
                                    color="primary"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (
                                        Number(item.inward) == 0 &&
                                        Number(item.outward) == 0
                                      ) {
                                        setNotify({
                                          isOpen: true,
                                          message: "No change in stock",
                                          type: "warning",
                                        });
                                      } else {
                                        getEntry(item);
                                        setButtonPopup(true);
                                        console.log(item);
                                      }
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </Controls.LoadingActionButton>
                                </>
                              ) : (headcell.feild == "prodCode" || //dont repeat same
                                  headcell.feild == "prodName") && //prodName & prodCode
                                index !== 0 ? ( //cant compare with prev element if 0
                                item[headcell.feild] ==
                                finalRecords[index - 1][headcell.feild] ? (
                                  ""
                                ) : (
                                  item[headcell.feild]
                                )
                              ) : (
                                item[headcell.feild]
                              )}
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
              title={`Stock of ${ledger[0].prodName} (${
                ledger[0].prodCode
              }) from ${roleService.date(
                filter.startDate
              )} - to ${roleService.date(filter.endDate)}`}
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
              size="md"
            >
              <StockLedger records={ledger} />
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
                    onClick={() => {
                      handleFilterSubmit();
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
    </>
  );
}
