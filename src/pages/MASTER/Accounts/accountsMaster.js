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
  TableContainer,
  TableCell,
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
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import BasicSelect from "../../Usermaster/basicselect";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import UnusedAutosuggest from "../../../components/unusedautosuggest";

const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "Account Type", label: "Account Type " },
  { id: "Name", label: "NAME " },
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
const initialValues = {
  acCode: "X X X X",
  acc: "",
  preFix: "G",
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
};
const initialFilterValues = {
  ...initialValues,
  acCode: "",
};

export default function AccountMaster() {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [records, setRecords] = useState([initialValues]);
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
  const [errors, setErrors] = useState({});
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("acName");
    check("acStatus");
    check("acGroupName");
    check("acType");
    let x = "acName";
    let y = "acCode";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";
console.log(temp)
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };

  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  if (records[0] && records[0].acCode == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.accounts + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.mst_accounts.length !== 0) {
          setRecords(function () {
            const temp = response.data.mst_accounts.filter((item) => {
              return item.preFix == "G";
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
              if (item.acTypeFor == "General" && item.acTypeStatus == "Active")
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
  console.log(records, acTypeOptions, acGroupData);
  function onDelete(item) {
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.acCode !== item.acCode;
    });
    if (newRecord.length == 0) {
      setRecords([initialValues]);
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
  }
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(validate(), errors);
    if (validate()) {
      let x = true;
      records.map((item, index) => {
        if (item.acCode == values.acCode) {
          const updatedRecords = records.map((p) =>
            p.acCode === values.acCode ? values : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          x = false;
        }
      });
      console.log(x);
      if (x) {
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .put(
            Config.accounts + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setRecords([...records, response.data.values]);
            setNotify({
              isOpen: true,
              message: "Account created  successfully",
              type: "success",
            });
            setButtonPopup(false);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        const token = AuthHandler.getLoginToken();
        console.log("updated");
        axios
          .patch(
            Config.accounts + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            setNotify({
              isOpen: true,
              message: "Account updated  successfully",
              type: "success",
            });
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
        setButtonPopup(false);
      }
    }
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
            item.acGroupName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acName.toLowerCase().includes(allfields.toLowerCase())
          )
            return item;
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
              setFilter({ initialFilterValues, allFields: "" });
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
  console.log(acGroupData.filter((item) => item.acGroupStatus == "Active"));
  const acGroupOptions = acGroupData
    .filter((item) => item.acGroupStatus == "Active")
    .map((item) => {
      return item.acGroupName;
    });
  if (values.acGroupName) {
    acGroupData.map((item) => {
      if (
        values.acGroupName == item.acGroupName &&
        values.acGroupCode !== item.acGroupCode
      ) {
        setValues({
          ...values,
          acGroupCode: item.acGroupCode,
        });
      }
    });
  }
  if (!values.acGroupName && values.acGroupCode) {
    console.log("hi", acGroupData, values.acGroupCode);
    acGroupData.map((item) => {
      if (values.acGroupCode == item.acGroupCode) {
        setValues({ ...values, acGroupName: item.acGroupName });
      }
    });
  }

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Account Master"
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
                          sm={4}
                          xs={12}
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
                              setValues(initialValues);
                              setErrors({});
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Toolbar>
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
                              <TableCell>
                                <span className={item.acStatus}>
                                  {item.acStatus}
                                </span>
                              </TableCell>
                              <TableCell>
                                {item.userCompanyCode !== "all" && (
                                  <>
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
                                          },
                                        });
                                        e.preventDefault();
                                      }}
                                    >
                                      <DeleteIconOutline fontSize="small" />
                                    </Controls.ActionButton>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </TblContainer>
                    <TblPagination />
                  </section>
                  <Popup
                    title="ACCOUNT form"
                    openPopup={buttonPopup}
                    setOpenPopup={setButtonPopup}
                  >
                    <Form onSubmit={handleSubmit}>
                      <Grid container>
                        <Grid item sm={6} xs={12}>
                          <Controls.Input
                            name="acCode"
                            label="Code"
                            value={values.acCode}
                            onChange={handleInputChange}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controls.Input
                            name="acName"
                            label=" Name"
                            value={values.acName}
                            onChange={handleInputChange}
                            error={errors.acName}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <UnusedAutosuggest
                            name="acType"
                            label="A C Type "
                            value={values}
                            setValue={setValues}
                            options={acTypeOptions}
                            error={errors.acType}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <UnusedAutosuggest
                            name="acGroupName"
                            label="A.C Group"
                            value={values}
                            setValue={setValues}
                            options={acGroupOptions}
                            error={errors.acGroupName}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <Controls.RadioGroup
                            name="acStatus"
                            label="Status"
                            value={values.acStatus}
                            onChange={handleInputChange}
                            items={statusItems}
                            error={errors.acStatus}
                          />
                        </Grid>
                      </Grid>

                      <div>
                        <Controls.Button type="submit" text="Submit" />
                        <Controls.Button
                          text="Reset"
                          color="default"
                          onClick={() => {}}
                        />
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
