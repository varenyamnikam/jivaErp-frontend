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
  acType: "X X X X",
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
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

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
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(initialValues).map((x) => {
      check(x);
    });
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);

  if (records[0] && records[0].acType == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.acgl + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_acTypes.length !== 0) {
          setRecords(response.data.mst_acTypes);
        } else {
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
  // setBranchNames(branchOption);
  //       setRecords(response.data.country);
  //       console.log(response.data.country);
  //       console.log("hi....", records, response.data);
  //     });
  console.log(records);
  function onDelete(item) {
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
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const token = AuthHandler.getLoginToken();
    console.log("updated");
    axios
      .post(
        Config.acgl + query,
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
        axios
          .put(
            Config.acgl + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data);
            setNotify({
              isOpen: true,
              message: "Account type created  successfully",
              type: "success",
            });
            setRecords([...records, { _id: response.data.id, ...values }]);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        axios
          .patch(
            Config.acgl + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data);
            setNotify({
              isOpen: true,
              message: "Account type updated  successfully",
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

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
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
                              endAdornment: getCancel(),
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
                        {records[0].acType == "X X X X" ? (
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
                    <Form onSubmit={handleSubmit}>
                      <Grid container>
                        <Controls.Input
                          name="acType"
                          label="A C Type"
                          value={values.acType}
                          onChange={handleInputChange}
                          error={errors.acType}
                        />

                        <UnusedAutosuggest
                          name="acTypeFor"
                          label="A C Type For"
                          value={values}
                          setValue={setValues}
                          options={groupTypes}
                          error={errors.acTypeFor}
                        />
                        <Controls.RadioGroup
                          name="acTypeStatus"
                          label="Status"
                          value={values.acTypeStatus}
                          onChange={handleInputChange}
                          items={statusItems}
                          error={errors.acTypeStatus}
                        />
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
