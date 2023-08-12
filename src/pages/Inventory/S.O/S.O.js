import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const initialSoValues = {
    ...allInitialValues().initialValues,
    docCode: "SO",
  };

  return (
    <ReuseMaster
      title="Sales Order"
      docCode="SO"
      initialValues={initialSoValues}
      route="none"
    />
  );
}
