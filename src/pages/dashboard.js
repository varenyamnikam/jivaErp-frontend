import React, { useState } from "react";
import Home from "./home/Home";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
import { FcCalendar } from "react-icons/fc";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { IconButton } from "@material-ui/core";

const Dashboard = (props) => {
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
            From 01/04/2023 to 9/9/2023
            <IconButton
              size="small"
              onClick={() => {
                // setButtonPopup(true);
              }}
              style={{
                boxShadow: "none",
              }}
            >
              <ChangeCircleIcon />
            </IconButton>
          </div>
          <div className="card-body">
            <Home />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
