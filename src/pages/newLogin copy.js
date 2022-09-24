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
import JivaLogo from "../img/JivaLogo.png";
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
import "../index.css";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  padding: "10px",

  // height: 60,
  // lineHeight: "60px",
}));
const customItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,

  // height: 60,
  // lineHeight: "60px",
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="http://www.jivasoftware.com/">
        JIVA SOFTWARE (OPC) PRIVATE LIMITED
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  let history = useHistory();
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
    usrCode: "",
    usrPassword: "",
    btnDisabled: true,
    usrCompanyCode: "",
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
      // window.location = Config.homeUrl;
      history.push("/home");
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
    <ThemeProvider theme={theme}>
      <Notification notify={notify} setNotify={setnotify} />
      <div
        style={
          {
            // background: "#D5F3FE",
            // backgroundImage: `url(${coolbackground})`,
          }
        }
      >
        {background()}
        <CssBaseline />
        <div
          style={{
            display: "flex",
            // justifyContent: "right",
            // alignItems: "right",
            // marginRight: "200px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <Box
            sx={{
              marginTop: "55px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "500px",
              width: "500px",
            }}
          >
            <Item key={2} elevation={10}>
              <Fade bottom cascade>
                <img src={JivaLogo} height={200} width={400} />
              </Fade>
              <div
                style={{
                  marginLeft: "210px",
                }}
              >
                {getLock()}
              </div>
              <Typography component="h1" variant="h5">
                ERP Log In
              </Typography>
              <Item key={2} elevation={2}>
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
                      <Grid item style={{ marginLeft: "25px" }}>
                        <Link href="#" variant="body2">
                          Forgot password?
                        </Link>{" "}
                      </Grid>

                      <Grid item style={{ marginLeft: "125px" }}>
                        <Link to="/register" variant="body2">
                          Don't have an account? Sign Up
                        </Link>
                      </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 3, mb: 4 }} />
                  </Box>
                </Fade>
              </Item>
            </Item>
          </Box>
        </div>
        <Grid
          Container
          height={50}
          // width={1350}
          style={{
            backgroundColor: " #181818",
            marginTop: "350px",
            // borderTopRightRadius: "25px",
            // borderTopLeftRadius: "25px",
            // paddingTop: "280px",
            display: "flex",
          }}
        ></Grid>
      </div>
    </ThemeProvider>
  );
}
