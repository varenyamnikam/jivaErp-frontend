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
  TableContainer,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import Customersform from "./CustomersForm";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Adressform from "./adressForm";
import AdressMaster from "./adressMaster";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ControlledAccordions from "../../../components/accordions";

const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "Type", label: "TYPE " },
  { id: "Name", label: "NAME " },
  { id: "mobNo", label: "MOB NO." },
  { id: "status", label: "STATUS", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.acCode !== "") return item;
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
const initialAdress = {
  // acCode: "",
  acName: "",
  // addressNo: "",
  addressLine1: "",
  addressLine2: "",
  countryCode: "",
  stateCode: "",
  regionCode: "",
  districtCode: "",
  talukaName: "",
  villageName: "",
  pincode: "",
  email: "",
  mobileno: "",
  contactNo: "",
  stateName: "",
  countryName: "",
  districtName: "",
  talukaName: "",
};
const initialValues = {
  acCode: "X X X X",
  acc: "",
  preFix: "C",
  firmType: "",
  acGroupName: "",
  acGroupCode: "",
  acType: "",
  acName: "",
  fatherName: "",
  propritorName: "",
  tradeName: "",
  creditDays: "0",
  creditAmount: "0",
  panNo: "",
  aadharNo: "",
  gstNo: "",
  seedLicenNo: "NULL",
  bankName: "NULL",
  ifscCode: "NULL",
  bankAcNo: "NULL",
  acRegMob: "",
  mktArea: "",
  mktAreaCode: "",
  parentAreaCode: "",
  prdAreaCode: "NULL",
  acStatus: "",
};
const initialFilterValues = {
  ...initialValues,
  acCode: "",
  allFields: "",
};

const OperateItems = [
  { name: "CONTROL", code: "C" },
  { name: "SUB", code: "S" },
];

