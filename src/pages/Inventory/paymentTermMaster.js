import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
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
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import Popup from "../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../components/useForm";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import { NotifyMsg } from "../../components/notificationMsg";
const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Term ID", label: "Term ID" },
  { id: "Payment Terms", label: "Payment Terms" },
  { id: "EDIT", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.paymentTermsCode !== "") return item;
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
  paymentTermsCode: "X X X X",
  paymentTerms: "",
};
const initialFilterValues = {
  ...initialValues,
  paymentTermsCode: "",
};

export default function AccountMaster() {
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
  const [loading, setLoading] = useState(false);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("paymentTerms");
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "");
  };

  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values, records);
  const url = Config.paymentTerms;
  const handleErr = (err) => {
    setNotify(NotifyMsg(4));
  };

  if (loading) {
    const handleRes = (res) => {
      console.log(res.data);
      if (res.data.mst_paymentTerm.length !== 0) {
        setRecords(res.data.mst_paymentTerm);
      } else {
        setRecords([initialFilterValues]);
      }
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {
      loading && setLoading(false);
    });
  }
  function onDelete(item) {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });

    const handleRes = (res) => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.paymentTermsCode !== item.paymentTermsCode;
      });
      if (newRecord.length == 0) {
        setRecords([initialFilterValues]);
      } else {
        setRecords(newRecord);
      }
      roleService.axiosDelete(url, item, handleRes, handleErr, () => {});
    };
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
        if (item.paymentTermsCode == values.paymentTermsCode) {
          const updatedRecords = records.map((p) =>
            p.paymentTermsCode === values.paymentTermsCode ? values : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          x = false;
        }
      });
      console.log(x);
      if (x) {
        function handleRes(res) {
          console.log("hi....", res.data.values);
          setNotify(NotifyMsg(1));
          setButtonPopup(false);
        }
        roleService.axiosPut(url, values, handleRes, handleErr, () => {});
      } else {
        function handleRes(res) {
          setNotify(NotifyMsg(2));
          setButtonPopup(false);
        }
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
          if (item.paymentTerms.toLowerCase().includes(allfields.toLowerCase()))
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
      <PageHeader
        title="Payment Type Master"
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
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    style={{ display: "flex", justifyContent: "flex-end" }}
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
                  {records[0].paymentTermsCode == "X X X X" ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.paymentTermsCode}</TableCell>
                          <TableCell>{item.paymentTerms}</TableCell>
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
                                  },
                                });
                                e.preventDefault();
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </Controls.ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </TblContainer>
              </TableContainer>
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title="Payment Term form"
            openPopup={buttonPopup}
            setOpenPopup={setButtonPopup}
          >
            <Form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item sm={6} xs={12}>
                  <Controls.Input
                    name="paymentTermsCode"
                    label="Term ID"
                    value={values.paymentTermsCode}
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controls.Input
                    name="paymentTerms"
                    label="Payment Terms"
                    value={values.paymentTerms}
                    onChange={handleInputChange}
                    error={errors.paymentTerms}
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
    </>
  );
}
