import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import RolemasterForm from "./RolemasterForm";
import RoleForm from "./RoleForm";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Popup from "../../components/Popup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";

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

export default function Rolemaster() {
  const headCells = [
    { id: "roleCode", label: "CODE" },
    { id: "roleName", label: "NAME" },
    { id: "actions", label: "RIGHTS", disableSorting: true },
  ];

  const classes = useStyles();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsRights, setRecordsRights] = useState([]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
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
  console.log(recordsRights);

  useEffect(() => {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.userUrl, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        setRecords(JSON.parse(JSON.stringify(response.data.adm_userrole)));
        // console.log(response.data.adm_userrole);
        // console.log(response.data.adm_userrights);

        setRecordsRights(
          JSON.parse(JSON.stringify(response.data.adm_userrights))
        );
      });
  }, []);
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.roleName.toLowerCase().includes(target.value)
          );
      },
    });
  };

  // const addOrEdit = (newrole) => {
  //   roleService.insertnewRole(newrole);
  //   console.log(newrole);
  //   setOpenPopup(false);
  //   console.log(records);
  //   setRecords([
  //     ...records,
  //     { roleCode: newrole.roleCode, roleName: newrole.roleName },
  //   ]);
  // };

  const addOrEdit = (newrole) => {
    console.log(newrole);
    console.log(records);
    let x = false;
    records.map((item) => {
      if (
        item.roleCode == newrole.roleCode &&
        item.roleName == newrole.roleName
      ) {
        x = true;
        console.log("found");
      }
    });
    roleService.insertnewRole(newrole);
    console.log(newrole);
    setOpenPopup(false);
    console.log(records);
    if (!x) {
      setRecords([
        ...records,
        { roleCode: newrole.roleCode, roleName: newrole.roleName },
      ]);
    } else {
      setNotify({
        isOpen: true,
        message: "Record already exists",
        type: "error",
      });
    }
  };

  const addOrEditRights = (newroleRights, subNav) => {
    roleService.insertnewRoleRights(newroleRights);
    // resetForm();
    setOpenPopup(false);
    console.log(newroleRights.roleName);
    console.log(subNav);

    setRecordsRights([
      ...recordsRights,
      {
        _id: 1,
        roleCode: newroleRights.roleCode,
        roleName: subNav,
        menuRight: newroleRights.menuRight,
        editRight: newroleRights.editRight,
        addRight: newroleRights.addRight,
        deleteRight: newroleRights.deleteRight,
      },
    ]);
    console.log(recordsRights);
    console.log(newroleRights);
  };

  const openInPopup = (item) => {
    console.log(item);
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const onDelete = (roleCode) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    console.log(roleCode);
    roleService.deleteUserRole(roleCode);
    setRecords((prev) => {
      console.log("delete:" + roleCode);
      return prev.filter(function (item) {
        console.log(item);
        console.log(roleCode);
        return item.roleCode !== roleCode;
      });
    });

    // console.log(newrole1)
    // setRecords(newrole1)
    // setRecords(newrole, [...records])

    // setRecords([
    //   ...records,
    //   //{ roleCode: newrole.roleCode, roleName: newrole.roleName },
    // ]);

    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "error",
    });
  };

  return (
    <>
      <PageHeader
        title="Role Master"
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
                  onChange={handleSearch}
                />
                <Controls.Button
                  text="Add New"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  className={classes.newButton}
                  onClick={() => {
                    setButtonPopup(true);
                    setRecordForEdit(null);
                  }}
                />
              </Toolbar>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.roleCode}</TableCell>
                      <TableCell>{item.roleName}</TableCell>
                      <TableCell>
                        <Controls.ActionButton
                          color="primary"
                          onClick={() => {
                            openInPopup(item);
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </Controls.ActionButton>
                        <Controls.ActionButton
                          color="secondary"
                          onClick={(e) => {
                            setConfirmDialog({
                              isOpen: true,
                              title: "Are you sure to delete this record?",
                              subTitle: "You can't undo this operation",
                              onConfirm: (e) => {
                                onDelete(item.roleCode);
                                e.preventDefault();
                                console.log("records:" + records);
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
              </TblContainer>
              <TblPagination />
            </section>
          </Paper>
          <Popup
            title="Role Master Form"
            openPopup={buttonPopup}
            setOpenPopup={setButtonPopup}
          >
            <RoleForm addOrEdit={addOrEdit} />
          </Popup>
          <Notification notify={notify} setNotify={setNotify} />
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />

          <Popup
            title="Admin Role Rights Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            size="md"
          >
            <RolemasterForm
              recordForEdit={recordForEdit}
              addOrEditRights={addOrEditRights}
              recordsRights={recordsRights}
              setRecordsRights={setRecordsRights}
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
