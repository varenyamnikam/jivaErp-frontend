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
  { id: "Country", label: "Country" },
  { id: "Code", label: "CODE" },
  { id: "STATE", label: "STATE" },
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
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  if (loading) {
    const handleRes = (response) => {
      console.log(response.data);
      if (response.data.states.length !== 0) {
        console.log("res....", response.data.states.length);
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
  console.log(location.states.length);
  if (records[0].stateName !== location.states[0].stateName) {
    setRecords(location.states);
    console.log(records, records.length, location.states.length);
  }

  return (
    <>
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
        country={location.countries}
        state={location.states}
        District={location.districts}
      />{" "}
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};
export default Statemaster;
