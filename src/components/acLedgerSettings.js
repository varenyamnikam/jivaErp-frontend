import NormalAutoSuggest from "./normalAutoSuggest";
import React, { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import "./profile.scss";
import { Grid } from "@material-ui/core";
import Controls from "./controls/Controls";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
import axios from "axios";
import ButtonLoader from "./loading";
import SmartAutosuggest from "./smartAutoSuggest";
import Divider from "@mui/material/Divider";
import DefaultAcc from "./hardCoded/defaultAcc";
const initialAccValues = { acCode: "", acName: "" };
const dividerStyle = { borderBottomWidth: 2 };
const dividerGridStyle = { padding: "0px" };
const { purchaseAcc, saleAcc, purchaseErrObj, saleErrObj } = DefaultAcc();
//explanatn
//in db data is like =>  [{ code: "G10005", feild: "cgstTotal", label: "CGST A/C" },]
//we have to convert this arr of obj in one obj like {cgstTotalCode:"G10005"}
//and vice versa

const purchaseObj = {};
purchaseAcc.map((item) => {
  if (!(item.feild + "Code" in purchaseObj)) {
    purchaseObj[item.feild + "Code"] = item.code;
    purchaseObj[item.feild + "Name"] = "";
  }
});
const saleObj = {};
saleAcc.map((item) => {
  if (!(item.feild + "Code" in saleObj)) {
    saleObj[item.feild + "Code"] = item.code;
    saleObj[item.feild + "Name"] = "";
  }
});

export default function AcLedgerSettings({
  purchaseValues,
  setPurchaseValues,
  saleValues,
  setSaleValues,
  setValues,
  values,
  handleSubmit,
}) {
  let company = JSON.parse(reactLocalStorage.get("company"));
  const token = AuthHandler.getLoginToken();
  const userCode = localStorage.getItem("userCode");
  const query = `?userCompanyCode=${company.companyCode}&userCode=${userCode}`;
  const [purchaseErrors, setPurchaseErrors] = useState(purchaseErrObj);
  const [saleErrors, setSaleErrors] = useState(saleErrObj);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([initialAccValues]);
  const [save, setSave] = useState(true);

  //   function handleInputChange(e) {
  //     const { value, name } = e.target;
  //     setValues({ ...values, [name]: value });
  //     // !save && setSave(true);
  //   }
  if (loading) {
    axios
      .get(Config.accounts + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        const temp = response.data.mst_accounts.filter((item) => {
          return item.preFix == "G";
        });
        if (temp.length !== 0) setAccounts(temp);
        setLoading(false);
      });
  }
  //   const handleSubmit = () => {
  //validate first
  // setButtonLoading(true);
  // setSave(false);
  // reactLocalStorage.set("company", JSON.stringify(values));
  // axios
  //   .patch(
  //     Config.register + query,
  //     { values: values },
  //     {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     }
  //   )
  //   .then((response) => {
  //     setButtonLoading(false);
  //     setValues(values);
  //   });
  //   };
  console.log(accounts);
  console.log(purchaseValues, saleValues);

  function validate() {
    console.log(purchaseValues, saleValues);
    function validateObj(obj, fieldValues) {
      let temp = obj;
      function check(key) {
        if (key in fieldValues)
          temp[key] = fieldValues[key] ? "" : "This field is required.";
      }
      Object.keys(temp).map((x) => {
        console.log(x);
        check(x);
      });
      return temp;
    }
    //separately validate purchaseValues
    let validatePurchase = validateObj(purchaseErrObj, purchaseValues);
    let isPurchaseAccValidated = Object.values(validatePurchase).every(
      (x) => x == ""
    );
    setPurchaseErrors(validatePurchase);
    // and saleValues
    let validateSale = validateObj(saleErrObj, saleValues);
    let isSaleAccValidated = Object.values(validateSale).every((x) => x == "");
    setSaleErrors(validateSale);
    console.log(validatePurchase, validateSale);

    const areBothValid = isSaleAccValidated && isPurchaseAccValidated;
    console.log(areBothValid);
    return areBothValid;
  }
  useEffect(() => {
    !save && setSave(true);
    setValues({
      ...values,
      purchaseLedger: purchaseValues,
      saleLedger: saleValues,
    });
  }, [purchaseValues, saleValues]);
  const acOptions = accounts.map((item) => item.acName);
  return (
    <>
      <Grid Item xs={12} sm={12} style={{ justifyContent: "left" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            style={{ ...dividerGridStyle, marginTop: "8px" }}
          >
            <Divider variant="middle" color="blue" sx={dividerStyle} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 style={{ margin: "0px" }}>Purchase </h4>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{ ...dividerGridStyle, marginBottom: "8px" }}
          >
            <Divider variant="middle" color="blue" sx={dividerStyle} />
          </Grid>
          {purchaseAcc.map((item) => (
            <>
              <Grid
                item
                xs={12}
                sm={4}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SmartAutosuggest
                  options1={acOptions}
                  options2={accounts}
                  setValue={setPurchaseValues}
                  value={purchaseValues}
                  label={item.label + " IN"}
                  name2="acName"
                  code2="acCode"
                  name1={item.feild + "Name"}
                  code1={item.feild + "Code"}
                  fullWidth
                  error={purchaseErrors[item.feild + "Code"]}
                />
              </Grid>
            </>
          ))}
          <Grid
            item
            xs={12}
            sm={12}
            style={{ ...dividerGridStyle, marginTop: "8px" }}
          >
            <Divider variant="middle" color="blue" sx={dividerStyle} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 style={{ margin: "0px" }}>Sale </h4>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            style={{ ...dividerGridStyle, marginBottom: "8px" }}
          >
            <Divider variant="middle" color="blue" sx={dividerStyle} />
          </Grid>
          {saleAcc.map((item) => (
            <>
              <Grid
                item
                xs={12}
                sm={4}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SmartAutosuggest
                  options1={acOptions}
                  options2={accounts}
                  setValue={setSaleValues}
                  value={saleValues}
                  label={item.label + " OUT"}
                  name2="acName"
                  code2="acCode"
                  name1={item.feild + "Name"}
                  code1={item.feild + "Code"}
                  fullWidth
                  error={saleErrors[item.feild + "Code"]}
                />
              </Grid>
            </>
          ))}
          <Grid
            item
            sm={12}
            xs={6}
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ButtonLoader
              loading={buttonLoading}
              setLoading={setButtonLoading}
              onClick={() => {
                validate() && handleSubmit();
              }}
              save={save}
              setSave={setSave}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
