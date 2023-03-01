import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import Controls from "./controls/Controls";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import VerticalTabs from "./verticalTabs";
import AuthHandler from "../Utils/AuthHandler";
import { useNavigate } from "react-router-dom";

const styles = (theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "6px",
      // top: "5px",
      // marginRight: "12px",
      // left: "12px !important",
      // position: "fixed",
    },
    "*::-webkit-scrollbar-track": {
      // width: "10px",

      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      // marginRight: "12px",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgb(194, 193, 193)",
      borderRadius: "25px",
      // marginRight: "12px",

      "&:hover": {
        // add hover selector
        backgroundColor: "rgb(142, 141, 141)",
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    // padding: theme.spacing(2),
    position: "absolute",
    // top: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.light}`,
  },
  dialogTitle: {
    padding: "0px",
    paddingLeft: "16px",
    backgroundColor: theme.palette.primary.light,
    color: "white",
  },
  dialogContent: {
    // padding: "0px",
    // paddingRight: "1px",
  },
  ...styles(theme),
}));
export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, size, ...other } = props;
  const classes = useStyles();
  let history = useNavigate();

  console.log(size, title);
  function getSize(ok) {
    if (size) {
      return size;
    } else {
      return "sm";
    }
  }
  console.log(getSize());
  function resetAddParty() {
    // reset if user closes dailogue ,while adding party thru transaction form
    let newParty = JSON.parse(localStorage.getItem("newParty"));
    console.log(newParty);
    let openOnRender = newParty.partyOpen;
    // if (openOnRender)
    //   localStorage.setItem("newParty", JSON.stringify(newParty));
    if (openOnRender) {
      let newParty = JSON.parse(localStorage.getItem("newParty"));
      newParty.partyOpen = false;
      localStorage.setItem("newParty", JSON.stringify(newParty));
      history(newParty.path);
    }
  }
  return (
    <Dialog
      fullWidth={true}
      open={openPopup}
      maxWidth={getSize()}
      classes={{ paper: classes.dialogWrapper }}
      {...other}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            style={{ paddingTop: "5px", color: "white" }}
          >
            {title}
          </Typography>

          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
              resetAddParty();
            }}
            style={{
              height: "30px",
              width: "30px",
              borderRadius: "50%",
              margin: "5px",
            }}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>{" "}
      <DialogContent className={classes.dialogContent} dividers {...other}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
