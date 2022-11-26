import React, { useEffect, useState } from "react";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import { makeStyles } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "../../components/useForm";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
const cash = [
  { id: "Cash", title: "Cash" },
  { id: "Credit", title: "Credit" },
];
const clear = [
  { id: "Clear", title: "Clear" },
  { id: "Cancel", title: "Cancel" },
];

const docOptions = ["DC", "QT", "GR", "SI"];
const useStyles = makeStyles((theme) => ({
  // input: { minWidth: "200px", flexGrow: 1 },
}));
const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));

export default function GeneralForm(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const {
    records,
    values,
    initialFilterValues,
    adress,
    products,
    handleSubmit,
  } = props;
  const [input, setInput] = useState(values);

  const prodOptions = products.map((item) => item.prodName);

  console.log(input, prodOptions);
  const classes = useStyles();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setInput({
      ...input,
      [name]: value,
    });
  };

  let y = true;
  records.map((item) => {
    if (item.refNo == input.refNo) {
      console.log(item);
      y = false;
    }
  });
  const userDate = new Date(
    JSON.parse(localStorage.getItem("user")).defaultYearStart
  );
  const newDate = new Date(
    new Date().setFullYear(userDate.getFullYear(), 2, 31)
  );
  function getVouNo() {
    if (y) {
      return " NEW ";
    } else {
      return input.refNo;
    }
  }
  const user = AuthHandler.getUser();

  if (
    !input.refNo.includes(
      user.defaultBranchCode + input.refType + user.defaultYearCode
    )
  )
    setInput({
      ...input,
      refNo: user.defaultBranchCode + input.refType + user.defaultYearCode,
    });
  if (input.refType == "OP" && String(input.vouDate) !== String(newDate)) {
    console.log(newDate, String(input.vouDate) !== String(newDate));
    setInput({ ...input, vouDate: newDate });
  }
  return (
    <>
      <Grid container style={{ marginBottom: "10px" }} spacing={2}>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="refNo"
            label="Voucher No"
            value={getVouNo()}
            onChange={handleChange}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="refType"
            label="Doc Code"
            value={input}
            setValue={setInput}
            options={["AJ", "OP"]}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <SmartAutoSuggest
            name1="prodName"
            code1="prodCode"
            name2="prodName"
            code2="prodCode"
            label="Product"
            value={input}
            setValue={setInput}
            options1={prodOptions}
            options2={products}
          />
        </Grid>
        {settings.userBatchNo == "Yes" && (
          <>
            <Grid item xs={12} sm={3} className={classes.input}>
              <Controls.Input
                name="batchNo"
                label="Batch No"
                value={input.batchNo}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3} className={classes.input}>
              <StaticDatePickerLandscape
                name="expDate"
                label="Expiry Date"
                value={input}
                setValue={setInput}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={3} className={classes.input}>
          <StaticDatePickerLandscape
            name="vouDate"
            label="Voucher Date"
            value={input}
            setValue={setInput}
            disabled={input.refType == "OP"}
          />
        </Grid>

        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="inwardQty"
            label="Inward Quantity"
            value={input.inwardQty}
            onChange={handleChange}
          />
        </Grid>
        {input.refType !== "OP" && (
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="outwardQty"
              label="Outward Quantity"
              value={input.outwardQty}
              onChange={handleChange}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={12} className={classes.input}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Controls.Button
              type="submit"
              text="Submit"
              onClick={(e) => {
                handleSubmit(input);
              }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
