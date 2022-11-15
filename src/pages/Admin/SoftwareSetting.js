import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
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
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { reactLocalStorage } from "reactjs-localstorage";
import { Grid } from "@material-ui/core";
import { Form } from "../../components/useForm";
import BasicSelect from "../Usermaster/basicselect";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@material-ui/core/IconButton";
import "../../components/public.css";
import MuiSkeleton from "../../components/skeleton";
import UnusedAutosuggest from "../../components/specialAutoSuggest";
import SettingsIcon from "@mui/icons-material/Settings";
import Profile from "../../components/profile";
import ButtonLoader from "../../components/loading";
const statusItems = [
  { id: "Yes", title: "Yes" },
  { id: "NO", title: "NO" },
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
};

export default function Settings() {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(true);

  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
    // !save && setSave(true);
  }
  if (values.userCompanyCode == "X X X X") {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .get(Config.soft + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.result) {
          setValues(response.data.result);
        } else {
          setValues({ ...values, userCompanyCode: "" });
        }
      });
  }
  console.log(values);
  function handleSubmit() {
    setLoading(true);
    setSave(false);
    const token = AuthHandler.getLoginToken();
    axios
      .patch(
        Config.soft + query,
        { values },
        {
          headers: {
            authorization: "Bearer" + token,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setValues(values);
        localStorage.setItem("adm_softwareSettings", JSON.stringify(values));
      });
  }
  useEffect(() => {
    !save && setSave(true);
  }, [values]);
  let company = JSON.parse(reactLocalStorage.get("company"));

  return (
    <>
      <div className="hold-transition sidebar-mini">
        <div className="wrapper">
          <div className="content-wrapper">
            <PageHeader
              title="Settings"
              icon={<SettingsIcon fontSize="large" />}
            />
            <section className="content">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Grid container>
                    <Profile />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <div className="card">
                    <div className="card-body">
                      <section className="content">
                        <Grid container>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="userBatchNo"
                              label="userBatchNo"
                              value={values.userBatchNo}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.userBatchNo}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="useSerialNo"
                              label="useSerialNo"
                              value={values.useSerialNo}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.useSerialNo}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="itemDescription"
                              label="itemDescription"
                              value={values.itemDescription}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.itemDescription}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <UnusedAutosuggest
                              style={{ width: "100%", marginBottom: "20px" }}
                              name="gstReg"
                              label="Gst Registration"
                              value={values}
                              setValue={setValues}
                              options={[
                                "UnRegistered",
                                "Regular",
                                "Composition",
                              ]}
                              error={errors.gstReg}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="useintraStateSale"
                              label="useintraStateSale"
                              value={values.useintraStateSale}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.useintraStateSale}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="usePesticideSale"
                              label="usePesticideSale"
                              value={values.usePesticideSale}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.usePesticideSale}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <Controls.RadioGroup
                              size="small"
                              name="useCessitem"
                              label="useCessitem"
                              value={values.useCessitem}
                              onChange={handleInputChange}
                              items={statusItems}
                              error={errors.useCessitem}
                            />
                          </Grid>{" "}
                          <Grid item sm={6} xs={12}>
                            <UnusedAutosuggest
                              style={{ width: "100%" }}
                              name="saleStockUpdateUsing"
                              label="saleStockUpdateUsing"
                              value={values}
                              setValue={setValues}
                              options={["DC", "Invoice"]}
                              error={errors.saleStockUpdateUsing}
                            />
                          </Grid>{" "}
                          <Grid item sm={6} xs={12}>
                            <UnusedAutosuggest
                              style={{ width: "100%" }}
                              name="purcStockUpdateUsing"
                              label="purcStockUpdateUsing"
                              value={values}
                              setValue={setValues}
                              options={["GRN", "Invoice"]}
                              error={errors.purcStockUpdateUsing}
                            />
                          </Grid>{" "}
                          <Grid item sm={3} xs={12}></Grid>
                          <Grid
                            item
                            sm={3}
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <ButtonLoader
                              style={{ width: "100%" }}
                              loading={loading}
                              setLoading={setLoading}
                              onClick={handleSubmit}
                              save={save}
                              setSave={setSave}
                            />
                          </Grid>
                        </Grid>
                      </section>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
