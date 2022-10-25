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
export default function (props) {
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterSorting,
    headCells,
  } = props;
  let componentRef = React.useRef();
  function geth() {
    if (recordsAfterSorting().length > 20) return "200vh";
    else {
      return "100vh";
    }
  }

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
      {/* component to be printed */}
      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "column",
            height: geth(),
            flexGrow: 1,
          }}
        >
          <table className="table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={4}>
                  <h1>{company.companyName}</h1>
                  <p> filter: x y z</p>
                </TableCell>
              </TableRow>
            </TableHead>
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
                          }}
                        >
                          {headCell.feild in item ? item[headCell.feild] : ""}
                        </TableCell>
                      )
                  )}{" "}
                </TableRow>
              ))}
              {recordsAfterSorting().map((item) => (
                <TableRow key={item._id}>
                  {headCells.map(
                    (headCell) =>
                      headCell.feild in item && (
                        <TableCell
                          key={headCell.id}
                          style={{
                            borderRight: "1px solid rgba(0,0,0,0.2)",
                            color: "black",
                          }}
                        >
                          {headCell.feild in item ? item[headCell.feild] : ""}
                        </TableCell>
                      )
                  )}{" "}
                </TableRow>
              ))}
            </TableBody>
          </table>
          <Grid
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
          </Grid>
        </div>
      </div>
    </>
  );
}
