import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Reusemaster from "./reusableMaster";
import GetData from "../../Admin/BranchMaster/initialValues";
import { NotifyMsg } from "../../../components/notificationMsg";
import * as roleService from "../../../services/roleService";
import Notification from "../../../components/Notification";
const headCells = [
  { id: "Code", label: "CODE" },
  { id: "Country", label: "Country" },
  { id: "Edit", label: "EDIT" },
];
const initialCountryValues = {
  countryCode: "",
  countryName: "",
};

const Countrymaster = (props) => {
  const [records, setRecords] = useState([initialCountryValues]);
  const [location, setLocation] = useState({ countries: [{}] });
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  if (loading) {
    const handleRes = (response) => {
      console.log(response.data);
      if (response.data.countries.length !== 0) {
        console.log("res....", response.data.countries.length);
        setLocation(response.data);
      }
      setLoading(false);
    };

    const url = Config().location;

    const handleErr = (error) => {
      setNotify(NotifyMsg(4));
      setLoading(false);
    };
    roleService.axiosGet(url, handleRes, handleErr, () => {});
  }
  console.log(location);
  console.log(location.countries.length);
  useEffect(() => {
    if (records[0].countryName !== location.countries[0].countryName) {
      setRecords(location.countries);
      console.log(records, records.length, location.countries.length);
    }
  }, [location]);

  return (
    <>
      <Reusemaster
        headCells={headCells}
        initialValues={initialCountryValues}
        records={records}
        setRecords={setRecords}
        title={"COUNTRY"}
        m2={"countryCode"}
        countries={location.countries}
        state={location.states}
        District={location.districts}
      />{" "}
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};
export default Countrymaster;
