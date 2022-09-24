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
import Notification from "../components/Notification";
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
    <Grid
      Container
      height={570}
      width={1350}
      style={{
        // backgroundColor: "#87CEFA",
        marginTop: "250px",
        borderTopRightRadius: "25px",
        borderTopLeftRadius: "25px",
        paddingTop: "280px",
      }}
    >
      <Grid
        Container
        height={50}
        width={1350}
        style={{
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          backgroundColor: "black",
          marginTop: "0px",
        }}
      ></Grid>{" "}
      <Grid
        Container
        height={50}
        width={1350}
        style={{
          marginTop: "0px",
        }}
      >
        <img src={footer} height={280} width={1350} />
      </Grid>
      <Box
        height={80}
        width={1340}
        style={{
          paddingLeft: "50px",
          paddingBottom: "20px",
        }}
      >
        <Box height={80} width={500} style={{ display: "inline-block" }}>
          {" "}
          <h4
            style={{
              marginBottom: "30px",
              color: "white",
              display: "inline-block",
            }}
          >
            JIVA SOFTWARE (OPC) PRIVATE LIMITED
          </h4>{" "}
          <p
            style={{
              color: "white",
              display: "inline-block",
            }}
          >
            Office: Dhayari, Pune, Maharashtra, India.
          </p>
        </Box>
        <Box
          width={250}
          style={{
            alignSelf: "flex-end",
            marginLeft: "450px",
            color: "white",
            display: "inline-block",
          }}
        >
          {" "}
          <h4
            style={{
              margin: "0px",
              color: "white",
              display: "inline-block",
            }}
          >
            SUPPORT{" "}
          </h4>{" "}
          <p
            style={{
              marginTop: "10px",
              color: "white",
              marginBottom: "0px",
            }}
          >
            +91 9876543210
          </p>
          <p
            style={{
              color: "white",
            }}
          >
            +91 9874543210
          </p>
        </Box>
      </Box>
    </Grid>
  );
}
