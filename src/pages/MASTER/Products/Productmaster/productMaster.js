import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import AuthHandler from "../../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../../Utils/Config";
import * as roleService from "../../../../services/roleService";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import ControlledAccordions from "../../../../components/accordions";
import { useForm, Form } from "../../../../components/useForm";
import { Grid } from "@material-ui/core";
import useTable from "../../../../components/useTable";
import Controls from "../../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../../../components/Notification";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import Popup from "../../../../components/Popup";
import Productform from "./productform";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import IconButton from "@material-ui/core/IconButton";
import { reactLocalStorage } from "reactjs-localstorage";
import Table from "@mui/material/Table";
import "../../../../components/public.css";
import MuiSkeleton from "../../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";

const headCells = [
  { id: "Code", label: "CODE" },
  { id: "name", label: "NAME" },
  { id: "M.R.P", label: "M.R.P" },
  { id: "Status", label: "Status" },
  { id: "EDIT", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.prodCode !== "") return item;
    });
    console.log(newRecords);
    return newRecords;
  },
};

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "100%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  Active: {
    padding: "5px",
    borderRadius: "5px",
    color: "green",
    backgroundColor: "rgba(0, 128, 0, 0.151)",
  },
  Inactive: {
    padding: "5px",
    borderRadius: "5px",
    color: "goldenrod",
    backgroundColor: "rgba(189, 189, 3, 0.103)",
  },
}));
const initialValues = {
  prodCode: "X X X X",
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
};
const initialFilterValues = {
  ...initialValues,
  prodCode: "",
  allFields: "",
};
export default function ProductMaster(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const [records, setRecords] = useState([initialValues]);
  const [unitNames, setUnitNames] = useState(["unable to get units"]);
  const [prodCompanyNames, setProdCompanyNames] = useState([
    "unable to get prodCompany",
  ]);
  const [prodTypesNames, setProdTypesNames] = useState([
    "unable to get prodType",
  ]);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [filter, setFilter] = useState(initialFilterValues);
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [buttonPopup, setButtonPopup] = useState(false);
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

  React.useEffect(() => {
    const token = AuthHandler.getLoginToken();
    if (records[0].prodCode && records[0].prodCode == "X X X X") {
      axios
        .get(Config.prodMaster + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          if (response.data.mst_prodMaster[0])
            setRecords(response.data.mst_prodMaster);
          else {
            setRecords([initialFilterValues]);
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

    if (unitNames[0] == "unable to get units") {
      axios
        .get(Config.unit + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          const unitNameArr = [];

          if (response.data.mst_unit[0]) {
            response.data.mst_unit.map((item) => {
              unitNameArr.push(item.UOM);
            });
            setUnitNames(unitNameArr);
          } else {
            setUnitNames([""]);
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
    if (prodCompanyNames[0] == "unable to get prodCompany") {
      axios
        .get(Config.prodCompany + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          if (response.data.mst_prodCompany[0]) {
            const prodCompanyNameArr = [];
            response.data.mst_prodCompany.map((item) => {
              prodCompanyNameArr.push(item.prodCompany);
            });
            setProdCompanyNames(prodCompanyNameArr);
          } else {
            setProdCompanyNames([""]);
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
    if (prodTypesNames[0] == "unable to get prodType") {
      axios
        .get(Config.prodType + query, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          if (response.data.mst_prodTypes[0]) {
            const prodTypesNameArr = [];
            response.data.mst_prodTypes.map((item) => {
              prodTypesNameArr.push(item.prodType);
            });
            setProdTypesNames(prodTypesNameArr);
          } else {
            setProdTypesNames([""]);
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
  }, []);
  console.log(records, unitNames, prodCompanyNames, prodTypesNames);
  function onDelete(item) {
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.prodCode !== item.prodCode;
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
      .put(
        Config.prodMaster + query,
        { item },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  function searchFilter() {
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        function sort(arr, key) {
          if (filter[key]) {
            arr = arr.filter((item) => {
              if (item[key].toLowerCase().includes(filter[key].toLowerCase()))
                return item;
            });
          }
          return arr;
        }
        newRecords = sort(newRecords, "prodName");
        newRecords = sort(newRecords, "prodCode");
        newRecords = sort(newRecords, "prodStatus");
        newRecords = sort(newRecords, "MRP");

        return newRecords;
      },
    });
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
          if (
            item.prodCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.prodName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.MRP.toLowerCase().includes(allfields.toLowerCase())
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
  return (
    <>
      <PageHeader
        title="PRODUCTS"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <div className="wrapper">
        <div className="content-wrapper">
          <br></br>
          <Paper className={classes.pageContent}>
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
                  <Grid item sm={1} xs={4}>
                    {filterIcon ? (
                      <>
                        <IconButton
                          onClick={() => {
                            setFilterPopup(true);
                            setFilter(initialFilterValues);
                          }}
                          style={{
                            borderRadius: 0,
                            marginTop: "5px",
                            marginLeft: "10px",
                          }}
                        >
                          <FilterAltOutlinedIcon color="success" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => {
                            setFilterFn({
                              fn: (items) => {
                                return items;
                              },
                            });
                            setFilterIcon(true);
                          }}
                          style={{
                            borderRadius: 0,
                            marginTop: "5px",
                            marginLeft: "10px",
                          }}
                        >
                          <FilterAltOffOutlinedIcon color="error" />
                        </IconButton>
                      </>
                    )}
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    xs={8}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Controls.Button
                      text="Add New"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        setButtonPopup(true);
                        setValues(initialValues);
                      }}
                    />
                  </Grid>
                </Grid>
              </Toolbar>
              <TableContainer>
                <TblContainer>
                  <TblHead />
                  {records[0].prodCode == "X X X X" ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.prodCode}</TableCell>
                          <TableCell>{item.prodName}</TableCell>
                          <TableCell>{item.MRP}</TableCell>
                          <TableCell>
                            <span className={item.prodStatus}>
                              {item.prodStatus}
                            </span>
                          </TableCell>
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
                                  title: "Are you sure to delete this record?",
                                  subTitle: "You can't undo this operation",
                                  onConfirm: (e) => {
                                    onDelete(item);
                                    e.preventDefault();
                                    console.log("records:" + records);
                                  },
                                });
                                e.preventDefault();
                              }}
                            >
                              <DeleteIconOutline fontSize="small" />
                            </Controls.ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </TblContainer>
              </TableContainer>{" "}
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title="Product form"
            openPopup={buttonPopup}
            setOpenPopup={setButtonPopup}
            size="md"
          >
            <Productform
              records={records}
              setRecords={setRecords}
              values={values}
              setValues={setValues}
              initialValues={initialValues}
              initialFilterValues={initialFilterValues}
              unitNames={unitNames}
              prodCompanyNames={prodCompanyNames}
              prodTypesNames={prodTypesNames}
              setNotify={setNotify}
            />
          </Popup>
          <Popup
            title="Filter"
            openPopup={filterPopup}
            setOpenPopup={setFilterPopup}
            // size="md"
          >
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                searchFilter();
                setFilterPopup(false);
                setFilterIcon(false);
              }}
            >
              <ControlledAccordions
                name="prodCode"
                label="Product Code"
                subLabel="Filter by Product Code"
                value={filter}
                setValue={setFilter}
              />
              <ControlledAccordions
                name="prodName"
                label="Product Name"
                subLabel="Filter by Product Name"
                value={filter}
                setValue={setFilter}
              />
              <ControlledAccordions
                name="MRP"
                label="M.R.P"
                subLabel="Filter by M.R.P"
                value={filter}
                setValue={setFilter}
              />

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
    </>
  );
}
// <TableCell>{item.countryCode}</TableCell>
// <TableCell>{item.countryName}</TableCell>
// <TableCell>{item.countryStatus}</TableCell>
// <TableCell>
//   <Controls.ActionButton
//     color="primary"
//     onClick={() => {
//       setValues(item);
//       setButtonPopup(true);
//     }}
//   >
//     <EditOutlinedIcon fontSize="small" />
//   </Controls.ActionButton>
//   <Controls.ActionButton
//     color="secondary"
//     onClick={(e) => {
//       console.log(item);
//       setConfirmDialog({
//         isOpen: true,
//         title: "Are you sure to delete this record?",
//         subTitle: "You can't undo this operation",
//         onConfirm: (e) => {
//           onDelete(item);
//           e.preventDefault();
//         },
//       });
//       e.preventDefault();
//     }}
//   >
//     <CloseIcon fontSize="small" />
//   </Controls.ActionButton>
// </TableCell>
