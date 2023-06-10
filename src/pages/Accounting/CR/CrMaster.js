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
    docCode: "CR",
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
    vouStatus: "",
    checkNo: "",
    favouringName: "",
    entryBy: "",
    entryOn: "",
  };
  return <AcMaster title="Cash Reciept" initialValues={initialValues} />;
}
