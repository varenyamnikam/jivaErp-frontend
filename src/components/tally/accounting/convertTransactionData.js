import AuthHandler from "../../../Utils/AuthHandler";
import VouConversnFn from "./voucherXml";
import DownloadTallyXml from "../transactions/dwnldTrnsctn";

const convert = require("xml-js");
const { escape } = require("lodash");
export default function DownloadTransactionTallyXml(grouped, accounts) {
  console.log(grouped, accounts);
  const { convertVouToXml, wrapperXml } = VouConversnFn;
  function getAccName(acCode) {
    let acc = accounts.find((item) => item.acCode == acCode);
    return acc ? acc.acName : "";
  }
  function cnvrtDate(vou) {
    const date = new Date(vou.vouDate);
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    return formattedDate;
  }
  let typeInfo = {};
  function getTypeInfo(vou) {
    if (vou.docCode == "JV") {
      typeInfo = { isInvoice: "Yes", voucherType: "Journal" };
    } else if (vou.docCode == "BP") {
      typeInfo = { isInvoice: "Yes", voucherType: "Payment" };
    } else if (vou.docCode == "BR") {
      typeInfo = { isInvoice: "No", voucherType: "Receipt" };
    } else if (vou.docCode == "CP") {
      typeInfo = { isInvoice: "No", voucherType: "Payment" };
    } else if (vou.docCode == "CR") {
      typeInfo = { isInvoice: "No", voucherType: "Receipt" };
    } else if (vou.docCode == "CV") {
      typeInfo = { isInvoice: "No", voucherType: "Contra" };
    } else {
      typeInfo = { isInvoice: "No", voucherType: "IDK" };
    }
    return typeInfo;
  }
  const elaborateVoucherArr = grouped.map((item) => ({
    partyName: getAccName(item.documents[0].acCode),
    acLedger: item.documents.map((item) => ({
      ...item,
      acName: getAccName(item.acCode),
    })),
    typeInfo: getTypeInfo(item.documents[0]),
    vouNo: item._id,
  }));
  const xmlStringArr = elaborateVoucherArr.map((item) => convertVouToXml(item));
  // DownloadTallyXml(xmlStringArr, wrapperXml);
  console.log(elaborateVoucherArr);

  return xmlStringArr; // This component doesn't render anything, so we return null
}
