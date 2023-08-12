import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/AuthHandler";
import AcMaster from "../AcMaster";
export default function BR() {
  const user = AuthHandler.getUser();
  const initialValues = {
    userCompanyCode: "",
    vouNo: "",
    branchCode: "",
    docCode: "CP",
    finYear: "",
    vno: "",
    manualNo: "",
    vouDate: new Date(),
    srNo: "",
    acCode: "",
    acName: "",
    debit: "",
    credit: "",
    narration: "",
    refType: "",
    refNo: "",

    vouStatus: "",
    checkNo: "",
    favouringName: "",
    entryBy: "",
    entryOn: "",
  };
  return <AcMaster title="Cash Payment" initialValues={initialValues} />;
}
