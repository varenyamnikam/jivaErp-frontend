const { escape } = require("lodash");

const convertVouToXml = (
  vou
) => `                    <TALLYMESSAGE xmlns:UDF="TallyUDF">
<VOUCHER REMOTEID="" VCHKEY="" VCHTYPE="${
  vou.typeInfo.voucherType
}" ACTION="Create" OBJVIEW="Accounting Voucher View">
<OLDAUDITENTRYIDS.LIST TYPE="Number">
    <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
</OLDAUDITENTRYIDS.LIST>
<DATE>20230402</DATE>
<GUID></GUID>
<NARRATION>narration</NARRATION>
<VOUCHERTYPENAME>${vou.typeInfo.voucherType}</VOUCHERTYPENAME>
<VOUCHERNUMBER>${vou.vouNo}</VOUCHERNUMBER>
<PARTYLEDGERNAME>${vou.partyName}</PARTYLEDGERNAME>
<CSTFORMISSUETYPE/>
<CSTFORMRECVTYPE/>
<FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
<PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
<VCHGSTCLASS/>
<DIFFACTUALQTY>No</DIFFACTUALQTY>
<ISMSTFROMSYNC>No</ISMSTFROMSYNC>
<ASORIGINAL>No</ASORIGINAL>
<AUDITED>No</AUDITED>
<FORJOBCOSTING>No</FORJOBCOSTING>
<ISOPTIONAL>No</ISOPTIONAL>
<EFFECTIVEDATE>20230402</EFFECTIVEDATE>
<USEFOREXCISE>No</USEFOREXCISE>
<ISFORJOBWORKIN>No</ISFORJOBWORKIN>
<ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
<USEFORINTEREST>No</USEFORINTEREST>
<USEFORGAINLOSS>No</USEFORGAINLOSS>
<USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
<USEFORCOMPOUND>No</USEFORCOMPOUND>
<USEFORSERVICETAX>No</USEFORSERVICETAX>
<ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
<EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
<USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
<IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
<EXCISEOPENING>No</EXCISEOPENING>
<USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
<ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
<ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
<ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
<INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
<ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
<ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
<IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
<ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
<ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
<ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
<ISISDVOUCHER>No</ISISDVOUCHER>
<ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
<ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
<ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
<GSTNOTEXPORTED>No</GSTNOTEXPORTED>
<IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
<ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
<ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
<ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
<ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
<ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
<ISCANCELLED>No</ISCANCELLED>
<HASCASHFLOW>No</HASCASHFLOW>
<ISPOSTDATED>No</ISPOSTDATED>
<USETRACKINGNUMBER>No</USETRACKINGNUMBER>
<ISINVOICE>No</ISINVOICE>
<MFGJOURNAL>No</MFGJOURNAL>
<HASDISCOUNTS>No</HASDISCOUNTS>
<ASPAYSLIP>No</ASPAYSLIP>
<ISCOSTCENTRE>No</ISCOSTCENTRE>
<ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
<ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
<ISBLANKCHEQUE>No</ISBLANKCHEQUE>
<ISVOID>No</ISVOID>
<ISONHOLD>No</ISONHOLD>
<ORDERLINESTATUS>Yes</ORDERLINESTATUS>
<VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
<VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
<ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
<VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
<ISVATDUTYPAID>Yes</ISVATDUTYPAID>
<ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
<ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
<ISDELETED>No</ISDELETED>
<CHANGEVCHMODE>No</CHANGEVCHMODE>
<ALTERID> 123</ALTERID>
<MASTERID> 76</MASTERID>
<VOUCHERKEY>193346542764200</VOUCHERKEY>
<EXCLUDEDTAXATIONS.LIST></EXCLUDEDTAXATIONS.LIST>
<OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
<ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
<AUDITENTRIES.LIST></AUDITENTRIES.LIST>
<DUTYHEADDETAILS.LIST></DUTYHEADDETAILS.LIST>
<SUPPLEMENTARYDUTYHEADDETAILS.LIST></SUPPLEMENTARYDUTYHEADDETAILS.LIST>
<EWAYBILLDETAILS.LIST></EWAYBILLDETAILS.LIST>
<INVOICEDELNOTES.LIST></INVOICEDELNOTES.LIST>
<INVOICEORDERLIST.LIST></INVOICEORDERLIST.LIST>
<INVOICEINDENTLIST.LIST></INVOICEINDENTLIST.LIST>
<ATTENDANCEENTRIES.LIST></ATTENDANCEENTRIES.LIST>
<ORIGINVOICEDETAILS.LIST></ORIGINVOICEDETAILS.LIST>
<INVOICEEXPORTLIST.LIST></INVOICEEXPORTLIST.LIST>
${vou.acLedger
  .map(
    (acLedger) =>
      `
