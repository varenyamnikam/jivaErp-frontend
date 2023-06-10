import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
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
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutosuggest from "../../../components/smartAutoSuggest";

const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
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
  acCode: "",
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
  allFields: "",
};

export default function AccountMaster() {
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [records, setRecords] = useState([initialValues]);
  const [acTypeOptions, setAcTypeOptions] = useState([""]);
  const [loading, setLoading] = useState(true);
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
    console.log(temp);
    setErrors({
      ...temp,
    });
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    return Object.values(temp).every((x) => x == "") && hasRight;
  };

  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);

  const url = Config().accounts;
  const handleErr = (error) => {
    setNotify(NotifyMsg(4));
    loading && setLoading(false);
  };

  if (loading) {
    const handleRes = (response) => {
      console.log(response.data);
      const { mst_accounts, mst_acTypes, mst_acGroup } = response.data;
      if (mst_accounts.length !== 0) {
        const temp = mst_accounts.filter((item) => item.preFix === "G");
        if (temp.length !== 0) {
          setRecords(temp);
        } else {
          setRecords([initialFilterValues]);
        }
      }
      if (mst_acTypes.length !== 0) {
        const temp = mst_acTypes.filter(
          (item) =>
            item.acTypeFor === "General" && item.acTypeStatus === "Active"
        );
        if (temp.length !== 0) {
          setAcTypeOptions(temp.map((item) => item.acType));
        } else {
          setAcTypeOptions([""]);
        }
      }
      if (mst_acGroup.length !== 0) {
        setAcGroup(mst_acGroup);
      }
      loading && setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }

  console.log(records, acTypeOptions, acGroupData);

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
    };
    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
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
          x = false;
        }
      });
      console.log(x);

      if (x) {
        const handleRes = (response) => {
          console.log("hi....", response.data.values);
          setRecords([...records, response.data.values]);
          setNotify(NotifyMsg(1));
          setButtonPopup(false);
        };

        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        const handleRes = (response) => {
          console.log("hi....", response.data.values);
          const updatedRecords = records.map((p) =>
            p.acCode === values.acCode ? values : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          setNotify(NotifyMsg(2));
          setButtonPopup(false);
        };

        roleService.axiosPatch(url, values, handleRes, handleErr, () => {});
      }
    }
  }
  function handleFilter(e) {
    const value = e.target.value;
    setFilter({ ...filter, allFields: value });
    search(value);
  }
  console.log(filter.allFields);

  //search and smartAutoSuggest

  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (
            item.acType.toLowerCase().includes(allfields.toLowerCase()) ||
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
  console.log(acGroupData.filter((item) => item.acGroupStatus == "Active"));
  const acGroupOptions = acGroupData
    .filter((item) => item.acGroupStatus == "Active")
    .map((item) => {
      return item.acGroupName;
    });
  // if (values.acGroupName) {
  //   acGroupData.map((item) => {
  //     if (
  //       values.acGroupName == item.acGroupName &&
  //       values.acGroupCode !== item.acGroupCode
  //     ) {
  //       setValues({
  //         ...values,
  //         acGroupCode: item.acGroupCode,
  //       });
  //     }
  //   });
  // }
  // if (!values.acGroupName && values.acGroupCode) {
  //   console.log("hi", acGroupData, values.acGroupCode);
  //   acGroupData.map((item) => {
  //     if (values.acGroupCode == item.acGroupCode) {
  //       setValues({ ...values, acGroupName: item.acGroupName });
  //     }
  //   });
  // }
  console.log(values);
  return (
    <>
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
                {loading ? (
                  <MuiSkeleton />
                ) : (
                  <TableBody>
                    {recordsAfterPagingAndSorting().map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.acCode}</TableCell>
                        <TableCell>{item.acType}</TableCell>
                        <TableCell>{item.acName}</TableCell>
                        <TableCell>
                          <span className={item.acStatus}>{item.acStatus}</span>
                        </TableCell>
                        <TableCell>
                          {item.userCompanyCode !== "all" && (
                            <>
                              <Controls.EditButton
                                handleClick={() => {
                                  setValues(item);
                                  setButtonPopup(true);
                                }}
                              />
                              <Controls.DeleteButton
                                handleConfirm={(e) => {
                                  AuthHandler.canDelete()
                                    ? onDelete(item)
                                    : setNotify(NotifyMsg(8));
                                }}
                                setConfirmDialog={setConfirmDialog}
                              />
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
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <Controls.Input
                    name="acCode"
                    label="Code"
                    value={values.acCode ? values.acCode : "N E W"}
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
                  <SmartAutosuggest
                    name1="acGroupName"
                    code1="acGroupCode"
                    name2="acGroupName"
                    code2="acGroupCode"
                    label="A.C Group"
                    value={values}
                    setValue={setValues}
                    options1={acGroupOptions}
                    options2={acGroupData}
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
                </Grid>{" "}
                <Grid
                  item
                  sm={6}
                  xs={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Controls.Button
                    text="Reset"
                    color="default"
                    onClick={() => {}}
                  />{" "}
                  <Controls.Button
                    type="submit"
                    text="Submit"
                    onClick={handleSubmit}
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
