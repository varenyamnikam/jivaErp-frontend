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
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import StockConversionForm from "./stockConversionForm.js";
import Excel from "../../../components/useExcel";
import Print from "../../../components/print";
import MultipleSelectCheckmarks from "../../../components/multiSelect";
import Filter from "../../../components/filterButton";
import * as roleService from "../../../services/roleService";
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutoSuggest from "../../../components/smartAutoSuggest";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";

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
  prodCode1: "",
  prodCode2: "",
  prodName1: "",
  prodName2: "",
  batchNo: "",
  qty1: "",
  qty2: "",
  refNo: "",
  vouDate: new Date(),
  entryBy: "",
  entryOn: "",
  userCompanyCode: "",
  expDate: new Date(),
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
export default function StockConversionMaster({ title = "Stock Conversion" }) {
  const headCells = [
    { id: "VOUCHER NO", label: "VOUCHER NO", feild: "refNo" },
    { id: "Product 1", label: "Product 1", feild: "prodCode1" },
    { id: "Product 2", label: "Product 2", feild: "prodCode2" },
    { id: "DATE", label: "DATE", feild: "getDate" },
    { id: "Edit", label: "Edit", feild: "" },
  ];
  const filterFields = [
    { feild: "prodName1", label: "Product Name 1" },
    { feild: "prodName2", label: "Product Name 2" },
    { feild: "vouNo", label: "Voucher No" },
  ];

  const settings = AuthHandler.getSettings();
  const user = AuthHandler.getUser();

  const initialFilterValues = {
    ...initialValues,
    refNo: "",
    allFields: "",
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
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

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
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
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  console.log(records, recordsAfterAndSorting());
  console.log("filter=>", filter);
  console.log(settings);
  let query = `&useBatch=${settings.userBatchNo}&vouN=${values.refNo}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;
  const url = Config().stockConversion + query;
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    console.error(err);
    loading && setLoading(false);
  };

  if (loading) {
    const handleRes = (res) => {
      console.log(res.data);
      if (res.data.records.length !== 0) {
        let arr = res.data.records.map((item) => ({
          ...item,
          getDate: roleService.date(item.vouDate),
        }));
        console.log(arr);
        setRecords(arr);
      }

      if (res.data.prod.length !== 0) {
        setProducts(res.data.prod);
      }
      loading && setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }

  function onDelete(item) {
    // roleService.deleteBranch(item);

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const handleRes = (res) => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.refNo !== item.refNo;
      });
      if (newRecord.length == 0) {
        setRecords([initialFilterValues]);
      } else {
        setRecords(newRecord);
      }
    };
    roleService.axiosDelete(url, item, handleRes, handleErr);
  }

  console.log(products);
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
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

  const handleSubmit = (input) => {
    let x = true;
    records.map((item) => {
      if (item.refNo == input.refNo) {
        x = false;
      }
    });
    console.log(input, x);
    // setButtonPopup(false);
    if (x) {
      const handleRes = (response) => {
        if (response.data.inserted) {
          let returnValues = response.data.values;
          console.log(response.data);
          setRecords([
            ...records,
            {
              ...input,
              refNo: returnValues.refNo,
              getDate: roleService.date(returnValues.vouDate),
            },
          ]);
          setNotify(NotifyMsg(1));
        } else {
          const availableStock = response.data.availableStock;
          setNotify({
            isOpen: true,
            message: `Insufficient Stock only ${availableStock} qty available`,
            type: "warning",
          });
        }
      };
      console.log(url);
      roleService.axiosPut(url, input, handleRes, handleErr);
    } else {
      const handleRes = (response) => {
        console.log(response);
        if (response.data.inserted) {
          const returnValues = input;
          const updatedRecords = records.map((item) => {
            return item.refNo == returnValues.refNo
              ? {
                  ...returnValues,
                  getDate: roleService.date(returnValues.vouDate),
                }
              : item;
          });
          setRecords(updatedRecords);
          setNotify(NotifyMsg(2));
        } else {
          const availableStock = response.data.availableStock;
          setNotify({
            isOpen: true,
            message: `Insufficient Stock only ${availableStock} qty available`,
            type: "warning",
          });
        }
      };
      roleService.axiosPatch(url, input, handleRes, handleErr);
    }
  };
  function handleFilterSubmit() {
    console.log(filter);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        if (filter.startDate && filter.endDate) {
          newRecords = newRecords.filter((item) => {
            if (
              new Date(item.vouDate).setUTCHours(0, 0, 0, 0) >=
                new Date(filter.startDate).setUTCHours(0, 0, 0, 0) &&
              new Date(item.vouDate).setUTCHours(0, 0, 0, 0) <=
                new Date(filter.endDate).setUTCHours(0, 0, 0, 0)
            )
              return item;
          });
          console.log(newRecords);
        }
        if (filter.prodCode1) {
          newRecords = newRecords.filter(
            (item) => item.prodCode1 == filter.prodCode1
          );
          console.log(newRecords, filter.prodCode1);
        }
        if (filter.prodCode2) {
          newRecords = newRecords.filter(
            (item) => item.prodCode2 == filter.prodCode2
          );
          console.log(newRecords, filter.prodCode2);
        }

        return newRecords;
      },
    });
    // setLoading(true);
  }
  const prodOptions = products.map((item) => item.prodName);
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
                <Grid container style={{ display: "flex", flexGrow: 1 }}>
                  <Grid
                    item
                    xs={8}
                    sm={6}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Controls.Input
                      label="Search"
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
                      value={filter.allFields}
                      onChange={handleFilter}
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
                      setFilterPopup={setFilterPopup}
                      setFilter={setFilter}
                      setFilterFn={setFilterFn}
                      initialFilterValues={initialFilterValues}
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
                        buttonText="Export Data to Excel"
                        title={title}
                        headCells={headcells}
                        recordsAfterSorting={recordsAfterAndSorting}
                        filterFields={filterFields}
                        filter={filter}
                      />
                      <Print
                        title={title}
                        buttonText="Export Data to Excel"
                        headCells={headcells}
                        recordsAfterSorting={recordsAfterAndSorting}
                        filterFields={filterFields}
                        filter={filter}
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
                    sm={2}
                    xs={12}
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
                        setValues({ ...initialValues, refNo: "" });
                      }}
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
                              {headcell.label == "Edit" ? (
                                <>
                                  <Controls.EditButton
                                    handleClick={() => {
                                      setValues(item);
                                      setButtonPopup(true);
                                    }}
                                  />
                                  <Controls.DeleteButton
                                    handleConfirm={() => {
                                      AuthHandler.canDelete()
                                        ? onDelete(item)
                                        : setNotify(NotifyMsg(8));
                                    }}
                                    setConfirmDialog={setConfirmDialog}
                                  />
                                </>
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
              title="Filter"
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
              size="md"
            >
              <StockConversionForm
                records={records}
                setRecords={setRecords}
                values={values}
                setValues={setValues}
                initialValues={initialValues}
                initialFilterValues={initialFilterValues}
                setButtonPopup={setButtonPopup}
                setNotify={setNotify}
                openPopup={buttonPopup}
                products={products}
                handleSubmit={handleSubmit}
              />
            </Popup>

            <Popup
              title="Filter"
              openPopup={filterPopup}
              setOpenPopup={setFilterPopup}
            >
              {" "}
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
                <Grid item xs={12} sm={6}>
                  <SmartAutoSuggest
                    name1="prodName1"
                    code1="prodCode1"
                    name2="prodName"
                    code2="prodCode"
                    label="Product 1"
                    value={filter}
                    setValue={setFilter}
                    options1={prodOptions}
                    options2={products}
                  />
                </Grid>{" "}
                <Grid item xs={12} sm={6}>
                  <SmartAutoSuggest
                    name1="prodName2"
                    code1="prodCode2"
                    name2="prodName"
                    code2="prodCode"
                    label="Product 2"
                    value={filter}
                    setValue={setFilter}
                    options1={prodOptions}
                    options2={products}
                  />
                </Grid>{" "}
                <Grid item xs={3}>
                  <Controls.Button
                    text="Reset"
                    color="inherit"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter(initialFilterValues);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Controls.Button
                    type="submit"
                    text="Apply"
                    onClick={(e) => {
                      e.preventDefault();
                      // searchFilter();
                      handleFilterSubmit();
                      setFilterPopup(false);
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
