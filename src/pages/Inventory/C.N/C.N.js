import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import Config from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
export default function QT() {
  const user = AuthHandler.getUser();
  const initialValues = {
    vouNo: "X X X X",
    branchCode: user.defaultBranchCode,
    docCode: "CN",
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
  console.log(Config.ledger);
  return (
    <ReuseMaster
      title="Credit Note"
      docCode="CN"
      initialValues={initialValues}
      route="ledger"
    />
  );
}
