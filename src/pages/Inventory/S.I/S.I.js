import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function SI() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  const initialSIValues = {
    ...allInitialValues().initialValues,
    docCode: "SI",
  };
  return (
    <ReuseMaster
      title="Sale Invoice"
      docCode="SI"
      initialValues={initialSIValues}
      route={company.saleStockUpdateUsing == "DC" ? "ledger" : "both"}
    />
  );
}
