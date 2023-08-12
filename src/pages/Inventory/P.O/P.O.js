import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const user = AuthHandler.getUser();
  const initialPoValues = {
    ...allInitialValues().initialValues,
    docCode: "PO",
  };

  return (
    <ReuseMaster
      title="Puchase Order"
      docCode="PO"
      initialValues={initialPoValues}
      route="none"
    />
  );
}
