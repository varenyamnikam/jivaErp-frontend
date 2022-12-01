import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthHandler from "../Utils/AuthHandler";
import { useHistory } from "react-router-dom";
import Config from "../Utils/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import Popup from "./Popup";
import ChangeFinyear from "./changeFinYear";
const Headerpart = (props) => {
  const recentImageDataUrl = localStorage.getItem("recent-image");
  const [buttonPopup, setButtonPopup] = React.useState(false);
  function getImage() {
    if (recentImageDataUrl) {
      return (
        <img
          height={40}
          width={50}
          src={recentImageDataUrl}
          alt=""
          id="img"
          className="img"
        />
      );
    } else
      return (
        <img
          height={40}
          width={50}
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt=""
          id="img"
          className="img"
        />
      );
  }
  let user;
  if (AuthHandler.getUser()) {
    user = AuthHandler.getUser();
  }
  console.log(user);
  const userCompanyName = reactLocalStorage.get("userCompanyName");
  console.log(userCompanyName);
  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#">
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li
            className="nav-item d-none d-sm-inline-block"
            style={{ marginTop: "8px", marginLeft: "10px" }}
          >
            {userCompanyName} (Branch:
            {user.defaultBranchName ? user.defaultBranchName : "Pune Branch"})
          </li>
          <li
            className="nav-item d-none d-sm-inline-block"
            style={{ marginTop: "8px", marginLeft: "10px" }}
          >
            Financial Year :
            {user.defaultFinYear ? user.defaultFinYear : "2021-22"}
          </li>

          <li className="nav-item d-none d-sm-inline-block">&nbsp;</li>
        </ul>
        <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="fa fa-user"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-header">
                Welcome
                <b>
                  <span id="lblLoginUName">
                    {reactLocalStorage.get("userName")}!
                  </span>
                </b>
              </span>
              <div className="dropdown-divider"></div>
              <a href="#" className="dropdown-item">
                <i className="fas fa-envelope mr-2"></i>{" "}
                <span id="mnuopencall">4 new messages</span>
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={() => {
                  setButtonPopup(true);
                }}
              >
                <span id="mnuopencall">change</span>
              </a>

              <li>
                <Link
                  to={Config.logoutPageUrl}
                  className="dropdown-item dropdown-footer"
                  onClick={() => {
                    localStorage.clear();
                  }}
                >
                  <center>
                    <span>Log off!</span>
                  </center>
                </Link>
              </li>
            </div>
          </li>
        </ul>
      </nav>
      <Popup
        title={`Financial Year`}
        openPopup={buttonPopup}
        setOpenPopup={setButtonPopup}
        size="md"
      >
        <ChangeFinyear setButtonPopup={setButtonPopup} />
      </Popup>
    </>
  );
};

export default Headerpart;
// <li style={{ marginRight: "20px" }}>{getImage()}</li>
// <li className="nav-item dropdown">
//   <a className="nav-link" data-toggle="dropdown" href="#">
//     <i className="fa fa-user"></i>
//   </a>
