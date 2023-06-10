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
import { Edit, RestaurantRounded, Search } from "@material-ui/icons";
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
import AcForm from "./AcForm";
import PrintAcc from "../../components/printAcc";
import { getTime } from "date-fns";
import DateCalc from "../../components/dateCalc";
import { NotifyMsg } from "../../components/notificationMsg";
import * as roleService from "../../services/roleService";
import FilterForm from "./generalFilterForm";
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
  tableStyle: { borderRight: "1px solid rgba(0,0,0,0.2)" },
}));
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
export default function AcMaster(props) {
  const { title, initialValues } = props;
  const user = AuthHandler.getUser();
  const { getD } = DateCalc(user);
  initialValues.narration = "";
  console.log(initialValues);

  const headCells = [
    { id: "VOUCHER NO", label: "VOUCHER NO", feild: "vouNo" },
    { id: "Account", label: "Account", feild: "acName" },
    { id: "Date", label: "Date", feild: "getDate" },
    { id: "Debit", label: "Debit", feild: "debit", align: "right" },
    { id: "Credit", label: "Credit", feild: "credit", align: "right" },
    { id: "Edit", label: "Edit", feild: "" },
  ];
  const filterFields = [
    { feild: "acName", label: "Party Name" },
    { feild: "vouNo", label: "Voucher No" },
  ];
  const initialFilterValues = {
    ...initialValues,
    vouNo: "",
    allFields: "",
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
    vouDate: "",
    docCode: "",
  };
  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (initialValues.docCode !== "JV" && item.vouNo && !item.srNo) {
          return item;
        } else if (
          initialValues.docCode == "JV" &&
          item.vouNo &&
          Number(item.srNo) == 1
        ) {
          return item;
        }
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
  const [loading, setLoading] = useState(true);

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
  console.log(Config().batch);
  const addQuery = `&date=${filter.startDate}&docCode=${initialValues.docCode}&yearStart=${user.yearStartDate}&yearCode=${user.currentYearCode}&branchCode=${user.currentBranchCode}`;
  const url = Config().accounting + addQuery;
  console.log(url);
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    console.error(err);
    loading && setLoading(false);
  };

  if (loading) {
    const handleRes = (res) => {
      // console.log(res.data);

      if (res.data.mst_accounts !== 0) {
        setAccounts(res.data.mst_accounts);
      }
      let temp = res.data.inv_voucher;
      if (temp.length !== 0) {
        temp = temp.map((item) => ({
          ...item,
          acName: getName(item.acCode, res.data.mst_accounts),
          debit: Math.abs(item.debit),
          credit: Math.abs(item.credit),
          getDate: roleService.date(item.vouDate),
        }));
        console.log(temp);
        setRecords(temp);
      }
      //filter fn only shows srNo:1 in the table ie
      //table info

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
      setNotify(NotifyMsg(3));
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.vouNo !== item.vouNo;
      });
      if (newRecord.length == 0) {
        setRecords([initialFilterValues]);
      } else {
        setRecords(newRecord);
      }
    };
    roleService.axiosDelete(url, item, handleRes, handleErr);
  }

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
        console.log(newRecords);
        return newRecords;
      },
    });
  }
  function getName(code, arr) {
    let name = arr.find((item) => item.acCode == code);
    name = name ? name.acName : "";
    return name;
  }
  function edit(e, ite) {
    e.preventDefault();
    const arr = records.filter((item) => item.vouNo == ite.vouNo && item.vouNo);
    //filter fn  shows everything except srNo:1 in the grid ie
    //grid info (in the form)

    setItemList(arr);
    setValues(ite);
    setButtonPopup(true);
  }
  console.log(headcells);
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
                <Grid container spacing={2}>
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
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
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
                    </div>{" "}
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
                        setValues(initialValues);
                        setItemList([initialValues]);
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
                          {headcells.map((headcell) => (
                            <TableCell className={classes.tableStyle}>
                              {headcell.label !== "Edit" ? (
                                item[headcell.feild]
                              ) : (
                                <>
                                  <Controls.LoadingActionButton
                                    value={values}
                                    color="primary"
                                    onClick={(e) => {
                                      edit(e, item);
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
                                    <PrintAcc
                                      values={item}
                                      accounts={accounts}
                                      itemList={itemList}
                                      records={records}
                                      title={title}
                                    />
                                  </Controls.ActionButton>
                                </>
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
              title={`${title} form`}
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
              size="md"
            >
              {" "}
              <AcForm
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
                setButtonPopup={setButtonPopup}
                initialFilterValues={initialFilterValues}
              />
            </Popup>{" "}
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
                accounts={accounts}
                setFilterFn={setFilterFn}
                initialFilterValues={initialFilterValues}
                setRefresh={setLoading}
                values={values}
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
