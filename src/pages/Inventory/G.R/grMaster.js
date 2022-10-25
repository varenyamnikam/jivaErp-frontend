import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
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
  TableHead,
} from "@material-ui/core";

import useAcTable from "../../../components/useAcTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import ControlledAccordions from "../../../components/accordions";
import ViewsDatePicker from "../../../components/yearSelector";
import { useForm, Form } from "../../../components/useForm";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import IconButton from "@material-ui/core/IconButton";
import { reactLocalStorage } from "reactjs-localstorage";
import Table from "@mui/material/Table";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import DcForm from "../generalForm";
import GrValues from "./grValues";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Excel from "../../../components/useExcel";
import Filter from "../../../components/filterButton";
import FilterForm from "../generalFilterForm";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import PrintOne from "../../../components/printOne";

const headCells = [
  { id: "GR NO", label: "GR NO", feild: "vouNo" },
  { id: "MANUAL NO", label: "MANUAL NO", feild: "manualNo" },
  { id: "DATE", label: "DATE", feild: "getDate" },
  { id: "PARTY", label: "PARTY", feild: "getName" },
  { id: "AMOUNT", label: "AMOUNT", feild: "netAmount" },
  { id: "Edit", label: "Edit" },
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
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.vouNo !== "") return item;
    });
    console.log(newRecords);
    return newRecords;
  },
};

