import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Reusemaster from "./reusableMaster";
import GetData from "../../Branchmaster/data";
const headCells = [
  { id: "Country", label: "Country" },
  { id: "Code", label: "CODE" },
  { id: "STATE", label: "STATE" },
  { id: "status", label: "status", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialStateValues = {
  stateCode: "",
  countryCode: "",
  stateName: "",
  stateStatus: "",
  countryName: "",
};

const Statemaster = (props) => {
  const [records, setRecords] = useState([initialStateValues]);
  const [location, setLocation] = useState({ states: [{}] });
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
        if (response.data.states.length !== location.states.length) {
          console.log("res....", response.data.states.length);
          setLocation(response.data);
        }
      });
  });
  console.log(location);
  console.log(location.states.length);
  if (records[0].stateName !== location.states[0].stateName) {
    setRecords(location.states);
    console.log(records, records.length, location.states.length);
  }

  return (
    <Reusemaster
      headCells={headCells}
      initialValues={initialStateValues}
      records={records}
      setRecords={setRecords}
      title={"STATE"}
      m1={"countryCode"}
      m2={"stateCode"}
      m3={"stateName"}
      m4={"stateStatus"}
      country={location.country}
      state={location.states}
      District={location.districts}
    />
  );
};
export default Statemaster;
