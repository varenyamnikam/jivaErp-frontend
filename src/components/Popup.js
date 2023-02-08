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

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    // padding: theme.spacing(2),
    position: "absolute",
    // top: theme.spacing(2),
  },
  dialogTitle: {
    padding: "0px",
    paddingLeft: "16px",
    backgroundColor: "#e2e9f3",
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
            style={{ paddingTop: "10px" }}
          >
            {title}
          </Typography>

          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
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
