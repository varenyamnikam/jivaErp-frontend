import GeneralDeliveryReport from "./generalDeliveryReport";

export default function GRNReport() {
  const company = JSON.parse(localStorage.getItem("adm_softwareSettings"));

  return (
    <GeneralDeliveryReport
      deliveryDocCode={company.purcStockUpdateUsing == "Invoice" ? "PV" : "GR"}
      docCode="PO"
    />
  );
}
