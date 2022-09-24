import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
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
import Notification from "./Notification";
import Zoom from "react-reveal/Zoom";
import Fade from "react-reveal/Fade";
import loginimage from "../img/loginimage.jpg";
import loginman from "../img/loginman.jpg";
import JivaLogo from "../img/JivaLogo.png";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Shake from "react-reveal/Shake";
import unlock from "../img/unlock.png";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import coolbackground from "../img/cool-background.png";
import footer from "../img/footer.jpg";
import manonlaptop from "../img/manonlaptop.jpg";
import ERP from "../img/ERP.jpg";
import Divider from "@mui/material/Divider";
import "./widget/widget.scss";
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
export default function background() {
  return (
    <div
      style={{
        // display: "flex",
        // justifyContent: "left",
        // alignItems: "left",
        // height: "1px",
        display: "flex",
        justifyContent: "space-between",
        flex: "1",
        padding: "10px",
        // -webkit-box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.47);
        // box-shadow: 2px 4px 10px 1px rgba(201, 201, 201, 0.47);
        // border-radius: 10px;
        height: "100px",
        // transition: background 0.7s;
      }}
    >
      <Grid
        Container
        height={540}
        width={560}
        style={{
          background: "#0000FF",
          borderBottomRightRadius: "400px",
        }}
      >
        <Grid
          Container
          height={520}
          width={545}
          style={{
            background: "#87CEFA",
            borderBottomRightRadius: "400px",
          }}
        >
          <img
            src={loginimage}
            height={500}
            width={525}
            style={{
              borderBottomRightRadius: "400px",
            }}
          />
          <img
            className="left"
            src={manonlaptop}
            height={300}
            width={500}
            style={{
              marginTop: "90px",
            }}
          />
        </Grid>
      </Grid>
      <img
        className="right"
        src={loginman}
        height={425}
        // width={525}
        width={425}
        style={{
          marginTop: "250px",
          marginLeft: "40px",
          float: "right",
        }}
      />
    </div>
  );
}
// <Grid
// Container
// height={450}
// width={500}
// style={{
//   background: "#87CEFA",
//   borderRadius: "50px",
//   borderTopLeftRadius: "40px",
//   borderBottomLeftRadius: "40px",
//   marginLeft: "25px",
//   marginTop: "25px",
// }}
// ></Grid>

// <img
// src={ERP}
// height={400}
// width={425}
// style={{
//   marginTop: "25px",
//   borderTopLeftRadius: "40px",
//   borderBottomLeftRadius: "40px",
//   marginLeft: "25px",
// }}
// />{" "}
