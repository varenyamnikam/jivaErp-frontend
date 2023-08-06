import React from "react";
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
  TableFooter,
} from "@material-ui/core";
import { add } from "date-fns";
import AuthHandler from "../../Utils/AuthHandler";
import * as roleService from "../../services/roleService";
import { Grid } from "@mui/material";
const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    "& thead th": {
      // fontWeight: "600",
      border: "1px solid rgba(0,0,0,0.2)",
      fontSize: "10px",
      backgroundColor: "white",
      padding: "0px ",
      paddingLeft: "2px",
      paddingRight: "2px",
    },
    "& tbody td": {
      fontSize: "8px",
      padding: "2px",
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
      fontSize: "8px",
    },
    border: "1px solid rgba(0,0,0,0.2)",
    fontSize: "10px",
  },
  footer: {
    padding: "1rem",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  center: { alignItems: "center", justifyContent: "flex-end" },
  page: {
    pageBreakAfter: "always",
  },
}));

export default function Components(props) {
  const { values, voucherItems, adress, accounts, products, payTerms, item } =
    props;
  const classes = useStyles();

  const ad = adress.filter((item) => item.acCode == values.partyCode);
  console.log(ad, adress, values);
  function getAd(values) {
    const adressObj = adress.find(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.billingAdressCode)
    );
    console.log(adressObj);
    if (adressObj) return adressObj;
    else
      return {
        districtName: "",
        talukaName: "",
        countryName: "",
        stateName: "",
      };
  }
  function getParty(values) {
    const party = accounts.filter((item) => item.acCode == values.partyCode);
    return party[0];
  }
  function getItems(values) {
    let arr = [];
    arr = voucherItems.filter((item) => item.vouNo == values.vouNo);
    return arr;
  }
  function getProdName(code) {
    let temp = "";
    products.map((item) => {
      if (item.prodCode == code) {
        temp = item.prodName;
      }
    });
    return temp;
  }
  const recentImageDataUrl = AuthHandler.getImage();

  function getImage() {
    if (recentImageDataUrl) {
      return (
        <img
          height={75}
          width={40}
          src={recentImageDataUrl}
          alt=""
          id="img"
          className="img"
        />
      );
    } else
      return (
        <img
          height={75}
          width={25}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          id="img"
          className="img"
        />
      );
  }
  function getTheme() {
    const color = JSON.parse(
      localStorage.getItem("adm_softwareSettings")
    ).color;
    if (color == "blue") {
      return "#79A9C5EB";
    } else {
      return "#66FF99";
    }
  }

  function getPay(code) {
    let temp = "";
    payTerms.map((item) => {
      if (item.paymentTermsCode == code) {
        temp = item.paymentTerms;
      }
    });
    return temp;
  }
  const settings = AuthHandler.getSettings();
  let company = AuthHandler.getCompany();
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
  function getTax(values) {
    let arr = voucherItems.filter((item) => item.vouNo == values.vouNo);
    let cgstArr = [];
    let sgstArr = [];
    let igstArr = [];

    const RemoveDuplicates = (array, key) => {
      return array.reduce((arr, item) => {
        const removed = arr.filter((i) => i[key] !== item[key]);
        return [...removed, item];
      }, []);
    };

    cgstArr = RemoveDuplicates(arr, "cgstP");
    sgstArr = RemoveDuplicates(arr, "sgstP");
    igstArr = RemoveDuplicates(arr, "igstP");
    console.log({ c: cgstArr, s: sgstArr, i: igstArr });
    return { c: cgstArr, s: sgstArr, i: igstArr };
  }
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
  function rnd(no) {
    return Number(no)
      .toFixed(2)
      .replace(/(\.0+|0+)$/, "");
  }

  const Header = () => {
    return (
      <>
        <Grid Item xs={2} sm={2}>
          {getImage()}
        </Grid>
        <Grid
          Item
          sm={6}
          xs={6}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5>
            {values.docCode} No.: <strong>{values.vouNo}</strong>
          </h5>
        </Grid>
        <Grid
          Item
          sm={4}
          xs={4}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h5> Date: {getDate(new Date())}</h5>
        </Grid>
      </>
    );
  };

  const AddressInfo = () => {
    const partyAdress = getAd(values);

    return (
      <>
        <Grid Item xs={4} sm={4}>
          <Grid
            Item
            sm={9}
            xs={9}
            style={{
              backgroundColor: getTheme(),
              paddingLeft: "10px",
              color: "black",
            }}
          >
            <Typography> From</Typography>
          </Grid>
          <h5>{company.companyName}</h5>
          <span>{company.adressLine1}</span>, <span>{company.adressLine2}</span>
          ,
          <span>
            {company.district}-{company.pinCode}
          </span>
          ,{" "}
          <span>
            {company.stateName}({company.stateCode})
          </span>
          ,{" "}
          <span>
            {company.countryName}({company.countryCode})
          </span>
          <br></br>
          <span>Phone: {company.contactNo}</span>
          <br></br>
          <span>Email: {company.email}</span>
          <br></br>
          <span>GST In: {company.gstInNo}</span>
        </Grid>
        <Grid Item sm={4} xs={4}>
          <Grid
            Item
            sm={9}
            xs={9}
            style={{
              backgroundColor: getTheme(),
              paddingLeft: "10px",
              color: "black",
            }}
          >
            <Typography>Bill To</Typography>
          </Grid>
          <h5>{getParty(values) && getParty(values).acName}</h5>
          {getAd && (
            <>
              <span>{getAd(values).addressLine1}</span>,{" "}
              <span>{getAd(values).addressLine2}</span>,{" "}
              {partyAdress.districtName && (
                <span> {partyAdress.districtName}, </span>
              )}
              {partyAdress.talukaName && (
                <span> {partyAdress.talukaName}, </span>
              )}
              <br />
              {partyAdress.stateName && (
                <span>
                  {" "}
                  {partyAdress.stateName}({partyAdress.stateCode}),{" "}
                </span>
              )}
              {partyAdress.countryName && (
                <span>
                  {" "}
                  {partyAdress.countryName}({partyAdress.countryCode}),{" "}
                </span>
              )}
            </>
          )}
        </Grid>
        <Grid Item sm={4} xs={4}>
          <Grid
            Item
            sm={9}
            xs={9}
            style={{
              backgroundColor: getTheme(),
              paddingLeft: "10px",
              color: "black",
            }}
          >
            <Typography> Ship To</Typography>
          </Grid>
          <h5>{getParty(values) && getParty(values).acName}</h5>
          {partyAdress && (
            <>
              <span>{getAd(values).addressLine1}</span>,{" "}
              <span>{getAd(values).addressLine2}</span>,{" "}
              {partyAdress.districtName && (
                <span> {partyAdress.districtName}, </span>
              )}
              {partyAdress.talukaName && (
                <span> {partyAdress.talukaName}, </span>
              )}
              <br />
              {partyAdress.stateName && (
                <span>
                  {" "}
                  {partyAdress.stateName}({partyAdress.stateCode}),{" "}
                </span>
              )}
              {partyAdress.countryName && (
                <span>
                  {" "}
                  {partyAdress.countryName}({partyAdress.countryCode}),{" "}
                </span>
              )}
            </>
          )}
        </Grid>
      </>
    );
  };

  const TableComponent = () => {
    const tableHeaders = [
      { label: "Product", align: "left" },
      { label: "Quantity", align: "right" },
      { label: "Rate", align: "right" },
      { label: "Amount", align: "right" },
      { label: "Discount", align: "right" },
      { label: "G.S.T", align: "right" },
    ];

    return (
      <Grid Item sm={12} xs={12}>
        <Table style={{}} className={classes.table}>
          <TableHead style={{ padding: "0px" }}>
            <TableRow className={classes.table} style={{ padding: "0px" }}>
              {tableHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  align={header.align}
                  className={classes.table}
                >
                  {header.label}
                </TableCell>
              ))}
              {settings.useCessitem === "Yes" && (
                <TableCell className={classes.table} align="right">
                  Cess
                </TableCell>
              )}
              <TableCell align="right" className={classes.table}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(2)].map((_, index) => (
              <>
                {getItems(values).map((item) => (
                  <TableRow className={classes.table}>
                    <TableCell className={classes.table}>
                      <div style={{ display: "flex" }}>
                        {getProdName(item.prodCode)}
                      </div>
                      {settings.userBatchNo === "Yes" && (
                        <div>
                          {item.batchList.map((batch, i) => (
                            <span key={i}>
                              {batch.batchNo}-{batch.sell} (
                              {roleService.date(batch.expDate)})
                              {i < item.batchList.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>{item.qty}</div>
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>{Number(item.rate)}</div>
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>{Number(item.qr)}</div>
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>
                        ({rnd(item.disPer)}%) {rnd(Number(item.discount))}
                      </div>
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ marginRight: "10px" }}>
                            (
                            {rnd(
                              Number(item.cgstP) +
                                Number(item.sgstP) +
                                Number(item.igstP)
                            )}
                            %)
                          </div>
                          <div style={{ flex: 1 }}>
                            {rnd(
                              Number(item.cgst) +
                                Number(item.sgst) +
                                Number(item.igst)
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {settings.useCessitem === "Yes" && (
                      <TableCell className={classes.table} align="right">
                        <div style={{ display: "flex" }}>
                          ({rnd(item.cessP)}%) {rnd(item.cess)}
                        </div>
                      </TableCell>
                    )}
                    <TableCell className={classes.table} align="right">
                      <div style={{ display: "flex" }}>
                        {Number(item.itemAmount)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>{" "}
      </Grid>
    );
  };

  const FooterComponent = () => {
    return (
      <>
        <Grid
          Item
          sm={12}
          style={{ alignSelf: "flex-end", flexGrow: 1, marginTop: "10px" }}
        >
          <Grid container spacing={3}>
            <Grid Item xs={12}>
              <h6> Payment term: {getPay(values.paymentTermsCode)}</h6>
            </Grid>
            <Grid
              Item
              xs={6}
              sm={6}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingRight: "10px",
                fontsize: "8px",
                backgroundcolor: "red",
              }}
            >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.table}>CGST</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {getTax(values).c.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={classes.table}
                        align="right"
                        variant="body"
                      >
                        {Number(item.cgstP)}% - {rnd(Number(item.cgst))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.table}>SGST</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {getTax(values).s.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={classes.table}
                        align="right"
                        variant="body"
                      >
                        {Number(item.sgstP)}% - {rnd(Number(item.sgst))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.table}>IGST</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {getTax(values).i.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={classes.table}
                        align="right"
                        variant="body"
                      >
                        {Number(item.igstP)}% - {rnd(Number(item.igst))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid
              Item
              xs={6}
              sm={6}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingLeft: "10px",
                backgroundcolor: "blue",
              }}
            >
              <Table className={classes.table} style={{ fontsize: "10px" }}>
                <TableRow>
                  <TableCell
                    className={classes.table}
                    align="right"
                    style={{ fontsize: "10px" }}
                  >
                    Subtotal
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    {values.itemTotal}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    Discount ({Number(values.billDisPer)})
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    {rnd(Number(values.billDis))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    TCS
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    {" "}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    Roundoff
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    {" "}
                    {Number(values.roundOff)}{" "}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    Net Amount
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    style={{ fontsize: "10px" }}
                    align="right"
                  >
                    {" "}
                    {Number(values.netAmount)}
                  </TableCell>
                </TableRow>
              </Table>
            </Grid>
            <Grid Item xs={8}>
              <Typography
                style={{ marginTop: "10px", fontsize: "10px", color: "black" }}
              >
                {company.declaration && <>Declaration {company.declaration}</>}
              </Typography>
            </Grid>{" "}
            <Grid
              Item
              xs={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                color: "black",
              }}
            >
              <Typography style={{ fontsize: "10px", marginTop: "10px" }}>
                For {company.companyName}
              </Typography>
            </Grid>
            <Grid Item xs={8} sm={8}>
              <Typography
                style={{ marginTop: "10px", fontsize: "8", color: "black" }}
              >
                {company.footer}
              </Typography>
            </Grid>
            <Grid
              Item
              xs={4}
              sm={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                style={{ marginTop: "10px", fontsize: "8", color: "black" }}
              >
                Authorized Signatory
              </Typography>
            </Grid>{" "}
          </Grid>
        </Grid>
      </>
    );
  };
  return { Header, AddressInfo, FooterComponent, TableComponent };
}
