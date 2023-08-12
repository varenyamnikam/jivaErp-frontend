import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const initialSRValues = {
    ...allInitialValues().initialValues,
    docCode: "SR",
  };
  return (
    <ReuseMaster
      title="Sale Return"
      docCode="SR"
      initialValues={initialSRValues}
      route="both"
    />
  );
}
