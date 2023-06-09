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
  TableContainer,
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
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import { NotifyMsg } from "../../../components/notificationMsg";
const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const headCells = [
  { id: "Actype", label: "A C Type" },
  { id: "Actypefor", label: "A C Type For" },
  { id: "status", label: "STATUS", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.acType !== "") return item;
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
  acType: "",
  acTypeFor: "",
  acTypeStatus: "",
};
const initialFilterValues = {
  acType: "",
  acTypeStatus: "",
  acTypeFor: "",
  allFields: "",
};

export default function AccountTypesMaster() {

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [records, setRecords] = useState([initialValues]);
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
  const groupTypes = ["Customer", "Supplier", "Employee", "General"];
  const [loading, setLoading] = useState(true);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(initialValues).map((x) => {
      check(x);
    });
    let x = "acType";
    let y = "acTypeFor";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] == fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists for ${found[y]}` : "";
    console.log(temp);
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "") && hasRight;
  };
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);

  const url = Config.acgl;

  const handleErr = (error) => {
    setNotify(NotifyMsg(4));
    console.log(error);
  };

  if (loading) {
    const handleRes = (response) => {
      if (response.data.mst_acTypes.length !== 0)
        setRecords(response.data.mst_acTypes);

      loading && setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }
  // setBranchNames(branchOption);
  //       setRecords(response.data.country);
  //       console.log(response.data.country);
  //       console.log("hi....", records, response.data);
  //     });
  console.log(records);
  function onDelete(item) {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const handleRes = (response) => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.acType !== item.acType;
      });
      if (newRecord.length == 0) {
        console.log("record empty!");
        setRecords([initialValues]);
      } else {
        setRecords(newRecord);
      }
      setNotify(NotifyMsg(3));
    };
    roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
  }
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      let x = true;
      if (values._id) {
        const updatedRecords = records.map((p) =>
          p._id == values._id ? values : p
        );
        setRecords(updatedRecords);
        x = false;
      }

      setButtonPopup(false);

      const token = AuthHandler.getLoginToken();
      if (x) {
        const handleRes = (response) => {
          console.log(response.data);
          setRecords([...records, { _id: response.data.id, ...values }]);
          setNotify(NotifyMsg(1));
        };

        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        const handleRes = (response) => {
          console.log(response);
          setNotify(NotifyMsg(2));
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

  function search(allfields) {
    console.log(allfields);
    setFilterFn({
      fn: (items) => {
        let newRecords = items;
        newRecords = items.filter((item) => {
          console.log(item, allfields);
          if (
            item.acType.toLowerCase().includes(allfields.toLowerCase()) ||
            item.acTypeFor.toLowerCase().includes(allfields.toLowerCase())
          )
            return item;
        });
        console.log(newRecords);
        return newRecords;
      },
    });
  }

  return (
    <>
      <PageHeader
        title="Account Types"
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
                      label="Search AC Type"
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
                        setValues(initialFilterValues);
                        setErrors({});
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
                          <TableCell>{item.acType}</TableCell>
                          <TableCell>{item.acTypeFor}</TableCell>
                          <TableCell>
                            <span className={item.acTypeStatus}>
                              {item.acTypeStatus}
                            </span>
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
                      ))}{" "}
                    </TableBody>
                  )}
                </TblContainer>
              </TableContainer>
              <TblPagination />
            </section>
            <Popup
              title="Account Types Form"
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
            >
              <Grid container spacing={2}>
                <Grid item sx={12} sm={6}>
                  {" "}
                  <Controls.Input
                    name="acType"
                    label="A C Type"
                    value={values.acType}
                    onChange={handleInputChange}
                    error={errors.acType}
                  />
                </Grid>
                <Grid item sx={12} sm={6}>
                  <UnusedAutosuggest
                    name="acTypeFor"
                    label="A C Type For"
                    value={values}
                    setValue={setValues}
                    options={groupTypes}
                    error={errors.acTypeFor}
                  />
                </Grid>
                <Grid item sx={12} sm={6}>
                  <Controls.RadioGroup
                    name="acTypeStatus"
                    label="Status"
                    value={values.acTypeStatus}
                    onChange={handleInputChange}
                    items={statusItems}
                    error={errors.acTypeStatus}
                  />
                </Grid>
                <Grid
                  item
                  sx={12}
                  sm={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div>
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
                  </div>
                </Grid>{" "}
              </Grid>{" "}
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
