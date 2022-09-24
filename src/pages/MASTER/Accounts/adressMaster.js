import React, { useEffect, useState } from "react";

import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import BasicSelect from "../../Usermaster/basicselect";
import Controls from "../../../components/controls/Controls";
import AdvancedSelect from "../../../components/advancedBasicSelect";
import ControllableStates from "../../../components/selectsearchstate";
import PopupMarketingArea from "./popupTreeView";
import Popup from "../../../components/Popup";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Adressform from "./adressForm";
import AddIcon from "@material-ui/icons/Add";
import { getFormLabelUtilityClasses } from "@mui/material";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";

const Firms = [
  "N.A.",
  "Proprietary",
  "Private Limited",
  "Limited",
  "Co-Operative",
  "Co-Operative Limited",
];
const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  addButton: {
    color: "white",
  },
}));

const TabWithCount = ({ children, count }) => {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Typography component="div">{children}</Typography>
      {count ? (
        <Typography
          component="div"
          variant="body2"
          sx={{ marginLeft: "0.5rem" }}
        >
          {count}
        </Typography>
      ) : null}
    </Box>
  );
};
const ButtonInTabs = ({ className, onClick, children }) => {
  return <Button className={className} onClick={onClick} children={children} />;
};

const customerType = ["DEALER", "DISTRIBUTOR", "RETAILER"];
export default function AdressMaster(props) {
  const classes = useStyles();
  const {
    initialAdress,
    acCode,
    acName,
    location,
    adressData,
    setAdressData,
    getAdress,
    values,
  } = props;
  const [adresses, setAdresses] = useState([
    { acCode: acCode, ...initialAdress },
  ]);
  const [records, setRecords] = useState([]);
  const [value, setValue] = useState("1");
  const [save, setSave] = useState({});
  const [imitate, setImitate] = useState({});
  let arr = adressData.filter((item) => item.acCode == acCode);
  console.log(arr, acCode);
  if (arr.length !== 0) {
    if (arr[0].addressNo !== adresses[0].addressNo) {
      console.log("hehe");
      setAdresses(arr);
      // setRecords(arr);
    }
  }
  useEffect(() => {
    if (adressData.length !== records.length) {
      setRecords(adressData);
    }
  }, [adressData]);
  // arr.length - 1
  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };
  console.log(adressData, records);
  console.log(arr, adresses);
  // function handleFinalSubmit() {
  //   let x = true;
  //   adresses.map((item) => {
  //     if (item.adressLine1 == "") {
  //       setNotify({
  //         isOpen: true,
  //         message: "plz fill Adress Line 1",
  //         type: "error",
  //       });
  //       x = false;
  //     }
  //   });
  //   console.log(x);
  //   if (x) {
  //     console.log(adresses);
  //     adresses.map((item) => {
  //       roleService.insertAcAdress(item);
  //     });
  //   }
  // }
  // function handleSubmit(e) {
  //   e.preventDefault();
  //   let x = true;
  //   const updatedAdresses = adresses.map((p, index) => {
  //     if (index == Index) {
  //       x = false;
  //       return input;
  //     } else {
  //       return p;
  //     }
  //   });
  //   setSave({ ...save, [Index]: false });
  //   setAdresses(updatedAdresses);
  //   setRecords([...records, { ...input }]);
  //   const updatedData = adressData.filter(
  //     (item) => item.acCode == input.acCode && item.adressNo == input.adressNo
  //   );
  //   setAdressData([...updatedData, input]);
  // }
  function getValue(value) {
    if (value == "NULL") {
      console.log("undefined");
      return "";
    } else {
      console.log("not undefined", value);
      return value;
    }
  }

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value.toString()}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {adresses.map((item, index) => {
                console.log(index);
                return (
                  <Tab
                    label={
                      <TabWithCount count={index + 1}>Adress</TabWithCount>
                    }
                    value={(index + 1).toString()}
                  />
                );
              })}
              <ButtonInTabs
                onClick={(e) => {
                  setAdresses([
                    ...adresses,
                    { acCode: acCode, ...initialAdress },
                  ]);
                  // setRecords([...records, initialAdress]);
                  setValue((adresses.length + 1).toString());
                  // setValue((records.length + 1).toString());
                  // handleSubmit(e);
                  // getAdress();
                }}
                className={classes.root}
              >
                <AddIcon />
                New Tab
              </ButtonInTabs>
            </TabList>
          </Box>
          {adresses.map((item, index) => {
            return (
              <TabPanel value={(index + 1).toString()}>
                {" "}
                <Adressform
                  currentAdress={item}
                  initialAdress={initialAdress}
                  acCode={acCode}
                  acName={acName}
                  country={location.country}
                  states={location.states}
                  districts={location.districts}
                  talukas={location.talukas}
                  records={records}
                  setRecords={setRecords}
                  imitate={imitate}
                  setImitate={setImitate}
                  setAdresses={setAdresses}
                  adresses={adresses}
                  Index={index}
                  save={save}
                  setSave={setSave}
                  setAdressData={setAdressData}
                  adressData={adressData}
                />
              </TabPanel>
            );
          })}
        </TabContext>
      </Box>
    </>
  );
}
// <div style={{ marginLeft: 705, marginBottom: 25 }}>
// <Controls.Button type="submit" text="Submit" />
// </div>
//
