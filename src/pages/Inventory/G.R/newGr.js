import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  const initialGrValues = {
    ...allInitialValues().initialValues,
    docCode: "GR",
  };
  console.log(company.purcStockUpdateUsing);
  return (
    <ReuseMaster
      title="Good Reciept Note"
      docCode="GR"
      initialValues={initialGrValues}
      route={company.purcStockUpdateUsing == "GRN" ? "dc" : "none"}
    />
  );
}
