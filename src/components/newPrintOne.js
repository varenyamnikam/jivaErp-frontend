import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "./componentToPrint";
import AuthHandler from "../Utils/AuthHandler";
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
  const color = AuthHandler.getSettings().color;
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
  const recentImageDataUrl = AuthHandler.getImage();
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
  let componentRef = React.useRef();
  console.log(print);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  function hi() {
    setPrint(getEntry(item.vouNo, "p"));
  }
  useEffect(() => {
    if (printPopup) {
      console.log(values.vouNo == print.vouNo, values.vouNo, print.vouNo);
      setopen(false);
      handlePrint();
    }
  }, [print]);
  console.log(voucherItems);
  return (
    <>
      <div>
        {/* button to trigger printing of target component */}

        <PrintIcon
          backgroundColor={getTheme()}
          style={{ color: "#7A5299" }}
          onClick={hi}
          fontSize="small"
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
