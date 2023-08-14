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
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import GeneralForm from "./generalForm";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
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
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import { NotifyMsg } from "../../../components/notificationMsg";
import DownloadTallyXml from "../../../components/tally/master/convertMasterData";
import accConversnFn from "../../../components/tally/master/accountTally";

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
  acCode: "",
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
  gstNo: "",
  email: "",
  mobileno: "",
  contactNo: "",
  stateName: "",
  countryName: "",
  districtName: "",
  talukaName: "",
};

export default function GeneralAccountMaster({ acTypeFor, initialValues }) {
  const newParty = AuthHandler.getNewParty();
  const openOnRender = newParty.partyOpen;
  const initialFilterValues = {
    ...initialValues,
    acCode: "",
    allFields: "",
  };
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(
    openOnRender ? openOnRender : false
  );
  const [values, setValues] = useState(initialValues);
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
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ states: [] });
  const [marketArea, setMarketArea] = useState([
    {
      mktAreaCode: "X X X X",
      parrentAreaCode: "",
      mktArea: "",
      assignTo: "",
      mktAreaStatus: "",
    },
  ]);

  console.log(location, marketArea);

  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // if (adressData[0] && !adressData[0].acCode) {
  //   const token = AuthHandler.getLoginToken();

  //   axios
  //     .get(Config().acadress , {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  //     .then((response) => {
  //       console.log("req sent Config().getacadress", adressData);
  //       setAdressData(response.data.acadress);
  //     });
  // }
  const url = Config().accounts;
  const handleErr = (error) => {
    setNotify(NotifyMsg(4));
    loading && setLoading(false);
  };
  if (loading) {
    // console.log(records);
    const handleRes = (response) => {
      console.log(response.data);
      if (response.data.mst_mktArea.length !== 0)
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
      if (response.data.acadress.length !== 0)
        setAdressData(response.data.acadress);

      if (response.data.mst_accounts.length !== 0) {
        setRecords(function () {
          const temp = response.data.mst_accounts.filter((item) => {
            return item.preFix == values.preFix;
          });
          if (temp.length !== 0) {
            return temp;
          } else {
            return [initialFilterValues];
          }
        });
      }
      if (response.data.mst_acTypes.length !== 0) {
        setAcTypeOptions(function () {
          const temp = response.data.mst_acTypes.filter((item) => {
            if (item.acTypeFor == acTypeFor && item.acTypeStatus == "Active")
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
      if (response.data.location.states.length !== 0)
        setLocation(response.data.location);

      loading && setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }
  // if (marketArea[0] && marketArea[0].mktAreaCode == "X X X X") {
  //   const token = AuthHandler.getLoginToken();
  //   const body = { hello: "hello" };
  //   axios
  //     .get(Config().mktArea , {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  //     .then((response) => {})
  //     .catch((error) => {
  //       console.log(error);
  //       setMarketArea([
  //         {
  //           mktAreaCode: "",
  //           parrentAreaCode: "",
  //           mktArea: "",
  //           assignTo: "",
  //           mktAreaStatus: "",
  //         },
  //       ]);
  //       setNotify({
  //         isOpen: true,
  //         message: "Unable to connect to servers",
  //         type: "warning",
  //       });
  //     });
  // }
  // useEffect(() => {
  //   const userCode = localStorage.getItem("userCode");
  //   const userCompanyCode = localStorage.getItem("userCompanyCode");
  //   const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  //   if (location.states.length == 0) {
  //     const token = AuthHandler.getLoginToken();
  //     const body = { hello: "hello" };
  //     axios
  //       .post(Config().location + query, body, {
  //         headers: {
  //           authorization: "Bearer" + token,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //         if (response.data.states.length !== 0) setLocation(response.data);
  //         else {
  //           setLocation({
  //             states: ["MAHARASHTRA"],
  //             country: ["INDIA"],
  //             districts: ["JALGAON"],
  //             talukas: ["JALGAON"],
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setNotify({
  //           isOpen: true,
  //           message: "Unable to connect to servers",
  //           type: "warning",
  //         });
  //         console.log(error);
  //       });
  //   }
  // });
  console.log(adressData);
  console.log(marketArea);
  function onDelete(item) {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const handleRes = () => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.acCode !== item.acCode;
      });
      if (newRecord.length == 0) {
        setRecords([initialValues]);
      } else {
        setRecords(newRecord);
      }
      setNotify(NotifyMsg(3));
    };
    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
  }
  function getTitle() {
    if (value == "1") {
      return `${acTypeFor}Form`;
    } else {
      return "Address Master";
    }
  }
  function changeTab() {
    setValue("2");
  }
  function handleFilter(e) {
    const value = e.target.value;
    const name = e.target.name;
    setFilter({ ...filter, [name]: value });
    if (name == "allFields") search(value);
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
            item.acName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acRegMob.toLowerCase().includes(allfields.toLowerCase())
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
        newRecords = sort(newRecords, "acType");

        return newRecords;
      },
    });
  }
  const acGroupOptions = acGroupData
    .filter((item) => item.acGroupStatus == "Active")
    .map((item) => {
      return item.acGroupName;
    });
  return (
    <>
      <PageHeader
        title={`${acTypeFor}s`}
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
                      name="allFields"
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
                  </Grid>
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
                    <IconButton
                      onClick={() => {
                        setFilterPopup(true);
                      }}
                      style={{
                        borderRadius: 5,
                        padding: "7px",
                      }}
                    >
                      <FilterAltOutlinedIcon color="success" />
                    </IconButton>
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
                  {loading ? (
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
                            <Controls.EditButton
                              handleClick={() => {
                                setValue("1");
                                setValues(item);
                                setButtonPopup(true);
                                setSubmit(true);
                              }}
                            />
                            <Controls.DeleteButton
                              handleConfirm={(e) => {
                                AuthHandler.canDelete()
                                  ? onDelete(item)
                                  : setNotify(NotifyMsg(8));
                                e.preventDefault();
                              }}
                              setConfirmDialog={setConfirmDialog}
                            />
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
              title={getTitle()}
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
              size="md"
              style={{ padding: "0px" }}
            >
              <Box>
                <TabContext value={value}>
                  <Box>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="secondary"
                      textColor="inherit"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label={acTypeFor} value="1" />
                      <Tab label="Adress" value="2" disabled={!values.acCode} />
                    </Tabs>
                  </Box>
                  <TabPanel value="1">
                    <GeneralForm
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
                      acTypeFor={acTypeFor}
                    />
                  </TabPanel>
                  <TabPanel value="2" style={{ padding: "0px" }}>
                    <AdressMaster
                      adressData={adressData}
                      setAdressData={setAdressData}
                      initialAdress={initialAdress}
                      acCode={values.acCode}
                      acName={values.acName}
                      location={location}
                      values={values}
                      setNotify={setNotify}
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
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    name="acCode"
                    label="Code"
                    subLabel="Filter by  Code"
                    value={filter.acCode}
                    setValue={setFilter}
                    onChange={handleFilter}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    name="acName"
                    label="Name"
                    subLabel="Filter by  Name"
                    value={filter.acName}
                    setValue={setFilter}
                    onChange={handleFilter}
                  />
                </Grid>{" "}
                <Grid item sm={6} xs={12}>
                  <UnusedAutosuggest
                    name="acType"
                    label="A C Type"
                    value={filter}
                    setValue={setFilter}
                    options={acTypeOptions}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controls.Input
                    name="acRegMob"
                    label=" Mobile no."
                    subLabel="Filter by Mobile no."
                    value={filter.acRegMob}
                    setValue={setFilter}
                    onChange={handleFilter}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Controls.Button
                    type="submit"
                    text="Submit"
                    onClick={(e) => {
                      e.preventDefault();
                      searchFilter();
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
    </>
  );
}
