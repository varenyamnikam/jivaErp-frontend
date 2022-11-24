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
import StockForm from "./stockForm";
import Excel from "../../components/useExcel";
import Print from "../../components/print";
import MultipleSelectCheckmarks from "../../components/multiSelect";
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
const initialValues = {
  userCompanyCode: "",
  prodCode: "",
  batchNo: "",
  inwardQty: "",
  outwardQty: "",
  rate: "",
  refType: "",
  refNo: "X X X X",

  entryBy: "",
  entryOn: "",
  vouDate: "",
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
export default function StockMaster() {
  const headCells = [
    { id: "VOUCHER NO", label: "VOUCHER NO", feild: "refNo" },
    { id: "Product", label: "Product", feild: "prodCode" },
    { id: "DATE", label: "DATE", feild: "getDate" },
    { id: "Edit", label: "Edit", feild: "getDate" },
  ];

  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
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

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [values, setValues] = useState(initialValues);
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
  console.log(Config.batch);
  if ((records[0] && records[0].refNo == "X X X X") || refresh) {
    query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&prodCode=0&useBatch=idk&vouN=${values.refNo}`;
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.batch + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.raw.length !== 0) {
          let arr = response.data.raw.map((item) => {
            return { ...item, prodName: "", getDate: getDate(item.vouDate) };
          });
          console.log(arr);
          setRecords(arr);
        } else {
          setRecords([
            {
              ...initialValues,
              refNo: "X X X",
              prodName: "",
              getDate: null,
            },
          ]);
        }

        if (response.data.prod.length !== 0) {
          setProducts(response.data.prod);
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
  function getEntry(code, signal, type) {
    const token = AuthHandler.getLoginToken();
    let newValue = values;
    // axios
    //   .post(
    //     // Config.addUser,
    //     Config.batch + query,
    //     { code: code, type: "entry" },
    //     {
    //       headers: {
    //         authorization: "Bearer" + token,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response.data);
    //     setValues(response.data.values);

    //     newValue = response.data.values;
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setNotify({
    //       isOpen: true,
    //       message: "unable to fetch entry",
    //       type: "warn",
    //     });
    //   })
    //   .finally(() => {
    //     getProd(code);
    //     if (signal == "v") {
    //       setButtonPopup(true);
    //       // setLoading("X X X X");
    //     } else {
    //       setPrint(true);
    //     }
    //   });
    return newValue;
  }
  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="StockMaster"
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
                              setValues({ ...initialValues, refNo: "" });
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
                  >
                    <StockForm
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
