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
} from "@material-ui/core";
import Controls from "./controls/Controls";
import PrintIcon from "@mui/icons-material/Print";
import { Grid } from "@mui/material";
import { add } from "date-fns";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    "& thead th": {
      // fontWeight: "600",
    },
    "& tbody td": {
      fontSize: "16px",
      //padding: "3px",
      // "&:nth-of-type(odd)": {
      //   backgroundColor: "red",
      // },
      //border: "1px solid rgba(0,0,0,0.2)",
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
    color: "white",
  },
  center: { alignItems: "center", justifyContent: "flex-end" },
}));
function getTheme() {
  if (localStorage.getItem("color") == "blue") {
    return "#79A9C5EB";
  } else {
    return "green";
  }
}
function price_in_words(price) {
  var sglDigit = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ],
    dblDigit = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ],
    tensPlace = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ],
    handle_tens = function (dgt, prevDgt) {
      return 0 == dgt
        ? ""
        : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
    },
    handle_utlc = function (dgt, nxtDgt, denom) {
      return (
        (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
        (0 != nxtDgt || dgt > 0 ? " " + denom : "")
      );
    };

  var str = "",
    digitIdx = 0,
    digit = 0,
    nxtDigit = 0,
    words = [];
  if (((price += ""), isNaN(parseInt(price)))) str = "";
  else if (parseInt(price) > 0 && price.length <= 10) {
    for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
      switch (
        ((digit = price[digitIdx] - 0),
        (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
        price.length - digitIdx - 1)
      ) {
        case 0:
          words.push(handle_utlc(digit, nxtDigit, ""));
          break;
        case 1:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 2:
          words.push(
            0 != digit
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                    ? " and"
                    : "")
              : ""
          );
          break;
        case 3:
          words.push(handle_utlc(digit, nxtDigit, "Thousand"));
          break;
        case 4:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 5:
          words.push(handle_utlc(digit, nxtDigit, "Lakh"));
          break;
        case 6:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 7:
          words.push(handle_utlc(digit, nxtDigit, "Crore"));
          break;
        case 8:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 9:
          words.push(
            0 != digit
              ? " " +
                  sglDigit[digit] +
                  " Hundred" +
                  (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                    ? " and"
                    : " Crore")
              : ""
          );
      }
    str = words.reverse().join("");
  } else str = "";
  return str;
}

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { values, accounts, itemList, records, title } = props;
  const classes = useStyles();
  const recentImageDataUrl = localStorage.getItem("recent-image");
  function getParty(obj) {
    const party = accounts.find((item) => item.acCode == obj.acCode);
    console.log(accounts, party);
    if ("acCode" in obj && party) {
      console.log(party);
      return party.acName;
    } else {
      return "";
    }
  }
  function getItems(values) {
    let arr = [];
    // arr = records.filter(
    //   (item) => item.vouNo == values.vouNo && Number(item.srNo) !== 1
    // );
    console.log(records, values);
    arr = records.filter(
      (item) => item.vouNo == values.vouNo && Number(item.srNo)
    );

    return arr;
  }
  function calc(list) {
    let credit = 0;
    let debit = 0;
    let net = 0;
    list.map((item) => {
      credit += Number(item.credit);
      debit += Number(item.debit);
    });
    let obj = { credit: credit, debit: debit };
    return obj;
  }
  function finalCalc(obj = calc(getItems(values))) {
    let temp = 0;
    if (values.docCode == "BP" || values.docCode == "CP") {
      temp = Number(obj.debit) - Number(obj.credit);
      obj.credit = temp;
      obj.debit = 0;
    } else if (values.docCode == "BR" || values.docCode == "CR") {
      temp = Number(obj.credit) - Number(obj.debit);
      obj.credit = 0;
      obj.debit = temp;
    } else {
      obj.debit = 0;
      obj.credit = 0;
    }
    console.log(obj, values.docCode);
    return obj;
  }

  function getImage() {
    if (recentImageDataUrl) {
      return (
        <img
          height={150}
          width={50}
          src={recentImageDataUrl}
          alt=""
          id="img"
          className="img"
        />
      );
    } else
      return (
        <img
          height={150}
          width={50}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          id="img"
          className="img"
        />
      );
  }
  const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  let company = JSON.parse(reactLocalStorage.get("company"));
  function getDate(code) {
    const date = new Date(code);
    const zeroPad = (num, places) => String(num).padStart(places, "0");

    return (
      String(date.getDate()) +
      "/" +
      String(zeroPad(date.getMonth() + 1, 2)) +
      "/" +
      // String(date.getFullYear()).slice(-2)
      String(date.getFullYear())
    );
  }
  console.log(getTheme());
  function geth(arr) {
    if (arr.length) {
      if (arr.length > 20) return "200vh";
      else {
        return "100vh";
      }
    } else {
      return "100vh";
    }
  }
  console.log(
    getItems(values).map((item) => (
      <h4>
        {Number(item.credit) == 0 ? item.debit : item.credit}
        <br />
      </h4>
    ))
  );
  const center = { display: "flex", justifyContent: "center" };
  const right = { display: "flex", justifyContent: "flex-end" };
  function getDate(code) {
    const date = new Date(code);
    return (
      String(date.getDate()) +
      "/" +
      String(date.getMonth() + 1) +
      "/" +
      String(date.getFullYear()).slice(-2)
    );
  }

  return (
    <>
      <div
        ref={ref}
        style={{ height: geth(getItems(values)), padding: "20px" }}
      >
        <Grid container>
          <Grid Item xs={3} sm={3}>
            <h2>{getImage()}</h2>
          </Grid>
          <Grid Item xs={6} sm={6} style={{ paddingLeft: "150px" }}>
            <h1>{company.companyName}</h1>
          </Grid>
          <Grid Item xs={12} sm={12} style={center}>
            <h3>{company.adressLine1}</h3>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "50px" }}>
          <Grid Item xs={12} sm={12} style={center}>
            <h1>{title}</h1>
          </Grid>
          <Grid Item xs={6} sm={6} style={center}>
            <h3>{`${title} No. ${values.vouNo}`}</h3>
          </Grid>
          <Grid Item xs={6} sm={6} style={center}>
            <h3>Date: {values.getDate()}</h3>
          </Grid>
          <Grid Item xs={12} sm={12} style={{ ...center }}>
            <Grid
              container
              style={{ marginTop: "10px", border: "3px solid black" }}
            >
              <Grid
                Item
                xs={8}
                sm={8}
                style={{
                  ...center,
                  borderBottom: "3px solid black",
                  borderRight: "3px solid black",
                }}
              >
                <h4>Particulars</h4>
              </Grid>
              <Grid
                Item
                xs={4}
                sm={4}
                style={{ ...center, borderBottom: "3px solid black" }}
              >
                <h4>Amount</h4>
              </Grid>
              <Grid
                Item
                xs={8}
                sm={8}
                style={{
                  ...center,

                  paddingLeft: "20px",
                  borderRight: "3px solid black",
                }}
              >
                <h5>Account: </h5>
              </Grid>
              <Grid Item xs={4} sm={4} style={right}></Grid>
              {getItems(values).map((item) => (
                <>
                  <Grid
                    Item
                    xs={8}
                    sm={8}
                    style={{
                      paddingLeft: "20px",
                      borderRight: "3px solid black",
                    }}
                  >
                    <h4>{getParty(item)}</h4>
                  </Grid>
                  <Grid
                    Item
                    xs={4}
                    sm={4}
                    style={{ ...right, paddingRight: "20px" }}
                  >
                    <h4>
                      {Number(item.credit) == 0 ? item.debit : item.credit}

                      {Number(item.credit) == 0 ? "Dr" : "Cr"}
                    </h4>
                  </Grid>
                </>
              ))}
              <Grid
                Item
                xs={8}
                sm={8}
                style={{
                  borderTop: "3px solid black",
                  borderRight: "3px solid black",
                }}
              >
                <h4>
                  Amount (In Words): INR
                  {price_in_words(
                    finalCalc().credit == 0
                      ? finalCalc().debit
                      : finalCalc().credit
                  )}
                  only
                </h4>
              </Grid>
              <Grid
                Item
                xs={4}
                sm={4}
                style={{
                  ...right,
                  borderTop: "3px solid black",
                }}
              >
                <h4>
                  <span>&#8377;</span>
                  {finalCalc().credit == 0
                    ? finalCalc().debit
                    : finalCalc().credit}
                </h4>
              </Grid>
            </Grid>
          </Grid>
          <Grid Item xs={8} sm={8} style={{ ...center, marginTop: "20px" }}>
            <h3>Payment Through : {getParty(values)}</h3>
          </Grid>
          <Grid Item xs={4} sm={4} style={{ ...center, marginTop: "20px" }}>
            <h3>Narration : {values.narration}</h3>
          </Grid>
          <Grid Item xs={12} sm={12} style={{ ...center, marginTop: "250px" }}>
            <h2>Authorized Signatory</h2>
          </Grid>
        </Grid>
      </div>
    </>
  );
});

export default ComponentToPrint;
