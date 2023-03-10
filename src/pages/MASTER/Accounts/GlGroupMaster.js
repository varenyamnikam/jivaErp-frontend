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
  { id: "Code", label: "CODE" },
  { id: "GroupName", label: "GROUP NAME" },
  { id: "status", label: "STATUS", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.acGroupCode !== "") return item;
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
  acGroupCode: "X X X X",
  parentGroupName: "",
  parentGroupCode: "",
  acGroupName: "",
  acGroupStatus: "",
  groupType: "",
};
const initialFilterValues = {
  acGroupCode: "",
  acGroupName: "",
  acGroupStatus: "",
  allFields: "",
  groupType: "",
};

export default function AcGlGroup() {
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
  const groupTypes = records.map((item) => {
    return item.acGroupName;
  });
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(initialFilterValues).map((x) => {
      check(x);
    });
    let x = "acGroupName";
    let y = "acGroupCode";
    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";
    console.log(temp);

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  if (records[0] && records[0].acGroupCode == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.acglgroup + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_acglgroup.length !== 0) {
          setRecords(response.data.mst_acglgroup);
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
      return record.acGroupCode !== item.acGroupCode;
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
        Config.acglgroup + query,
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
      records.map((item, index) => {
        if (item.acGroupCode == values.acGroupCode) {
          const updatedRecords = records.map((p) =>
            p.acGroupCode === values.acGroupCode ? values : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          x = false;
        }
      });
      if (x) {
        setButtonPopup(false);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .put(
            Config.acglgroup + query,
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
              message: response.message,
              type: "success",
            });
            setButtonPopup(false);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "plz try again",
              type: "warning",
            });
            console.log(error);
          });
      } else {
        setButtonPopup(false);

        const token = AuthHandler.getLoginToken();
        console.log("updated");
        axios
          .patch(
            Config.acglgroup + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setNotify({
              isOpen: true,
              message: "Account updated  successfully",
              type: "success",
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
            item.acGroupCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.parentGroupName
              .toLowerCase()
              .includes(allfields.toLowerCase()) ||
            item.acGroupName.toLowerCase().includes(allfields.toLowerCase())
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
  if (values.parentGroupName) {
    records.map((item) => {
      if (
        values.parentGroupName == item.acGroupName &&
        values.parentGroupCode !== item.acGroupCode
      ) {
        setValues({
          ...values,
          parentGroupCode: item.acGroupCode,
        });
      }
    });
  }
  if (!values.parentGroupName && values.parentGroupCode) {
    records.map((item) => {
      if (values.parentGroupCode == item.acGroupCode) {
        setValues({ ...values, parentGroupName: item.acGroupName });
      }
    });
  }

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Account  Groups"
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
                        {records[0].acGroupCode == "X X X X" ? (
                          <MuiSkeleton />
                        ) : (
                          <TableBody>
                            {recordsAfterPagingAndSorting().map((item) => (
                              <TableRow key={item._id}>
                                <TableCell>{item.acGroupCode}</TableCell>
                                <TableCell>{item.acGroupName}</TableCell>
                                <TableCell>
                                  <span className={item.acGroupStatus}>
                                    {item.acGroupStatus}
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
                    <Form onSubmit={handleSubmit}>
                      <Grid container>
                        <Controls.Input
                          name="acGroupCode"
                          label="Code"
                          value={values.acGroupCode}
                          onChange={handleInputChange}
                          error={errors.acGroupCode}
                          disabled={true}
                        />

                        <Controls.Input
                          name="acGroupName"
                          label="Group Name"
                          value={values.acGroupName}
                          onChange={handleInputChange}
                          error={errors.acGroupName}
                        />

                        <UnusedAutosuggest
                          name="parentGroupName"
                          label="Parent"
                          value={values}
                          setValue={setValues}
                          options={groupTypes}
                          error={errors.parentGroupName}
                        />
                        <UnusedAutosuggest
                          name="groupType"
                          label="Group Type"
                          value={values}
                          setValue={setValues}
                          options={["Asset", "Laibality", "Income"]}
                          error={errors.groupType}
                        />
                      </Grid>{" "}
                      <Controls.RadioGroup
                        name="acGroupStatus"
                        label="Status"
                        value={values.acGroupStatus}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.acGroupStatus}
                      />
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
