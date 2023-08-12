import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  const initialDcValues = {
    ...allInitialValues().initialValues,
    docCode: "DC",
  };
  return (
    <ReuseMaster
      title="Delivery Challan"
      docCode="DC"
      initialValues={initialDcValues}
      route={company.saleStockUpdateUsing == "Invoice" ? "none" : "dc"}
    />
  );
}
