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
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import { NotifyMsg } from "../../../components/notificationMsg";
import SmartAutosuggest from "../../../components/smartAutoSuggest";
const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const headCells = [
  { id: "Prod Company Code", label: "Prod Company Code" },
  { id: "Name", label: "Prod Company Name" },
  { id: "Edit", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.prodCompanyCode) return item;
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
  prodCompanyCode: "",
  prodCompanyName: "",
};
const initialFilterValues = initialValues;

export default function ProdTypeMaster() {
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [records, setRecords] = useState([initialValues]);
  const [loading, setLoading] = useState(true);

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
  const groupTypes = records.map((item) => {
    return item.prodCompanyName;
  });
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(initialFilterValues).map((x) => {
      x !== "prodCompanyCode" && check(x);
    });
    let x = "prodCompanyName";
    let y = "prodCompanyCode";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";
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

  const url = Config.prodCompany;

  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
    console.error(err);
    loading && setLoading(false);

  };

  if (loading) {
    const handleRes = (res) => {
      if (res.data.mst_prodCompany.length !== 0)
        setRecords(res.data.mst_prodCompany);
      loading && setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }
  // setBranchNames(branchOption);
  //       setRecords(res.data.country);
  //       console.log(res.data.country);
  //       console.log("hi....", records, res.data);
  //     });
  console.log(records);
  function onDelete(item) {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const handleRes = (res) => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.prodCompanyCode !== item.prodCompanyCode;
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
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      let x = true;
      x = records.find(
        (item) =>
          item.prodCompanyCode == values.prodCompanyCode && item.prodCompanyCode
      );
      setButtonPopup(false);
      if (!x) {
        const handleRes = (res) => {
          console.log(res.data.values);
          setRecords([...records, res.data.values]);
          setNotify(NotifyMsg(1));
        };

        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        const handleRes = (res) => {
          const updatedRecords = records.map((p) =>
            p.prodCompanyCode === values.prodCompanyCode ? values : p
          );
          console.log(updatedRecords);
          setNotify(NotifyMsg(2));

          setRecords(updatedRecords);
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
            item.prodCompanyCode
              .toLowerCase()
              .includes(allfields.toLowerCase()) ||
            item.prodCompanyName.toLowerCase().includes(allfields.toLowerCase())
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
        title="Product Types"
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
                        setValues(initialValues);
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
                          <TableCell>{item.prodCompanyCode}</TableCell>
                          <TableCell>{item.prodCompanyName}</TableCell>
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
              title="Group Master Form"
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
            >
              <Grid container spacing={2}>
                <Grid item sx={12} sm={6}>
                  <Controls.Input
                    name="prodCompanyCode"
                    label="Prod Type Code"
                    value={
                      values.prodCompanyCode ? values.prodCompanyCode : "N E W"
                    }
                    onChange={handleInputChange}
                    error={errors.prodCompanyCode}
                    disabled={true}
                  />
                </Grid>{" "}
                <Grid item sx={12} sm={6}>
                  <Controls.Input
                    name="prodCompanyName"
                    label="Prod Type Name"
                    value={values.prodCompanyName}
                    onChange={handleInputChange}
                    error={errors.prodCompanyName}
                  />
                </Grid>{" "}
                <Grid
                  item
                  sx={12}
                  sm={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
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
