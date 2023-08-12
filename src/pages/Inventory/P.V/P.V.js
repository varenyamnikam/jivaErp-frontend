import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  const initialPvValues = {
    ...allInitialValues().initialValues,
    docCode: "PV",
  };
  return (
    <ReuseMaster
      title="Purchase Voucher"
      docCode="PV"
      initialValues={initialPvValues}
      route={company.purcStockUpdateUsing == "GRN" ? "ledger" : "both"}
    />
  );
}
