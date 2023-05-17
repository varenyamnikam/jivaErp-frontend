import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import * as roleService from "../services/roleService";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { AiFillFileExcel } from "react-icons/ai";
import { reactLocalStorage } from "reactjs-localstorage";
const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(1),
    "& thead th": {
      fontWeight: "600",
      color: theme.palette.primary.main,
      backgroundColor: "#e2e9f3",
    },
    "& tbody td": {
      fontWeight: "300",
      fontSize: "16px",
      padding: "3px",
      // "&:nth-of-type(odd)": {
      //   backgroundColor: "red",
      // },
    },
    "& tbody tr": {
      "&:nth-of-type(even)": {
        backgroundColor: "#e3e0e0",
      },
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      // backgroundColor: "red",
      cursor: "pointer",
    },
    "& .MuiTableCell-root": {
      borderRight: "1px solid rgba(0,0,0,0.2)",
    },
    border: "1px solid rgba(0,0,0,0.2)",
  },
  excel: {
    backgroundColor: "#28A745",
    color: "white",
    height: "40px",
    padding: "0px",
    margin: "0px",
    marginTop: "4px",
    paddingLeft: "15px",
    paddingRight: "15px",
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
  },
}));

export default function Excel(props) {
  const {
    title,
    recordsAfterSorting,
    headCells,
    filter = {},
    filterFields = [],
  } = props;
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(recordsAfterSorting());
  const classes = useStyles();

  function produceDateString(date1, date2) {
    //helper
    // console.log(typeof date1, new Date(date1), isNaN(new Date(date1)), date2);
    return `From ${roleService.date(date1)} to ${roleService.date(date2)}`;
  }

  function GetTimePeriod() {
    if ("startDate" in filter && "endDate" in filter) {
      return produceDateString(filter.startDate, filter.endDate);
    } else return produceDateString(user.defaultYearStart, new Date());
  }
  function filterInfoText() {
    const filterLabelArr = filterFields
      .filter((item) => filter[item.feild])
      .map((item) => ({
        filterText: item.label,
        filterValues: filter[item.feild],
      }));
    console.log(filterLabelArr);
    if (filterLabelArr.length)
      return filterLabelArr
        .map((item) => `${item.filterText}: ${item.filterValues}`)
        .join(", ");
    else return "";
  }

  let company = JSON.parse(reactLocalStorage.get("company"));
  return (
    <>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className={classes.excel}
        table="print"
        filename="tablexls"
        sheet="tablexls"
        buttonText={<AiFillFileExcel size={20} style={{ bottom: 5 }} />}
      />
      <table className="table" id="print" style={{ display: "none" }}>
        <TableContainer id="print">
          <TableHead>
            <TableRow
              style={{
                fontWeight: "600",
                fontSize: "25px",
                color: "blue",
                backgroundColor: "#e2e9f3",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <TableCell>
                <h1>{company.companyName}</h1>
              </TableCell>
            </TableRow>{" "}
          </TableHead>

          <TableRow
            style={{
              fontWeight: "600",
              fontSize: "20px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TableCell>
              <h1>{title}</h1>
            </TableCell>{" "}
          </TableRow>
          <TableRow
            style={{
              fontWeight: "600",
              fontSize: "20px",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TableCell
              item
              sm={6}
              style={{ display: "flex", alignItems: "center" }}
            >
              {GetTimePeriod()}
            </TableCell>{" "}
          </TableRow>

          {filterInfoText() && (
            <TableRow>
              <TableCell
                item
                sm={12}
                style={{ display: "flex", alignItems: "center" }}
              >
                <typography> {filterInfoText()}</typography>
              </TableCell>
            </TableRow>
          )}
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  style={{
                    borderRight: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {headCell.label == "Edit" ? "" : headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterSorting().length ? (
              recordsAfterSorting().map((item) => (
                <TableRow key={item._id}>
                  {headCells.map(
                    (headCell) =>
                      headCell.feild in item && (
                        <TableCell
                          key={headCell.id}
                          style={{
                            border: "1px solid rgba(0,0,0,0.2)",
                            color: "black",
                            whiteSpace: "nowrap",
                          }}
                          align={headCell.align}
                        >
                          {headCell.feild in item ? item[headCell.feild] : ""}
                        </TableCell>
                      )
                  )}{" "}
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </TableContainer>
      </table>
    </>
  );
}
