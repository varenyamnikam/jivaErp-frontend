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
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import BasicSelect from "../../Usermaster/basicselect";
import Gimasterform from "./GlMasterForm";
const statusItems = [
  { id: "ACTIVE", title: "ACTIVE" },
  { id: "INACTIVE", title: "INACTIVE" },
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

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
}));
const initialValues = {
  glCode: "",
  glc: "",
  preFix: "",
  glGroupCode: "",
  glGroupName: "",
  glName: "",
  glOperateAs: "",
  glStatus: "",
  operateAs: "",
};
const initialGroupValues = {
  glGroupCode: "A10001",
  glGroupType: "ASSET",
  glGroupName: "CASH IN HAND",
  glGroupStatus: "ACTIVE",
  entryBy: "1001",
  entryOn: "2021-09-04 15:00:00",
  editBy: "NULL",
  editOn: "NULL",
};
const OperateItems = [
  { name: "CONTROL", code: "C" },
  { name: "SUB", code: "S" },
];

export default function AcGl() {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
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
  if (records.length == 1) {
    console.log("req sent");
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getacGl, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setRecords(response.data.mst_acgl);
      });
  }
  if (groups.length == 1) {
    console.log("req sent");
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getacGlGroup, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setGroups(response.data.mst_acglgroup);
      });
  }
  // setBranchNames(branchOption);
  //       setRecords(response.data.country);
  //       console.log(response.data.country);
  //       console.log("hi....", records, response.data);
  //     });

  function onDelete(item) {
    // roleService.deleteBranch(item);
    let newRecord = [];
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  }
  console.log("GL" + (parseInt("G105".match(/(\d+)/)[0]) + 1).toString());
  function getGlGroupName(code) {
    if (groups.length !== 1)
      return groups.filter((item) => {
        if (item.glGroupCode == code) {
          return item.glGroupName;
        }
      })[0].glGroupName;
  }
  // recordsAfterPagingAndSorting().map((item) => {
  //   console.log(getGlGroupName(item.glGroupCode));
  // });
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
                <Controls.Input
                  label="Search Role Name"
                  className={classes.searchInput}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onChange={() => {}}
                />
                <Controls.Button
                  text="Add New"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  className={classes.newButton}
                  onClick={(e) => {
                    setButtonPopup(true);
                    setValues(initialValues);
                  }}
                />
              </Toolbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.glCode}</TableCell>
                      <TableCell>{getGlGroupName(item.glGroupCode)}</TableCell>
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
                          <CloseIcon fontSize="small" />
                        </Controls.ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}{" "}
                </TableBody>
              </TblContainer>
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title="User form"
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
