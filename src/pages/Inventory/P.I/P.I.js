import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const initialPIValues = {
    ...allInitialValues().initialValues,
    docCode: "PI",
  };

  return (
    <ReuseMaster
      title="Performa Invoice"
      docCode="PI"
      initialValues={initialPIValues}
      route="none"
    />
  );
}
