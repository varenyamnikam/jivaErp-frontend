import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./componentToPrint";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
  TableFooter,
} from "@material-ui/core";
import { Grid } from "@mui/material";
import Controls from "./controls/Controls";
import PrintIcon from "@mui/icons-material/Print";
import { getHours } from "date-fns";
import { reactLocalStorage } from "reactjs-localstorage";
import Popup from "./Popup";
import * as roleService from "../services/roleService";
export default function (props) {
  const {
    title = "",
    recordsAfterSorting,
    headCells,
    filter = {},
    filterFields = [],
  } = props;
  const [buttonPopup, setButtonPopup] = React.useState(false);
  let componentRef = React.useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  function geth() {
    if (recordsAfterSorting().length > 20) return "200vh";
    else {
      return "100vh";
    }
  }
  function x(string) {
    //helper
    return string in filter;
  }
  function produceDateString(date1, date2) {
    //helper
    // console.log(typeof date1, new Date(date1), isNaN(new Date(date1)), date2);
    return `From ${roleService.date(date1)} to ${roleService.date(date2)}`;
  }
  function GetTimePeriod() {
    if (x("startDate") && x("endDate")) {
      return produceDateString(filter.startDate, filter.endDate);
    } else return produceDateString(user.defaultYearStart, new Date());
  }
  function filterInfoText() {
    const filterLabelArr = filterFields
      .filter((item) =>
        typeof filter[item.feild] !== "function"
          ? filter[item.feild]
          : filter[item.feild]()
      )
      .map((item) => {
        const fieldValue =
          typeof filter[item.feild] !== "function"
            ? filter[item.feild]
            : filter[item.feild]();
        console.log(fieldValue);
        return {
          filterText: item.label,
          filterValues: fieldValue,
        };
      });
    console.log(filterLabelArr);
    if (filterLabelArr.length)
      return filterLabelArr
        .map((item) => `${item.filterText}: ${item.filterValues}`)
        .join(", ");
    else return "";
  }
  console.log(filterInfoText());
  // recordsAfterSorting().map((item) => {
  //   headCells.map((headCell) => {
  //     console.log(item, headCell.feild);
  //   });
  // });
  console.log(filterFields, headCells, filter);
  let company = JSON.parse(reactLocalStorage.get("company"));
  return (
    <>
      {/* button to trigger printing of target component */}
      <ReactToPrint
        trigger={() => (
          <Controls.Button
            text={<PrintIcon />}
            size="small"
            style={{
              height: "40px",
              borderRadius: "0px",
              marginLeft: "0px",
              marginRight: "0px",
            }}
            disableElevation={true}
          />
        )}
        content={() => componentRef.current}
      />
      {/* <Controls.Button
        text={<PrintIcon />}
        size="small"
        style={{
          height: "40px",
          borderRadius: "0px",
          marginLeft: "0px",
          marginRight: "0px",
        }}
        disableElevation={true}
        onClick={() => {
          setButtonPopup(true);
        }}
      />
 */}
      {/* component to be printed */}

      <div style={{ display: "none" }}>
        {/* <Popup
          size="lg"
          title=""
          openPopup={buttonPopup}
          setOpenPopup={setButtonPopup}
        > */}
        <div
          ref={componentRef}
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            height: geth(),
            flexGrow: 1,
            padding: "20px",
          }}
        >
          <Grid container spacing={1}>
            <Grid
              item
              sm={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h1>{company.companyName}</h1>
            </Grid>
            <Grid item sm={6}>
              <h1>{title}</h1>
            </Grid>
            <Grid item sm={6} style={{ display: "flex", alignItems: "center" }}>
              <h2> {GetTimePeriod()}</h2>
            </Grid>
            {filterInfoText() && (
              <Grid
                item
                sm={12}
                style={{ display: "flex", alignItems: "center" }}
              >
                <typography> {filterInfoText()}</typography>
              </Grid>
            )}
            <Grid item sm={12}>
              <table className="table">
                <TableHead sx={{ "& td": { border: 0 } }}> </TableHead>
                <br />
                <TableHead>
                  <TableRow>
                    {headCells.map(
                      (headCell) =>
                        headCell.label !== "Edit" && (
                          <TableCell
                            key={headCell.id}
                            style={{
                              border: "1px solid rgba(0,0,0,0.2)",
                            }}
                          >
                            {headCell.label == "Edit" ? "" : headCell.label}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recordsAfterSorting().map((item) => (
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
                              {headCell.feild in item
                                ? item[headCell.feild]
                                : ""}
                            </TableCell>
                          )
                      )}{" "}
                    </TableRow>
                  ))}{" "}
                  {/* {recordsAfterSorting().map((item) => (
                      <TableRow key={item._id}>
                        {headCells.map(
                          (headCell) =>
                            headCell.feild in item && (
                              <TableCell
                                key={headCell.id}
                                style={{
                                  border: "1px solid rgba(0,0,0,0.2)",
                                  color: "black",
                                }}
                              >
                                {headCell.feild in item
                                  ? item[headCell.feild]
                                  : ""}
                              </TableCell>
                            )
                        )}{" "}
                      </TableRow>
                    ))} */}
                </TableBody>
              </table>{" "}
            </Grid>
            {/* <Grid
              container
              style={{
                padding: "1rem",
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                color: "white",
                pageBreakInside: "none",
                backgroundColor: "green",
              }}
            >
              <h1> Footer </h1>
            </Grid> */}
          </Grid>
        </div>
        {/* </Popup> */}
      </div>
    </>
  );
}
