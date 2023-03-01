import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import {
  Paper,
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
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Popup from "../../components/Popup";
import { Grid } from "@material-ui/core";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import ControlledAccordions from "../../components/accordions";
import ViewsDatePicker from "../../components/yearSelector";
import { useForm, Form } from "../../components/useForm";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import IconButton from "@material-ui/core/IconButton";
import { reactLocalStorage } from "reactjs-localstorage";
import Table from "@mui/material/Table";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import DcFilterForm from "./D.C/dcFilterForm";
import DcForm from "./design";
import DcValues from "./D.C/DcValues";
import Excel from "../../components/useExcel";
import Print from "../../components/print";
import PrintOne from "../../components/newPrintOne";
import MultipleSelectCheckmarks from "../../components/multiSelect";
import FilterForm from "./generalFilterForm";
import Filter from "../../components/filterButton";

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

export default function ReuseMaster(props) {
  const { docCode, title, initialValues, route } = props;
  const headCells = [
    {
      id: `${initialValues.docCode} NO`,
      label: `${initialValues.docCode} NO`,
      feild: "vouNo",
    },
    { id: "MANUAL NO", label: "MANUAL NO", feild: "manualNo" },
    { id: "DATE", label: "DATE", feild: "getDate" },
    { id: "PARTY", label: "PARTY", feild: "getName" },
    { id: "AMOUNT", label: "AMOUNT", feild: "netAmount" },
    { id: "Edit", label: "Edit" },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}&yearStart=${
    user.yearStartDate
  }`;
  const {
    initialAc,
    initialVouItem,
    initialAdress,
    initialPayValues,
    initialProdValues,
    initialCommonValues,
  } = DcValues();

  const initialFilterValues = {
    ...initialValues,
    prodCode: "",
    vouNo: "",
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
  const newParty = JSON.parse(localStorage.getItem("newParty"));
  const openOnRender = newParty.transactnOpen;

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(
    openOnRender ? openOnRender : false
  );
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
  const [loading1, setLoading1] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [common, setCommon] = useState(initialCommonValues);
  const [records, setRecords] = useState([initialValues]);
  const [reference, setReference] = useState([initialValues]);

  const [filter, setFilter] = useState(initialFilterValues);
  const [itemList, setItemList] = useState([initialVouItem]);
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
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  console.log(values);
  console.log("filter=>", filter);

  function getName(code) {
    let name = "";
    common.accounts.map((item) => {
      if (code == item.acCode) {
        name = item.acName;
      }
    });
    return name;
  }
  if (records[0].vouNo == "X X X X") {
    let temp = "MANUAL NO";
    let arr = headCells.filter((item) => !temp.includes(item.label));
    console.log(temp, arr);
    if (arr.length !== headcells.length) {
      setSelected(["MANUAL NO"]);
      setheadcells(arr);
    }
  }
  console.log(Config[route]);
  if (loading1 || refresh) {
    let qry = initialValues.docCode;
    if (initialValues.docCode == "GR") {
      qry = JSON.stringify({ $in: ["GR", "PO"] });
    }
    if (initialValues.docCode == "SI") {
      qry = JSON.stringify({ $in: ["SI", "DC", "QT"] });
    }

    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&startDate=${filter.startDate}&endDate=${filter.endDate}&docCode=${qry}&yearStart=${user.yearStartDate}`;
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config[route] + query, {
        headers: {
          authorization: "Bearer" + token,
        },
        data: initialValues,
      })
      .then((response) => {
        console.log(response.data);
        if (loading1) setLoading1(false);
        if (refresh) setRefresh(false);

        const gr = response.data.inv_voucher
          .filter((item) => item.docCode == docCode)
          .map((item) => {
            return {
              ...item,
              getDate: getDate(item.vouDate),
              getName: getName(item.partyCode),
            };
          });

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
            return [initialVouItem];
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
        const prodData = response.data.mst_prodMaster;
        setCommon({
          accounts: getAccounts(response.data.mst_accounts),
          voucherItems: getVouItems(response.data.inv_voucherItems),
          adress: getAdress(response.data.mst_acadress),
          payTerms: getPayterms(response.data.mst_paymentTerm),
          products: prodData.length == 0 ? initialProdValues : prodData,
        });
        const po = response.data.inv_voucher.filter(
          (item) => item.docCode !== docCode
        );
        if (po.length !== 0) {
          setReference(po);
        }
        if (gr.length !== 0) {
          setRecords(gr);
        } else {
          setRecords([{ ...initialValues, vouNo: "" }]);
        }
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

  console.log(records, common);
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
    axios
      .delete(Config[route] + query, {
        headers: {
          authorization: "Bearer" + token,
        },
        data: item,
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // console.log(count);
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
          if (
            item.vouNo.toLowerCase().includes(allfields.toLowerCase()) ||
            item.manualNo.toLowerCase().includes(allfields.toLowerCase()) ||
            getDate(item.vouDate).includes(allfields.toLowerCase())
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

  const handleSubmit = (input, itemList) => {
    let x = true;
    records.map((item) => {
      if (item.vouNo == input.vouNo) {
        x = false;
      }
    });
    setButtonPopup(false);
    console.log(input, itemList, new Date(input.vouDate), x);
    const token = AuthHandler.getLoginToken();
    // setButtonPopup(false);
    if (x) {
      axios
        .put(
          // Config.addUser,
          Config[route] + query,
          {
            obj: {
              input: input,
              itemList: itemList,
            },
          },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          const res = response.data.values;
          setRecords([
            ...records,
            {
              ...res,
              getDate: getDate(res.vouDate),
              getName: getName(res.partyCode),
            },
          ]);
          // setVoucherItems([...voucherItems, ...response.data.items]);
          setCommon({
            ...common,
            voucherItems: [...common.voucherItems, ...response.data.items],
          });
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
          Config[route] + query,
          {
            obj: {
              input: input,
              itemList: itemList,
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
            item.vouNo == input.vouNo ? response.data.values : item
          );
          setRecords(updatedRecords);
          const newVouItems = common.voucherItems.filter(
            (item) => item.vouNo !== input.vouNo
          );
          setCommon({
            ...common,
            voucherItems: [...newVouItems, ...itemList],
          });

          setNotify({
            isOpen: true,
            message: "Voucher updated  successfully",
            type: "success",
          });
        });
    }
  };
  function getEntry(code, signal, type) {
    const token = AuthHandler.getLoginToken();
    let newValue = values;
    axios
      .post(
        // Config.addUser,
        Config[route] + query,
        { code: code, type: "entry" },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setValues(response.data.values);
        let restOfVouItems = common.voucherItems.filter(
          (item) => item.vouNo != code
        );
        setCommon({
          ...common,
          voucherItems: [...restOfVouItems, ...response.data.itemList],
        });
        newValue = response.data.values;
        setLatestVouItems(code, response.data.itemList);
      })
      .catch((err) => {
        console.log(err);
        setNotify({
          isOpen: true,
          message: "unable to fetch entry",
          type: "warn",
        });
      })
      .finally(() => {
        if (signal == "v") {
          setButtonPopup(true);
          // setLoading("X X X X");
        } else {
          setPrint(true);
        }
      });
    return newValue;
  }
  let componentRef = React.useRef();
  function setLatestVouItems(voucherNumber, latestData) {
    let arr = [];
    arr = latestData.filter((item) => item.vouNo == voucherNumber);
    console.log(arr, latestData, itemList, voucherNumber);
    if (arr.length !== 0) {
      setItemList(arr);
    } else {
      setItemList([initialVouItem]);
    }
  }
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
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
                              setValues({ ...initialValues, vouNo: "" });
                              setItemList([initialVouItem]);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>{" "}
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {loading1 ? (
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
                                            getEntry(item.vouNo, "v");
                                            // setLoading(item.vouNo);
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
                                        <Controls.ActionButton>
                                          <PrintOne
                                            key={i}
                                            values={values}
                                            item={item}
                                            voucherItems={common.voucherItems}
                                            adress={common.adress}
                                            accounts={common.accounts}
                                            products={common.products}
                                            payTerms={common.payTerms}
                                            getEntry={getEntry}
                                            setopen={setPrint}
                                            printPopup={print}
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
                    size="lg"
                    title={`${title} form`}
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    style={{ padding: "0px" }}
                  >
                    <DcForm
                      records={records}
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
                      initialVouItem={initialVouItem}
                      setCommon={setCommon}
                      common={common}
                      itemList={itemList}
                      setItemList={setItemList}
                      title={title}
                      reference={reference}
                    />
                  </Popup>

                  <Popup
                    title={`Filter form`}
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
                      initialFilterValues={initialFilterValues}
                      setRefresh={setRefresh}
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
