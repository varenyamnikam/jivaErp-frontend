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
} from "@material-ui/core";
import useTable from "../../../components/useTable";
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
import DcFilterForm from "./dcFilterForm";
import DcForm from "./dcForm";
import DcValues from "./DcValues";
const headCells = [
  { id: "DC NO", label: "DC NO" },
  { id: "MANUAL NO", label: "MANUAL NO" },
  { id: "DATE", label: "DATE" },
  { id: "PARTY", label: "PARTY" },
  { id: "AMOUNT", label: "AMOUNT" },
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

export default function DcMaster(props) {
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
  } = DcValues();

  const initialFilterValues = {
    ...initialValues,
    vouNo: "",
    allFields: "",
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
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  console.log("filter=>", filter);
  // console.log(accounts[0], accounts[0].acCode);
  if (records[0] && records[0].vouNo == "X X X X") {
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
        if (response.data.inv_voucher.length !== 0) {
          setRecords(response.data.inv_voucher);
        } else {
          setRecords([{ ...initialValues, vouNo: "" }]);
        }
        if (response.data.inv_voucherItems.length !== 0) {
          setVoucherItems(response.data.inv_voucherItems);
        } else {
          setVoucherItems([vouItems]);
        }

        if (response.data.mst_accounts.length !== 0) {
          setAccounts(response.data.mst_accounts);
        } else {
          setAccounts([initialAc]);
        }
        if (response.data.mst_acadress.length !== 0) {
          setAdress(response.data.mst_acadress);
        } else {
          setAdress([initialAdress]);
        }
        if (response.data.mst_paymentTerm.length !== 0) {
          setPayTerms(response.data.mst_paymentTerm);
        } else {
          setPayTerms([initialPayValues]);
        }
        if (response.data.mst_prodMaster.length !== 0) {
          setProducts(response.data.mst_prodMaster);
        } else {
          setProducts([initialPayValues]);
        }
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
  function searchFilter() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;

        if (filter.vouNo) {
          console.log("vouNo", filter.vouNo);
          newRecords = items.filter((item) => {
            if (item.vouNo == filter.vouNo) return item;
          });
          console.log(newRecords);
        }
        return newRecords;
      },
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
  function getCancel() {
    if (filter.allFields) {
      return (
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
      );
    } else {
      return <></>;
    }
  }
  function getName(code) {
    let name = "";
    accounts.map((item) => {
      if (code == item.acCode) {
        name = item.acName;
      }
    });
    return name;
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
                        <Grid item xs={12} sm={8}>
                          <Controls.Input
                            label="Search Role Name"
                            className={classes.searchInput}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search />
                                </InputAdornment>
                              ),
                              endAdornment: getCancel(),
                            }}
                            value={filter.allFields}
                            onChange={handleFilter}
                          />
                        </Grid>
                        <Grid
                          item
                          sm={3}
                          xs={8}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Controls.Button
                            text="Add New"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={(e) => {
                              setButtonPopup(true);
                              setValues({ ...initialValues, vouNo: "" });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0].vouNo == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {recordsAfterPagingAndSorting().map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.vouNo}</TableCell>
                                <TableCell>{item.manualNo}</TableCell>
                                <TableCell>{getDate(item.vouDate)}</TableCell>
                                <TableCell>{getName(item.partyCode)}</TableCell>
                                <TableCell>{item.netAmount}</TableCell>
                                <TableCell>
                                  <Controls.ActionButton
                                    color="primary"
                                    onClick={() => {
                                      setValues(item);
                                      setButtonPopup(true);
                                    }}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </Controls.ActionButton>
                                  <Controls.ActionButton
                                    color="secondary"
                                    onClick={(e) => {
                                      console.log(item);
                                      setConfirmDialog({
                                        isOpen: true,
                                        title:
                                          "Are you sure to delete this record?",
                                        subTitle:
                                          "You can't undo this operation",
                                        onConfirm: (e) => {
                                          onDelete(item);
                                          e.preventDefault();
                                          console.log("records:" + records);
                                        },
                                      });
                                      e.preventDefault();
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
                    title="Filter"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    size="md"
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
                      accounts={accounts}
                      adress={adress}
                      payTerms={payTerms}
                      products={products}
                      voucherItems={voucherItems}
                      setVoucherItems={setVoucherItems}
                      openPopup={buttonPopup}
                      setOpenPopup={setButtonPopup}
                    />{" "}
                  </Popup>

                  <Popup
                    title="Filter"
                    openPopup={filterPopup}
                    setOpenPopup={setFilterPopup}
                  >
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        searchFilter();
                        setFilterPopup(false);
                        setFilterIcon(false);
                      }}
                    >
                      <DcFilterForm filter={filter} setFilter={setFilter} />
                      <div style={{ marginTop: "25px" }}>
                        <Controls.Button type="submit" text="Submit" />
                      </div>
                    </Form>
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
