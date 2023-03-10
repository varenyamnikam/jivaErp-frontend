import React, { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import Controls from "./controls/Controls";
import { reactLocalStorage } from "reactjs-localstorage";
import { Grid } from "@material-ui/core";
import "./public.css";
import UnusedAutosuggest from "./unusedautosuggest";
import SettingsIcon from "@mui/icons-material/Settings";
import ButtonLoader from "./loading";
const statusItems = [
  { id: "Yes", title: "Yes" },
  { id: "NO", title: "NO" },
];
const Colors = [
  { id: "blue", title: "blue" },
  { id: "green", title: "green" },
];
const template = [
  { id: "oaj", title: "oaj" },
  { id: "tally", title: "tally" },
];

const groupTypes = ["ASSET", "LIABILITY", "INCOME", "EXPENSE"];

const useStyles = makeStyles((theme) => ({
  center: { paddingLeft: "10px", display: "flex", alignContent: "center" },
}));

export default function Settings({ input, setInput, errors }) {
  const classes = useStyles();
  function handleInputChange(e) {
    const { value, name } = e.target;
    console.log("hi");
    setInput({ ...input, [name]: value });
  }
  console.log(input);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="userBatchNo"
            label="use Batch No?"
            value={input.userBatchNo}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.userBatchNo}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="useSerialNo"
            label="Use Serial No?"
            value={input.useSerialNo}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.useSerialNo}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="itemDescription"
            label="Use Item Description?"
            value={input.itemDescription}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.itemDescription}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="useintraStateSale"
            label="Use Intra State Sale?"
            value={input.useintraStateSale}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.useintraStateSale}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="usePesticideSale"
            label="Use Pesticide Sale?"
            value={input.usePesticideSale}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.usePesticideSale}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="useCessitem"
            label="Use Cess Item"
            value={input.useCessitem}
            onChange={handleInputChange}
            items={statusItems}
            error={errors.useCessitem}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="saleStockUpdateUsing"
            label="Sale Stock Update Using-"
            value={input}
            setValue={setInput}
            options={["DC", "Invoice"]}
            error={errors.saleStockUpdateUsing}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="color"
            label="THEME"
            value={input.color}
            onChange={handleInputChange}
            items={Colors}
            error={errors.color}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <UnusedAutosuggest
            style={{ width: "100%" }}
            name="purcStockUpdateUsing"
            label="Purchase Stock Update Using-"
            value={input}
            setValue={setInput}
            options={["GRN", "Invoice"]}
            error={errors.purcStockUpdateUsing}
          />
        </Grid>
        <Grid item className={classes.center} sm={6} xs={12}>
          <Controls.RadioGroup
            position="left"
            size="small"
            name="useAcc"
            label="Account Print Format"
            value={input.useAcc}
            onChange={handleInputChange}
            items={template}
            error={errors.useAcc}
          />
        </Grid>
      </Grid>
    </>
  );
}
