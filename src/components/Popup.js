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
  },
}));
export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, size, ...other } = props;
  const classes = useStyles();
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
    let openOnRender = newParty.partyOpen;
    newParty = AuthHandler.getResetParty();
    if (openOnRender)
      localStorage.setItem("newParty", JSON.stringify(newParty));
  }
  return (
    <Dialog
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
