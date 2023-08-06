import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    // margin: theme.spacing(0.5),
  },
  label: {
    textTransform: "none",
  },
}));

export default function LoadingButtons(props) {
  const {
    loading,
    text,
    size,
    color,
    variant,
    onClick,
    startIcon,
    endIcon,
    ...other
  } = props;
  const classes = useStyles();
  return (
    <LoadingButton
      loading={loading || false}
      startIcon={startIcon || <></>}
      endIcon={endIcon || <></>}
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      style={{ maxHeight: "50px" }}
      onClick={onClick}
      {...other}
      classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </LoadingButton>
  );
}
