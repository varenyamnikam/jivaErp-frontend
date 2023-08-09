import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { reactLocalStorage } from "reactjs-localstorage";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@material-ui/core";
import Controls from "../controls/Controls";
import PrintIcon from "@mui/icons-material/Print";
import { Grid } from "@mui/material";
import { add } from "date-fns";
import AuthHandler from "../../Utils/AuthHandler";
import * as roleService from "../../services/roleService";
import Components from "./pdfcomponent";
import IdealComponents from "../printInvoice/ideal";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    "& thead th": {
      // fontWeight: "600",
      border: "1px solid rgba(0,0,0,0.2)",
    },
    "& tbody td": {
      fontSize: "16px",
      padding: "3px",
      // "&:nth-of-type(odd)": {
      //   backgroundColor: "red",
      // },
      //
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
  footer: {
    padding: "1rem",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  center: { alignItems: "center", justifyContent: "flex-end" },
}));

const ComponentToPdf = React.forwardRef((props, ref) => {
  const { values, voucherItems, adress, accounts, products, payTerms, item } =
    props;

  function geth(arr) {
    console.log(arr.length);
    if (arr.length) {
      if (arr.length > 10) return "100px";
      else {
        return "842px";
      }
    } else {
      return "842px";
    }
  }
  function getItems(values) {
    let arr = [];
    arr = voucherItems.filter((item) => item.vouNo == values.vouNo);
    return arr;
  }
  const { Header, AddressInfo, FooterComponent, TableComponent } =
    Components(props);
  // const { Header, AddressInfo, FooterComponent } = IdealComponents(props);

  return (
    <>
      <Grid
        container
        ref={ref}
        style={{
          height: geth(getItems(values)),
          padding: "20px",
          width: "610px",
          fontSize: "8px",
        }}
        spacing={2}
      >
        <Grid Item>
          <Grid container>
            <Header />
            <AddressInfo />
            <TableComponent />
          </Grid>
        </Grid>
        <Grid Item style={{ padding: "20px" }}>
          <FooterComponent />
        </Grid>
      </Grid>
    </>
  );
});
export default ComponentToPdf;
