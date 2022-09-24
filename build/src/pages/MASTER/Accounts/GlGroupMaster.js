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
const statusItems = [
  { id: "ACTIVE", title: "ACTIVE" },
  { id: "INACTIVE", title: "INACTIVE" },
];
const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "TYPE", label: "TYPE" },
  { id: "GroupName", label: "GROUP NAME" },
  { id: "status", label: "STATUS", disableSorting: true },
  { id: "Edit", label: "EDIT" },
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
  glGroupCode: "",
  glGroupType: "",
  glGroupName: "",
  glGroupStatus: "",
};
export default function AcGlGroup() {
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
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
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);
  console.log(values);
  if (records[0].glGroupCode !== "A10001") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.getacGlGroup, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setRecords(response.data.mst_acglgroup);
      });
  }
  // setBranchNames(branchOption);
  //       setRecords(response.data.country);
  //       console.log(response.data.country);
  //       console.log("hi....", records, response.data);
  //     });
  console.log(records);
  function onDelete(item) {
    // roleService.deleteBranch(item);
    let newRecord = [];
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  }
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    let x = true;
    records.map((item, index) => {
      if (item.glGroupCode == values.glGroupCode) {
        const updatedRecords = records.map((p) =>
          p.glGroupCode === values.glGroupCode ? values : p
        );
        console.log(updatedRecords);
        setRecords(updatedRecords);
        x = false;
      }
    });
    if (x) {
      setRecords([...records, values]);
      roleService.insertglGroup(values);
    }
  }
  console.log("GL" + (parseInt("G105".match(/(\d+)/)[0]) + 1).toString());
  return (
    <>
      <PageHeader
        title="Account GL Groups"
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
                      <TableCell>{item.glGroupCode}</TableCell>
                      <TableCell>{item.glGroupType}</TableCell>
                      <TableCell>{item.glGroupName}</TableCell>
                      <TableCell>{item.glGroupStatus}</TableCell>
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
            <Form onSubmit={handleSubmit}>
              <Grid container>
                <Controls.Input
                  name="glGroupCode"
                  label="Code"
                  value={values.glGroupCode}
                  onChange={handleInputChange}
                  // error={errors.stateCode}
                />

                <Controls.Input
                  name="glGroupName"
                  label="Group Name"
                  value={values.glGroupName}
                  onChange={handleInputChange}
                  // error={errors.stateName}
                />

                <BasicSelect
                  name="glGroupType"
                  label="Group Type"
                  values={values}
                  setValues={setValues}
                  options={groupTypes}
                />
                <Controls.RadioGroup
                  name="glGroupStatus"
                  label="Status"
                  value={values.glGroupStatus}
                  onChange={handleInputChange}
                  items={statusItems}
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
    </>
  );
}
