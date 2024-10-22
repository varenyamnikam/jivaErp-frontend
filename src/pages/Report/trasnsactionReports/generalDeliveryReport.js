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
import Excel from "../../../components/useExcel";
import Print from "../../../components/print";
import MultipleSelectCheckmarks from "../../../components/multiSelect";
import Filter from "../../../components/filterButton";
import DateCalc from "../../../components/dateCalc";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import DcValues from "../../Inventory/D.C/DcValues";
import ExportSwitch from "../../../components/controls/Switch";
import { NotifyMsg } from "../../../components/notificationMsg";
import * as roleService from "../../../services/roleService";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
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
const {
  initialAc,
  vouItems,
  initialAdress,
  initialPayValues,
  initialProdValues,
  initialCommonValues,
} = DcValues();

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
const initialReport = {
  vouNo: "X X X X",
  vouSrNo: "",
  vouDate: null,
  partyCode: "",
  partyName: "",
  prodCode: "",
  prodName: "",
  qty: "",
  rate: "",
  qr: "",
  discount: "",
  gst: "",
  gstP: "",
  deliveredQty: "",
};

export default function POReport({ deliveryDocCode = "GR", docCode = "PO" }) {
  const title = `${docCode} Report`;

  const filterFields = [
    { feild: "prodName", label: "Product Name" },
    { feild: "partyName", label: "Party Name" },
  ];

  const headCells = [
    { id: `${docCode} No`, label: `${docCode} No`, feild: "vouNo" },
    { id: "Date", label: "Date", feild: "vouDate" },
    { id: "Party", label: "Party", feild: "partyName" },
    { id: "Product Code", label: "Product Code", feild: "prodCode" },
    { id: "Product", label: "Product", feild: "prodName" },
    { id: "Quantity", label: "Quantity", feild: "qty", align: "right" },
    { id: "Rate", label: "Rate", feild: "rate", align: "right" },
    { id: "Discount", label: "Discount", feild: "discount", align: "right" },
    { id: "GST", label: "GST", feild: "gst", align: "right" },
    { id: "%", label: "%", feild: "gstP", align: "right" },
    { id: "Bill Amt", label: "Bill Amt", feild: "itemAmount", align: "right" },
    {
      id: "Delivered",
      label: "Delivered",
      feild: "deliveredQty",
      align: "right",
    },
  ];
  const user = AuthHandler.getUser();
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;

  const { getD } = DateCalc(user);

  const initialFilterValues = {
    ...initialReport,
    refNo: "",
    allFields: "",
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
  };
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.vouNo !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };

  const [values, setValues] = useState(initialReport);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([initialReport]);
  const [filter, setFilter] = useState(initialFilterValues);
  const [products, setProducts] = useState([initialProducts]);
  const [delivered, setDelivered] = useState(false);
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
  const [common, setCommon] = useState(initialCommonValues);

  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  console.log(values, records);
  console.log("filter=>", filter);
  console.log(Config().batch);
  function getPartyName(code, arr) {
    let name = "";
    console.log(arr, code);
    arr.map((item) => {
      if (code == item.acCode) {
        name = item.acName;
      }
    });
    return name;
  }
  function getProdName(code, arr) {
    let name = "";
    console.log(arr, code);
    arr.map((item) => {
      if (code == item.prodCode) {
        name = item.prodName;
      }
    });
    return name;
  }

  function rnd(no) {
    return Number(no)
      .toFixed(2)
      .replace(/(\.0+|0+)$/, "");
  }

  function calc(obj) {
    let tot = 0;
    let totP = 0;
    totP = rnd(Number(obj.cgstP) + Number(obj.igstP) + Number(obj.sgstP));
    tot = rnd(Number(obj.cgst) + Number(obj.igst) + Number(obj.sgst));
    return { tot: tot, totP: totP };
  }
  function getGr(arr, orderCode, prodCode) {
    let ref = "0";
    console.log(arr, orderCode);
    arr.map((item) => {
      if (item.vouNo == orderCode && item.prodCode == prodCode) ref = item.qty;
    });
    return ref;
  }
  if (loading) {
    const qrObj = JSON.stringify({ $in: [deliveryDocCode, docCode] });
    const query = `&startDate=${filter.startDate}&endDate=${filter.endDate}&docCode=${qrObj}&yearStart=${user.yearStartDate}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;
    console.log(query);
    const url = Config().both + query;

    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.error(err);
    };
    const handleRes = (res) => {
      console.log(res.data);
      let deliveredItems = res.data.inv_voucherItems.filter(
        (item) => item.docCode == deliveryDocCode
      );
      let orederedItems = res.data.inv_voucherItems.filter(
        (item) => item.docCode == docCode
      );

      function getAccounts(arr) {
        if (arr.length !== 0) {
          return arr;
        } else {
          return [initialAc];
        }
      }
      function getVouItems(arr) {
        if (arr.length !== 0) {
          return arr;
        } else {
          return [vouItems];
        }
      }
      function getAdress(arr) {
        if (arr.length !== 0) {
          return arr;
        } else {
          return [initialAdress];
        }
      }
      function getPayterms(arr) {
        if (arr.length !== 0) {
          return arr;
        } else {
          return [initialPayValues];
        }
      }
      function getProd(arr) {
        if (arr.length !== 0) {
          return arr;
        } else {
          return [initialProdValues];
        }
      }
      let cmnData = {
        accounts: getAccounts(res.data.mst_accounts),
        voucherItems: getVouItems(res.data.inv_voucherItems),
        adress: getAdress(res.data.mst_acadress),
        payTerms: getPayterms(res.data.mst_paymentTerm),
        products: getProd(res.data.mst_prodMaster),
      };
      setCommon(cmnData);
      let report = [];
      console.log("PO=>", orederedItems);
      let grVou = res.data.inv_voucher.filter(
        (item) => item.docCode == deliveryDocCode
      );

      res.data.inv_voucher
        .filter((item) => item.docCode == docCode)
        .map((voucher, i) => {
          let arr = [];
          arr = orederedItems.filter(
            (vouItem) => voucher.vouNo == vouItem.vouNo
          );
          let deliveredGr = "";
          grVou.map((it) => {
            if (it.refNo == voucher.vouNo) deliveredGr = it.vouNo;
          });
          if (arr.length != 0) {
            console.log(arr, voucher);
            arr.map((item) => {
              report.push({
                ...item,
                itemAmount: voucher.itemTotal,
                prodName: getProdName(item.prodCode, cmnData.products),
                partyCode: voucher.partyCode,
                partyName: getPartyName(voucher.partyCode, cmnData.accounts),
                gst: calc(item).tot,
                gstP: calc(item).totP,
                deliveredQty: Number(
                  getGr(deliveredItems, deliveredGr, item.prodCode)
                ),
                vouDate: roleService.date(item.vouDate),
              });
            });
          }
        });
      console.log(report);
      if (report.length !== 0) setRecords(report);
      else {
        setRecords([{ ...initialReport, vouNo: "" }]);
      }
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {
      loading && setLoading(false);
    });
  }

  console.log(products);
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
          if (item.vouNo.toLowerCase().includes(allfields.toLowerCase()))
            return item;
          // item.talukaName == filter.allfields ||
          // item.branchName == filter.allfields
        });
        function dynamicFilterFn(feild) {
          console.log(feild, filter, filter[feild]);
          newRecords.map((item) => {
            console.log(item, filter[feild]);
          });
          newRecords = newRecords.filter(
            (item) => item[feild] == filter[feild]
          );
          console.log(feild, newRecords);
        }
        filter.partyCode && dynamicFilterFn("partyCode");
        filter.prodCode && dynamicFilterFn("prodCode");

        console.log(newRecords);
        return newRecords;
      },
    });
  }
  const partyOptions = common.accounts
    .filter((item) => item.preFix == "C" || item.preFix == "S")
    .map((item) => {
      return item.acName;
    });
  const prodOptions = common.products.map((item) => {
    return item.prodName;
  });

  return (
    <>
      <PageHeader
        title={`${docCode} Report`}
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
                      filterIcon={filterIcon}
                      setFilterPopup={setFilterPopup}
                      setFilter={setFilter}
                      setFilterFn={setFilterFn}
                      setFilterIcon={setFilterIcon}
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
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>Pending</Typography>
                    <ExportSwitch
                      checked={delivered}
                      onChange={() => {
                        setDelivered((prev) => !prev);
                      }}
                    />{" "}
                    <Typography>Delivered</Typography>
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
                      {recordsAfterPagingAndSorting().map((item) =>
                        delivered
                          ? item.deliveredQty >= item.qty && (
                              <TableRow>
                                {headcells.map((headcell, i) => (
                                  <TableCell
                                    key={headcell.id}
                                    // sortDirection={orderBy === headcell.id ? order : false}
                                    style={{
                                      borderRight: "1px solid rgba(0,0,0,0.2)",
                                    }}
                                    align={headcell.align}
                                  >
                                    {item[headcell.feild]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                          : item.deliveredQty < item.qty && (
                              <TableRow>
                                {headcells.map((headcell, i) => (
                                  <TableCell
                                    key={headcell.id}
                                    // sortDirection={orderBy === headcell.id ? order : false}
                                    style={{
                                      borderRight: "1px solid rgba(0,0,0,0.2)",
                                    }}
                                  >
                                    {item[headcell.feild]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                      )}
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
            ></Popup>

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
                    name1="partyName"
                    code1="partyCode"
                    label="Party"
                    name2="acName"
                    code2="acCode"
                    value={filter}
                    setValue={setFilter}
                    options1={partyOptions}
                    options2={common.accounts}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SmartAutosuggest
                    name1="prodName"
                    code1="prodCode"
                    label="Product"
                    name2="prodName"
                    code2="prodCode"
                    value={filter}
                    setValue={setFilter}
                    options1={prodOptions}
                    options2={common.products}
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
