import React, { useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import ReuseMaster from "../reusableMaster";
export default function GR() {
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

  return (
    <ReuseMaster
      title="GR"
      docCode="GR"
      initialValues={initialValues}
      route="dc"
    />
  );
}
// {
//   "_id": {
//     "$oid": "630cfbb233f64f5f043235e0"
//   },
//   "NID": 36,
//   "screenCode": "Inventory",
//   "screenName": "INVENTORY",
//   "screenDescription": "Inventory Menu",
//   "screenType": "LINK",
//   "SrNo": 1,
//   "parentScreen": null,
//   "pageLink": "#",
//   "displayInMenu": "Y",
//   "menuLavel": 0,
//   "hasChild": "Y",
//   "superParent": null,
//   "subNav": [
//     {
//       "NID": 39,
//       "screenCode": "D.C",
//       "screenName": "D.C",
//       "screenDescription": "D.C",
//       "screenType": "FORM",
//       "SrNo": 3,
//       "parentScreen": "ADMIN",
//       "pageLink": "/Inventory/D.C",
//       "displayInMenu": "Y",
//       "menuLavel": 1,
//       "hasChild": "N",
//       "superParent": null
//     },    {
//       "NID": 40,
//       "screenCode": "Q.T",
//       "screenName": "Q.T",
//       "screenDescription": "Q.T",
//       "screenType": "FORM",
//       "SrNo": 3,
//       "parentScreen": "ADMIN",
//       "pageLink": "/Inventory/Q.T",
//       "displayInMenu": "Y",
//       "menuLavel": 1,
//       "hasChild": "N",
//       "superParent": null
//     },
//     {
//       "NID": 39,
//       "screenCode": "G.R",
//       "screenName": "G.R",
//       "screenDescription": "G.R",
//       "screenType": "FORM",
//       "SrNo": 3,
//       "parentScreen": "ADMIN",
//       "pageLink": "/Inventory/G.R",
//       "displayInMenu": "Y",
//       "menuLavel": 1,
//       "hasChild": "N",
//       "superParent": null
//     }
// ,{
//   "NID": 39,
//   "screenCode": "S.O",
//   "screenName": "S.O",
//   "screenDescription": "S.O",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/S.O",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "P.I",
//   "screenName": "P.I",
//   "screenDescription": "P.I",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/P.I",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "S.I",
//   "screenName": "S.I",
//   "screenDescription": "S.I",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/S.I",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "S.R",
//   "screenName": "S.R",
//   "screenDescription": "S.R",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/S.R",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "P.O",
//   "screenName": "P.O",
//   "screenDescription": "P.O",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/P.O",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "P.V",
//   "screenName": "P.V",
//   "screenDescription": "P.V",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/P.V",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "P.R",
//   "screenName": "P.R",
//   "screenDescription": "P.R",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/P.R",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "G.RC.N",
//   "screenName": "C.N",
//   "screenDescription": "C.N",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/C.N",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,{
//   "NID": 39,
//   "screenCode": "D.N",
//   "screenName": "D.N",
//   "screenDescription": "D.N",
//   "screenType": "FORM",
//   "SrNo": 3,
//   "parentScreen": "ADMIN",
//   "pageLink": "/Inventory/D.N",
//   "displayInMenu": "Y",
//   "menuLavel": 1,
//   "hasChild": "N",
//   "superParent": null
// }
// ,
//     {
//       "NID": 39,
//       "screenCode": "Payment Term",
//       "screenName": "Payment Term",
//       "screenDescription": "Payment Term",
//       "screenType": "FORM",
//       "SrNo": 3,
//       "parentScreen": "ADMIN",
//       "pageLink": "/Inventory/PaymentTerm",
//       "displayInMenu": "Y",
//       "menuLavel": 1,
//       "hasChild": "N",
//       "superParent": null
//     },
//     {
//       "NID": 29,
//       "screenCode": "Item Master",
//       "screenName": "Item Master",
//       "screenDescription": "Item Master",
//       "screenType": "FORM",
//       "SrNo": 2,
//       "parentScreen": "Inventory Mast",
//       "pageLink": "/Master/Products/ProductsMaster",
//       "displayInMenu": "Y",
//       "menuLavel": 2,
//       "hasChild": "N",
//       "superParent": "Master"
//     },
//   ]
// }
