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
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import "../index.css";
import "../components/css/style.css";
import bg1 from "../components/images/bg-1.jpg";
import JivaLogo from "../components/images/JivaLogo.png";

const theme = createTheme();

export default function SignIn() {
  let history = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    alert("First few login attempts may fail due to sleeping backend service");

    setShowAlert(false);
  }, []);
  // window.onunload = function () {
  //   window.scrollTo(0, 50);
  // };
  // function delay(time) {
  //   return new Promise((resolve) => setTimeout(resolve, time));
  // }
  // document.addEventListener("load", function () {
  //   console.log("hi");
  //   delay(3000).then(() => {
  //     window.scrollTo(0, 50);
  //   });
  // });
  // window.onunload = function () {
  //   delay(3000).then(() => {
  //     console.log("hi");
  //     window.scrollTo(0, 50);
  //   });
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  const [notify, setnotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [state, setState] = useState({
    usrCode: "1001",
    usrPassword: "1001",
    btnDisabled: false,
    usrCompanyCode: "1022",
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
    AuthHandler.login(
      state.usrCode,
      state.usrPassword,
      state.usrCompanyCode,
      handleAjaxResponse
    );
  };

  const handleAjaxResponse = (data) => {
    console.log(data);
    if (data.error) {
      if (data.message == "unable to connect to servers") {
        setState({ ...state, loginStatus: 5 });
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "unable to connect to servers",
          type: "warning",
        });
      }
      if (data.message == "wrong userName/password") {
        setState({ ...state, loginStatus: 6 });
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "wrong userName/password",
          type: "warning",
        });
      }
      if (data.message == "User is Inactive...") {
        setState({ ...state, loginStatus: 2 });
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "User is Inactive...",
          type: "warning",
        });
      } else {
        setState({ ...state, loginStatus: 4 });
        // window.location = Config().loginUrl;
        console.log(data.message);
        setnotify({
          isOpen: true,
          message: "invalid username/password",
          type: "error",
        });
      }
    } else {
      setState({ ...state, loginStatus: 3 });
      // window.location = Config().homeUrl;
      history("/home");
      // document.location.reload(true);
      // setnotify({
      //   isOpen: true,
      //   message: "login success",
      //   type: "success",
      // });
    }
  };

  const getMessages = () => {
    if (state.loginStatus === 0) {
      return "";
    } else if (state.loginStatus === 3) {
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
    } else if (state.loginStatus === 6) {
      return (
        <div class="alert alert-danger">
          <strong>Wrong UserName Password</strong>
        </div>
      );
    } else if (state.loginStatus === 2) {
      return (
        <div class="alert alert-danger">
          <strong>User is Inactive</strong>
        </div>
      );
    }
  };
  const getLock = () => {
    if (state.loginStatus == 3) {
      return (
        <Avatar sx={{ m: 1, bgcolor: "#4BB543" }}>
          <img src={unlock} height={20} width={20} />
        </Avatar>
      );
    } else if (state.loginStatus == 4) {
      return (
        <Shake>
          <Avatar sx={{ m: 1, bgcolor: "#cc0000" }}>
            <LockOutlinedIcon />
          </Avatar>
        </Shake>
      );
    } else {
      return (
        <Avatar sx={{ m: 1, bgcolor: "#2c6fbb" }}>
          <LockOutlinedIcon />
        </Avatar>
      );
    }
  };
  // function startAdornment() {
  //   if (state.usrCode == "") return "";
  //   else
  //     return (
  //       <>
  //         <InputAdornment position="start">
  //           <AccountCircle />
  //         </InputAdornment>
  //       </>
  //     );
  // }
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
                    <Grid container>
                      <Grid
                        item
                        xs={6}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {getLock()}
                      </Grid>
                      <Grid item xs={6}>
                        <h2 style={{ marginBottom: "0px" }}>Sign in</h2>
                      </Grid>
                    </Grid>
                    <Fade bottom cascade>
                      <Box
                        component="form"
                        onSubmit={formSubmit}
                        noValidate
                        sx={{ mt: 1, marginTop: "25px" }}
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            <TextField
                              value={state.usrCode}
                              margin="normal"
                              required
                              fullWidth
                              id="email"
                              label="User Code"
                              name="usrCode"
                              autoComplete="email"
                              onChange={saveInputs}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccountCircle />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              value={state.usrPassword}
                              margin="normal"
                              required
                              fullWidth
                              name="usrPassword"
                              label="Password"
                              type="password"
                              id="password"
                              autoComplete="current-password"
                              onChange={saveInputs}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <KeySharpIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              value={state.usrCompanyCode}
                              margin="normal"
                              required
                              fullWidth
                              name="usrCompanyCode"
                              label="Company Code"
                              type="usrCompanyCode"
                              id="usrCompanyCode"
                              onChange={saveInputs}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BusinessIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                        <div>
                          <Grid container>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              disabled={state.btnDisabled}
                            >
                              Sign In
                            </Button>
                          </Grid>
                        </div>
                        <div>{getMessages()} </div>
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <Link href="#" variant="body2">
                              Forgot password?
                            </Link>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <p className="text-center">
                              Not a member?
                              <Link to="/register" variant="body2">
                                Sign Up
                              </Link>
                            </p>
                          </Grid>
                        </Grid>
                      </Box>
                    </Fade>
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
