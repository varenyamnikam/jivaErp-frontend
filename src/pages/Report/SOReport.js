import GeneralDeliveryReport from "./generalDeliveryReport";

export default function SOReport() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  return (
    <GeneralDeliveryReport
      deliveryDocCode={company.saleStockUpdateUsing == "Invoice" ? "SI" : "DC"}
      docCode="SO"
    />
  );
}
