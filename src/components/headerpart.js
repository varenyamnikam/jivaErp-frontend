import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthHandler from "../Utils/AuthHandler";
import { useHistory } from "react-router-dom";
import Config from "../Utils/Config";
import { reactLocalStorage } from "reactjs-localstorage";
import Popup from "./Popup";
import ChangeFinyear from "./changeFinYear";
import PersonIcon from "@mui/icons-material/Person";
import jQuery from "jquery";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { FcCalendar } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { IconButton } from "@material-ui/core";
import { FcShop } from "react-icons/fc";
import { FcManager } from "react-icons/fc";
import ShortcutList from "./shortcutInHeader";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  listItem: {
    display: "flex",
    alignItems: "center",
  },
}));
export default function Headerpart(props) {
  const [buttonPopup, setButtonPopup] = React.useState(false);
  let history = useNavigate();
  let location = useLocation();
  const classes = useStyles();
  let user;
  if (AuthHandler.getUser()) {
    user = AuthHandler.getUser();
  }
  console.log(user);
  const userCompanyName = reactLocalStorage.get("userCompanyName");
  console.log(userCompanyName);
  // {userCompanyName} (Branch:
  //   {user.defaultBranchName ? user.defaultBranchName : "Pune Branch"})
  // Financial Year :
  // {user.defaultFinYear ? user.defaultFinYear : "2021-22"}
  return (
    <>
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
          <li class="nav-item" style={{ color: "rgba(0,0,0,.5)" }}>
            <a
              class="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
              style={{
                paddingTop: "15px",
                display: "flex",
                alignContent: "flex-end",
              }}
            >
              <i class="fas fa-bars"></i>
            </a>
          </li>

          <li class="nav-item" style={{ color: "rgba(0,0,0,.5)" }}>
            <div className="nav-link">
              <>
                <FcShop
                  style={{ marginBottom: "4px", height: "24px", width: "24px" }}
                />{" "}
                Branch:
                {user.defaultBranchName
                  ? user.defaultBranchName
                  : "unknown Branch"}
                <IconButton
                  size="small"
                  onClick={() => {
                    setButtonPopup(true);
                  }}
                  style={{
                    marginBottom: "3px",
                    marginLeft: "5px",
                    boxShadow: "none",
                  }}
                >
                  <ChangeCircleIcon />
                </IconButton>
                <FcCalendar
                  style={{
                    marginBottom: "2px",
                    marginLeft: "20px",
                    height: "24px",
                    width: "24px",
                  }}
                />{" "}
                Financial Year :
                {user.defaultFinYear ? user.defaultFinYear : "unknown year"}
                <IconButton
                  size="small"
                  onClick={() => {
                    setButtonPopup(true);
                  }}
                  style={{
                    marginBottom: "3px",
                    marginLeft: "5px",
                    boxShadow: "none",
                  }}
                >
                  <ChangeCircleIcon />
                </IconButton>
              </>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <div
              class="nav-link"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ShortcutList />
            </div>
          </li>
          <li class="nav-item dropdown">
            <div
              class="nav-link"
              style={{ display: "flex", alignItems: "center" }}
            >
              <IconButton
                size="small"
                style={{
                  boxShadow: "none",
                }}
                onClick={() => {
                  console.log("hi");
                  history("/");
                }}
              >
                <LogoutIcon
                  fontSize="small"
                  onClick={() => {
                    history("/");
                    localStorage.clear();
                  }}
                />
              </IconButton>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
              <i class="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              data-widget="control-sidebar"
              data-controlsidebar-slide="true"
              href="#"
              role="button"
            >
              <i class="fas fa-th-large"></i>
            </a>
          </li>
        </ul>{" "}
      </nav>
      <aside class="control-sidebar control-sidebar-dark"></aside>
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
}
