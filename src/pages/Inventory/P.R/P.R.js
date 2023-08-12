import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function QT() {
  const initialPRValues = {
    ...allInitialValues().initialValues,
    docCode: "PR",
  };
  return (
    <ReuseMaster
      title="Purchase Return"
      docCode="PR"
      initialValues={initialPRValues}
      route="both"
    />
  );
}
