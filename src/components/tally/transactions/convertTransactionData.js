import AuthHandler from "../../../Utils/AuthHandler";
import VouConversnFn from "./voucherXml";
import DownloadTallyXml from "./dwnldTrnsctn";

const convert = require("xml-js");
const { escape } = require("lodash");
export default function DownloadTransactionTallyXml(data) {
  const { acLedger, voucher, accounts, voucherItems, adress, products } = data;
  console.log(data);
  const { convertVouToXml, wrapperXml } = VouConversnFn;
  function getAdress(vou) {
    const adressObj = adress.find(
      (item) =>
        item.acCode == vou.partyCode && item.addressNo == vou.billingAdressCode
    );
    return adressObj;
  }
  function getAccName(acCode) {
    let acc = accounts.find((item) => item.acCode == acCode);
    return acc ? acc.acName : "";
  }
  function cnvrtDate(vou) {
    const date = new Date(vou.vouDate);
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
    return formattedDate;
  }
  function findAcLedger(vou) {
    let found = acLedger.find((item) => item._id == vou.vouNo);
    if (found) {
      console.log(found);
      found = found.documents
        .filter((item) => item.acCode !== "G10002" && item.acCode !== "G10003")
        .map((item) => ({
          ...item,
          acName: getAccName(item.acCode),
        }));
      console.log(found);
    }
    return found ? found : [];
  }
  function getProd(code) {
    let prod = products.find((item) => item.prodCode == code);
    return prod ? prod : { prodName: "", UOM: "" };
  }
  function findVouItems(vou) {
    let found = voucherItems.filter((item) => item.vouNo == vou.vouNo);
    if (found) {
      console.log(found);
      found = found.map((item) => ({
        ...item,
        prodName: getProd(item.prodCode).prodName,
        UOM: getProd(item.prodCode).UOM,
        saleAcc: getAccName(AuthHandler.getSettings().saleLedger.qrTotalCode),
        purcAcc: getAccName(
          AuthHandler.getSettings().purchaseLedger.qrTotalCode
        ),
      }));
      console.log(found);
    }
    return found ? found : [];
  }
  let typeInfo = {};
  function getTypeInfo(vou) {
    if (vou.docCode == "SI") {
      typeInfo = { isInvoice: "Yes", voucherType: "Sales" };
    } else if (vou.docCode == "PV") {
      typeInfo = { isInvoice: "Yes", voucherType: "Purchase" };
    } else if (vou.docCode == "DC") {
      typeInfo = { isInvoice: "No", voucherType: "Delivery Note" };
    } else if (vou.docCode == "GR") {
      typeInfo = { isInvoice: "No", voucherType: "Receipt Note" };
    } else if (vou.docCode == "SO") {
      typeInfo = { isInvoice: "No", voucherType: "Sales Order" };
    } else if (vou.docCode == "PO") {
      typeInfo = { isInvoice: "No", voucherType: "Purchase Order" };
    } else if (vou.docCode == "SR" || vou.docCode == "CN") {
      typeInfo = { isInvoice: "Yes", voucherType: "Credit Note" };
    } else if (vou.docCode == "PR" || vou.docCode == "DN") {
      typeInfo = { isInvoice: "Yes", voucherType: "Debit Note" };
    } else {
      typeInfo = { isInvoice: "No", voucherType: "IDK" };
    }
    return typeInfo;
  }
  function deliveryRefVou(vou) {
    let found = voucher.find((item) => item.vouNo == vou.refNo);
    if (found && (found.docCode == "DC" || found.docCode == "GR")) return found;
    else return null;
  }
  function orderRefVou(deliveryVou, vou) {
    let found = voucher.find((item) => item.vouNo == vou.refNo);
    if (deliveryVou)
      found = voucher.find((item) => item.vouNo == deliveryVou.refNo);
    if (found && (found.docCode == "SO" || found.docCode == "PO")) return found;
    else return null;
  }

  const elaborateVoucherArr = voucher.map((item) => ({
    ...item,
    fullAdress: getAdress(item) ? getAdress(item).addressLine1 : "",
    tallyDate: cnvrtDate(item),
    stateName: getAdress(item) ? getAdress(item).stateName : "",
    countryName: getAdress(item) ? getAdress(item).countryName : "",
    acLedger: findAcLedger(item),
    vouItems: findVouItems(item),
    typeInfo: getTypeInfo(item),
    deliveryVou: deliveryRefVou(item),
    orderVou: orderRefVou(deliveryRefVou(item), item),
  }));
  const xmlStringArr = elaborateVoucherArr.map((item) => convertVouToXml(item));
  // DownloadTallyXml(xmlStringArr, wrapperXml);
  console.log(data, elaborateVoucherArr);

  return xmlStringArr; // This component doesn't render anything, so we return null
}
