import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
export default function QT() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  const user = AuthHandler.getUser();
  const initialValues = {
    vouNo: "X X X X",
    branchCode: user.defaultBranchCode,
    docCode: "GR",
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
  console.log(company.purcStockUpdateUsing);
  return (
    <ReuseMaster
      title="Good Reciept Note"
      docCode="GR"
      initialValues={initialValues}
      route={company.purcStockUpdateUsing == "GRN" ? "dc" : "none"}
    />
  );
}
