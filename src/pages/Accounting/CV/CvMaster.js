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
import { Edit, RestaurantRounded, Search } from "@material-ui/icons";
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
import CvForm from "./Cvform";
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
  userCompanyCode: "",
  vouNo: "X X X X",
  branchCode: "",
  docCode: "CV",
  finYear: "",
  vno: "",
  manualNo: "",
  vouDate: new Date(),
  srNo: "",
  acCode: "",
  acName: "",
  debit: "",
  credit: "",
  narration: "",
  refType: "",
  vouStatus: "",
  checkNo: "",
  favouringName: "",
  entryBy: "",
  entryOn: "",
  fromName: "",
  fromCode: "",
  toName: "",
  toCode: "",
  amount: "",
};

const initialAccounts = {
  acCode: "",
  acc: "",
  preFix: "",
  acGroupCode: "",
  acGroupName: "",
  acType: "",
  acName: "",
  fatherName: "",
  propritorName: "",
  tradeName: "",
  creditDays: "",
  creditAmount: "",
  panNo: "",
  aadharNo: "",
  gstNo: "",
  seedLicenNo: "",
  bankName: "",
  ifscCode: "",
  bankAcNo: "",
  acRegMob: "",
  mktArea: "",
  mktAreaCode: "",
  parentAreaCode: "",
  prdAreaCode: "",
  acStatus: "",
  userCompanyCode: "",
};
export default function AcMaster({ title = "Contra Voucher" }) {
  const headCells = [
    { id: "VOUCHER NO", label: "VOUCHER NO", feild: "vouNo" },
    { id: "Account", label: "Account", feild: "getName" },
    { id: "Date", label: "Date", feild: "getDate" },
    { id: "Edit", label: "Edit", feild: "" },
  ];

  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}`;
  const initialFilterValues = {
    ...initialValues,
    vouNo: "",
    allFields: "",
    startDate: getD(),
    endDate: new Date(),
    vouDate: "",
    docCode: "",
  };
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.vouNo !== "" && item.srNo == 1) return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [headcells, setheadcells] = useState(headCells);
  const [selected, setSelected] = React.useState([]);
  const [itemList, setItemList] = useState([initialValues]);
  const [refresh, setRefresh] = useState(false);
  const [records, setRecords] = useState([initialValues]);
  const [accounts, setAccounts] = useState([initialAccounts]);
  const [filter, setFilter] = useState(initialFilterValues);
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
  console.log(values, records);
  console.log("filter=>", filter);
  console.log(Config.batch);
  if ((records[0] && records[0].vouNo == "X X X X") || refresh) {
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${filter.startDate}&docCode=${initialValues.docCode}`;
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.accounting + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.mst_accounts !== 0) {
          setAccounts(response.data.mst_accounts);
        }
        let temp = response.data.inv_voucher;
        if (temp.length !== 0) {
          temp = temp.map((item) => ({
            ...item,
            getName: getName(item.acCode, response.data.mst_accounts),
            getDate: new Date(item.vouDate).toLocaleDateString(),
          }));
        }
        setRecords(function () {
          if (temp.length !== 0) {
            return temp;
          } else {
            return [initialFilterValues];
          }
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
          if (item.vouNo.toLowerCase().includes(allfields.toLowerCase()))
            return item;
          // item.talukaName == filter.allfields ||
          // item.branchName == filter.allfields
        });
        console.log(newRecords);
        return newRecords;
      },
    });
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
  function getName(code, arr) {
    let name = "";
    arr.map((item) => {
      if (item.acCode == code) name = item.acName;
    });
    return name;
  }
  function edit(e, ite) {
    e.preventDefault();
    const arr = records.filter(
      (item) =>
        item.vouNo == ite.vouNo && item.srNo !== 1 && item.vouNo !== "X X X X"
    );
    setItemList(arr);
    setValues(ite);
    setButtonPopup(true);
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
                              setItemList([initialValues]);
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
                                <TableCell
                                  style={{
                                    borderRight: "1px solid rgba(0,0,0,0.2)",
                                  }}
                                >
                                  {item.vouNo}
                                </TableCell>
                                <TableCell
                                  style={{
                                    borderRight: "1px solid rgba(0,0,0,0.2)",
                                  }}
                                >
                                  {getName(item.acCode, accounts)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    borderRight: "1px solid rgba(0,0,0,0.2)",
                                  }}
                                >
                                  {new Date(item.vouDate).toLocaleDateString()}
                                </TableCell>

                                <TableCell
                                  // sortDirection={orderBy === headcell.id ? order : false}
                                  style={{
                                    borderRight: "1px solid rgba(0,0,0,0.2)",
                                  }}
                                >
                                  <Controls.LoadingActionButton
                                    value={values}
                                    color="primary"
                                    onClick={(e) => {
                                      edit(e, item);
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
                                          console.log("records:" + records);
                                        },
                                      });
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </Controls.ActionButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      </TblContainer>
                    </TableContainer>
                    <TblPagination />
                  </section>
                  <Popup
                    title={`${initialValues.docCode} form`}
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    size="md"
                  >
                    {" "}
                    <CvForm
                      records={records}
                      setRecords={setRecords}
                      accounts={accounts}
                      bankValues={values}
                      setBankValues={setValues}
                      itemList={itemList}
                      setItemList={setItemList}
                      initialValues={initialValues}
                      notify={notify}
                      setNotify={setNotify}
                      initialFilterValues={initialFilterValues}
                    />
                  </Popup>

                  <Popup
                    title="Filter"
                    openPopup={filterPopup}
                    setOpenPopup={setFilterPopup}
                  ></Popup>

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
