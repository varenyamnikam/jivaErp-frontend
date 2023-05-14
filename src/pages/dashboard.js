import React, { useState } from "react";
import Home from "./home/Home";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
const Dashboard = (props) => {
  console.log(Config.homeUrl);
  let userCompanyCode = AuthHandler.getUser().userCompanyCode;
  let userCode = AuthHandler.getUser().userCode;
  console.log(userCompanyCode, userCode);
  console.log(Config.query);

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
            <h3 className="card-title">&nbsp;</h3>
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