export default function GrMaster(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const {
    initialValues,
    initialAc,
    vouItems,
    initialAdress,
    initialPayValues,
    initialProdValues,
    initialCommonValues,
  } = GrValues();
  function getD() {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return oneMonthAgo;
  }

  const initialFilterValues = {
    ...initialValues,
    vouNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
  };

  const [records, setRecords] = useState([initialValues]);
  const [voucherItems, setVoucherItems] = useState([vouItems]);
  const [accounts, setAccounts] = useState([initialAc]);
  const [adress, setAdress] = useState([initialAdress]);
  const [payTerms, setPayTerms] = useState([initialPayValues]);
  const [products, setProducts] = useState([initialProdValues]);
  const [filter, setFilter] = useState(initialFilterValues);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [common, setCommon] = useState(initialCommonValues);
  const [loading, setLoading] = useState("X X X X");
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
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    Buttons,
    headcells,
    TblBody,
  } = useAcTable(
    common.records,
    headCells,
    filterFn,
    common.voucherItems,
    common.adress,
    common.accounts,
    common.products,
    common.payTerms,
    loading
  );
  console.log(headcells, common);
  console.log(values);
  console.log("filter=>", filter);
  // console.log(accounts[0], accounts[0].acCode);
  if (common.records[0] && common.records[0].vouNo == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.dc + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        // if (response.data.mst_accounts.length !== 0) {
        //   setAccounts(response.data.mst_accounts);
        // } else {
        //   setAccounts([initialAc]);
        // }
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
        function getProducts(arr) {
          if (arr.length !== 0) {
            return arr;
          } else {
            return [initialProdValues];
          }
        }
        // const gr = response.data.inv_voucher
        // .filter((item) => item.docCode == "GR")
        // .map((item) => {
        //   return {
        //     ...item,
        //     getDate: getDate(item.vouDate),
        //     getName: getName(item.partyCode),
        //   };
        // });
        function getRecords(arr) {
          const gr = arr
            .filter((item) => item.docCode == "GR")
            .map((item) => {
              return {
                ...item,
                getDate: getDate(item.vouDate),
                getName: getName(item.partyCode),
              };
            });
          if (gr.length !== 0) {
            return gr;
          } else {
            return [{ ...initialValues, vouNo: "" }];
          }
        }
        // if (gr.length !== 0) {
        //   setRecords(gr);
        // } else {
        //   setRecords([{ ...initialValues, vouNo: "" }]);
        // }
        // if (response.d.length !== 0) {
        //   setVoucherItems(response.data.inv_voucherItems);
        // } else {
        //   setVoucherItems([vouItems]);
        // }

        // if (response.data.mst_acadress.length !== 0) {
        //   setAdress(response.data.mst_acadress);
        // } else {
        //   setAdress([initialAdress]);
        // }
        // if (response.data.mst_paymentTerm.length !== 0) {
        //   setPayTerms(response.data.mst_paymentTerm);
        // } else {
        //   setPayTerms([initialPayValues]);
        // }
        // if (response.data.mst_prodMaster.length !== 0) {
        //   setProducts(response.data.mst_prodMaster);
        // } else {
        //   setProducts([initialPayValues]);
        // }
        setCommon({
          accounts: getAccounts(response.data.mst_accounts),
          records: getRecords(response.data.inv_voucher),
          voucherItems: getVouItems(response.data.inv_voucherItems),
          adress: getAdress(response.data.mst_acadress),
          payTerms: getPayterms(response.data.mst_paymentTerm),
          products: getProducts(response.data.mst_prodMaster),
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  console.log(records);
  function onDelete(item) {
    // roleService.deleteBranch(item);
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.vouNo !== item.vouNo;
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
    axios.post(
      Config.dc + query,
      { item },
      {
        headers: {
          authorization: "Bearer" + token,
        },
      }
    );
  }

  // console.log(count);
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  function getDate(code) {
    const date = new Date(code);
    const zeroPad = (num, places) => String(num).padStart(places, "0");

    return (
      String(date.getDate()) +
      "/" +
      String(zeroPad(date.getMonth() + 1, 2)) +
      "/" +
      // String(date.getFullYear()).slice(-2)
      String(date.getFullYear())
    );
  }
  console.log(TblBody);
  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (
            item.vouNo.toLowerCase().includes(allfields.toLowerCase()) ||
            item.manualNo.toLowerCase().includes(allfields.toLowerCase()) ||
            item.partyCode.toLowerCase().includes(allfields.toLowerCase()) ||
            getDate(item.vouDate).includes(allfields.toLowerCase())
          )
            return item;
        });
        console.log(newRecords);
        return newRecords;
      },
    });
  }

  function getName(code) {
    let name = "";
    common.accounts.map((item) => {
      if (code == item.acCode) {
        name = item.acName;
      }
    });
    return name;
  }
  const handleSubmit = (input, itemList) => {
    let x = true;
    records.map((item) => {
      if (item.vouNo == input.vouNo) {
        x = false;
      }
    });
    const token = AuthHandler.getLoginToken();
    // setButtonPopup(false);
    if (x) {
      axios
        .put(
          // Config.addUser,
          Config.dc + query,
          { obj: { input: input, itemList: itemList } },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          let temp = {
            ...response.data.values,
            getDate: getDate(response.data.values.vouDate),
            getName: getName(response.data.values.partyCode),
          };
          setRecords([...records, temp]);
          setVoucherItems([...voucherItems, ...response.data.items]);
          setNotify({
            isOpen: true,
            message: "Voucher created  successfully",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .patch(
          // Config.addUser,
          Config.dc + query,
          { input: input },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          const updatedRecords = records.map((item) =>
            item.vouNo == input.vouNo ? response.data.values : item
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
  function getEntry(code) {
    const token = AuthHandler.getLoginToken();
    axios
      .post(
        // Config.addUser,
        Config.dc + query,
        { code: code },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setValues(response.data.values);
        setButtonPopup(true);
        setLoading("X X X X");
      })
      .catch((err) => {
        console.log(err);
        setNotify({
          isOpen: true,
          message: "unable to fetch entry",
          type: "warn",
        });
        setLoading("X X X X");
      });
  }

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="D.C"
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
                          <Buttons values={values} />
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
                              setValues({ ...initialValues, vouNo: "" });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>{" "}
                    <TableContainer id="grMaster">
                      <TblContainer>
                        <TblHead />
                        {common.records[0].vouNo == "X X X X" ? (
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
                                        <Controls.ActionButton
                                          color="primary"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            getEntry(item.vouNo);
                                            setLoading(item.vouNo);
                                          }}
                                        >
                                          {loading !== item.vouNo && (
                                            <EditOutlinedIcon fontSize="small" />
                                          )}

                                          {loading == item.vouNo && (
                                            <CircularProgress
                                              variant="indeterminate"
                                              disableShrink
                                              sx={{
                                                color: "blue",
                                                animationDuration: "550ms",

                                                [`& .${circularProgressClasses.circle}`]:
                                                  {
                                                    strokeLinecap: "round",
                                                  },
                                              }}
                                              size={18}
                                              thickness={4}
                                              {...props}
                                            />
                                          )}
                                        </Controls.ActionButton>
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
                                        <Controls.ActionButton>
                                          <PrintOne
                                            key={i}
                                            values={item}
                                            voucherItems={voucherItems}
                                            adress={adress}
                                            accounts={accounts}
                                            products={products}
                                            payTerms={payTerms}
                                          />
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
                  >
                    <DcForm
                      records={common.records}
                      setRecords={setRecords}
                      values={values}
                      setValues={setValues}
                      initialValues={initialValues}
                      initialFilterValues={initialFilterValues}
                      setButtonPopup={setButtonPopup}
                      setNotify={setNotify}
                      accounts={common.accounts}
                      adress={common.adress}
                      payTerms={common.payTerms}
                      products={common.products}
                      voucherItems={common.voucherItems}
                      openPopup={buttonPopup}
                      setOpenPopup={setButtonPopup}
                      handleSubmit={handleSubmit}
                      vouItems={vouItems}
                    />{" "}
                  </Popup>

                  <Popup
                    title="Filter"
                    openPopup={filterPopup}
                    setOpenPopup={setFilterPopup}
                  >
                    <FilterForm
                      filterIcon={filterIcon}
                      setFilterPopup={setFilterPopup}
                      setFilterIcon={setFilterIcon}
                      setFilter={setFilter}
                      filter={filter}
                      accounts={common.accounts}
                      products={common.products}
                      setFilterFn={setFilterFn}
                      voucherItems={common.voucherItems}
                    />
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