export default function Customers() {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [acCodeHook, setAcCodeHook] = useState(values.acCode);
  const [value, setValue] = useState("1");
  const [records, setRecords] = useState([initialValues]);
  const [adressData, setAdressData] = useState([initialAdress]);
  const [acTypeOptions, setAcTypeOptions] = useState([""]);
  const [firmTypeOptions, setFirmTypeOptions] = useState([""]);
  const [acGroupData, setAcGroup] = useState([{ acGroupName: "" }]);
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
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterIcon, setFilterIcon] = useState(true);
  const [submit, setSubmit] = useState(true);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  const [marketArea, setMarketArea] = useState([
    {
      mktAreaCode: "X X X X",
      parrentAreaCode: "",
      mktArea: "",
      assignTo: "",
      mktAreaStatus: "",
    },
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    getAdress();
  };
  function getAdress() {
    const token = AuthHandler.getLoginToken();

    axios
      .get(Config.acadress + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log("req sent Config.getacadress");
        setAdressData(response.data.acadress);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  if (adressData[0] && !adressData[0].acCode) {
    const token = AuthHandler.getLoginToken();

    axios
      .get(Config.acadress + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log("req sent Config.getacadress", adressData);
        setAdressData(response.data.acadress);
      });
  }

  console.log(recordsAfterPagingAndSorting(), records);
  if (records[0] && records[0].acCode == "X X X X") {
    // console.log(records);
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.accounts + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_accounts.length !== 0) {
          setRecords(function () {
            const temp = response.data.mst_accounts.filter((item) => {
              return item.preFix == "C";
            });
            if (temp.length !== 0) {
              return temp;
            } else {
              return [initialFilterValues];
            }
          });
        } else {
          setRecords([initialFilterValues]);
        }
        if (response.data.mst_acTypes.length !== 0) {
          setAcTypeOptions(function () {
            const temp = response.data.mst_acTypes.filter((item) => {
              if (item.acTypeFor == "Customer" && item.acTypeStatus == "Active")
                return item;
            });
            if (temp.length !== 0) {
              return temp.map((item) => {
                return item.acType;
              });
            } else {
              return [""];
            }
          });
        }
        if (response.data.mst_firmType.length !== 0) {
          setFirmTypeOptions(
            response.data.mst_firmType.map((item) => {
              return item.firmType;
            })
          );
        }
        if (response.data.mst_acGroup.length !== 0) {
          setAcGroup(response.data.mst_acGroup);
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
  if (marketArea[0] && marketArea[0].mktAreaCode == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.mktArea + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_mktArea[0])
          setMarketArea(response.data.mst_mktArea);
        else {
          setMarketArea([
            {
              mktAreaCode: "",
              parrentAreaCode: "",
              mktArea: "",
              assignTo: "",
              mktAreaStatus: "",
            },
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
        setNotify({
          isOpen: true,
          message: "Unable to connect to servers",
          type: "warning",
        });
      });
  }
  const [location, setLocation] = useState({ states: [] });
  console.log(location, marketArea);
  useEffect(() => {
    if (location.states.length == 0) {
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(Config.location + query, body, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.states.length !== 0) setLocation(response.data);
          else {
            setLocation({
              states: ["MAHARASHTRA"],
              country: ["INDIA"],
              districts: ["JALGAON"],
              talukas: ["JALGAON"],
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setNotify({
            isOpen: true,
            message: "Unable to connect to servers",
            type: "warning",
          });
        });
    }
  });
  console.log(adressData);
  console.log(marketArea);
  function onDelete(item) {
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.acCode !== item.acCode;
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
      .post(
        Config.accounts + query,
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
    roleService.deleteAcAdress(item);
  }
  function getTitle() {
    if (value == "1") {
      return "CustomerForm";
    } else {
      return "Address Master";
    }
  }
  function changeTab() {
    setValue("2");
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
            item.acCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acName.toLowerCase().includes(allfields.toLowerCase())
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
              setFilterFn(initialFilterFn);
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
        newRecords = sort(newRecords, "acName");
        newRecords = sort(newRecords, "acCode");
        newRecords = sort(newRecords, "acRegMob");
        newRecords = sort(newRecords, "acStatus");

        return newRecords;
      },
    });
  }

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Customers"
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
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Controls.Button
                            text="Add New"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            className={classes.newButton}
                            onClick={(e) => {
                              setButtonPopup(true);
                              setValue("1");
                              // getAdress();
                              setValues({
                                ...initialValues,
                              });
                              setSubmit(false);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>
                    <TableContainer>
                      <TblContainer>
                        <TblHead />
                        {records[0].acCode == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {recordsAfterPagingAndSorting().map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.acCode}</TableCell>
                                <TableCell>{item.acType}</TableCell>
                                <TableCell>{item.acName}</TableCell>
                                <TableCell>{item.acRegMob}</TableCell>
                                <TableCell>{item.acStatus}</TableCell>
                                <TableCell>
                                  <Controls.ActionButton
                                    color="primary"
                                    onClick={() => {
                                      setValue("1");
                                      setValues(item);
                                      setButtonPopup(true);
                                      // getAdress();
                                      setSubmit(true);
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
                                        },
                                      });
                                      e.preventDefault();
                                    }}
                                  >
                                    <DeleteIconOutline fontSize="small" />
                                  </Controls.ActionButton>
                                </TableCell>
                              </TableRow>
                            ))}{" "}
                          </TableBody>
                        )}
                      </TblContainer>
                    </TableContainer>
                    <TblPagination />
                  </section>
                  <Popup
                    title={getTitle()}
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                    size="md"
                  >
                    <Box sx={{ width: "100%", typography: "body1" }}>
                      <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                          >
                            {" "}
                            <Tab label="Customers" value="1" />
                            <Tab label="Adress" value="2" />
                          </TabList>
                        </Box>
                        <TabPanel value="1">
                          {" "}
                          <Customersform
                            values={values}
                            setValues={setValues}
                            records={records}
                            setRecords={setRecords}
                            statusItems={statusItems}
                            marketArea={marketArea}
                            changeTab={changeTab}
                            submit={submit}
                            setSubmit={setSubmit}
                            notify={notify}
                            setNotify={setNotify}
                            acTypeOptions={acTypeOptions}
                            firmTypeOptions={firmTypeOptions}
                            acGroupData={acGroupData}
                            setAcGroup={setAcGroup}
                          />
                        </TabPanel>
                        <TabPanel value="2">
                          {" "}
                          <AdressMaster
                            adressData={adressData}
                            setAdressData={setAdressData}
                            initialAdress={initialAdress}
                            acCode={values.acCode}
                            acName={values.acName}
                            location={location}
                            getAdress={getAdress}
                            values={values}
                          />
                        </TabPanel>
                      </TabContext>
                    </Box>
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
                      {" "}
                      <Grid container spacing={2} style={{ marginTop: "10px" }}>
                        <Grid item xs={12} sm={6} style={{ flexGrow: 1 }}>
                          <ControlledAccordions
                            name="acCode"
                            label="Code"
                            subLabel="Filter by  Code"
                            value={filter}
                            setValue={setFilter}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ flexGrow: 1 }}>
                          <ControlledAccordions
                            name="acName"
                            label="Name"
                            subLabel="Filter by  Name"
                            value={filter}
                            setValue={setFilter}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ flexGrow: 1 }}>
                          <ControlledAccordions
                            name="acRegMob"
                            label=" Mobile no."
                            subLabel="Filter by Mobile no."
                            value={filter}
                            setValue={setFilter}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{ flexGrow: 1 }}>
                          <Controls.RadioGroup
                            name="acStatus"
                            label="Status"
                            value={filter.acStatus}
                            onChange={(e) => {
                              setFilter({
                                ...filter,
                                acStatus: e.target.value,
                              });
                            }}
                            items={statusItems}
                          />{" "}
                        </Grid>
                      </Grid>
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
