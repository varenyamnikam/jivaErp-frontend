const convert = require("xml-js");

export default function DownloadTallyXml(arr, wrapperXml) {
  // Step 1: Parse XML to JavaScript object
  console.log(arr, wrapperXml);
  const xmlObject = convert.xml2js(wrapperXml, { compact: true });

  // Step 2: Locate REQUESTDATA element
  let requestData = xmlObject.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA;
  let x = true;
  let tallyMessages = requestData.TALLYMESSAGE || [];

  // Step 3: Create stockItem object
  arr.forEach((xmlString) => {
    try {
      const tallyObj = convert.xml2js(xmlString, {
        compact: true,
      });

      tallyMessages.push(tallyObj.TALLYMESSAGE);
      console.log(requestData);
    } catch (error) {
      console.log("Conversion failed for item:", xmlString);
      console.error(error);
      x = false;
    }
  });

  requestData.TALLYMESSAGE = tallyMessages;

  // Step 4: Convert JavaScript object back to XML string
  const modifiedXml = convert.js2xml(xmlObject, { compact: true, spaces: 2 });
  console.log(modifiedXml);
  // Step 5: Create a Blob object from the XML string
  const blob = new Blob([modifiedXml], { type: "text/xml" });

  // Step 6: Create a temporary download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "Vouchers.xml";

  // Step 7: Trigger the download if there are new TALLYMESSAGE elements
  if (x && tallyMessages.length > 0) {
    downloadLink.click();
  }

  // Step 8: Clean up the temporary download link
  URL.revokeObjectURL(downloadLink.href);

  return null; // This component doesn't render anything, so we return null
}
