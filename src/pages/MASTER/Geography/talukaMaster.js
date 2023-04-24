import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Reusemaster from "./reusableMaster";
import GetData from "../../Admin/BranchMaster/initialValues";

const headCells = [
  { id: "Country", label: "Country" },
  { id: "STATE", label: "STATE" },
  { id: "Code", label: "CODE" },
  { id: "Taluka", label: "Taluka" },
  { id: "status", label: "status", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialTalukaValues = {
  districtCode: "",
  stateCode: "",
  countryCode: "",
  districtName: "",
  talukaCode: "",
  talukaName: "",
  talukaStatus: "",
  countryName: "",
  stateName: "",
};

const Talukamaster = (props) => {
  const [records, setRecords] = useState([initialTalukaValues]);
  const [location, setLocation] = useState({
    districts: [{}],
    states: [{}],
    talukas: [{}],
  });
  useEffect(() => {
    const token = AuthHandler.getLoginToken();
    const body = { hello: "hello" };
    axios
      .post(Config.location, body, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .then((response) => {
        if (response.data.talukas.length !== location.talukas.length) {
          console.log("res....", response.data.talukas.length);
          setLocation(response.data);
        }
      });
  });
  console.log(records[0].talukaName, location.talukas[0].talukaName);
  if (records[0].talukaName !== location.talukas[0].talukaName) {
    setRecords(location.talukas);
  }

  return (
    <Reusemaster
      headCells={headCells}
      initialValues={initialTalukaValues}
      records={records}
      setRecords={setRecords}
      title={"TALUKA"}
      country={location.country}
      state={location.states}
      District={location.districts}
      m2={"talukaName"}
    />
  );
};
export default Talukamaster;
