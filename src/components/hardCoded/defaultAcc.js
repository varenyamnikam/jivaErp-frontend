import React from "react";

export default function DefaultAcc() {
  let purchaseAcc = [
    { code: "G10003", feild: "qrTotal", label: "Purchase A/C" },
    {
      code: "G10004",
      feild: "discountTotal",
      type: "debit",
      label: "Discount A/C",
    },
    { code: "G10008", feild: "cgstTotal", label: "CGST A/C " },
    { code: "G10009", feild: "sgstTotal", label: "SGST A/C " },
    { code: "G10010", feild: "igstTotal", label: "IGST A/C " },
    { code: "G10012", feild: "cessTotal", label: "CESS A/C " },
    {
      code: "G10004",
      feild: "billDis",
      type: "debit",
      label: "Bill Discount A/C",
    },
    { code: "G10014", feild: "roundOff", label: "Round off  A/C" },
  ];
  let saleAcc = [
    { code: "G10002", feild: "qrTotal", label: "Sale A/C" },
    {
      code: "G10004",
      feild: "discountTotal",
      type: "debit",
      label: "Discount A/C",
    },
    { code: "G10005", feild: "cgstTotal", label: "CGST A/C " },
    { code: "G10006", feild: "sgstTotal", label: "SGST A/C " },
    { code: "G10007", feild: "igstTotal", label: "IGST A/C " },
    { code: "G10011", feild: "cessTotal", label: "CESS A/C " },
    {
      code: "G10004",
      feild: "billDis",
      type: "debit",
      label: "Bill Discount A/C",
    },
    { code: "G10014", feild: "roundOff", label: "Round off  A/C" },
  ];
  const purchaseObj = {};
  const purchaseErrObj = {};

  purchaseAcc.map((item) => {
    if (!(item.feild + "Code" in purchaseObj)) {
      purchaseObj[item.feild + "Code"] = item.code;
      purchaseObj[item.feild + "Name"] = "";
      purchaseErrObj[item.feild + "Code"] = "";
      purchaseErrObj[item.feild + "Name"] = "";
    }
  });
  const saleObj = {};
  const saleErrObj = {};

  saleAcc.map((item) => {
    if (!(item.feild + "Code" in saleObj)) {
      saleObj[item.feild + "Code"] = item.code;
      saleObj[item.feild + "Name"] = "";
      saleErrObj[item.feild + "Code"] = "";
      saleErrObj[item.feild + "Name"] = "";
    }
  });

  console.log(purchaseObj, saleObj, purchaseAcc, saleAcc);
  return {
    purchaseObj,
    saleObj,
    purchaseAcc,
    saleAcc,
    saleErrObj,
    purchaseErrObj,
  };
}
