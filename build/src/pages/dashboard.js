import React, { useState } from "react";
import Home from "./home/Home";

const Dashboard = (props) => {
  return (
    <div className="hold-transition sidebar-mini">
      <div className="wrapper">
        <div className="content-wrapper">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
