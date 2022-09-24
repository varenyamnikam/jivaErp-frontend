import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AuthHandler from "../Utils/AuthHandler";
import Config from "../Utils/Config";
import { makeStyles } from "@material-ui/core";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InputAdornment from "@mui/material/InputAdornment";
import KeySharpIcon from "@mui/icons-material/KeySharp";
import Notification from "../components/Notification";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import loginimage from "../img/loginimage.jpg";
import loginman from "../img/loginman.jpg";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Shake from "react-reveal/Shake";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import coolbackground from "../img/cool-background.png";
import footer from "../img/footer.jpg";
import manonlaptop from "../img/manonlaptop.jpg";
import ERP from "../img/ERP.jpg";
import Divider from "@mui/material/Divider";
import background from "../components/loginBackground";
import unlock from "../img/unlock-24.png";
import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import "./css/style.css";
import bg1 from "./images/bg-1.jpg";
import JivaLogo from "./images/JivaLogo.png";
export default function finalLogin() {
  return (
    <>
      <div>
        <section className="ftco-section">
          <div className="container">
            <div
              className="row justify-content-center"
              style={{ padding: "0px" }}
            >
              <img src={JivaLogo} alt="Paris" className="center" />
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12 col-lg-10">
                <div className="wrap d-md-flex">
                  <div
                    className="img"
                    style={{
                      backgroundImage: `url(${bg1})`,
                    }}
                  ></div>

                  <div className="login-wrap p-4 p-md-5">
                    <div className="d-flex">
                      <div className="w-100">
                        <h3 className="mb-4">Sign in</h3>
                      </div>
                      <div className="w-100">
                        <p className="social-media d-flex justify-content-end">
                          <a
                            href="#"
                            className="social-icon d-flex align-items-center justify-content-center"
                          >
                            <span className="fa fa-facebook" />
                          </a>
                          <a
                            href="#"
                            className="social-icon d-flex align-items-center justify-content-center"
                          >
                            <span className="fa fa-twitter" />
                          </a>
                        </p>
                      </div>
                    </div>
                    <form action="#" className="signin-form">
                      <div className="form-group mb-3">
                        <label className="label" htmlFor="name">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          required
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <button
                          type="submit"
                          className="form-control btn btn-primary rounded submit px-3"
                        >
                          Sign In
                        </button>
                        Sign In
                      </div>
                      <div className="form-group d-md-flex">
                        <div className="w-50 text-left">
                          <label className="checkbox-wrap checkbox-primary mb-0">
                            Remember Me
                            <input type="checkbox" defaultChecked />
                            <span className="checkmark" />
                          </label>
                        </div>
                        <div className="w-50 text-md-right">
                          <a href="#">Forgot Password</a>
                        </div>
                      </div>
                    </form>
                    <p className="text-center">
                      Not a member?{" "}
                      <a data-toggle="tab" href="#signup">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
// <div
//   className="img"
//   style=
//     backgroundImage: { JivaLogo },
//   }}
// />
