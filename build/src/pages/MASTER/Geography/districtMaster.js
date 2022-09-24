import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Reusemaster from "./reusableMaster";
import GetData from "../../Branchmaster/data";

const headCells = [
  { id: "Country", label: "Country" },
  { id: "STATE", label: "STATE" },
  { id: "Code", label: "CODE" },
  { id: "District", label: "District" },
  { id: "status", label: "status", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialDistrictValues = {
  districtCode: "",
  stateCode: "",
  countryCode: "",
  districtName: "",
  districtStatus: "",
  countryName: "",
  stateName: "",
};

const Districtmaster = (props) => {
  const [records, setRecords] = useState([initialDistrictValues]);
  const [location, setLocation] = useState({ districts: [{}], states: [{}] });
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
        if (response.data.districts.length !== location.districts.length) {
          console.log("res....", response.data.districts.length);
          setLocation(response.data);
        }
      });
  });
  console.log(records[0].districtName, location.districts[0].districtName);
  if (records[0].districtName !== location.districts[0].districtName) {
    setRecords(location.districts);
  }

  return (
    <Reusemaster
      headCells={headCells}
      initialValues={initialDistrictValues}
      records={records}
      setRecords={setRecords}
      title={"DISTRICT"}
      country={location.country}
      state={location.states}
      District={location.districts}
      m2={"districtCode"}
    />
  );
};
export default Districtmaster;
