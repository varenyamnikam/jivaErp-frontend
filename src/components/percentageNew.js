import { React, useState } from "react";
import { Button, FormGroup, TextField, withStyles } from "@material-ui/core";
import { makeStyles, IconButton } from "@material-ui/core";
import { Grid } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import { InputAdornment } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root1: {
    top: 5,
    "& .MuiFormLabel-root": {
      fontSize: 15,
      color: "#D3D3D3",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue", // or black
    },
    "& .MuiInputLabel-shrink": {
      color: "grey", // or black
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  root2: {
    top: 5,
    "& .MuiFormLabel-root": {
      fontSize: 15,
      color: "#D3D3D3",
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "blue", // or black
    },
    "& .MuiInputLabel-shrink": {
      color: "grey", // or black
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },

  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
}));

export default function Percent(props) {
  const {
    name1,
    name2,
    name3,
    label,
    value,
    setValue,
    error = null,
    onChange,
    disabled,
    ...other
  } = props;
  const classes = useStyles();
  const [disabled1, setDisabled1] = useState(disabled);
  const [disabled2, setDisabled2] = useState(disabled);
  const [priority, setPriority] = useState(name2);
  const [inferior, setInferior] = useState(name1);

  function percentOfAmt(net, amt) {
    console.log(net, amt);
    var per = (net / amt) * 100;
    console.log(per);
    return per;
  }
  function amtOfPercent(per, amt) {
    console.log(per, amt);
    var net = (per / 100) * amt;
    console.log(net);
    return net;
  }

  function subStractFromAmt(sub, amt) {
    amt = amt - sub;
    return amt;
  }
  console.log(props);

  if (
    value[name3] &&
    priority == name2 &&
    Number(value[name1]) !==
      amtOfPercent(Number(value[name2]), Number(value[name3]))
  ) {
    console.log(
      value[name1],
      value[name2],
      amtOfPercent(Number(value[name2]), Number(value[name3]))
    );
    setValue({
      ...value,
      [name1]: amtOfPercent(Number(value[name2]), Number(value[name3])),
    });
  }
  if (
    value[name3] &&
    priority == name1 &&
    Number(value[name2]) !==
      percentOfAmt(Number(value[name1]), Number(value[name3]))
  ) {
    console.log(
      value[name1],
      value[name2],
      percentOfAmt(Number(value[name1]), Number(value[name3]))
    );

    setValue({
      ...value,
      [name2]: percentOfAmt(Number(value[name1]), Number(value[name3])),
    });
  }

  return (
    <Grid container>
      <Grid Item sm={6} xs={6}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          type={"number"}
          style={{
            borderRadius: "0px",
          }}
          label={label}
          name={name1}
          value={value[name1]}
          onChange={(e) => {
            onChange(e);
            setPriority(name1);
          }}
          className={classes.root1}
          {...other}
          {...(error && { error: true, helperText: error })}
          disabled={disabled}
        />
      </Grid>
      <Grid Item sm={6} xs={6}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          type={"number"}
          style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}
          label={`percent`}
          name={name2}
          value={value[name2]}
          onChange={(e) => {
            onChange(e);
            setPriority(name2);
          }}
          className={classes.root2}
          {...other}
          {...(error && { error: true, helperText: error })}
          // disabled={disabled}
          InputProps={{
            endAdornment: (
              <PercentIcon
                fontSize="small"
                // style={{ marginTop: "15px" }}
              />
            ),
          }}
        />
      </Grid>
    </Grid>
  );
}
