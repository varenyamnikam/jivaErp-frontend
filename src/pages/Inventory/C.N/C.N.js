import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const user = AuthHandler.getUser();
  const initialCnValues = {
    ...allInitialValues().initialValues,
    docCode: "CN",
  };
  console.log(Config().ledger);
  return (
    <ReuseMaster
      title="Credit Note"
      docCode="CN"
      initialValues={initialCnValues}
      route="none"
    />
  );
}
