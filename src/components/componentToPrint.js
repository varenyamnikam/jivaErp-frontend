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
import Controls from "./controls/Controls";
import PrintIcon from "@mui/icons-material/Print";
import { Grid } from "@mui/material";
import { add } from "date-fns";
import AuthHandler from "../Utils/AuthHandler";
import * as roleService from "../services/roleService";
const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    "& thead th": {
      // fontWeight: "600",
      border: "2px solid rgba(0,0,0,0.2)",
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
      borderRight: "2px solid rgba(0,0,0,0.2)",
    },
    border: "2px solid rgba(0,0,0,0.2)",
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

const ComponentToPrint = React.forwardRef((props, ref) => {
  const { values, voucherItems, adress, accounts, products, payTerms, item } =
    props;
  const classes = useStyles();

  const recentImageDataUrl = localStorage.getItem("recent-image");
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

    // arr.map((item) => {
    //   cgstArr.push(item.cgstP);
    //   sgstArr.push(item.sgstP);
    //   igstArr.push(item.igstP);
    // });
    // cgstArr = [...new Set(cgstArr)];
    // sgstArr = [...new Set(sgstArr)];
    // igstArr = [...new Set(igstArr)];

    // let cgst = [];
    // cgstArr.map((item) => {
    //   arr.map((a) => {
    //     if (a.cgstP == item) cgst.push(a);
    //   });
    // });
    // let sgst = [];
    // sgstArr.map((item) => {
    //   arr.map((a) => {
    //     if (a.sgstP == item) sgst.push(a);
    //   });
    // });
    // let igst = [];
    // igstArr.map((item) => {
    //   arr.map((a) => {
    //     if (a.igstP == item) igst.push(a);
    //   });
    // });
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
  console.log(getTax(values));
  const partyAdress = getAd(values);
  console.log(window.location.pathname);
  return (
    <>
      <div
        ref={ref}
        style={{ height: geth(getItems(values)), padding: "20px" }}
      >
        {" "}
        <Grid container spacing={1}>
          <Grid Item xs={3} sm={3}>
            <h2>{getImage()}</h2>
          </Grid>
          <Grid
            Item
            sm={6}
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h2>
              {values.docCode} No.: <strong>{values.vouNo}</strong>
            </h2>
          </Grid>
          <Grid
            Item
            sm={3}
            xs={3}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h2> Date: {getDate(new Date())}</h2>
          </Grid>
          <Grid Item xs={4} sm={4}>
            <Grid
              Item
              sm={9}
              xs={9}
              style={{ backgroundColor: getTheme(), paddingLeft: "10px" }}
            >
              <h5> From</h5>
            </Grid>
            <h4>{company.companyName}</h4>
            <span>{company.adressLine1}</span>,{" "}
            <span>{company.adressLine2}</span>,{" "}
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
              style={{ backgroundColor: getTheme(), paddingLeft: "10px" }}
            >
              <h5>Bill To</h5>
            </Grid>
            <h4>{getParty(values) && getParty(values).acName}</h4>
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
              style={{ backgroundColor: getTheme(), paddingLeft: "10px" }}
            >
              <h5> Ship To</h5>
            </Grid>
            <h4>{getParty(values) && getParty(values).acName}</h4>
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
          <Grid Item sm={12} xs={12}>
            <Table style={{ padding: "20px" }} className={classes.table}>
              <TableRow className={classes.table}>
                <TableCell style={{ backgroundColor: "white" }}>
                  Product
                </TableCell>
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  Quantity
                </TableCell>
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  Rate
                </TableCell>
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  Amount
                </TableCell>
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  Discount
                </TableCell>
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  G.S.T
                </TableCell>
                {settings.useCessitem === "Yes" && (
                  <TableCell
                    className={classes.table}
                    align="right"
                    style={{ backgroundColor: "white" }}
                  >
                    Cess
                  </TableCell>
                )}
                <TableCell align="right" style={{ backgroundColor: "white" }}>
                  Item Total
                </TableCell>
              </TableRow>
              <TableBody>
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
                        <div style={{ display: "flex", alignItems: "center" }}>
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
              </TableBody>
            </Table>
          </Grid>{" "}
        </Grid>
        <Grid container className={classes.footer}>
          <Grid
            Item
            xs={12}
            style={{
              display: "flex",
            }}
          >
            <h3> Payment term: {getPay(values.paymentTermsCode)}</h3>
          </Grid>
          <Grid
            Item
            xs={6}
            style={{
              display: "flex",
              justifyContent: "center",
              paddingRight: "20px",
            }}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.table}>CGST</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTax(values).c.map((item) => (
                  <TableRow>
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
                {getTax(values).s.map((item) => (
                  <TableRow>
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
                {getTax(values).i.map((item) => (
                  <TableRow>
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
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "20px",
            }}
          >
            <Table className={classes.table}>
              <TableRow>
                <TableCell className={classes.table} align="right">
                  Subtotal{" "}
                </TableCell>

                <TableCell className={classes.table} align="right">
                  {" "}
                  {values.itemTotal}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.table} align="right">
                  Discount ({Number(values.billDisPer)})
                </TableCell>

                <TableCell className={classes.table} align="right">
                  {rnd(Number(values.billDis))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.table} align="right">
                  TCS{" "}
                </TableCell>

                <TableCell className={classes.table} align="right">
                  {" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.table} align="right">
                  Roundoff{" "}
                </TableCell>

                <TableCell className={classes.table} align="right">
                  {" "}
                  {Number(values.roundOff)}{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.table} align="right">
                  Net Amount{" "}
                </TableCell>

                <TableCell className={classes.table} align="right">
                  {" "}
                  {Number(values.netAmount)}
                </TableCell>
              </TableRow>
            </Table>
          </Grid>{" "}
          <Grid
            Item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              margin: "20px",
            }}
          >
            <h5>Declaration {company.declaration}</h5>
            <h5>For {company.companyName}</h5>
          </Grid>
          <Grid
            Item
            xs={12}
            sm={12}
            sx={{
              fontWeight: 600,
            }}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontWeight: 700,
              margin: "20px",
            }}
          >
            {" "}
            {/* <h5 
              sx={{
                fontWeight: 600,
              }}
            >
              Subject To {company.district} Jurisdiction hi
            </h5  >{" "} */}
            <h5
              style={{ marginRight: "100px" }}
              sx={{
                fontWeight: 600,
              }}
            >
              {company.footer}
            </h5>
            <h5
              style={{ marginLeft: "50px" }}
              sx={{
                fontWeight: 600,
              }}
            >
              Authorized Signatory
            </h5>
          </Grid>
        </Grid>
      </div>
    </>
  );
});
export default ComponentToPrint;
