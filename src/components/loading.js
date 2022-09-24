import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import "./index.css";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
const useStyles = makeStyles((theme) => ({
  root: {
    // margin: theme.spacing(0.5),
    backgroundColor: "green",
    color: "white",
  },
  label: {
    textTransform: "none",
  },
  save: {
    backgroundColor: "green",
    color: "white",
    "&:hover": {
      backgroundColor: "dark green",
    },
  },
  saving: {
    color: "grey",
  },
  saved: { color: "green" },
}));
export default function ButtonLoader(props) {
  const {
    onClick,
    loading,
    size,
    color,
    setLoading,
    save,
    saved,
    text1,
    text2,
    text3,
    variant,
    ...other
  } = props;
  const classes = useStyles();
  function button() {
    if (!save && loading) {
      return (
        <Box sx={{ m: 1, position: "relative" }}>
          <Button
            variant="contained"
            className={classes.saving}
            disabled={loading}
            onClick={onClick}
          >
            Saving
          </Button>

          <CircularProgress
            size={24}
            sx={{
              color: "green",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        </Box>
      );
    } else if (!save && !loading) {
      return (
        <Box sx={{ m: 1, position: "relative" }}>
          <Button
            variant="contained"
            color="success"
            onClick={onClick}
            className={classes.saved}
            disabled={loading}
          >
            <DoneIcon color="success" />
            Saved
          </Button>{" "}
        </Box>
      );
    } else {
      return (
        <Button
          variant="contained"
          onClick={onClick}
          className={classes.save}
          disabled={loading}
        >
          Save
        </Button>
      );
    }
  }
  return <>{button()}</>;
}
// {!loading && (
// <Button
//   variant="contained"
//   color="success"
//   onClick={onClick}
//   className={classes.root}
//   disabled={loading}
// >
//   Save
// </Button>
// )}
// {loading && (
//   <Button
//     variant="contained"
//     color="success"
//     onClick={onClick}
//     className={classes.root}
//     disabled={loading}
//   >
//     <DoneIcon />
//     Saved
//   </Button>
// )}
