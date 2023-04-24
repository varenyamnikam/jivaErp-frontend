import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Reusemaster from "./reusableMaster";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";

const initialBranchValues = {
  contactNo: "",
  Mobileno: "",
  pesticideLicenceNo: "",
  seedLicenceNo: "",
  Emailid: "",
  GSTno: "",
  pinCode: "",
  adressLine2: "",
  adressLine1: "",
  branchName: "",
  branchCode: "",
  branchType: "",
  stateCode: 0,
};

export default function ReuseTable(props) {
  const {
    title,
    recordsAfterPagingAndSorting,
    setValues,
    setButtonPopup,
    setConfirmDialog,
    setNotify,
    onDelete,
  } = props;
  if (title == "COUNTRY")
    return recordsAfterPagingAndSorting().map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.countryCode}</TableCell>
        <TableCell>{item.countryName}</TableCell>
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
                  onDelete(item);
                  e.preventDefault();
                }}
                setConfirmDialog={setConfirmDialog}
              />
            </>
          )}
        </TableCell>
      </TableRow>
    ));

  if (title == "STATE")
    return recordsAfterPagingAndSorting().map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.countryCode}</TableCell>
        <TableCell>{item.stateCode}</TableCell>
        <TableCell>{item.stateName}</TableCell>
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
                  onDelete(item);
                  e.preventDefault();
                }}
                setConfirmDialog={setConfirmDialog}
              />
            </>
          )}
        </TableCell>
      </TableRow>
    ));
  if (title == "DISTRICT")
    return recordsAfterPagingAndSorting().map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.countryCode}</TableCell>
        <TableCell>{item.stateCode}</TableCell>
        <TableCell>{item.districtCode}</TableCell>
        <TableCell>{item.districtName}</TableCell>
        <TableCell>{item.districtStatus}</TableCell>
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
    ));
  if (title == "TALUKA")
    return recordsAfterPagingAndSorting().map((item) => (
      <TableRow key={item._id}>
        <TableCell>{item.countryCode}</TableCell>
        <TableCell>{item.stateCode}</TableCell>
        <TableCell>{item.districtCode}</TableCell>
        <TableCell>{item.talukaName}</TableCell>
        <TableCell>{item.talukaStatus}</TableCell>
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
    ));
}
