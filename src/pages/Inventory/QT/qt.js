import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const user = AuthHandler.getUser();
  const initialQtValues = {
    ...allInitialValues().initialValues,
    docCode: "QT",
  };
  return (
    <ReuseMaster
      title="Quotation"
      docCode="QT"
      initialValues={initialQtValues}
      route="none"
    />
  );
}
