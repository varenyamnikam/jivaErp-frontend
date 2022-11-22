import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/AuthHandler";
import AcMaster from "../AcMaster";
export default function BR() {
  const user = AuthHandler.getUser();
  const initialValues = {
    userCompanyCode: "",
    vouNo: "X X X X",
    branchCode: "",
    docCode: "BR",
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
  console.log(Config.ledger);
  return <AcMaster title="Bank Reciept" initialValues={initialValues} />;
}
