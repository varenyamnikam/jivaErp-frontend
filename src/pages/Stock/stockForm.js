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
    itemList,
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

  function getVouNo() {
    if (y) {
      return " NEW ";
    } else {
      return input.refNo;
    }
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
            name="docCode"
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

        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="inwardQty"
            label="Inward Quantity"
            value={input.inwardQty}
            onChange={handleChange}
          />
        </Grid>
        {input.docCode !== "OP" && (
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="outwardQty"
              label="Outward Quantity"
              value={input.outwardQty}
              onChange={handleChange}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} className={classes.input}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "50px",
              marginTop: "40px",
            }}
          >
            <Controls.Button
              type="submit"
              text="Submit"
              onClick={(e) => {
                handleSubmit(input, itemList);
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
