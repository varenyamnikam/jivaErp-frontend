const { escape } = require("lodash");

const convertProdToXml = (prod) => `    <TALLYMESSAGE xmlns:UDF="TallyUDF">
<STOCKITEM NAME="" RESERVEDNAME="">
 <OLDAUDITENTRYIDS.LIST TYPE="Number">
  <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
 </OLDAUDITENTRYIDS.LIST>
 <GUID>ed4004c8-c967-44d9-b1fe-876f2c898bdc-000000a2</GUID>
 <PARENT>${escape(prod.prodTypeName)}</PARENT>
 <CATEGORY/>
 <GSTAPPLICABLE>&#4; Applicable</GSTAPPLICABLE>
 <TAXCLASSIFICATIONNAME/>
 <GSTTYPEOFSUPPLY>Goods</GSTTYPEOFSUPPLY>
 <EXCISEAPPLICABILITY>&#4; Not Applicable</EXCISEAPPLICABILITY>
 <SALESTAXCESSAPPLICABLE/>
 <VATAPPLICABLE>&#4; Applicable</VATAPPLICABLE>
 <BASEUNITS>${escape(prod.UOM)}</BASEUNITS>
  <ADDITIONALUNITS/>
 <EXCISEITEMCLASSIFICATION/>
 <ISCOSTCENTRESON>No</ISCOSTCENTRESON>
 <ISBATCHWISEON>No</ISBATCHWISEON>
 <ISPERISHABLEON>No</ISPERISHABLEON>
 <ISENTRYTAXAPPLICABLE>No</ISENTRYTAXAPPLICABLE>
 <ISCOSTTRACKINGON>No</ISCOSTTRACKINGON>
 <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
 <ASORIGINAL>Yes</ASORIGINAL>
 <ISRATEINCLUSIVEVAT>No</ISRATEINCLUSIVEVAT>
 <IGNOREPHYSICALDIFFERENCE>No</IGNOREPHYSICALDIFFERENCE>
 <IGNORENEGATIVESTOCK>No</IGNORENEGATIVESTOCK>
 <TREATSALESASMANUFACTURED>No</TREATSALESASMANUFACTURED>
 <TREATPURCHASESASCONSUMED>No</TREATPURCHASESASCONSUMED>
 <TREATREJECTSASSCRAP>No</TREATREJECTSASSCRAP>
 <HASMFGDATE>No</HASMFGDATE>
 <ALLOWUSEOFEXPIREDITEMS>No</ALLOWUSEOFEXPIREDITEMS>
 <IGNOREBATCHES>No</IGNOREBATCHES>
 <IGNOREGODOWNS>No</IGNOREGODOWNS>
 <CALCONMRP>No</CALCONMRP>
 <EXCLUDEJRNLFORVALUATION>No</EXCLUDEJRNLFORVALUATION>
 <ISMRPINCLOFTAX>No</ISMRPINCLOFTAX>
 <ISADDLTAXEXEMPT>No</ISADDLTAXEXEMPT>
 <ISSUPPLEMENTRYDUTYON>No</ISSUPPLEMENTRYDUTYON>
 <GVATISEXCISEAPPL>No</GVATISEXCISEAPPL>
 <REORDERASHIGHER>No</REORDERASHIGHER>
 <MINORDERASHIGHER>No</MINORDERASHIGHER>
 <ISEXCISECALCULATEONMRP>No</ISEXCISECALCULATEONMRP>
 <INCLUSIVETAX>No</INCLUSIVETAX>
 <GSTCALCSLABONMRP>No</GSTCALCSLABONMRP>
 <MODIFYMRPRATE>No</MODIFYMRPRATE>
 <ALTERID> 163</ALTERID>
 <DENOMINATOR> 1</DENOMINATOR>
 <BASICRATEOFEXCISE> 5</BASICRATEOFEXCISE>
 <RATEOFVAT>0</RATEOFVAT>
 <SERVICETAXDETAILS.LIST>      </SERVICETAXDETAILS.LIST>
 <VATDETAILS.LIST>      </VATDETAILS.LIST>
 <SALESTAXCESSDETAILS.LIST>      </SALESTAXCESSDETAILS.LIST>
 <GSTDETAILS.LIST>      </GSTDETAILS.LIST>
 <LANGUAGENAME.LIST>
  <NAME.LIST TYPE="String">
   <NAME>${escape(prod.prodName)}</NAME>
  </NAME.LIST>
  <LANGUAGEID> 1033</LANGUAGEID>
 </LANGUAGENAME.LIST>
 <OPENINGBALANCE>${escape(prod.openingStock)}</OPENINGBALANCE>
 <SCHVIDETAILS.LIST>      </SCHVIDETAILS.LIST>
 <EXCISETARIFFDETAILS.LIST>      </EXCISETARIFFDETAILS.LIST>
 <TCSCATEGORYDETAILS.LIST>      </TCSCATEGORYDETAILS.LIST>
 <TDSCATEGORYDETAILS.LIST>      </TDSCATEGORYDETAILS.LIST>
 <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
 <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
 <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
 <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
 <MRPDETAILS.LIST>      </MRPDETAILS.LIST>
 <VATCLASSIFICATIONDETAILS.LIST>      </VATCLASSIFICATIONDETAILS.LIST>
 <COMPONENTLIST.LIST>      </COMPONENTLIST.LIST>
 <ADDITIONALLEDGERS.LIST>      </ADDITIONALLEDGERS.LIST>
 <SALESLIST.LIST>      </SALESLIST.LIST>
 <PURCHASELIST.LIST>      </PURCHASELIST.LIST>
 <FULLPRICELIST.LIST>      </FULLPRICELIST.LIST>
 <BATCHALLOCATIONS.LIST>      </BATCHALLOCATIONS.LIST>
 <TRADEREXCISEDUTIES.LIST>      </TRADEREXCISEDUTIES.LIST>
 <STANDARDCOSTLIST.LIST>      </STANDARDCOSTLIST.LIST>
 <STANDARDPRICELIST.LIST>      </STANDARDPRICELIST.LIST>
 <EXCISEITEMGODOWN.LIST>      </EXCISEITEMGODOWN.LIST>
 <MULTICOMPONENTLIST.LIST>      </MULTICOMPONENTLIST.LIST>
 <LBTDETAILS.LIST>      </LBTDETAILS.LIST>
 <PRICELEVELLIST.LIST>      </PRICELEVELLIST.LIST>
 <GSTCLASSFNIGSTRATES.LIST>      </GSTCLASSFNIGSTRATES.LIST>
 <EXTARIFFDUTYHEADDETAILS.LIST>      </EXTARIFFDUTYHEADDETAILS.LIST>
 <TEMPGSTITEMSLABRATES.LIST>      </TEMPGSTITEMSLABRATES.LIST>
</STOCKITEM>
</TALLYMESSAGE>
`;
const convertUomToXml = (item) =>
  `<TALLYMESSAGE xmlns:UDF="TallyUDF">
<UNIT NAME="" RESERVEDNAME="">
 <NAME>${escape(item.UOM)}</NAME>
 <GUID></GUID>
 <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
 <ASORIGINAL>Yes</ASORIGINAL>
 <ISGSTEXCLUDED>No</ISGSTEXCLUDED>
 <ISSIMPLEUNIT>Yes</ISSIMPLEUNIT>
 <ALTERID></ALTERID>
</UNIT>
</TALLYMESSAGE>
`;
const convertItemGrpToXml = (grp) => `    <TALLYMESSAGE xmlns:UDF="TallyUDF">
<STOCKGROUP NAME="" RESERVEDNAME="">
 <GUID>ca925687-9b58-410a-b109-f57908f203c0-000000b8</GUID>
 <PARENT/>
 <BASEUNITS/>
 <ADDITIONALUNITS/>
 <ISBATCHWISEON>No</ISBATCHWISEON>
 <ISPERISHABLEON>No</ISPERISHABLEON>
 <ISADDABLE>No</ISADDABLE>
 <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
 <ASORIGINAL>Yes</ASORIGINAL>
 <IGNOREPHYSICALDIFFERENCE>No</IGNOREPHYSICALDIFFERENCE>
 <IGNORENEGATIVESTOCK>No</IGNORENEGATIVESTOCK>
 <TREATSALESASMANUFACTURED>No</TREATSALESASMANUFACTURED>
 <TREATPURCHASESASCONSUMED>No</TREATPURCHASESASCONSUMED>
 <TREATREJECTSASSCRAP>No</TREATREJECTSASSCRAP>
 <HASMFGDATE>No</HASMFGDATE>
 <ALLOWUSEOFEXPIREDITEMS>No</ALLOWUSEOFEXPIREDITEMS>
 <IGNOREBATCHES>No</IGNOREBATCHES>
 <IGNOREGODOWNS>No</IGNOREGODOWNS>
 <ALTERID> 199</ALTERID>
 <SERVICETAXDETAILS.LIST>      </SERVICETAXDETAILS.LIST>
 <VATDETAILS.LIST>      </VATDETAILS.LIST>
 <SALESTAXCESSDETAILS.LIST>      </SALESTAXCESSDETAILS.LIST>
 <GSTDETAILS.LIST>      </GSTDETAILS.LIST>
 <LANGUAGENAME.LIST>
  <NAME.LIST TYPE="String">
   <NAME>${escape(grp.prodTypeName)}</NAME>
  </NAME.LIST>
  <LANGUAGEID> 1033</LANGUAGEID>
 </LANGUAGENAME.LIST>
 <SCHVIDETAILS.LIST>      </SCHVIDETAILS.LIST>
 <EXCISETARIFFDETAILS.LIST>      </EXCISETARIFFDETAILS.LIST>
 <TCSCATEGORYDETAILS.LIST>      </TCSCATEGORYDETAILS.LIST>
 <TDSCATEGORYDETAILS.LIST>      </TDSCATEGORYDETAILS.LIST>
 <GSTCLASSFNIGSTRATES.LIST>      </GSTCLASSFNIGSTRATES.LIST>
 <EXTARIFFDUTYHEADDETAILS.LIST>      </EXTARIFFDUTYHEADDETAILS.LIST>
 <TEMPGSTITEMSLABRATES.LIST>      </TEMPGSTITEMSLABRATES.LIST>
</STOCKGROUP>
</TALLYMESSAGE>
`;
const wrapperXml = `
<ENVELOPE>
<HEADER>
<TALLYREQUEST>Import Data</TALLYREQUEST>
</HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>All Masters</REPORTNAME>
        <STATICVARIABLES>
         <SVCURRENTCOMPANY>Test 2</SVCURRENTCOMPANY>
         </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA></REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
const prodConversnFn = {
  convertProdToXml,
  convertUomToXml,
  convertItemGrpToXml,
  wrapperXml,
};
export default prodConversnFn;
