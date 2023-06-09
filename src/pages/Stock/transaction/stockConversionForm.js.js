import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/Config";
import { makeStyles } from "@material-ui/core";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "../../../components/useForm";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import SmartAutoSuggest from "../../../components/smartAutoSuggest";
import { NotifyMsg } from "../../../components/notificationMsg";

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
const settings = AuthHandler.getSettings();

export default function StockConversionForm(props) {
  const {
    records,
    values,
    initialFilterValues,
    setNotify,
    products,
    handleSubmit,
  } = props;
  const [input, setInput] = useState(values);
  const [errors, setErrors] = useState(initialFilterValues);

  const prodOptions = products.map((item) => item.prodName);
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    delete temp.endDate;
    delete temp.startDate;
    delete temp.vouDate;
    delete temp.expDate;

    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }

    settings.userBatchNo == "Yes" && check("batchNo");
    check("prodCode1");
    check("prodName1");
    check("prodCode2");
    check("prodName2");
    check("qty1");
    check("qty2");

    console.log(temp);
    setErrors({
      ...temp,
    });
    const entryExists = records.find((item) => item.refNo == fieldValues.refNo);
    const hasRight = entryExists ? AuthHandler.canEdit() : AuthHandler.canAdd();
    if (!hasRight)
      entryExists ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    if (fieldValues == input)
      return Object.values(temp).every((x) => x == "") && hasRight;
  };
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
  function getVouNo() {
    if (y) {
      return " NEW ";
    } else {
      return input.refNo;
    }
  }
  const user = AuthHandler.getUser();

  if (
    !input.refNo.includes(user.currentBranchCode + "SC" + user.currentYearCode)
  )
    setInput({
      ...input,
      refNo: user.currentBranchCode + "SC" + user.currentYearCode,
    });
  console.log(settings.userBatchNo);
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
          <SmartAutoSuggest
            name1="prodName1"
            code1="prodCode1"
            name2="prodName"
            code2="prodCode"
            label="Product 1"
            value={input}
            setValue={setInput}
            options1={prodOptions}
            options2={products}
            error={errors.prodCode}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <SmartAutoSuggest
            name1="prodName2"
            code1="prodCode2"
            name2="prodName"
            code2="prodCode"
            label="Product 2"
            value={input}
            setValue={setInput}
            options1={prodOptions}
            options2={products}
            error={errors.prodCode}
          />
        </Grid>

        {settings.userBatchNo == "Yes" && (
          <>
            <Grid item xs={12} sm={3} className={classes.input}>
              <StaticDatePickerLandscape
                name="expDate"
                label="Expiry Date"
                value={input}
                setValue={setInput}
              />
            </Grid>

            <Grid item xs={12} sm={3} className={classes.input}>
              <Controls.Input
                name="batchNo"
                label="Batch No"
                value={input.batchNo}
                onChange={handleChange}
                error={errors.batchNo}
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
          />
        </Grid>

        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="qty1"
            label="Quantity of Prod 1"
            value={input.qty1}
            onChange={handleChange}
            type="Number"
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="qty2"
            label="Quantity of Prod 2"
            value={input.qty2}
            onChange={handleChange}
            type="Number"
          />
        </Grid>
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
                validate() && handleSubmit(input);
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
