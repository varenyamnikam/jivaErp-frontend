import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: "0px",
    marginLeft: "10px",
    height: "21px",
    width: "21px",
    // borderRadius: "50%",
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.secondary.main,
      backgroundColor: "white",
    },
  },
  secondary: {
    backgroundColor: theme.palette.secondary.light,
    "& .MuiButton-label": {
      color: "white",
    },
    color: "whitesmoke",

    "&:hover": {
      "& $addIcon": {
        color: theme.palette.secondary.main,
      },
    },
  },
  primary: {
    backgroundColor: theme.palette.primary.light,
    "& .MuiButton-label": {
      color: "white",
    },
    "&:hover": {
      "& $addIcon": {
        color: theme.palette.primary.main,
      },
    },

    color: "whitesmoke",
  },
  addIcon: {
    color: "white",
  },
}));

export default function ActionButton(props) {
  const { color, children, onClick, disabled, ...other } = props;
  const classes = useStyles();

  return (
    <Button
      className={`${classes.root} ${classes[color]}`}
      onClick={onClick}
      size="small"
      disabled={disabled || false}
      {...other}
    >
      <div className={classes.addIcon}>{children}</div>
    </Button>
  );
}
