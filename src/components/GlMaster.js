import React, { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import AuthHandler from "../Utils/AuthHandler";
import axios from "axios";
import Config from "../Utils/Config";
import * as roleService from "../services/roleService";
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
import useTable from "./useTable";
import Controls from "./controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "./userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";
import Popup from "./Popup";
import { Grid } from "@material-ui/core";
import { Form } from "./useForm";
import Gimasterform from "./GlMasterForm";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
// import "../../../components/public.css";
import MuiSkeleton from "./skeleton";

const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "GROUP", label: "GROUP" },
  { id: "GLName", label: "GLName" },
  { id: "OPERATE", label: "OPERATE" },
  { id: "STATUS", label: "STATUS", disableSorting: true },
  { id: "EDIT", label: "EDIT" },
];
const initialFilterFn = {
  fn: (items) => {
    let newRecords = items.filter((item) => {
      if (item.glCode !== "") return item;
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
  glCode: "X X X X",
  glGroupCode: "",
  glGroupName: "",
  glName: "",
  glOperateAs: "",
  glStatus: "",
  operateAs: "",
};
const initialFilterValues = {
  glCode: "",
  glGroupCode: "",
  glGroupName: "",
  glName: "",
  glOperateAs: "",
  glStatus: "",
  operateAs: "",
};
const initialGroupFilterValues = {
  glGroupCode: "",
  glGroupType: "",
  glGroupName: "",
  glGroupStatus: "",
};

const initialGroupValues = {
  glGroupCode: "X X X X",
  glGroupType: "",
  glGroupName: "",
  glGroupStatus: "",
};
const OperateItems = [
  { name: "CONTROL", code: "C" },
  { name: "SUB", code: "S" },
];

export default function AcGl() {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [filter, setFilter] = useState(initialFilterValues);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [records, setRecords] = useState([initialValues]);
  const [groups, setGroups] = useState([initialGroupValues]);
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
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  if (records[0] && records[0].glCode == "X X X X") {
    console.log("req sent");
    const token = AuthHandler.getLoginToken();
    axios
      .get(Config().acgl + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_acgl.length !== 0) {
          setRecords(response.data.mst_acgl);
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
  if (groups[0] && groups[0].glGroupCode == "X X X X") {
    console.log("req sent");
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config().acglgroup + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.mst_acglgroup.length !== 0) {
          setGroups(response.data.mst_acglgroup);
        } else {
          setGroups([initialGroupFilterValues]);
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

  function onDelete(item) {
    let newRecord = [];
    newRecord = records.filter((record) => {
      return record.glCode !== item.glCode;
    });
    setRecords(newRecord);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    const token = AuthHandler.getLoginToken();
    axios
      .post(
        Config().acgl + query,
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
  console.log("GL" + (parseInt("G105".match(/(\d+)/)[0]) + 1).toString());
  function getGlGroupName(code) {
    if (groups) {
      const name = groups.map((item) => {
        if (item.glGroupCode == code) return item.glGroupName;
      });
      return name;
    } else {
      return "";
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
            item.glGroupCode.toLowerCase().includes(allfields.toLowerCase()) ||
            item.glGroupType.toLowerCase().includes(allfields.toLowerCase()) ||
            item.glGroupName.toLowerCase().includes(allfields.toLowerCase())
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
      <PageHeader
        title="Account GL Master"
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
                  </Grid>{" "}
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
                      }}
                    />
                  </Grid>
                </Grid>
              </Toolbar>
              <TableContainer>
                <TblContainer>
                  <TblHead />
                  {records[0].glCode == "X X X X" ? (
                    <MuiSkeleton />
                  ) : (
                    <TableBody>
                      {recordsAfterPagingAndSorting().map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.glCode}</TableCell>
                          <TableCell>
                            {getGlGroupName(item.glGroupCode)}
                          </TableCell>
                          <TableCell>{item.glName}</TableCell>
                          <TableCell>{item.glOperateAs}</TableCell>
                          <TableCell>{item.glStatus}</TableCell>
                          <TableCell>
                            <Controls.ActionButton
                              color="primary"
                              onClick={() => {
                                setValues({
                                  ...item,
                                  glGroupName: getGlGroupName(item.glGroupCode),
                                });
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
                              <DeleteIconOutline fontSize="small" />
                            </Controls.ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}{" "}
                    </TableBody>
                  )}
                </TblContainer>
              </TableContainer>{" "}
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title="Gl Master Form"
            openPopup={buttonPopup}
            setOpenPopup={setButtonPopup}
          >
            <Gimasterform
              values={values}
              setValues={setValues}
              records={records}
              setRecords={setRecords}
              groupTypes={groups}
              statusItems={statusItems}
              initialFilterValues={initialFilterValues}
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
    </>
  );
}
