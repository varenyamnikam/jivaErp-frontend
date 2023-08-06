import React, { useState } from "react";
import ComponentToPdf from "./componentToPdf";
import { jsPDF } from "jspdf";
import PrintIcon from "@mui/icons-material/Print";
import Popup from "../Popup";
import Controls from "../controls/Controls";
import { Grid } from "@material-ui/core";
import Config from "../../Utils/Config";
import * as roleService from "../../services/roleService";
import { NotifyMsg } from "../notificationMsg";
import axios from "axios";
import AuthHandler from "../../Utils/AuthHandler";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

const PdfGenerator = (props) => {
  const { setValues, item, setNotify } = props;
  const companyName = AuthHandler.getCompany().companyName;
  const options = {
    orientation: "portrait",
    unit: "in",
    format: [8.5, 11],
  };

  // Ref for the div that holds the content to be converted to PDF
  //"pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc" |
  const contentRef = React.useRef();
  const [popup, setPopup] = useState(false);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    const scaleDownFactor = 0.5; // Adjust this value to scale the content (0.8 means 80% of the original size)
    setLoading(true);
    const contentToScale = document.querySelector(".content-to-scale");
    if (!contentToScale) {
      console.log("not found");
      return;
    } // Exit if the element is not found

    var rep = new jsPDF("p", "pt", "a4");
    rep.html(contentToScale, {
      callback: function (pdf) {
        const pdfBase64 = pdf.output("datauristring");

        // Convert the base64 string to a Blob
        const pdfBlob = dataURItoBlob(pdfBase64);

        // Create a new File object from the Blob
        const pdfFile = new File([pdfBlob], `${item.vouNo}.pdf`, {
          type: "application/pdf",
        });
        console.log(pdfBlob, mobile);
        const formData = new FormData();
        formData.append("chatId", `91${mobile}@c.us`);
        formData.append("caption", `Invoice From ${companyName}`);
        formData.append("file", pdfFile);
        const token = AuthHandler.getLoginToken();

        axios
          .post(Config().whatsapp, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: token,
            },
          })
          .then((response) => {
            console.log("PDF sent to server:", response.data);
            // Handle the API response, e.g., show success message to the user
            setNotify(NotifyMsg(10));
          })
          .catch((error) => {
            console.error("Error sending PDF:", error);
            // Handle errors, e.g., show error message to the user
            setNotify(NotifyMsg(5));
          })
          .finally(() => {
            setLoading(false);
          });
        const fileName = `${item.vouNo}.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        // a.click();
        URL.revokeObjectURL(url);
      },
    });
  };

  return (
    <div className="App">
      {/* PDF component for generating the PDF */}
      <WhatsAppIcon
        onClick={() => {
          console.log("hi");
          setPopup(true);
          // setValues(item);
        }}
        fontSize="small"
        style={{ color: "#075e54" }}
      />
      <Popup
        size="sm"
        title={"Whatsapp Invoice"}
        openPopup={popup}
        setOpenPopup={setPopup}
      >
        <Grid container spacing={1}>
          <Grid Item sm={9} xs={12}>
            <Controls.Input
              label="Whatsapp Number"
              name="mobile"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />
          </Grid>
          <Grid
            Item
            sm={3}
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Controls.LoadingButton
              text={"Send"}
              onClick={generatePDF}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              size="medium"
            />
          </Grid>
        </Grid>
      </Popup>
      <div style={{ display: "none" }}>
        <div id="rep1" className="content-to-scale">
          {" "}
          <ComponentToPdf {...props} values={item} />
        </div>
      </div>
    </div>
  );
};

export default PdfGenerator;
