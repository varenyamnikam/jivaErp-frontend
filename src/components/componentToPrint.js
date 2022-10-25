import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { reactLocalStorage } from "reactjs-localstorage";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";
import Controls from "./controls/Controls";
import PrintIcon from "@mui/icons-material/Print";
import { Grid } from "@mui/material";
import { add } from "date-fns";
const useStyles = makeStyles((theme) => ({
  center: { display: "flex", alignItems: "center", justifyContent: "flex-end" },
}));

export default function (props) {
  const { values, voucherItems, adress, accounts } = props;
  const classes = useStyles();
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const ad = adress.filter((item) => item.acCode == values.partyCode);
  console.log(ad, adress, values.partyCode);
  const billingAd1 = adress
    .filter(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.billingAdressCode)
    )
    .map((item) => item.addressLine1);
  const shippingAd1 = adress
    .filter(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.shippingAdressCode)
    )
    .map((item) => item.addressLine1);
  console.log(billingAd1, shippingAd1, values);

  const partyName = accounts
    .filter((item) => item.acCode == values.partyCode)
    .map((item) => item.acName);
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
  let componentRef = React.useRef();
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
  // values={item}
  // voucherItems={voucherItems}
  // adress={adress}
  // accounts={accounts}
  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          trigger={() => <PrintIcon />}
          content={() => componentRef.current}
        />

        {/* component to be printed */}
        <div style={{ display: "none" }}>
          <ComponentToPrint
            ref={componentRef}
            values={values}
            voucherItems={voucherItems}
            adress={adress}
            accounts={accounts}
          />
        </div>
      </div>
    </>
  );
}
const ComponentToPrint = React.forwardRef((props, ref) => {
  const { values, voucherItems, adress, accounts } = props;
  const classes = useStyles();
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const ad = adress.filter((item) => item.acCode == values.partyCode);
  console.log(ad, adress, values.partyCode);
  const billingAd1 = adress
    .filter(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.billingAdressCode)
    )
    .map((item) => item.addressLine1);
  const shippingAd1 = adress
    .filter(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.shippingAdressCode)
    )
    .map((item) => item.addressLine1);
  console.log(billingAd1, shippingAd1, values);

  const partyName = accounts
    .filter((item) => item.acCode == values.partyCode)
    .map((item) => item.acName);
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
  return (
    <>
      <div ref={ref}>
        <table className="table">
          <TableHead style={{ border: "none" }}>
            <TableRow style={{ border: "none" }}>
              <Grid container>
                <Grid Item xs={3} sm={3} style={{ backgroundColor: "red" }}>
                  <h2>{getImage()}</h2>
                </Grid>
                <Grid Item sm={6} xs={6} className={classes.center}>
                  <h2>
                    {values.docCode} No.: <strong>{values.vouNo}</strong>
                  </h2>
                </Grid>
                <Grid Item sm={3} xs={3} className={classes.center}>
                  <h2> Date: {getDate(new Date())}</h2>
                </Grid>
              </Grid>
              <Grid container style={{ color: "black" }}>
                <Grid Item xs={4} sm={4}>
                  From
                  <h4>{company.companyName}</h4>
                  <span>{company.adressLine1}</span>
                  <br></br>
                  <span>Phone: {company.contactNo}</span>
                  <br></br>
                  <span>Email: {company.email}</span>
                  <br></br>
                  <span>GST In: {company.gstInNo}</span>
                </Grid>
                <Grid Item sm={4} xs={4}>
                  Bill To
                  <h4>{partyName}</h4>
                  {billingAd1}
                  <span>Country: {ad.countryName}</span>
                  <span>State: {ad.stateName}</span>
                  <span>District: {ad.districtName}</span>
                  <span>Taluka: {ad.talukaName}</span>
                </Grid>
                <Grid Item sm={4} xs={4}>
                  Ship To
                  <h4>{partyName}</h4>
                  {shippingAd1}
                  <span>Country: {ad.countryName} </span>
                  <span> State: {ad.stateName}</span>
                  <br />
                  <span>District: {ad.districtName} </span>
                  <span> Taluka: {ad.talukaName}</span>
                </Grid>
              </Grid>
            </TableRow>
          </TableHead>
        </table>
      </div>
    </>
  );
});
