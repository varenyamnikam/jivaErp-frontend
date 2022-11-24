import React, { useEffect, useRef } from "react";
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
import { useReactToPrint } from "react-to-print";
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
  const color = JSON.parse(localStorage.getItem("adm_softwareSettings")).color;
  if (color == "blue") {
    return "#79A9C5EB";
  } else {
    return "green";
  }
}

export default function (props) {
  const {
    values,
    voucherItems,
    adress,
    accounts,
    products,
    payTerms,
    getEntry,
    item,
    printPopup,
    setopen,
  } = props;
  const classes = useStyles();
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const ad = adress.filter((item) => item.acCode == values.partyCode);
  console.log(ad, adress, values);
  const [print, setPrint] = React.useState(values);
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
  console.log(getTheme(), localStorage.getItem("color"));
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
  console.log(print);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  function hi() {
    setPrint(getEntry(item.vouNo, "p"));
    //handlePrint();
  }
  useEffect(() => {
    if (printPopup) {
      console.log(values.vouNo == print.vouNo, values.vouNo, print.vouNo);
      setopen(false);
      handlePrint();
    }
  }, [print]);
  return (
    <>
      <div>
        {/* button to trigger printing of target component */}

        <PrintIcon
          backgroundColor={getTheme()}
          style={{ color: "#7A5299" }}
          onClick={hi}
        />

        {/* component to be printed */}
        <div style={{ display: "none" }}>
          <ComponentToPrint
            ref={componentRef}
            values={print}
            item={item}
            voucherItems={voucherItems}
            adress={adress}
            accounts={accounts}
            products={products}
            payTerms={payTerms}
          />
        </div>
      </div>
    </>
  );
}
const ComponentToPrint = React.forwardRef((props, ref) => {
  const { values, voucherItems, adress, accounts, products, payTerms, item } =
    props;
  const classes = useStyles();
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const ad = adress.filter((item) => item.acCode == values.partyCode);
  console.log(ad, adress, values);
  function getAd(values) {
    const adressObj = adress.filter(
      (item) =>
        item.acCode == values.partyCode &&
        Number(item.addressNo) == Number(values.billingAdressCode)
    );
    return adressObj[0];
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
  function getPay(code) {
    let temp = "";
    payTerms.map((item) => {
      if (item.paymentTermsCode == code) {
        temp = item.paymentTerms;
      }
    });
    return temp;
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
  return (
    <>
      <div
        ref={ref}
        style={{ height: geth(getItems(values)), padding: "20px" }}
      >
        <table style={{ padding: "20px" }}>
          <TableHead style={{ border: 0 }} sx={{ "& td": { border: 0 } }}>
            <TableRow>
              <TableCell colSpan={10}>
                <Grid container>
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
                </Grid>

                <Grid container style={{ color: "black" }}>
                  <Grid Item xs={4} sm={4}>
                    <Grid
                      Item
                      sm={9}
                      xs={9}
                      style={{ backgroundColor: getTheme(), color: "white" }}
                    >
                      <h5> From</h5>
                    </Grid>
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
                    <Grid
                      Item
                      sm={9}
                      xs={9}
                      style={{ backgroundColor: getTheme(), color: "white" }}
                    >
                      <h5>Bill To</h5>
                    </Grid>
                    <h4>{getParty(values) && getParty(values).acName}</h4>
                    {getAd(values) && (
                      <>
                        <span>Country: {getAd(values).countryName} </span>
                        <span> State: {getAd(values).stateName}</span>
                        <br />
                        <span>District: {getAd(values).districtName} </span>
                        <span> Taluka: {getAd(values).talukaName}</span>
                      </>
                    )}
                  </Grid>
                  <Grid Item sm={4} xs={4}>
                    <Grid
                      Item
                      sm={9}
                      xs={9}
                      style={{ backgroundColor: getTheme(), color: "white" }}
                    >
                      <h5> Ship To</h5>
                    </Grid>
                    <h4>{getParty(values) && getParty(values).acName}</h4>
                    {getAd(values) && (
                      <>
                        <span>Country: {getAd(values).countryName} </span>
                        <span> State: {getAd(values).stateName}</span>
                        <br />
                        <span>District: {getAd(values).districtName} </span>
                        <span> Taluka: {getAd(values).talukaName}</span>
                      </>
                    )}
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableHead style={{ backgroundColor: getTheme(), color: "white" }}>
            <TableRow style={{ backgroundColor: getTheme(), color: "white" }}>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  width: "20%",
                  color: "white",
                }}
              >
                Product
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  width: "5%",
                  color: "white",
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                Rate
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                Discount
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                cgst
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                sgst
              </TableCell>
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                }}
              >
                igst
              </TableCell>
              {settings.useCessitem == "Yes" && (
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                    color: "white",
                  }}
                >
                  cess
                </TableCell>
              )}
              <TableCell
                align="right"
                style={{
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "white",
                  width: "10%",
                }}
              >
                Item Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          >
            {getItems(values).map((item) => (
              <TableRow>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {getProdName(item.prodCode)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {item.qty}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {Number(item.rate)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {Number(item.qr)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {rnd(Number(item.discount))} ({rnd(item.disPer)}%)
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {rnd(item.cgst)} ({rnd(item.cgstP)}%)
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {rnd(item.sgst)} ({rnd(item.sgstP)}%)
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {rnd(item.igst)} ({rnd(item.igstP)}%)
                </TableCell>
                {settings.useCessitem == "Yes" && (
                  <TableCell
                    align="right"
                    style={{
                      border: "1px solid rgba(0,0,0,0.2)",
                    }}
                  >
                    {rnd(item.cess)} ({rnd(item.cessP)}%)
                  </TableCell>
                )}
                <TableCell
                  align="right"
                  style={{
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {Number(item.itemAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
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
            <table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>cgst</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTax(values).c.map((item) => (
                  <TableRow>
                    <TableCell align="right" variant="body">
                      {Number(item.cgstP)}% - {rnd(Number(item.cgst))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
            <table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>cgst</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTax(values).s.map((item) => (
                  <TableRow>
                    <TableCell align="right" variant="body">
                      {Number(item.sgstP)}% - {rnd(Number(item.sgst))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
            <table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>cgst</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getTax(values).i.map((item) => (
                  <TableRow>
                    <TableCell align="right" variant="body">
                      {Number(item.igstP)}% - {rnd(Number(item.igst))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
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
            <table className={classes.table}>
              <TableRow>
                <TableCell align="right">Subtotal </TableCell>

                <TableCell align="right"> {values.itemTotal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">
                  Discount ({Number(values.billDisPer)})
                </TableCell>

                <TableCell align="right">
                  {rnd(Number(values.billDis))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">TCS </TableCell>

                <TableCell align="right"> </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Roundoff </TableCell>

                <TableCell align="right"> {Number(values.roundOff)} </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Net Amount </TableCell>

                <TableCell align="right"> {Number(values.netAmount)}</TableCell>
              </TableRow>
            </table>
          </Grid>
        </Grid>
      </div>
    </>
  );
});