<ALLLEDGERENTRIES.LIST>
    <OLDAUDITENTRYIDS.LIST TYPE="Number">
        <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
    </OLDAUDITENTRYIDS.LIST>
    <LEDGERNAME>${acLedger.acName}</LEDGERNAME>
    <GSTCLASS/>
    <ISDEEMEDPOSITIVE>${acLedger.credit ? "No" : "Yes"}</ISDEEMEDPOSITIVE>
    <LEDGERFROMITEM>No</LEDGERFROMITEM>
    <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
    <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
    <ISLASTDEEMEDPOSITIVE>${
      acLedger.credit ? "No" : "Yes"
    }</ISLASTDEEMEDPOSITIVE>
    <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
    <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
    <AMOUNT> ${acLedger.credit ? "" : "-"}${
        acLedger.credit ? acLedger.credit : acLedger.debit
      }</AMOUNT>
    <VATEXPAMOUNT> ${acLedger.credit ? "" : "-"}${
        acLedger.credit ? acLedger.credit : acLedger.debit
      }</VATEXPAMOUNT>
    <SERVICETAXDETAILS.LIST></SERVICETAXDETAILS.LIST>
    <BANKALLOCATIONS.LIST></BANKALLOCATIONS.LIST>
    <BILLALLOCATIONS.LIST></BILLALLOCATIONS.LIST>
    <INTERESTCOLLECTION.LIST></INTERESTCOLLECTION.LIST>
    <OLDAUDITENTRIES.LIST></OLDAUDITENTRIES.LIST>
    <ACCOUNTAUDITENTRIES.LIST></ACCOUNTAUDITENTRIES.LIST>
    <AUDITENTRIES.LIST></AUDITENTRIES.LIST>
    <INPUTCRALLOCS.LIST></INPUTCRALLOCS.LIST>
    <DUTYHEADDETAILS.LIST></DUTYHEADDETAILS.LIST>
    <EXCISEDUTYHEADDETAILS.LIST></EXCISEDUTYHEADDETAILS.LIST>
    <RATEDETAILS.LIST></RATEDETAILS.LIST>
    <SUMMARYALLOCS.LIST></SUMMARYALLOCS.LIST>
    <STPYMTDETAILS.LIST></STPYMTDETAILS.LIST>
    <EXCISEPAYMENTALLOCATIONS.LIST></EXCISEPAYMENTALLOCATIONS.LIST>
    <TAXBILLALLOCATIONS.LIST></TAXBILLALLOCATIONS.LIST>
    <TAXOBJECTALLOCATIONS.LIST></TAXOBJECTALLOCATIONS.LIST>
    <TDSEXPENSEALLOCATIONS.LIST></TDSEXPENSEALLOCATIONS.LIST>
    <VATSTATUTORYDETAILS.LIST></VATSTATUTORYDETAILS.LIST>
    <COSTTRACKALLOCATIONS.LIST></COSTTRACKALLOCATIONS.LIST>
    <REFVOUCHERDETAILS.LIST></REFVOUCHERDETAILS.LIST>
    <INVOICEWISEDETAILS.LIST></INVOICEWISEDETAILS.LIST>
    <VATITCDETAILS.LIST></VATITCDETAILS.LIST>
    <ADVANCETAXDETAILS.LIST></ADVANCETAXDETAILS.LIST>
</ALLLEDGERENTRIES.LIST>`
  )
  .join("")}
<PAYROLLMODEOFPAYMENT.LIST></PAYROLLMODEOFPAYMENT.LIST>
<ATTDRECORDS.LIST></ATTDRECORDS.LIST>
<GSTEWAYCONSIGNORADDRESS.LIST></GSTEWAYCONSIGNORADDRESS.LIST>
<GSTEWAYCONSIGNEEADDRESS.LIST></GSTEWAYCONSIGNEEADDRESS.LIST>
<TEMPGSTRATEDETAILS.LIST></TEMPGSTRATEDETAILS.LIST>
</VOUCHER></TALLYMESSAGE >
`;
const wrapperXml = `
<ENVELOPE>
<HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
</HEADER>
 <BODY>
    <IMPORTDATA>
        <REQUESTDESC>
            <REPORTNAME>Vouchers</REPORTNAME>
            <STATICVARIABLES>
                <SVCURRENTCOMPANY>Test 4</SVCURRENTCOMPANY>
            </STATICVARIABLES>
        </REQUESTDESC>
        <REQUESTDATA>            </REQUESTDATA>
    </IMPORTDATA>
 </BODY>
</ENVELOPE>
`;
const VouConversnFn = {
  convertVouToXml,
  wrapperXml,
};
export default VouConversnFn;