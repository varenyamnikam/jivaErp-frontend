import { React, useState, useRef, useEffect, createRef } from "react";
import { Button, FormGroup, TextField, withStyles } from "@material-ui/core";
import { makeStyles, IconButton } from "@material-ui/core";
import { Grid } from "@mui/material";
import Popup from "./Popup";
import useTable from "./useTable";
import Notification from "./Notification";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";
import axios from "axios";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
import Controls from "./controls/Controls";
const useStyles = makeStyles((theme) => ({
  root1: {
    // top: 5,
    "& .MuiFormLabel-root": {
      fontSize: 15,
      // color: "#D3D3D3",
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
    // top: 5,
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
const statusItems = [
  { id: "batch no", title: "batch no" },
  { id: "exp date", title: "exp date" },
];
const initialBatch = [{ batchNo: "", qty: "" }];
export default function Grouped(props) {
  // const { value, setValue, error = null, onChange, disabled, ...other } = props;
  const { values, setValues, batchList, setBatchlist, error = null } = props;
  const [popup, setPopup] = useState(false);
  const [priority, setPriority] = useState("batch no");
  const [focus, setFocus] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [records, setRecords] = useState(batchList);
  const token = AuthHandler.getLoginToken();
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  console.log(values, records, batchList);
  const classes = useStyles();
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(
    records,
    [
      { id: "Batch No", label: "Batch No" },
      { id: "Quantity", label: "Quantity" },
      { id: "Sell", label: "Sell" },
    ],
    { fn: (r) => r }
  );
  const saviour = useRef(Array(records.length).fill(createRef()));
  console.log(records);
  function validate() {
    let x = true;
    for (var i = 0; i < records.length; i++) {
      if (Number(records[i].qty) < Number(records[i].sell)) {
        x = false;
        setNotify({
          isOpen: true,
          message: `not enough stock at batch no. ${records[i].batchNo}`,
          type: "warning",
        });
        break;
      }
    }
    if (Number(values.qty) !== Number(getTotal())) {
      x = false;
      setNotify({
        isOpen: true,
        message: `${
          Number(values.qty) > Number(getTotal())
            ? `select ${Number(values.qty) - Number(getTotal())} more item`
            : ""
        } ${
          Number(values.qty) < Number(getTotal())
            ? "surplus stock selected"
            : ""
        }`,
        type: "warning",
      });
    }
    return x;
  }
  function integrate() {
    let x = true;
    console.log(batchList);
    batchList.map((item) => {
      if (Number(item.sell) > 0) x = false;
    });
    return x;
  }
  function getStock(y = false) {
    const useBatch = JSON.parse(
      localStorage.getItem("adm_softwareSettings")
    ).userBatchNo; //userBatchNo =yes/no
    const user = JSON.parse(localStorage.getItem("user"));
    const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&prodCode=${values.prodCode}&vouNo=${values.vouNo}&useBatch=${useBatch}&branchCode=${user.defaultBranchCode}&yearCode=${user.defaultYearCode}`;
    let data = records;
    console.log(batchList, records);
    axios
      .get(Config().batch + query, {
        headers: {
          authorization: "Bearer" + token,
        },
      })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        let data = res.data.stock;
        let arr = data.map((item) => ({ ...item, sell: "0" }));
        //setRecords(arr);
        console.log(integrate(), arr, data);
        if (integrate()) {
          //!integrate
          arr.length == 0 ? setRecords(initialBatch) : setRecords(arr);
        } else {
          //integrate
          console.log(batchList, records);
          let total = 0;
          console.log(arr);
          batchList.map((item) => {
            total += Number(item.sell);
            arr.map((a, i) => {
              console.log(item, a, item.batchNo == a.batchNo);
              if (item.batchNo == a.batchNo) {
                arr[i].sell = item.sell;
              }
            });
          });
          console.log(arr);
          arr.length == 0 ? setRecords(initialBatch) : setRecords(arr);
          console.log(records, batchList, total, values.qty);
          // data = arr;
          if (Number(total) !== Number(values.qty)) calcStock();
        }
        if (y) {
          console.log(calcStock());
        }
      });
    return data;
  }
  function handleChange(e, i) {
    const newArr = records;
    // const newObj = { ...records[i], sell: e.target.value };
    // newArr[i] = newObj;
    newArr.map((item, index) => {
      if (index == i) {
        newArr[i].sell = e.target.value;
      }
    });
    console.log("hi", newArr);
    setRecords(newArr);
    console.log(saviour);
  }
  function calcStock() {
    console.log(records, batchList);
    if (Number(values.qty) > 0 && Number(records[0].qty > 0)) {
      let final = Number(values.qty);
      let newArr = records;
      records.map((item, i) => {
        if (final < item.qty && final !== 0) {
          newArr[i] = { ...records[i], sell: final };
          final = 0;
        } else if (final !== 0) {
          newArr[i] = { ...records[i], sell: item.qty };
          final = final - Number(item.qty);
        } else if (final == 0) {
          newArr[i] = { ...newArr[i], sell: 0 };
        }
      });
      console.log(newArr);
      setRecords([...newArr]);
      return newArr;
    } else {
      return null;
    }
  }
  useEffect(() => {
    let x = true;
    if (popup) {
      records.map((item) => {
        if (Number(item.sell) > 0 && Number(item.qty) !== 0) x = false;
      });
      if (x) calcStock();
    } else {
      let total = 0;
      let stock = 0;
      records.map((item) => {
        total += Number(item.sell);
        stock += Number(item.qty);
      });

      if (total !== Number(values.qty) && stock >= Number(values.qty)) {
        console.log("hi");
        calcStock();
      }
      if (stock < Number(values.qty)) {
        setNotify({
          isOpen: true,
          message: "not enough stock",
          type: "warning",
        });
      }
      console.log(stock, Number(values.qty));
    }
  }, [records]);
  useEffect(() => {
    let x = true;
    records.map((item) => {
      if (Number(item.sell) > 0 && Number(item.qty) !== 0) x = false;
    });
    console.log(x, popup);
    if (!x && !popup) {
      if (batchList.length !== records.length) {
        console.log("setBatchlist=>", records);
        setBatchlist(records);
      } else {
        let y = true;
        records.map((r) => {
          batchList.map((b) => {
            if (Number(b.sell) !== Number(r.sell)) y = false;
          });
        });
        if (!y) {
          setBatchlist(records);
          console.log("setBatchlist=>", records);
        }
      }
    }
  }, [records]);
  console.log(notify);
  function getTotal() {
    let count = 0;
    records.map((item) => {
      count += Number(item.sell);
    });
    return count;
  }
  console.log(records, recordsAfterAndSorting());

  return (
    <>
      <Grid container>
        <Grid Item sm={6} xs={6}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            type={"number"}
            label="quantity"
            className={classes.root1}
            name="qty"
            value={values.qty}
            {...(error && { error: true, helperText: error })}
            onChange={(e) => {
              setValues({ ...values, qty: e.target.value });
            }}
            onBlur={() => {
              if (values.prodCode) {
                getStock(true);
              }
            }}
          />
        </Grid>
        <Grid Item sm={6} xs={6}>
          <Button
            disableElevation
            variant="contained"
            size="small"
            color="primary"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              // top: 5,
              height: "40px",
            }}
            onClick={() => {
              if (values.prodCode) {
                console.log(batchList, records);
                setPopup(true);
                getStock(false, batchList);
                // calcStock();
              }
            }}
          >
            Batch
          </Button>
        </Grid>

        <Popup
          title="Batchwise Stock"
          openPopup={popup}
          setOpenPopup={setPopup}
          size="sm"
          style={{ paddingRight: "10px" }}
        >
          {" "}
          <Grid container>
            <Grid Item sm={12} xs={12}>
              <TableContainer>
                <TblContainer>
                  <TblHead />
                  <TableBody>
                    {recordsAfterAndSorting().map((item, i) => (
                      <TableRow key={item.batchNo}>
                        <TableCell>{item.batchNo}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>
                          <TextField
                            key={i}
                            autoFocus={focus == i ? "autofocus" : null}
                            fullWidth
                            name={item.batchNo}
                            size="small"
                            variant="outlined"
                            type={"number"}
                            label="quantity"
                            onChange={(e) => {
                              handleChange(e, i);
                              setFocus(i);
                            }}
                            value={item.sell}
                            ref={saviour[i]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell>{}</TableCell>
                      <TableCell
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          color:
                            Number(values.qty) !== Number(getTotal())
                              ? "red"
                              : "green",
                        }}
                      >
                        {getTotal()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TblContainer>
              </TableContainer>
            </Grid>
            <Grid
              Item
              sm={12}
              xs={12}
              style={{
                justifyContent: "flex-end",
                display: "flex",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={() => {
                  if (validate()) {
                    console.log(records);
                    setBatchlist(records);
                    setPopup(false);
                  }
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Popup>

        <Notification notify={notify} setNotify={setNotify} />
      </Grid>
    </>
  );
}
