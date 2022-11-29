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
import ComponentToPrint1 from "./tallyComponents";
import ComponentToPrint2 from "./oajComponent";

function getTheme() {
  if (localStorage.getItem("color") == "blue") {
    return "#79A9C5EB";
  } else {
    return "green";
  }
}

export default function (props) {
  const { values, accounts, itemList, records, title } = props;
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const [print, setPrint] = React.useState(values);
  let componentRef = React.useRef();
  let company = JSON.parse(reactLocalStorage.get("company"));
  let adm_soft = JSON.parse(reactLocalStorage.get("adm_softwareSettings"));

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

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          trigger={() => (
            <PrintIcon
              backgroundColor={getTheme()}
              style={{ color: "#7A5299" }}
            />
          )}
          content={() => componentRef.current}
          onBeforeGetContent={function hi() {
            setPrint(values);
            if (values.vouNo == print.vouNo) return Promise.resolve();
            else {
              hi();
            }
          }}
        />

        {/* component to be printed */}
        <div style={{ display: "none" }}>
          {adm_soft.useAcc == "tally" ? (
            <ComponentToPrint1
              ref={componentRef}
              values={print}
              accounts={accounts}
              itemList={itemList}
              records={records}
              title={title}
            />
          ) : (
            <ComponentToPrint2
              ref={componentRef}
              values={print}
              accounts={accounts}
              itemList={itemList}
              records={records}
              title={title}
            />
          )}
        </div>
      </div>
    </>
  );
}
