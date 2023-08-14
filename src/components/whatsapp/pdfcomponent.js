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
      paddingLeft: "5px",
      paddingRight: "5px",
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
  subscript: {
    fontSize: "0.7em",
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
    const maxRows = Math.max(cgstArr.length, sgstArr.length, igstArr.length);
    return { c: cgstArr, s: sgstArr, i: igstArr, maxRows: maxRows };
  }
  function rnd(no) {
    return Number(no).toFixed(2);
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
          <span style={{ color: "black", display: "block" }}>
            {company.companyName}
          </span>
          <span>{company.adressLine1}</span>, <span>{company.adressLine2}</span>
          ,
          <span>
            {company.district}-{company.pinCode}
          </span>
          ,
          <span>
            {company.stateName}({company.stateCode})
          </span>
          ,
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
          <span style={{ color: "black", display: "block" }}>
            {getParty(values) && getParty(values).acName}
          </span>
          {getAd && (
            <>
              <span>{getAd(values).addressLine1}</span>,
              <span>{getAd(values).addressLine2}</span>,
              {partyAdress.districtName && (
                <span> {partyAdress.districtName}, </span>
              )}
              {partyAdress.talukaName && (
                <span> {partyAdress.talukaName}, </span>
              )}
              <br />
              {partyAdress.stateName && (
                <span>
                  {partyAdress.stateName}({partyAdress.stateCode}),
                </span>
              )}
              {partyAdress.countryName && (
                <span>
                  {partyAdress.countryName}({partyAdress.countryCode}),
                </span>
              )}
              {getAd(values) && getAd(values).gstNo && (
                <>
                  <br></br>
                  <span>GST No: {getAd(values).gstNo}, </span>
                </>
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
          <span style={{ color: "black", display: "block" }}>
            {getParty(values) && getParty(values).acName}
          </span>
          {partyAdress && (
            <>
              <span>{getAd(values).addressLine1}</span>,
              <span>{getAd(values).addressLine2}</span>,
              {partyAdress.districtName && (
                <span> {partyAdress.districtName}, </span>
              )}
              {partyAdress.talukaName && (
                <span> {partyAdress.talukaName}, </span>
              )}
              <br />
              {partyAdress.stateName && (
                <span>
                  {partyAdress.stateName}({partyAdress.stateCode}),
                </span>
              )}
              {partyAdress.countryName && (
                <span>
                  {partyAdress.countryName}({partyAdress.countryCode}),
                </span>
              )}
              {getAd(values) && getAd(values).gstNo && (
                <>
                  <br></br>
                  <span>GST No: {getAd(values).gstNo}, </span>
                </>
              )}
            </>
          )}
        </Grid>
      </>
    );
  };

  const TableComponent = () => {
    const tableHeaders = [
      { label: "Sr No", align: "left" },
      { label: "Product", align: "left" },
      { label: "Quantity", align: "right" },
      { label: "Rate", align: "right" },
      { label: "Amount", align: "right" },
      { label: "Discount", align: "right" },
      { label: "G.S.T", align: "right" },
    ];

    return (
      <Grid Item sm={12} xs={12}>
        <Table className={classes.table}>
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
            {getItems(values).map((item, index) => (
              <TableRow className={classes.table}>
                <TableCell className={classes.table}>{index + 1}</TableCell>

                <TableCell className={classes.table}>
                  <div style={{ display: "flex" }}>
                    {getProdName(item.prodCode)}
                  </div>
                  {settings.userBatchNo === "Yes" && (
                    <div className={classes.subscript}>
                      {item.batchList.map((batch, i) => (
                        <span key={i}>
                          {batch.batchNo}-{batch.sell} (
                          {roleService.date(batch.expDate)})
                          {i < item.batchList.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  )}
                  {settings.useSerialNo === "Yes" && (
                    <div className={classes.subscript}>
                      Sn No-{item.serialNo}
                    </div>
                  )}
                </TableCell>
                <TableCell className={classes.table} align="right">
                  {rnd(item.qty)}
                </TableCell>
                <TableCell className={classes.table} align="right">
                  {rnd(item.rate)}
                </TableCell>
                <TableCell className={classes.table} align="right">
                  {rnd(item.qr)}
                </TableCell>
                <TableCell className={classes.table} align="right">
                  {rnd(Number(item.discount))}
                  <div className={classes.subscript}>({rnd(item.disPer)}%)</div>
                </TableCell>
                <TableCell className={classes.table} align="right">
                  {rnd(
                    Number(item.cgst) + Number(item.sgst) + Number(item.igst)
                  )}
                  <div className={classes.subscript}>
                    (
                    {rnd(
                      Number(item.cgstP) +
                        Number(item.sgstP) +
                        Number(item.igstP)
                    )}
                    %)
                  </div>
                </TableCell>
                {settings.useCessitem === "Yes" && (
                  <TableCell className={classes.table} align="right">
                    {rnd(item.cess)}
                    <div className={classes.subscript}>
                      ({rnd(item.cessP)}%)
                    </div>
                  </TableCell>
                )}
                <TableCell className={classes.table} align="right">
                  {Number(item.itemAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    );
  };

  const FooterComponent = () => {
    const taxObj = getTax(values);
    return (
      <>
        <Grid container spacing={3}>
          <Grid Item xs={12} style={{ paddingLeft: "5px" }}>
            <h6> Payment term: {getPay(values.paymentTermsCode)}</h6>
          </Grid>
          <Grid
            Item
            xs={6}
            sm={6}
            style={{
              fontsize: "8px",
              padding: "5px",
            }}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.table}>CGST</TableCell>
                  <TableCell className={classes.table}>SGST</TableCell>
                  <TableCell className={classes.table}>IGST</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...new Array(taxObj.maxRows)].map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.table} align="right">
                      {taxObj.c[i] && (
                        <>
                          {Number(taxObj.c[i].cgstP)}%&nbsp;-&nbsp;
                          {rnd(Number(taxObj.c[i].cgst))}
                        </>
                      )}
                    </TableCell>
                    <TableCell className={classes.table} align="right">
                      {taxObj.s[i] && (
                        <>
                          {Number(taxObj.s[i].sgstP)}%&nbsp;-&nbsp;
                          {rnd(Number(taxObj.s[i].sgst))}
                        </>
                      )}
                    </TableCell>

                    <TableCell className={classes.table} align="right">
                      {taxObj.i[i] && (
                        <>
                          {Number(taxObj.i[i].igstP)}%&nbsp;-&nbsp;
                          {rnd(Number(taxObj.i[i].igst))}
                        </>
                      )}
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
              padding: "5px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.table} align="right">
                    Subtotal
                  </TableCell>
                  <TableCell className={classes.table} align="right">
                    {values.itemTotal}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
                    TCS
                  </TableCell>
                  <TableCell
                    className={classes.table}
                    align="right"
                  ></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.table} align="right">
                    Roundoff
                  </TableCell>
                  <TableCell className={classes.table} align="right">
                    {Number(values.roundOff)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.table} align="right">
                    Net Amount
                  </TableCell>
                  <TableCell className={classes.table} align="right">
                    {Number(values.netAmount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid
            Item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px",
              color: "black",
            }}
          >
            {company.declaration && (
              <div>
                <div style={{ color: "black" }}>Declaration</div>
                {company.declaration}
              </div>
            )}
            <h6>For {company.companyName}</h6>
          </Grid>
          <Grid
            Item
            xs={12}
            sm={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "20px",
              color: "black",
            }}
          >
            <h6 style={{ marginRight: "100px" }} sx={{ fontWeight: 600 }}>
              {company.footer}
            </h6>
            <h6 style={{ marginLeft: "50px" }} sx={{ fontWeight: 600 }}>
              Authorized Signatory
            </h6>
          </Grid>
        </Grid>
      </>
    );
  };
  return { Header, AddressInfo, FooterComponent, TableComponent };
}
