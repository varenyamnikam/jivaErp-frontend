import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
export default function QT() {
  const user = AuthHandler.getUser();
  const initialValues = {
    vouNo: " ",
    branchCode: user.defaultBranchCode,
    docCode: "DN",
    finYear: user.defaultYearCode,
    vno: "",
    manualNo: "",
    vouDate: new Date(),
    partyCode: "",
    partyName: "",
    billingAdress: "",
    billingAdressCode: "",
    shippingAdressCode: "",
    shippingAdress: "",
    paymentTermsCode: "",
    paymentTerms: "",
    remark: "",
    partyBillNo: "",
    partyBillDate: new Date(),
    partyChallanNo: "",
    partyChallanDate: new Date(),
    refType: "",
    refNo: "",
    transpotation: "",
    truckNo: "",
    agentCode: "",
    agentName: "",
    itemTotal: "",
    fright: "",
    billDisPer: "",
    billDis: "",
    roundOff: "",
    netAmount: "",
    cashCredit: "",
    receivedCash: "",
    returnCash: "",
  };

  return (
    <ReuseMaster
      title="Debit Note"
      docCode="DN"
      initialValues={initialValues}
      route="none"
    />
  );
}
