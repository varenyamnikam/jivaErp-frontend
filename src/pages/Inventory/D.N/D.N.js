import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
import allInitialValues from "../initialValues";
export default function DN() {
  const user = AuthHandler.getUser();
  const initialDnValues = {
    ...allInitialValues().initialValues,
    docCode: "DN",
  };

  return (
    <ReuseMaster
      title="Debit Note"
      docCode="DN"
      initialValues={initialDnValues}
      route="none"
    />
  );
}
