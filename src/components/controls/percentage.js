import Input from "./Input";
import React, { useEffect, useState } from "react";
import PercentIcon from "@mui/icons-material/Percent";
import { InputAdornment } from "@material-ui/core";
import MuiTextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
const TextField = styled(MuiTextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    paddingRight: 0,
  },
  "& .MuiInputAdornment-root": {
    backgroundColor: theme.palette.divider,
    // padding: "28px 14px",
    width: "100%",
    // borderTopLeftRadius: theme.shape.borderRadius + "px",
    // borderBottomLeftRadius: theme.shape.borderRadius + "px",
  },
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
  console.log(disabled);
  const [disabled1, setDisabled1] = useState(disabled);
  const [disabled2, setDisabled2] = useState(disabled);

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

  // if (value[name3] && percentOfAmt(value[name2], value[name3])) {
  // }
  if (Number(value[name2]) !== 0 && Number(value[name1]) == 0 && !disabled1) {
    console.log(
      Number(value[name2]) !== 0 && Number(value[name1]) === 0 && !disabled1
    );
    setDisabled1(true);
    if (disabled2) setDisabled2(false);
  }

  if (Number(value[name2]) == 0 && Number(value[name1]) !== 0 && !disabled2) {
    setDisabled2(true);
    if (disabled1) setDisabled1(false);

    console.log(
      Number(value[name2]),
      Number(value[name2]) === 0 && Number(value[name1]) !== 0 && !disabled2
    );
  }
  if (
    Number(value[name2]) === 0 &&
    Number(value[name1]) === 0 &&
    (disabled1 || disabled2)
  ) {
    setDisabled2(false);
    setDisabled1(false);
  }
  if (
    Number(value[name2]) !== 0 &&
    Number(value[name1]) !== 0 &&
    !disabled1 &&
    !disabled2
  ) {
    setDisabled2(true);
  }

  if (
    value[name3] &&
    disabled1 &&
    Number(value[name1]) !==
      amtOfPercent(Number(value[name2]), Number(value[name3]))
  ) {
    console.log(
      "hi",
      Number(value[name1]) !==
        amtOfPercent(Number(value[name2]), Number(value[name3])),
      Number(value[name1]),
      Number(value[name2]),
      amtOfPercent(Number(value[name2]), Number(value[name3]))
    );
    setValue({
      ...value,
      [name1]: amtOfPercent(Number(value[name2]), Number(value[name3])),
    });
  }
  console.log(Number("0.1"));
  if (
    Number(value[name3]) &&
    disabled2 &&
    Number(value[name2]) !==
      percentOfAmt(Number(value[name1]), Number(value[name3]))
  ) {
    console.log("hi", percentOfAmt(Number(value[name1]), Number(value[name3])));

    setValue({
      ...value,
      [name2]: percentOfAmt(Number(value[name1]), Number(value[name3])),
    });
  }
  return (
    <>
      <TextField
        size="large"
        label={label}
        name={name1}
        value={value[name1]}
        onChange={onChange}
        type={"number"}
        {...other}
        {...(error && { error: true, helperText: error })}
        disabled={disabled1}
        InputProps={{
          startAdornment: <CurrencyRupeeIcon fontSize="small" />,
          endAdornment: (
            <InputAdornment position="end">
              <TextField
                // size="small"
                variant="filled"
                style={{ width: "100%" }}
                name={name2}
                value={value[name2]}
                disabled={disabled2}
                onChange={onChange}
                type={"number"}
                InputProps={{
                  endAdornment: (
                    <PercentIcon
                      fontSize="small"
                      // style={{ marginTop: "15px" }}
                    />
                  ),
                }}
              />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}
// <>
// <Input
// size="small"
// label={label}
// name={name1}
// value={value[name1]}
// onChange={onChange}
// type={"number"}
// {...other}
// {...(error && { error: true, helperText: error })}
// disabled={disabled1}
//   InputProps={{
//     sx: {
//       ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
//         border: "2px solid white",
//       },
//       "&:hover": {
//         ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
//           border: "2px solid white",
//         },
//       },
//       margin: "0px",
//       width: "80px",
//     },
//     endAdornment: (
// <Input
//   size="small"
//   variant="filled"
//   name={name2}
//   value={value[name2]}
//   disabled={disabled2}
//   onChange={onChange}
//   type={"number"}
// InputProps={{
//   endAdornment: (
//     <PercentIcon fontSize="small" style={{ marginTop: "15px" }} />
//   ),
// }}
// />
//     ),
//   }}
// />
// </>
