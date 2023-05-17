import React, { useEffect, useState, useMemo } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import Popup from "../../../components/Popup";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import ClearIcon from "@mui/icons-material/Clear";
import Excel from "../../../components/useExcel";
import Print from "../../../components/print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MultipleSelectCheckmarks from "../../../components/multiSelect";
import Filter from "../../../components/filterButton";
import DateCalc from "../../../components/dateCalc";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "100%",
  },
  newButton: {
    // position: "absolute",
    // right: "10px",
  },
  Y: {
    padding: "5px",
    borderRadius: "5px",
    color: "green",
    backgroundColor: "rgba(0, 128, 0, 0.151)",
  },
  N: {
    padding: "5px",
    borderRadius: "5px",
    color: "goldenrod",
    backgroundColor: "rgba(189, 189, 3, 0.103)",
  },
}));
function getD() {
  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  return oneMonthAgo;
}

const initialLedgerValues = {
  vouNo: "",
  rec: "",
  cumRec: "",
  issue: "",
  cumIssue: "",
  cumStock: "",
};

export default function StockLedger({ records }) {
  const useBatch =
    JSON.parse(localStorage.getItem("adm_softwareSettings")).userBatchNo ==
    "Yes";
  const headCells = [
    { id: "Date", label: "Date", feild: "vouDate" },
    { id: "Voucher", label: "Voucher", feild: "vouNo" },
    { id: "Rec.", label: "Rec.", feild: "rec" },
    { id: "CumRec.", label: "CumRec.", feild: "cumRec" },
    { id: "Issue", label: "Issue", feild: "issue" },
    { id: "CumIssue", label: "CumIssue", feild: "cumIssue" },
    { id: "CumStock", label: "CumStock", feild: "cumStock" },
  ];
  const user = JSON.parse(localStorage.getItem("user"));
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");

  let query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&date=${new Date()}&useBatch=${useBatch}`;
  const { getD } = DateCalc(user);

  const initialFilterFn = {
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.refNo !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  };
  const [filterFn, setFilterFn] = useState(initialFilterFn);
  const [headcells, setheadcells] = useState(headCells);
  // const [count, setCount] = useState(records[records.length - 1].branchCode);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(records, headcells, filterFn);
  console.log(
    "records=>",
    records.sort((a, b) => new Date(a.vouDate) - new Date(b.vouDate))
  );

  return (
    <>
      <TableContainer>
        <TblContainer>
          <TblHead />

          <TableBody>
            {recordsAfterPagingAndSorting()
              .sort((a, b) => {
                const dateA = a.vouDate
                  ? new Date(a.vouDate.split("/").reverse().join("/"))
                  : new Date(0);
                const dateB = b.vouDate
                  ? new Date(b.vouDate.split("/").reverse().join("/"))
                  : new Date(0);
                return dateA - dateB;
              })
              .map((item) => (
                <TableRow>
                  {headcells.map((headcell, i) => (
                    <TableCell
                      key={headcell.id}
                      // sortDirection={orderBy === headcell.id ? order : false}
                      style={{
                        borderRight: "1px solid rgba(0,0,0,0.2)",
                      }}
                    >
                      {item[headcell.feild]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </TblContainer>
      </TableContainer>
      <TblPagination />
    </>
  );
}
