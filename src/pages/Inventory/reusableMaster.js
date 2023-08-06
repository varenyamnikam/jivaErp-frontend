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
import Table from "@mui/material/Table";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import DcFilterForm from "./D.C/dcFilterForm";
import GeneralForm from "./reusableForm";
import DcValues from "./D.C/DcValues";
import Excel from "../../components/useExcel";
import Print from "../../components/print";
import PrintOne from "../../components/newPrintOne";
import MultipleSelectCheckmarks from "../../components/multiSelect";
import FilterForm from "./generalFilterForm";
import Filter from "../../components/filterButton";
import { NotifyMsg } from "../../components/notificationMsg";
import validateParty from "./validateParty";
import DownloadTransactionTallyXml from "../../components/tally/transactions/convertTransactionData";
import MyComponent from "../../components/whatsapp/generatePdf";

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
export default function ReuseMaster(props) {
  const { docCode, title, initialValues, route } = props;
  const headCellsData = [
    {
      id: `${initialValues.docCode} NO`,
      label: `${initialValues.docCode} NO`,
      feild: "vouNo",
    },
    { id: "MANUAL NO", label: "MANUAL NO", feild: "manualNo" },
    { id: "DATE", label: "DATE", feild: "getDate" },
    { id: "PARTY", label: "PARTY", feild: "getName" },
    { id: "AMOUNT", label: "AMOUNT", feild: "netAmount", align: "right" },
    { id: "Edit", label: "Edit" },
  ];
  const filterFields = [
    { feild: "prodName", label: "Product Name" },
    { feild: "partyName", label: "Party Name" },
    { feild: "manualNo", label: "Manual No." },
    { feild: "vouNo", label: "Voucher No" },
  ];
  const user = AuthHandler.getUser();
  const settings = AuthHandler.getSettings();
  let useBatch = settings.userBatchNo;

  let query = `&date=${new Date()}&useBatch=${useBatch}&yearStart=${
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
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
  };
  const validateValues = {
    ...initialValues,
    vouNo: "",
    docCode: "",
    finYear: "",
    branchCode: "",
    vouDate: "",
    partyBillDate: "",
    partyChallanDate: "",
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
  const url = Config()[route] + query;
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    console.error(err);
    loading && setLoading(false);
  };

  const newParty = AuthHandler.getNewParty();
  const openOnRender = newParty.transactnOpen;
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(
    openOnRender ? openOnRender : false
  );
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [print, setPrint] = useState(false);
  const [headcells, setheadcells] = useState(headCellsData);
  const [selected, setSelected] = React.useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading, setLoading] = useState(true);
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
  const [errors, setErrors] = useState(validateValues);

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
  if (values.docCode == "PR") useBatch = "NO";
  //no batch while purchasing
  //doing this only for PR coz we are verifying that we have enough stock
  // using axiosPOst before submiting PR only as it causes reduction in stock

  function getName(code, arr = common) {
    let name = "";
    console.log(code, arr);
    arr.accounts.map((item) => {
      if (code == item.acCode) {
        name = item.acName;
      }
    });
    return name;
  }
  if (!records[0].vouNo) {
    let temp = "MANUAL NO";
    let arr = headCellsData.filter((item) => !temp.includes(item.label));
    console.log(temp, arr);
    if (arr.length !== headcells.length) {
      setSelected(["MANUAL NO"]);
      setheadcells(arr);
    }
  }
  function getProdName(code) {
    const name = common.products.find((item) => item.prodCode == code);
    return name ? name.prodName : `prodCode ${code}`;
  }
  if (loading1 || refresh) {
    let qry = initialValues.docCode;
    if (initialValues.docCode == "PV") {
      qry = JSON.stringify({ $in: ["GR", "PO", "PV"] });
    }

    if (initialValues.docCode == "GR") {
      qry = JSON.stringify({ $in: ["GR", "PO"] });
    }
    if (initialValues.docCode == "SI") {
      qry = JSON.stringify({ $in: ["SI", "DC", "QT", "SO"] });
    }
    if (initialValues.docCode == "DC") {
      qry = JSON.stringify({ $in: ["DC", "QT", "SO"] });
    }
    const queryForGet = `&startDate=${filter.startDate}&endDate=${filter.endDate}&docCode=${qry}&yearStart=${user.yearStartDate}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;
    const url = Config()[route] + queryForGet;

    const handleRes = (res) => {
      console.log(res.data);
      loading1 && setLoading1(false);
      refresh && setRefresh(false);
      const acc = res.data.mst_accounts;
      const items = res.data.inv_voucherItems;
      const adress = res.data.mst_acadress;
      const payTerms = res.data.mst_paymentTerm;
      const prodData = res.data.mst_prodMaster;
      const vouchers = res.data.inv_voucher;
      const collectiveData = {
        accounts: acc.length !== 0 ? acc : [initialAc],
        voucherItems: items.length !== 0 ? items : [initialVouItem],
        adress: adress.length !== 0 ? adress : [initialAdress],
        payTerms: payTerms.length !== 0 ? payTerms : [],
        products: prodData.length !== 0 ? prodData : [initialProdValues],
      };
      setCommon(collectiveData);
      const po = vouchers.filter((item) => item.docCode !== docCode);
      if (po.length !== 0) {
        setReference(po);
      }
      const voucherData = vouchers
        .filter((item) => item.docCode == docCode)
        .map((item) => {
          return {
            ...item,
            getDate: roleService.date(item.vouDate),
            getName: getName(item.partyCode, collectiveData),
          };
        });

      voucherData.length !== 0
        ? setRecords(voucherData)
        : setRecords([{ ...initialValues, vouNo: "" }]);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }
  console.log(query);
  console.log(records, common);
  function onDelete(item) {
    // roleService.deleteBranch(item);

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const handleRes = () => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.vouNo !== item.vouNo;
      });
      newRecord.length == 0
        ? setRecords([initialFilterValues])
        : setRecords(newRecord);
      setNotify(NotifyMsg(3));
    };
    console.log(url);
    roleService.axiosDelete(url, item, handleRes, handleErr);
  }

  // console.log(count);
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    console.log(e.target.label);
    search(value);
  }
  // function getDate(code) {
  //   const date = new Date(code);
  //   return (
  //     String(date.getDate()) +
  //     "/" +
  //     String(date.getMonth() + 1) +
  //     "/" +
  //     String(date.getFullYear()).slice(-2)
  //   );
  // }

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
            roleService.date(item.vouDate).includes(allfields.toLowerCase())
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

  const handleSubmit = async (input, itemList) => {
    let vouExists = records.find((item) => item.vouNo == input.vouNo);

    if (validateParty(input, errors, setErrors, setNotify, vouExists)) {
      console.log("before");
      const batchQuery = `&vouNo=${input.vouNo}&useBatch=${useBatch}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;

      const batchUrl = Config().batch + batchQuery;
      const promise = new Promise((resolve, reject) => {
        let stockNotReduced = true;
        if (
          (settings.saleStockUpdateUsing == "DC"
            ? input.docCode == "DC"
            : input.docCode == "SI") ||
          input.docCode == "PR"
        )
          roleService.axiosPost(
            batchUrl,
            itemList,
            (batchRes) => {
              console.log(batchRes.data);
              stockNotReduced = batchRes.data.itemList.every(
                (item) => !item.hasStockReduced
              );
              // all vouItems have field hasStockReduced that should be false
              //for all vouItems i e stock has not reduced
              console.log(stockNotReduced);
              console.log(batchRes.data);
              const outOfStockProds = [];
              batchRes.data.itemList.map((item) => {
                if (item.hasStockReduced)
                  outOfStockProds.push(getProdName(item.prodCode));
              });
              const outOfStockProdsString = outOfStockProds.join(", ");
              if (!stockNotReduced)
                //stock is reduced
                setNotify({
                  isOpen: true,
                  message: `Not enough Stock for ${outOfStockProdsString}`,
                  type: "warning",
                });
              resolve(stockNotReduced); // resolve the Promise
            },
            (err) => {
              handleErr(err);
              reject(err); // reject the Promise
            }
          );
        else resolve(true);
      });

      promise
        .then((stockNotReduced) => {
          if (stockNotReduced) {
            setButtonPopup(false);
            console.log(input, itemList, new Date(input.vouDate), vouExists);
            let finalItemList = itemList;
            //removing batch from batchlist whose sell ==0
            if (useBatch == "Yes")
              itemList.map((item, i) => {
                if ("batchList" in item) {
                  let finalBatchList = item.batchList.filter(
                    (b) => Number(b.sell) !== 0
                  );
                  finalItemList[i].batchList = finalBatchList;
                }
              });
            console.log(finalItemList);
            //every item.hasStockReduced should be false

            if (!vouExists) {
              const handleRes = (response) => {
                console.log(response.data);
                const res = response.data.values;
                setRecords([
                  ...records,
                  {
                    ...res,
                    getDate: roleService.date(res.vouDate),
                    getName: getName(res.partyCode),
                  },
                ]);
                setCommon({
                  ...common,
                  voucherItems: [
                    ...common.voucherItems,
                    ...response.data.items,
                  ],
                });
                setNotify(NotifyMsg(1));
              };
              const obj = {
                input: input,
                itemList: finalItemList,
              };
              console.log(url);
              roleService.axiosPut(url, obj, handleRes, handleErr);
            } else {
              const handleRes = (response) => {
                let updatedEntry = response.data.values;
                console.log(updatedEntry);
                updatedEntry = {
                  ...updatedEntry,
                  getName: getName(updatedEntry.partyCode),
                  getDate: roleService.date(updatedEntry.vouDate),
                };
                const updatedRecords = records.map((item) =>
                  item.vouNo == input.vouNo ? updatedEntry : item
                );
                setRecords(updatedRecords);
                const newVouItems = common.voucherItems.filter(
                  (item) => item.vouNo !== input.vouNo
                );
                setCommon({
                  ...common,
                  voucherItems: [...newVouItems, ...itemList],
                });
                setNotify(NotifyMsg(2));
              };

              const obj = {
                input: input,
                itemList: finalItemList,
              };
              console.log(url);
              roleService.axiosPatch(url, obj, handleRes, handleErr);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          setNotify(NotifyMsg(4));
        });
    }
  };
  async function getEntry(code, signal, type) {
    let newValue = values;

    const final = () => {
      setErrors(validateValues);
      if (signal == "v") {
        setButtonPopup(true);
      } else {
        setPrint(true);
      }
    };

    const handleRes = (res) => {
      console.log(res.data);
      setValues(res.data.values);
      let restOfVouItems = common.voucherItems.filter(
        (item) => item.vouNo != code
      );
      setCommon({
        ...common,
        voucherItems: [...restOfVouItems, ...res.data.itemList],
      });
      newValue = res.data.values;
      setLatestVouItems(code, res.data.itemList);
      return Promise.resolve(newValue);
    };

    await roleService.axiosPost(
      url,
      { code: code, type: "entry" },
      handleRes,
      handleErr,
      final
    );
  }
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
  //this is for details of Filter Apllied in printing all vouchers
  //u can seein table

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
                    xs={12}
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
                                setFilterFn(initialFilterFn);
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
                    <Filter setFilterPopup={setFilterPopup} />
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    xs={8}
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
                        initialHeadCells={headCellsData}
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
                        setErrors(validateValues);
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
                              align={headcell.align}
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
                                  <Controls.DeleteButton
                                    handleConfirm={() => {
                                      AuthHandler.canDelete()
                                        ? onDelete(item)
                                        : setNotify(NotifyMsg(8));
                                    }}
                                    setConfirmDialog={setConfirmDialog}
                                  />
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
                                  </Controls.ActionButton>{" "}
                                  <Controls.ActionButton>
                                    <MyComponent
                                      key={i}
                                      values={values}
                                      setValues={setValues}
                                      item={item}
                                      voucherItems={common.voucherItems}
                                      adress={common.adress}
                                      accounts={common.accounts}
                                      products={common.products}
                                      payTerms={common.payTerms}
                                      getEntry={getEntry}
                                      setopen={setPrint}
                                      printPopup={print}
                                      setNotify={setNotify}
                                    />{" "}
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
              <GeneralForm
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
                errors={errors}
                setErrors={setErrors}
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
    </>
  );
}
