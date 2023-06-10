import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/AuthHandler";
import AcMaster from "../AcMaster";
import * as roleService from "../../../services/roleService";
export default function BR() {
  const user = AuthHandler.getUser();
  const initialValues = {
    userCompanyCode: "",
    vouNo: "",
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
    getDate: function () {
      return roleService.date(this.vouDate);
    },
  };
  return <AcMaster title="Bank Reciept" initialValues={initialValues} />;
}
