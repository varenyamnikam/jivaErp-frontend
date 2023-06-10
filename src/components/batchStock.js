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
import * as roleService from "../services/roleService";
import { NotifyMsg } from "./notificationMsg";
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
// records=[{ batchNo: "", qty: "" }]
//formData={[batchNo]:sell}
export default function Grouped(props) {
  // const { value, setValue, error = null, onChange, disabled, ...other } = props;
  const { values, setValues, batchList, setBatchlist, error = null } = props;
  const [popup, setPopup] = useState(false);
  const [focus, setFocus] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [records, setRecords] = useState(batchList);
  const [formData, setFormData] = useState({});

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
    {
      fn: (r) => r,
    }
  );
  const saviour = useRef(Array(records.length).fill(createRef()));
  console.log(records);
  function validate(feildValue = values) {
    let x = true;
    // if (Number(feildValue.qty) > Number(getTotalStock())) {
    //   x = false;
    //   setNotify({
    //     isOpen: true,
    //     message: "surplus stock selected",
    //     type: "warning",
    //   });
    // } else x = true;

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
    console.log(feildValue.qty, getTotalStock());
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
  function getTotalSell() {
    console.log(records);
    let count = 0;
    records.map((item) => {
      count += Number(item.sell);
    });
    return count;
  }
  function getTotalStock() {
    console.log(records);
    let count = 0;
    records.map((item) => {
      count += Number(item.qty);
    });
    return count;
  }

  // async function getStock(y = false) {
  //   const useBatch = JSON.parse(
  //     localStorage.getItem("adm_softwareSettings")
  //   ).userBatchNo;
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}&prodCode=${values.prodCode}&vouNo=${values.vouNo}&useBatch=${useBatch}&branchCode=${user.defaultBranchCode}&yearCode=${user.defaultYearCode}`;
  //   let data = records;
  //   console.log(batchList, records);
  //   const url = Config().batch + query;

  //   const handleErr = (err) => {
  //     setNotify(NotifyMsg(4));
  //     console.error(err);
  //     loading && setLoading(false);
  //   };

  //   const handleRes = (res) => {
  //     let data = res.data.stock;
  //     let arr = data.map((item) => ({ ...item, sell: "0" }));
  //     console.log(integrate(), arr, data);
  //     if (integrate()) {
  //       console.log("hi", arr);
  //       arr.length !== 0 && setRecords(arr);
  //       convertRecordsToFormData(arr);
  //       return autoCalcStock(arr);
  //     } else {
  //       let total = 0;
  //       console.log(arr);
  //       batchList.map((item) => {
  //         total += Number(item.sell);
  //         arr.map((a, i) => {
  //           console.log(item, a, item.batchNo == a.batchNo);
  //           if (item.batchNo == a.batchNo) {
  //             arr[i].sell = item.sell;
  //           }
  //         });
  //       });
  //       console.log(arr);
  //       arr.length !== 0 && setRecords(arr);
  //       convertRecordsToFormData(arr);
  //       console.log(records, batchList, total, values.qty);
  //       Number(total) !== Number(values.qty) ? autoCalcStock(arr) : batchList;
  //     }
  //   };

  //   roleService.axiosGet(url, handleRes, handleErr, () => {});
  //   return data;
  // }
  async function getStock() {
    console.log("getting stock");
    try {
      const useBatch = AuthHandler.getSettings().userBatchNo;
      const user = AuthHandler.getUser();
      const query = `&prodCode=${values.prodCode}&vouNo=${values.vouNo}&useBatch=${useBatch}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;
      console.log(batchList, records);
      const url = Config().batch + query;

      // Wrap the axios request in a Promise
      return new Promise((resolve, reject) => {
        const handleErr = (err) => {
          setNotify(NotifyMsg(4));
          console.error(err);
          reject(err); // Reject the Promise with the error
        };
        const handleRes = (res) => {
          let data = res.data.stock;
          console.log(res.data);
          let arr = data.map((item) => ({ ...item, sell: "0" }));
          console.log(integrate(), arr, data);
          if (arr.length !== 0) {
            if (integrate()) {
              //all sell:0
              console.log("hi", arr);
              // arr.length !== 0 && setRecords(arr);
              // convertRecordsToFormData(arr);
              console.log("autoCalcResult", arr);
              resolve(autoCalcStock(arr)); // Resolve the Promise with the autoCalcStock result
            } else {
              let total = 0;
              batchList.map((item) => {
                total += Number(item.sell);
                arr.map((a, i) => {
                  if (item.batchNo == a.batchNo) {
                    arr[i].sell = item.sell;
                  }
                });
              });
              // arr.length !== 0 && setRecords(arr);
              // convertRecordsToFormData(arr);
              console.log(records, batchList, total, values.qty);
              // return autoCalcStock(arr);
              console.log(
                "autoCalcResult",
                Number(total) !== Number(values.qty)
                  ? autoCalcStock(arr)
                  : batchList
              );
              // resolve(
              //   Number(total) !== Number(values.qty)
              //     ? autoCalcStock(arr)
              //     : batchList
              // );
              // Resolve the Promise with the result of the conditional

              resolve(autoCalcStock(arr)); // Resolve the Promise with the result of the conditional
            }
          } else {
            resolve(batchList);
            setNotify({
              isOpen: true,
              message: `NULL stock `,
              type: "warning",
            });
          }
        };

        roleService.axiosGet(url, handleRes, handleErr, () => {});
      });
    } catch (err) {
      console.error(err);
      setNotify(NotifyMsg(5));
      return records;
    }
  }

  function handleChange(e, i) {
    // const newArr = records;
    // const newObj = { ...records[i], sell: e.target.value };
    // newArr[i] = newObj;
    // newArr.map((item, index) => {
    //   if (index == i) {
    //     newArr[i].sell = e.target.value;
    //   }
    // });
    // console.log("hi", newArr);
    // setRecords(newArr);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(saviour);
    convertFormDataToRecords({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  console.log(formData);
  function isFormDataEqualToRecords() {
    let x = true;
    records.map((item) => {
      if (item.sell !== formData[item.batchNo]) x = false;
    });
    return x;
  }
  function convertFormDataToRecords(frmData = formData) {
    const updatedRecords = records.map((record) => ({
      ...record,
      sell: frmData[record.batchNo] ?? "",
    }));
    console.log(updatedRecords);
    setRecords(updatedRecords);
  }
  function convertRecordsToFormData(rcrds = records) {
    console.log(rcrds);
    const prevFormData = rcrds.reduce((acc, record) => {
      acc[record.batchNo] = record.sell;
      return acc;
    }, {});
    setFormData(prevFormData);
    console.log(prevFormData);
  }

  // useEffect(() => {
  //   !isFormDataEqualToRecords() && convertFormDataToRecords();
  // }, [formData]);
  function autoCalcStock(recrds = records) {
    //distribute values.qty among records[i].qty
    console.log(recrds, batchList);
    if (Number(values.qty) >= 0 && Number(recrds[0].qty >= 0)) {
      let final = Number(values.qty);
      let newArr = recrds;
      recrds.map((item, i) => {
        if (final < item.qty && final !== 0) {
          newArr[i] = { ...recrds[i], sell: final };
          final = 0;
        } else if (final !== 0) {
          newArr[i] = { ...recrds[i], sell: item.qty };
          final = final - Number(item.qty);
        } else if (final == 0) {
          newArr[i] = { ...newArr[i], sell: 0 };
        }
      });
      console.log(newArr);
      setRecords(newArr);
      convertRecordsToFormData(newArr);
      return newArr;
    } else {
      return null;
    }
  }
  // if (validate()) {
  //   console.log(records);
  //   setBatchlist(records);
  // getStock(false, batchList);

  // useEffect(() => {
  //   let x = true;
  //   if (popup) {
  //     records.map((item) => {
  //       if (Number(item.sell) > 0 && Number(item.qty) !== 0) x = false;
  //     });
  //     if (x) calcStock();
  //   } else {
  //     let total = 0;
  //     let stock = 0;
  //     records.map((item) => {
  //       total += Number(item.sell);
  //       stock += Number(item.qty);
  //     });

  //     if (total !== Number(values.qty) && stock >= Number(values.qty)) {
  //       console.log("hi");
  //       calcStock();
  //     }
  //     if (stock < Number(values.qty)) {
  //       setNotify({
  //         isOpen: true,
  //         message: "not enough stock",
  //         type: "warning",
  //       });
  //     }
  //     console.log(stock, Number(values.qty));
  //   }
  // }, [records]);
  // useEffect(() => {
  //   let x = true;
  //   records.map((item) => {
  //     if (Number(item.sell) > 0 && Number(item.qty) !== 0) x = false;
  //   });
  //   console.log(x, popup);
  //   if (!x && !popup) {
  //     if (batchList.length !== records.length) {
  //       console.log("setBatchlist=>", records);
  //       setBatchlist(records);
  //     } else {
  //       let y = true;
  //       records.map((r) => {
  //         batchList.map((b) => {
  //           if (Number(b.sell) !== Number(r.sell)) y = false;
  //         });
  //       });
  //       if (!y) {
  //         setBatchlist(records);
  //         console.log("setBatchlist=>", records);
  //       }
  //     }
  //   }
  // }, [records]);
  async function calcAuto() {
    try {
      const result = await getStock();
      console.log(result);
      validate() && setBatchlist(result);
    } catch (error) {
      console.error(error);
    }
  }
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
              console.log(values.prodCode, Number(values.qty), getTotalSell());
              if (values.prodCode && Number(values.qty) !== getTotalSell()) {
                calcAuto();
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
                getStock();
                // autoCalcStock();
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
                            value={formData[item.batchNo]}
                            // ref={saviour[i]}
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
                            Number(values.qty) !== Number(getTotalSell())
                              ? "red"
                              : "green",
                        }}
                      >
                        {getTotalSell()}
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
                onClick={async () => {
                  await setValues({ ...values, qty: getTotalSell() });
                  console.log(records, values);
                  if (validate({ ...values, qty: getTotalSell() })) {
                    console.log(records, values);
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
