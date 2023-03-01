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
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
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
import MultipleSelectCheckmarks from "../../components/multiSelect";
import Filter from "../../components/filterButton";
import DateCalc from "../../components/dateCalc";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import DcValues from "../Inventory/D.C/DcValues";
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

function getD() {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return oneMonthAgo;
}
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

export default function DCReport({ docCode }) {
  const headCells = [
    { id: `${docCode} no`, label: `${docCode} no`, feild: "vouNo" },
    { id: "Date", label: "Date", feild: "vouDate" },
    { id: "Party", label: "Party", feild: "partyName" },
    { id: "Product Code", label: "Product Code", feild: "prodCode" },
    { id: "Product", label: "Product", feild: "prodName" },
    { id: "Quantity", label: "Quantity", feild: "qty" },
    { id: "Rate", label: "Rate", feild: "rate" },
    { id: "Discount", label: "Discount", feild: "discount" },
    { id: "GST", label: "GST", feild: "gst" },
    { id: "%", label: "%", feild: "gstP" },
    { id: "Bill Amt", label: "Bill Amt", feild: "itemAmount" },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
  const { getD } = DateCalc(user);

  const initialFilterValues = {
    ...initialReport,
    refNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
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
  const [loading1, setLoading1] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialReport]);
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
  console.log(Config.batch);
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
  function getGr(arr, code) {
    let ref = "";
    console.log(arr, code);
    arr.map((item) => {
      if (item.vouNo == code) ref = item.qty;
    });
    return ref;
  }
  if ((records[0] && records[0].vouNo == "X X X X") || refresh) {
    const qrObj = JSON.stringify({ $in: ["SI", docCode] });
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&startDate=${filter.startDate}&endDate=${filter.endDate}&docCode=${qrObj}&yearStart=${user.yearStartDate}`;
    const token = AuthHandler.getLoginToken();
    console.log(query);
    axios
      .get(Config.both + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        let si = response.data.inv_voucherItems.filter(
          (item) => item.docCode == "SI"
        );
        let dc = response.data.inv_voucherItems.filter(
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
          accounts: getAccounts(response.data.mst_accounts),
          voucherItems: getVouItems(response.data.inv_voucherItems),
          adress: getAdress(response.data.mst_acadress),
          payTerms: getPayterms(response.data.mst_paymentTerm),
          products: getProd(response.data.mst_prodMaster),
        };
        setCommon(cmnData);
        let report = [];
        console.log("DC=>", dc);
        let siVou = response.data.inv_voucher.filter(
          (item) => item.docCode == "SI"
        );

        response.data.inv_voucher
          .filter((item) => item.docCode == docCode)
          .map((voucher, i) => {
            let arr = [];
            arr = dc.filter((vouItem) => voucher.vouNo == vouItem.vouNo);
            let deliveredGr = "";
            siVou.map((it) => {
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
                  deliveredQty: getGr(si, deliveredGr),
                  vouDate: getDate(item.vouDate),
                });
              });
            }
          });
        console.log(report);
        if (report.length !== 0) setRecords(report);
        else {
          setRecords([{ ...initialReport, vouNo: "" }]);
        }
        if (refresh) setRefresh(false);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
        setRecords([{ ...initialReport, vouNo: "" }]);

        console.log(error);
      })
      .finally(() => {});
  }

  function onDelete(item) {
    // roleService.deleteBranch(item);
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.refNo !== item.refNo;
    });
    if (newRecord.length == 0) {
      setRecords([initialFilterValues]);
    } else {
      setRecords(newRecord);
    }

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const token = AuthHandler.getLoginToken();
    axios
      .delete(Config.batch + query, {
        headers: {
          authorization: "Bearer" + token,
        },
        data: item,
      })
      .catch((err) => {
        console.log(err);
      });
  }

  console.log(products);
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

  console.log(filter.allFields);
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

    const token = AuthHandler.getLoginToken();
    setButtonPopup(false);
    if (x) {
      axios
        .put(
          Config.batch + query,
          {
            obj: {
              input: input,
            },
          },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          const res = response.data.values;
          console.log(response.data);
          setRecords([
            ...records,
            {
              ...res,
              getDate: getDate(res.vouDate),
            },
          ]);
          setNotify({
            isOpen: true,
            message: "Voucher created  successfully",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err.err);
        });
    } else {
      axios
        .patch(
          Config.batch + query,
          {
            obj: {
              input: input,
            },
          },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          const updatedRecords = records.map((item) =>
            item.refNo == input.refNo ? response.data.values : item
          );
          setRecords(updatedRecords);

          setNotify({
            isOpen: true,
            message: "Voucher updated  successfully",
            type: "success",
          });
        });
    }
  };
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
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
                              buttonText="Export Data to Excel"
                              TblContainer={TblContainer}
                              TblHead={TblHead}
                              TblPagination={TblPagination}
                              headCells={headCells}
                              recordsAfterSorting={recordsAfterAndSorting}
                            />
                            <Print
                              buttonText="Export Data to Excel"
                              TblContainer={TblContainer}
                              TblHead={TblHead}
                              TblPagination={TblPagination}
                              headCells={headcells}
                              recordsAfterSorting={recordsAfterAndSorting}
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
                              setValues({ ...initialReport, refNo: "" });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>{" "}
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
                                    {headcell.label == "Edit" ? (
                                      <>
                                        <Controls.LoadingActionButton
                                          value={values}
                                          color="primary"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setValues(item);
                                            setButtonPopup(true);
                                          }}
                                        >
                                          <EditOutlinedIcon fontSize="small" />
                                        </Controls.LoadingActionButton>
                                        <Controls.ActionButton
                                          color="secondary"
                                          onClick={(e) => {
                                            e.preventDefault();

                                            setConfirmDialog({
                                              isOpen: true,
                                              title:
                                                "Are you sure to delete this record?",
                                              subTitle:
                                                "You can't undo this operation",
                                              onConfirm: (e) => {
                                                onDelete(item);
                                                console.log(
                                                  "records:" + records
                                                );
                                              },
                                            });
                                          }}
                                        >
                                          <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
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
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        style={{ justifyContent: "flex-end", display: "flex" }}
                      >
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
