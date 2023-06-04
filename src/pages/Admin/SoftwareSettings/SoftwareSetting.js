import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
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
import useTable from "../../../components/useTable";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import Notification from "../../../components/Notification";
import "../../../components/public.css";
import MuiSkeleton from "../../../components/skeleton";
import UnusedAutosuggest from "../../../components/specialAutoSuggest";
import SettingsIcon from "@mui/icons-material/Settings";
import Profile from "./profile";
import ButtonLoader from "../../../components/loading";
import AcLedgerSettings from "../../../components/acLedgerSettings";
import DefaultAcc from "../../../components/hardCoded/defaultAcc";
import { NotifyMsg } from "../../../components/notificationMsg";

const { purchaseAcc, saleAcc, purchaseObj, saleObj } = DefaultAcc();
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
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "100%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  Active: {
    padding: "5px",
    borderRadius: "5px",
    color: "green",
    backgroundColor: "rgba(0, 128, 0, 0.151)",
  },
  Inactive: {
    padding: "5px",
    borderRadius: "5px",
    color: "goldenrod",
    backgroundColor: "rgba(189, 189, 3, 0.103)",
  },
  center: {
    display: "flex",
    justifyContent: "center",
  },
}));
const initialValues = {
  userCompanyCode: "X X X X",
  userBatchNo: "",
  useSerialNo: "",
  itemDescription: "",
  gstReg: "",
  useintraStateSale: "",
  usePesticideSale: "",
  useCessitem: "",
  saleStockUpdateUsing: "",
  purcStockUpdateUsing: "",
  color: "blue",
  useAcc: "",
  purchaseLedger: purchaseObj,
  saleLedger: saleObj,
};

export default function Settings() {
  const [values, setValues] = useState(initialValues);
  const [purchaseValues, setPurchaseValues] = useState(purchaseObj);
  const [saleValues, setSaleValues] = useState(saleObj);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [save, setSave] = useState(true);
  const classes = useStyles();
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
    // !save && setSave(true);
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(values).map((x) => {
      check(x);
    });
    const hasRight = AuthHandler.canEdit();

    if (!hasRight) setNotify(NotifyMsg(7));

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x == "") && hasRight;
  };

  const url = Config.soft;
  if (loading) {
    function handleRes(response) {
      console.log(response.data);
      const settingsData = response.data.result;

      if (settingsData) {
        console.log("hi", settingsData);
        setValues({
          purchaseLedger: settingsData.purchaseLedger,
          saleLedger: settingsData.saleLedger,
          ...settingsData,
        });
        setPurchaseValues(settingsData.purchaseLedger);
        setSaleValues(settingsData.saleLedger);
      } else {
        setValues({ ...values, userCompanyCode: "" });
      }
      setLoading(false);
    }
    function handelErr(err) {
      console.lo(err);
      setNotify(NotifyMsg(4));
    }
    roleService.axiosGet(url, handleRes, handelErr, () => {});
  }
  console.log(values);
  function handleSubmit(updatedSettings = values) {
    setButtonLoading(true);
    setSave(false);
    console.log(updatedSettings);
    const token = AuthHandler.getLoginToken();
    const handleRes = (response) => {
      setButtonLoading(false);
      setValues(updatedSettings);
      AuthHandler.updateSettings(updatedSettings);
    };
    function handleErr(err) {
      console.log(err);
      setNotify(NotifyMsg(4));
    }

    roleService.axiosPatch(
      url,
      updatedSettings,
      handleRes,
      handleErr,
      () => {}
    );
  }
  useEffect(() => {
    !save && setSave(true);
  }, [values]);
  let company = AuthHandler.getCompany();

  return (
    <>
      <PageHeader title="Settings" icon={<SettingsIcon fontSize="large" />} />
      <section className="content">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Grid container style={{ pading: "20px" }}>
              <Profile setNotify={setNotify} />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <div className="card">
              <div className="card-body">
                <section className="content">
                  <Grid container spacing={2}>
                    <Grid item sm={6} xs={12}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="userBatchNo"
                        label="use Batch No?"
                        value={values.userBatchNo}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.userBatchNo}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} className={classes.center}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="useSerialNo"
                        label="Use Serial No?"
                        value={values.useSerialNo}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.useSerialNo}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="itemDescription"
                        label="Use Item Description?"
                        value={values.itemDescription}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.itemDescription}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} className={classes.center}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="useintraStateSale"
                        label="Use Intra State Sale?"
                        value={values.useintraStateSale}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.useintraStateSale}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="usePesticideSale"
                        label="Use Pesticide Sale?"
                        value={values.usePesticideSale}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.usePesticideSale}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} className={classes.center}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="useCessitem"
                        label="Use Cess Item"
                        value={values.useCessitem}
                        onChange={handleInputChange}
                        items={statusItems}
                        error={errors.useCessitem}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <UnusedAutosuggest
                        style={{ width: "100%" }}
                        name="saleStockUpdateUsing"
                        label="Sale Stock Update Using-"
                        value={values}
                        setValue={setValues}
                        options={["DC", "Invoice"]}
                        error={errors.saleStockUpdateUsing}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} className={classes.center}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="color"
                        label="THEME"
                        value={values.color}
                        onChange={handleInputChange}
                        items={Colors}
                        error={errors.color}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <UnusedAutosuggest
                        style={{ width: "100%" }}
                        name="purcStockUpdateUsing"
                        label="Purchase Stock Update Using-"
                        value={values}
                        setValue={setValues}
                        options={["GRN", "Invoice"]}
                        error={errors.purcStockUpdateUsing}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12} className={classes.center}>
                      <Controls.RadioGroup
                        position="left"
                        size="small"
                        name="useAcc"
                        label="Account Print Format"
                        value={values.useAcc}
                        onChange={handleInputChange}
                        items={template}
                        error={errors.useAcc}
                      />
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "20px",
                      }}
                    >
                      <ButtonLoader
                        style={{ width: "100%" }}
                        onClick={() => {
                          validate() && handleSubmit();
                        }}
                        loading={buttonLoading}
                        setLoading={setButtonLoading}
                        save={save}
                        setSave={setSave}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Grid container style={{ pading: "20px" }}>
                        <AcLedgerSettings
                          values={values}
                          setValues={setValues}
                          handleSubmit={handleSubmit}
                          purchaseValues={purchaseValues}
                          setPurchaseValues={setPurchaseValues}
                          saleValues={saleValues}
                          setSaleValues={setSaleValues}
                          save={save}
                          setSave={setSave}
                          setNotify={setNotify}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </section>
              </div>
            </div>
          </Grid>
        </Grid>
        <Notification notify={notify} setNotify={setNotify} />
      </section>
    </>
  );
}
