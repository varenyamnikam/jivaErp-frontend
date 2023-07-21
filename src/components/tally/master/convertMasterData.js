const convert = require("xml-js");
const { escape } = require("lodash");
export default function DownloadTallyXml(dataAndFnArr, wrapperXml, fileName) {
  // Step 1: Parse XML to JavaScript object
  console.log(dataAndFnArr, wrapperXml);
  const xmlObject = convert.xml2js(wrapperXml, { compact: true });
  const arrToReturn = [];
  // Step 2: Locate REQUESTDATA element
  let requestData = xmlObject.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA;
  let x = true;
  // Step 3: Create stockItem object
  dataAndFnArr.map((obj) => {
    obj.data.map((item) => {
      try {
        // console.log(obj.fn(item));
        const tallyObj = convert.xml2js(obj.fn(item), {
          compact: true,
        });

        if (!requestData.TALLYMESSAGE) {
          requestData.TALLYMESSAGE = [];
        }
        requestData.TALLYMESSAGE.push(tallyObj.TALLYMESSAGE);
        arrToReturn.push(
          convert.js2xml(tallyObj, { compact: true, spaces: 2 })
        ); //for inventory vouchers
        console.log(requestData);
      } catch (error) {
        console.log("Conversion failed for item:", obj.fn(item));
        console.error(error);
        x = false;
      }
    });
  });

  // Step 4: Convert JavaScript object back to XML string
  const modifiedXml = convert.js2xml(xmlObject, { compact: true, spaces: 2 });
  console.log(modifiedXml);
  // Step 5: Create a Blob object from the XML string
  const blob = new Blob([modifiedXml], { type: "text/xml" });

  // Step 6: Create a temporary download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;

  // Step 7: Trigger the download
  fileName == "Masters.xml" && downloadLink.click();

  // Step 8: Clean up the temporary download link
  URL.revokeObjectURL(downloadLink.href);

  return arrToReturn; // This component doesn't render anything, so we return null
}
