import GeneralAccountMaster from "./generalAccountMaster";

const initialValues = {
  acCode: "X X X X",
  acc: "",
  preFix: "C",
  firmType: "",
  acGroupName: "",
  acGroupCode: "",
  acType: "",
  acName: "",
  fatherName: "",
  propritorName: "",
  tradeName: "",
  creditDays: "0",
  creditAmount: "0",
  panNo: "",
  aadharNo: "",
  gstNo: "",
  seedLicenNo: "NULL",
  bankName: "NULL",
  ifscCode: "NULL",
  bankAcNo: "NULL",
  acRegMob: "",
  mktArea: "",
  mktAreaCode: "",
  parentAreaCode: "",
  prdAreaCode: "NULL",
  acStatus: "Active",
};

export default function Customers() {
  return (
    <GeneralAccountMaster acTypeFor="Customer" initialValues={initialValues} />
  );
}
