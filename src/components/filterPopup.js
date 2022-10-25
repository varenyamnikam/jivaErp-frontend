import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Controls from "./controls/Controls";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
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
  // dialogContent: {
  //   paddingRight: "0px",
  // },
}));

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, size } = props;
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
      style={{ zIndex: 0 }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            component="div"
            style={{ flexGrow: 1, paddingTop: "10px" }}
          >
            {title}
          </Typography>
          <Controls.ActionButton
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>{" "}
      <DialogContent className={classes.dialogContent} dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
}
