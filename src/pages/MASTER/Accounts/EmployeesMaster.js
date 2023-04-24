import GeneralAccountMaster from "./generalAccountMaster";

const initialValues = {
  acCode: "",
  acc: "",
  preFix: "E",
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
  seedLicenNo: "",
  bankName: "",
  ifscCode: "",
  bankAcNo: "",
  acRegMob: "",
  mktArea: "",
  mktAreaCode: "",
  parentAreaCode: "",
  prdAreaCode: "",
  acStatus: "Active",
};

export default function Customers() {
  return (
    <GeneralAccountMaster acTypeFor="Employee" initialValues={initialValues} />
  );
}
