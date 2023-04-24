import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import Branchform from "./branchform";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import AuthHandler from "../../../Utils/AuthHandler";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import { Grid, Card } from "@material-ui/core";
import "../../../components/home.scss";
import MuiSkeleton from "../../../components/skeleton";
import GetData from "./initialValues";
import { NotifyMsg } from "../../../components/notificationMsg";
const {
  initialFilterFn,
  initialBranchValues,
  initialFilterValues,
  useStyles,
  headCells,
  defaultValue,
} = GetData();
console.log(
  initialFilterFn,
  initialBranchValues,
  initialFilterValues,
  useStyles,
  headCells
);
const Branchmaster = (props) => {
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [loading, setLoading] = useState(true);

  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialBranchValues);
  const [branchNames, setBranchNames] = useState([]);
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
  const [records, setRecords] = useState([initialBranchValues]);
  const [location, setLocation] = useState({
    states: [""],
    country: [""],
  });
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(recordsAfterPagingAndSorting());
  // mount data
  function getAcBranchName(code) {
    let parentBranch;
    parentBranch = records.find((parent) => parent.branchCode == code);
    let name = parentBranch ? parentBranch.branchName : "";
    return name;
  }
  const url = Config.Branch;

  if (loading) {
    const handleRes = (response) => {
      console.log(response);
      let data = response.data.adm_branch;

      if (data.length !== 0) {
        setRecords(data);
      }
      response.data.states.length !== 0 &&
        response.data.country.length !== 0 &&
        setLocation({
          states: response.data.states,
          country: response.data.country,
        });
      loading && setLoading(false);
    };

    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.log(err);
      loading && setLoading(false);
    };

    const handleFinally = () => {
      loading && setLoading(false);
    };

    roleService.axiosGet(url, handleRes, handleErr, handleFinally);
  }
  // if (!location.states[0] && !location.country[0]) {
  //   const url = Config.location;
  //   const body = { hello: "hello" };

  //   const handleRes = (response) => {
  //     if (
  //       response.data.states.length !== 0 &&
  //       response.data.country.length !== 0
  //     ) {
  //       setLocation(response.data);
  //     } else {
  //       setLocation(defaultValue);
  //     }
  //   };
  //   function handleErr(err) {
  //     setNotify(NotifyMsg(4));
  //     console.log(err);
  //   }
  //   const handleFinally = () => {};

  //   roleService.axiosPost(url, body, handleRes, handleErr, handleFinally);
  // }

  console.log(values);
  const { states, districts, talukas, country } = location;
  // console.log(location, states, districts, talukas, country);
  console.log(states, country);

  console.log(records);
  function onDelete(item) {
    const body = item;
    const handleRes = (response) => {
      let newRecord = [];
      newRecord = records.filter((record) => {
        return record.branchCode !== item.branchCode;
      });
      console.log(newRecord);
      if (newRecord.length == 0) {
        setRecords([initialBranchValues]);
      } else {
        setRecords(newRecord);
      }
      setNotify(NotifyMsg(3));
    };
    function handleErr(err) {
      setNotify(NotifyMsg(4));
      console.log(err);
    }
    roleService.axiosDelete(url, body, handleRes, handleErr, () => {});

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
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
          if (
            item.branchType.toLowerCase().includes(allfields.toLowerCase()) ||
            item.branchCode.includes(allfields.toLowerCase()) ||
            item.talukaName.toLowerCase().includes(allfields.toLowerCase()) ||
            item.branchName.toLowerCase().includes(allfields.toLowerCase())
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

  return (
    <>
      <PageHeader
        title="Branch Master"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />
      <section className="content">
        <div className="card">
          <div className="card-body">
            <section className="content">
              <Toolbar>
                <Grid container spacing={2}>
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
                        setValues(initialBranchValues);
                      }}
                    />
                  </Grid>
                </Grid>
              </Toolbar>

              <Grid container>
                <TblContainer>
                  <TblHead />
                  {loading ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.branchCode}</TableCell>
                          <TableCell>{item.branchName}</TableCell>
                          <TableCell>{item.branchType}</TableCell>
                          <TableCell>
                            {getAcBranchName(item.acBranchCode)}
                          </TableCell>
                          <TableCell>
                            <Controls.EditButton
                              handleClick={() => {
                                setValues(item);
                                setButtonPopup(true);
                              }}
                            />{" "}
                            {Number(item.branchCode) !== 1001 && (
                              <Controls.DeleteButton
                                handleConfirm={(e) => {
                                  AuthHandler.canDelete()
                                    ? onDelete(item)
                                    : setNotify(NotifyMsg(8));
                                }}
                                setConfirmDialog={setConfirmDialog}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </TblContainer>
              </Grid>
              <TblPagination />
            </section>
            <Popup
              title="Branch form"
              openPopup={buttonPopup}
              setOpenPopup={setButtonPopup}
              size="md"
            >
              <Branchform
                records={records}
                setRecords={setRecords}
                values={values}
                setValues={setValues}
                initialFilterValues={initialFilterValues}
                branchNames={branchNames}
                country={location.country}
                states={location.states}
                setButtonPopup={setButtonPopup}
                setNotify={setNotify}
              />
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
};

export default Branchmaster;
// <Usermasterpopup
// title="User form"
// openPopup={buttonPopup}
// setOpenPopup={setButtonPopup}
// count={count}
// setCount={setCount}
// values={values}
// records={records}
// >
