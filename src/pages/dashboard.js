import React, { useState } from "react";
import Home from "./home/Home";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
import { FcCalendar } from "react-icons/fc";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { IconButton } from "@material-ui/core";
import Popup from "../components/Popup";
import StaticDatePickerLandscape from "../components/calendarLandscape";
import * as roleService from "../services/roleService";
import { Grid } from "@material-ui/core";
import Controls from "../components/controls/Controls";
const Dashboard = (props) => {
  const [filterPopup, setFilterPopup] = useState(false);
  const [filter, setFilter] = useState({
    startDate: roleService.getStartDate(),
    endDate: roleService.getEndDate(),
  });
  const [loading, setLoading] = useState(true);

  console.log(Config().homeUrl);
  let userCompanyCode = AuthHandler.getUser().userCompanyCode;
  let userCode = AuthHandler.getUser().userCode;
  console.log(userCompanyCode, userCode);

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <h1>Dashboard</h1>
        </div>
      </section>
      <section className="content">
        <div className="card">
          <div className="card-header">
            {" "}
            <FcCalendar
              style={{
                height: "24px",
                width: "24px",
              }}
            />{" "}
            From {roleService.date(filter.startDate)} to{" "}
            {roleService.date(filter.endDate)}
            <IconButton
              size="small"
              onClick={() => {
                setFilterPopup(true);
              }}
              style={{
                boxShadow: "none",
              }}
            >
              <ChangeCircleIcon />
            </IconButton>
          </div>
          <div className="card-body">
            <Home
              startDate={filter.startDate}
              endDate={filter.endDate}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </section>
      <Popup
        title="Filter"
        openPopup={filterPopup}
        setOpenPopup={setFilterPopup}
      >
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <StaticDatePickerLandscape
              name="startDate"
              label="Start date From-"
              value={filter}
              setValue={setFilter}
            />{" "}
          </Grid>{" "}
          <Grid item sm={6} xs={12}>
            <StaticDatePickerLandscape
              name="endDate"
              label="To date"
              value={filter}
              setValue={setFilter}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Controls.Button
              text="Submit"
              onClick={() => {
                setFilter(filter);
                setFilterPopup(false);
                setLoading(true);
              }}
            />
          </Grid>
        </Grid>
      </Popup>
    </>
  );
};

export default Dashboard;
