import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Reusemaster from "./reusableMaster";
import GetData from "../../Branchmaster/data";
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "Country", label: "Country" },
  { id: "status", label: "status", disableSorting: true },
  { id: "Edit", label: "EDIT" },
];
const initialStateValues = {
  countryCode: "",
  countryName: "",
};

const Statemaster = (props) => {
  const [records, setRecords] = useState([initialStateValues]);
  const [location, setLocation] = useState({ country: [{}] });
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
        if (response.data.country.length !== location.country.length) {
          console.log("res....", response.data.country.length);
          setLocation(response.data);
        }
      });
  });
  console.log(location);
  console.log(location.country.length);
  if (records[0].countryName !== location.country[0].countryName) {
    setRecords(location.country);
    console.log(records, records.length, location.country.length);
  }

  return (
    <Reusemaster
      headCells={headCells}
      initialValues={initialStateValues}
      records={records}
      setRecords={setRecords}
      title={"COUNTRY"}
      m2={"countryCode"}
      country={location.country}
      state={location.states}
      District={location.districts}
    />
  );
};
export default Statemaster;
