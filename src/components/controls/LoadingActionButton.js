import React, { useEffect, useState } from "react";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 0,
    margin: "0px",
    marginLeft: "10px",
    height: "21px",
    width: "21px",
    backgroundColor: theme.palette.primary.light,
    color: "white",

    // borderRadius: "50%",
    "&:hover": {
      cursor: "pointer",
      color: theme.palette.primary.main,
      backgroundColor: "white",
    },
  },
  secondary: {
    backgroundColor: theme.palette.secondary.light,
    "& .MuiButton-label": {
      color: theme.palette.secondary.main,
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
}));

export default function ActionButton(props) {
  const { color, children, onClick, disabled, value, ...other } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) setLoading(false);
  }, [value]);
  return (
    <Button
      className={classes.root}
      onClick={(e) => {
        onClick(e);
        setLoading(true);
      }}
      size="small"
      disabled={disabled || false}
      {...other}
    >
      {!loading && children}

      {loading && (
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: "blue",
            animationDuration: "550ms",

            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: "round",
            },
          }}
          size={11}
          thickness={5}
        />
      )}
    </Button>
  );
}
