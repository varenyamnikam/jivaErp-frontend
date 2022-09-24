import React, { useEffect, useState } from "react";
import AuthHandler from "../Utils/AuthHandler";
import Config from "../Utils/Config";
import { Redirect } from "react-router-dom";
import Notification from "../components/Notification";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles();
export default function Login() {
  const [notify, setnotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [state, setState] = useState({
    usrCode: "",
    usrPassword: "",
    btnDisabled: true,
    loginStatus: 0,
  });
  console.log(state);
  const saveInputs = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (state.usrCode !== "" && state.usrPassword !== "")
      setState({ ...state, [name]: value, btnDisabled: false });
    else setState({ ...state, [name]: value, btnDisabled: true });
  };
  const formSubmit = (event) => {
    event.preventDefault();
    console.log("hi");
    console.log(state.usrCode);
    setState({ ...state, loginStatus: 1 });
    AuthHandler.login(state.usrCode, state.usrPassword, handleAjaxResponse);
  };

  const handleAjaxResponse = (data) => {
    console.log(data);
    if (data.error) {
      // if (data.message == "wrong userName/password") {
      //   setState({ ...state, loginStatus: 4 });
      //   // window.location = Config.loginUrl;
      //   console.log(data.message);
      //   setnotify({
      //     isOpen: true,
      //     message: "invalid username/password",
      //     type: "error",
      //   });
      // }
      if (data.message == "unable to connect to servers") {
        setState({ ...state, loginStatus: 5 });
        // window.location = Config.loginUrl;
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "unable to connect to servers",
          type: "warning",
        });
      } else {
        setState({ ...state, loginStatus: 4 });
        // window.location = Config.loginUrl;
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "invalid username/password",
          type: "error",
        });
      }
    } else {
      setState({ ...state, loginStatus: 3 });
      window.location = Config.homeUrl;
      setnotify({
        isOpen: true,
        message: "login success",
        type: "success",
      });
    }
  };

  const getMessages = () => {
    if (state.loginStatus === 0) {
      return "";
    }
    // else if (state.loginStatus === 1) {
    //   return (
    //     <div class="alert alert-warning">
    //       <strong>Logging in!</strong> Please Wait...
    //     </div>
    //   );
    // }
    else if (state.loginStatus === 3) {
      return (
        <div class="alert alert-success">
          <strong>Login Successfull!</strong>
        </div>
      );
    } else if (state.loginStatus === 4) {
      return (
        <div class="alert alert-danger">
          <strong>Invalid Login Details</strong>
        </div>
      );
    } else if (state.loginStatus === 5) {
      return (
        <div class="alert alert-danger">
          <strong>Unable to connect to servers</strong>
        </div>
      );
    }
  };

  // if (AuthHandler.loggedIn()) {
  //   return <Redirect to={Config.homeUrl} />;
  // }
  // <div
  //   style={{
  //     background: "linear-gradient(to right bottom, #045de9, #82ffa1)",
  //     alignContent: "center",
  //   }}
  // >

  return (
    // <div className="hold-transition login-page">
    <div
      style={{
        background: "linear-gradient(to right bottom, #045de9, #82ffa1)",
        align: "center",
      }}
    >
      <div className="login-box">
        <div className="login-logo">
          <b>OAJ</b> Seeds ERP
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <form id="sign_in" method="POST" onSubmit={formSubmit}>
              <div className="input-group mb-3">
                <input
                  name="usrCode"
                  type="text"
                  className="form-control"
                  placeholder="User Code"
                  required
                  onChange={saveInputs}
                ></input>

                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="usrPassword"
                  type="password"
                  placeholder="Password"
                  className="form-control passtext"
                  required
                  onChange={saveInputs}
                ></input>

                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>{" "}
              <br />
              <div className="row">
                <div className="col-8">&nbsp;</div>
                <div className="col-4">
                  <button
                    className="btn btn-block bg-pink waves-effect"
                    type="submit"
                    disabled={state.btnDisabled}
                  >
                    SIGN IN
                  </button>
                  <br />
                </div>
              </div>
              {getMessages()}
            </form>
          </div>
        </div>
      </div>
      <Notification notify={notify} setNotify={setnotify} />
    </div>
  );
}
