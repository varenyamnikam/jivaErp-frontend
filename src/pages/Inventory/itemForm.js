import React, { useEffect, useMemo, useState } from "react";
import AuthHandler from "../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../Utils/Config";
import Controls from "../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import StaticDatePickerLandscape from "../../components/calendarLandscape";
import useTable from "../../components/useTable";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";
import Calculate from "../../components/calculate";
import SmartAutoSuggest from "../../components/smartAutoSuggest";
import Popup from "../../components/Popup";
import Percent from "../../components/percentageNew";
import Grouped from "../../components/batchStock";
import Notification from "../../components/Notification";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Lottie from "react-lottie";
import rupee from "../../components/lotties/105335-rupee-coin.json";
import ProductAutoSuggest from "../../components/productAutoSuggest.js";
import MenuPopupState from "../../components/checkBoxMenu";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DoneIcon from "@mui/icons-material/Done";
import Divider from "@mui/material/Divider";
import "../../components/arrows.css";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
  TableFooter,
  Table,
  getVouNo,
} from "@material-ui/core";
import Validate from "./validateItem";
import * as roleService from "../../services/roleService";
import { NotifyMsg } from "../../components/notificationMsg";

let initialHeadCells = [
  { id: "Product", label: "Product" },
  { id: "Quantity", label: "Quantity" },
  { id: "Rate", label: "Rate" },
  { id: "AMOUNT", label: "AMOUNT" },
  { id: "Discount", label: "Discount" },
  { id: "GST", label: "G.S.T" },
  { id: "CESS", label: "CESS" },
  { id: "Item Total", label: "Item Total" },
  { id: "Delete", label: "Delete" },
];

const initialPause = { rate: true, itemAmount: true };
const useStyles = makeStyles((theme) => ({
  inputRoot: {
    paddingLeft: "5px",
  },
  next: { backgroundColor: theme.palette.primary.light },
  input: { display: "flex", alignItems: "center" },
}));
const useStylesContainer = makeStyles((theme) => ({
  root: {
    height: "60%",
  },
}));
export default function GeneralItemForm(props) {
  const {
    itemList,
    setItemList,
    records,
    products,
    prodOptions,
    initialVouItem,
    input,
    setCommon,
    common,
    setTabValue,
    adress,
    handleSubmit,
    item,
    setItem,
    setInput,
    getVouNo,
  } = props;
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const validateValues = { ...initialVouItem, vouNo: "", expDate: "" };
  const initialSettings = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  );
  const company = JSON.parse(localStorage.getItem("company"));
  const [batchList, setBatchlist] = useState(getBatchlist());
  const [errors, setErrors] = useState(validateValues);
  const [headCells, setHeadCells] = useState(initialHeadCells);
  const [disabled1, setDisabled1] = useState(false);
  const [isPaused, setIsPaused] = useState(initialPause);
  const [settings, setSettings] = useState(initialSettings);
  console.log(settings, input);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.prodCode !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  });
  const [popup, setPopup] = useState(false);
  let useBatch = JSON.parse(
    localStorage.getItem("adm_softwareSettings")
  ).userBatchNo;
  if (input.docCode == "PR") useBatch = "NO";
  //no batch while purchasing
  const pause = {
    loop: false,
    autoplay: true,
    animationData: rupee,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const play = {
    loop: false,
    autoplay: false,
    animationData: rupee,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const classes = useStyles();
  const { totalBeforeDs, totalAfterDs, Final } = Calculate(
    item,
    "qty",
    "rate",
    "qr",
    "discount",
    "dqr",
    "cgst",
    "sgst",
    "igst",
    "cess"
  );
  const token = AuthHandler.getLoginToken();
  const user = JSON.parse(localStorage.getItem("user"));
  const query = `&prodCode=${item.prodCode}&vouNo=${item.vouNo}&useBatch=${useBatch}&branchCode=${user.currentBranchCode}&yearCode=${user.currentYearCode}`;
  const url = Config.batch + query;
  console.log(totalBeforeDs(), totalAfterDs());
  if (totalBeforeDs()) {
    console.log(item, totalBeforeDs());
    setItem({ ...item, qr: totalBeforeDs() });
  }
  if (totalAfterDs()) {
    console.log(item, totalAfterDs());
    setItem({ ...item, dqr: totalAfterDs() });
  }
  if (parseFloat(Final()).toFixed(2) !== item.itemAmount) {
    setItem({ ...item, itemAmount: parseFloat(Final()).toFixed(2) });
  }
  const generalAccName = common.accounts
    .filter((item) => item.preFix == "G")
    .map((item) => item.acName);
  const newNo = Number(itemList[itemList.length - 1].vouSrNo) + 1;
  let y = "";
  products.map((item) => {
    if (item.prodCode == item.prodCode) {
      y = item.UOM;
    }
  });
  function getProdName(code) {
    let temp = "";
    products.map((item) => {
      if (item.prodCode == code) {
        temp = item.prodName;
      }
    });
    return temp;
  }
  if (item.prodCode && headCells[1].label !== `Quantity (${y})`)
    setHeadCells(function () {
      return headCells.map((item) => {
        if (item.label == "Quantity") {
          return { id: `Quantity`, label: `Quantity (${y})` };
        } else {
          return item;
        }
      });
    });
  function getBatchlist() {
    if ("batchList" in item) {
      console.log(item);
      return item.batchList;
    } else {
      console.log(item);
      return [{ batchNo: 0, qty: 0, sell: 0 }];
    }
  }
  function checkDuplicateItem() {
    let isEditing = true;
    let found = itemList.find((x) => x.prodCode == item.prodCode);
    if (found) {
      isEditing = item.vouSrNo == found.vouSrNo;

      !isEditing &&
        setNotify({
          isOpen: true,
          message: "Product Already exists",
          type: "warning",
        });
    }
    return !found || isEditing;
  }
  let x = 0;
  itemList.map((item) => {
    x = Number(x) + Number(item.itemAmount);
  });
  const amt = x;
  if (amt.toFixed(2) !== input.itemTotal) {
    setInput({ ...input, itemTotal: amt.toFixed(2) });
  }
  let k =
    Number(input.itemTotal) + Number(input.fright) - Number(input.billDis);

  if (Number(input.netAmount) !== Math.round(k)) {
    setInput({ ...input, netAmount: Math.round(k) });
  }
  console.log(batchList, itemList);
  if (
    Number(input.roundOff).toFixed(2) !==
    (k.toFixed(2) - Math.round(k)).toFixed(2)
  ) {
    setInput({ ...input, roundOff: (k.toFixed(2) - Math.round(k)).toFixed(2) });
  }

  function rnd(no) {
    return Number(no)
      .toFixed(2)
      .replace(/(\.0+|0+)$/, "");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setItem({
      ...item,
      [name]: value,
    });
  };
  function isPurchase() {
    if (
      input.docCode == "PO" ||
      input.docCode == "GR" ||
      input.docCode == "PV" ||
      input.docCode == "PR" ||
      input.docCode == "CN" ||
      input.docCode == "DN"
    )
      return true;
    else return false;
  }

  console.log(isPurchase(), company.gstRegType == "Regular", company);
  adjustFormHeadCells(company.gstRegType !== "Regular" && !isPurchase(), "GST");
  adjustFormHeadCells(initialSettings.useCessitem == "NO", "CESS");

  function adjustFormHeadCells(condition, _id) {
    if (condition) {
      let found = headCells.find((item) => item.id == _id);
      if (found) {
        let arr = headCells.filter((item) => item.id !== _id);
        console.log(arr);
        setHeadCells(arr);
      }
    } else {
      let found = headCells.find((item) => item.id == _id);
      if (!found) {
        setHeadCells(initialHeadCells);
      }
    }
  }

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(itemList, headCells, filterFn);
  if (itemList.length == 1 && itemList[0].vouSrNo == 0 && item.vouSrNo !== 1)
    setItem({
      ...item,
      vouSrNo: 1,
    });
  const handleItemSubmit = (e) => {
    setPopup(false);
    e.preventDefault();
    let x = true;
    itemList.map((ite) => {
      if (ite.vouSrNo == item.vouSrNo && ite.vouNo == item.vouNo) {
        console.log(ite, item);
        x = false;
      }
    });
    console.log(item, itemList, newNo, x);
    const promise = new Promise((resolve, reject) => {
      let stockNotReduced = true;
      const vouItem = {
        ...item,
        vouSrNo: newNo,
        vouNo: input.vouNo,
        batchList: batchList,
      };
      console.log(vouItem);
      if (
        (settings.saleStockUpdateUsing == "DC"
          ? input.docCode == "DC"
          : input.docCode == "SI") ||
        input.docCode == "PR"
      )
        roleService.axiosPost(
          url,
          [vouItem], //array contains only 1 item
          (res) => {
            console.log(res.data);
            const vouItem = res.data.itemList[0];
            stockNotReduced = !vouItem.hasStockReduced;
            if (stockNotReduced) {
              resolve(stockNotReduced);
            } else {
              resolve(false);
              useBatch == "Yes"
                ? setNotify(NotifyMsg(9))
                : setNotify({
                    isOpen: true,
                    message: `Not enough Stock for ${vouItem.prodName} available qty: ${vouItem.availableStock}`,
                    type: "warning",
                  });

              //notify insufficient stock
            }
          },
          (err) => {
            console.log(err);
            setNotify(NotifyMsg(4));
            reject(err);
          }
        );
      else resolve(true);
    });
    promise
      .then((stockNotReduced) => {
        console.log(stockNotReduced);
        if (stockNotReduced)
          if (x) {
            setItemList([
              ...itemList,
              {
                ...item,
                vouSrNo: newNo,
                vouNo: input.vouNo,
                batchList: batchList,
              },
            ]);
            console.log([
              ...itemList,
              {
                ...item,
                vouSrNo: newNo,
                vouNo: input.vouNo,
                batchList: batchList,
              },
            ]);
            setItem({
              ...initialVouItem,
              vouNo: input.vouNo,
            });
          } else {
            const updatedRecords = itemList.map((ite) =>
              ite.vouSrNo == item.vouSrNo
                ? { ...item, batchList: batchList }
                : ite
            );
            setItemList(updatedRecords);
            setItem({
              ...initialVouItem,
              vouNo: input.vouNo,
            });
          }
      })
      .catch((err) => {
        console.log(err);
        setNotify(NotifyMsg(4));
      });
  };
  console.log(item, itemList);
  const classesContainer = useStylesContainer();
  return (
    <>
      <Grid
        container
        spacing={2}
        // style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            name="vouNo"
            label="Voucher No"
            value={getVouNo()}
            onChange={handleChange}
            error={errors.vouNo}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            style={{ width: "100%" }}
            name="docCode"
            label="Doc Code"
            value={input.docCode}
            onChange={handleChange}
            disabled={true}
            // error={errors.docCode}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          className={classes.input}
          style={{ display: "flex", alignItems: "center" }}
        >
          <StaticDatePickerLandscape
            name="vouDate"
            size="small"
            label="Voucher Date"
            value={input}
            setValue={setInput}
            disabled={true}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={classes.input}>
          <Controls.Input
            style={{ width: "100%" }}
            name=""
            label="Party"
            value={input.partyName}
            disabled={true}
            // error={errors.docCode}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Divider
            variant="middle"
            color="blue"
            sx={{ borderBottomWidth: 2 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} className={classes.input}>
          <ProductAutoSuggest
            style={{ borderRadius: "0px" }}
            name1="prodName"
            code1="prodCode"
            name2="prodName"
            code2="prodCode"
            label="Products"
            value={item}
            setValue={setItem}
            itemList={itemList}
            options1={prodOptions}
            options2={products}
            error={errors.prodCode}
            input={input}
            adress={adress}
          />
        </Grid>
        {settings.itemDescription == "Yes" && (
          <Grid item xs={12} sm={3} className={classes.item}>
            <Controls.Input
              name="description"
              label="Description"
              value={item.description}
              onChange={handleChange}
              error={errors.description}
            />
          </Grid>
        )}
        {input.docCode !== "DC" &&
          input.docCode !== "SO" &&
          input.docCode !== "SI" &&
          settings.userBatchNo == "Yes" && (
            <>
              <Grid item xs={12} sm={2} className={classes.input}>
                <Controls.Input
                  name="batchNo"
                  label="Batch No"
                  value={item.batchNo}
                  onChange={handleChange}
                  error={errors.batchNo}
                />
              </Grid>
              <Grid item xs={12} sm={2} style={{}}>
                <StaticDatePickerLandscape
                  name="expDate"
                  label="Expiry Date"
                  value={item}
                  setValue={setItem}
                />
              </Grid>
            </>
          )}
        {settings.useSerialNo == "Yes" && (
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="serialNo"
              label="Serial No"
              value={item.serialNo}
              onChange={handleChange}
              error={errors.serialNo}
            />
          </Grid>
        )}
        {(input.docCode == "DC" ||
          input.docCode == "SI" ||
          input.docCode == "SO") &&
        settings.userBatchNo == "Yes" ? (
          <Grid item xs={12} sm={2} className={classes.input}>
            <Grouped
              values={item}
              setValues={setItem}
              batchList={batchList}
              setBatchlist={setBatchlist}
              error={errors.qty}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={2} className={classes.input}>
            <Controls.Input
              name="qty"
              label="Quantity"
              value={item.qty}
              onChange={handleChange}
              error={errors.qty}
            />{" "}
          </Grid>
        )}
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="rate"
            label="Rate"
            value={item.rate}
            onChange={handleChange}
            error={errors.rate}
            onFocus={() => {
              setIsPaused((prev) => ({ ...prev, rate: false }));
            }}
            onBlur={() => {
              setIsPaused((prev) => ({ ...prev, rate: true }));
            }}
            classname={classes.root}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lottie
                    options={play}
                    height={60}
                    width={30}
                    isStopped={isPaused.rate}
                  />
                </InputAdornment>
              ),
              classes: { root: classes.inputRoot },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Percent
            name1="discount"
            name2="disPer"
            name3="qr"
            label="Discount"
            value={item}
            setValue={setItem}
            onChange={handleChange}
            error={errors.discount}
          />
        </Grid>
        {(isPurchase() || company.gstRegType == "Regular") && (
          <>
            <Grid item xs={12} sm={2} className={classes.input}>
              <Percent
                name1="cgst"
                name2="cgstP"
                disabled={true}
                name3="dqr"
                label="C-GST"
                value={item}
                setValue={setItem}
                onChange={handleChange}
                error={errors.cgst}
              />
            </Grid>
            <Grid item xs={12} sm={2} className={classes.input}>
              <Percent
                name1="sgst"
                name2="sgstP"
                disabled={true}
                name3="dqr"
                label="S-GST"
                value={item}
                setValue={setItem}
                onChange={handleChange}
                error={errors.sgst}
              />
            </Grid>
            <Grid item xs={12} sm={2} className={classes.input}>
              <Percent
                name1="igst"
                name2="igstP"
                disabled={true}
                name3="dqr"
                label="I-GST"
                value={item}
                setValue={setItem}
                onChange={handleChange}
                error={errors.igst}
              />
            </Grid>
          </>
        )}
        {settings.useCessitem == "Yes" && (
          <Grid item xs={12} sm={2} className={classes.input}>
            <Percent
              name1="cess"
              name2="cessP"
              name3="dqr"
              disabled={true}
              label="CESS"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.cess}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="itemAmount"
            label="Item Amount"
            value={item.itemAmount}
            onChange={handleChange}
            error={errors.itemAmount}
            onFocus={() => {
              setIsPaused((prev) => ({ ...prev, itemAmount: false }));
            }}
            onBlur={() => {
              setIsPaused((prev) => ({ ...prev, itemAmount: true }));
            }}
            classname={classes.root}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lottie
                    options={play}
                    height={60}
                    width={30}
                    isStopped={isPaused.itemAmount}
                  />
                </InputAdornment>
              ),
              classes: { root: classes.inputRoot },
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm="auto"
          className={classes.input}
          style={{ display: "flex", justifyContent: "flex-end", flexGrow: "1" }}
        >
          {" "}
          <Controls.Button
            text="Add"
            variant="outlined"
            startIcon={<AddIcon />}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            onClick={(e) => {
              console.log(
                Validate(item, errors, setErrors, settings, input),
                checkDuplicateItem()
              );
              if (
                Validate(item, errors, setErrors, settings, input) &&
                checkDuplicateItem()
              ) {
                handleItemSubmit(e);
              }
            }}
          />
        </Grid>
      </Grid>
      <Grid container className={classesContainer.root} spacing={2}>
        <Grid Item style={{ marginBottom: "20px" }} xs={12} sm={12}>
          <TableContainer sx={{ minHeight: 500 }}>
            <TblContainer>
              <Table sx={{ minHeight: 500 }}>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{getProdName(item.prodCode)}</TableCell>
                      <TableCell align="right">{item.qty}</TableCell>
                      <TableCell align="right">{item.rate}</TableCell>
                      <TableCell align="right"> {Number(item.qr)}</TableCell>
                      <TableCell align="right">
                        {rnd(Number(item.discount))} ({rnd(item.disPer)}%)
                      </TableCell>
                      {(isPurchase() || company.gstRegType == "Regular") && (
                        <TableCell align="right">
                          {" "}
                          {rnd(
                            Number(item.cgst) +
                              Number(item.sgst) +
                              Number(item.igst)
                          )}
                          (
                          {rnd(
                            Number(item.cgstP) +
                              Number(item.sgstP) +
                              Number(item.igstP)
                          )}
                          %)
                        </TableCell>
                      )}
                      {initialSettings.useCessitem == "Yes" && (
                        <TableCell align="right">
                          {rnd(item.cess)} ({rnd(item.cessP)}%)
                        </TableCell>
                      )}{" "}
                      <TableCell align="right">{item.itemAmount}</TableCell>
                      <TableCell>
                        <Controls.ActionButton
                          color="primary"
                          onClick={() => {
                            setItem(item);
                            setPopup(true);
                            if (useBatch == "Yes") {
                              setBatchlist(item.batchList);
                              console.log("hii", item);
                            }
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </Controls.ActionButton>
                        <Controls.ActionButton
                          color="secondary"
                          onClick={() => {
                            const arr = itemList.filter(
                              (ite) => ite.vouSrNo !== item.vouSrNo
                            );
                            if (arr.length !== 0) setItemList(arr);
                            else {
                              setItemList([initialVouItem]);
                            }
                          }}
                        >
                          <DeleteIconOutline fontSize="small" />
                        </Controls.ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={headCells.length - 2}>
                      Total Amount
                    </TableCell>
                    <TableCell colSpan={2}>{Number(input.itemTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TblContainer>
          </TableContainer>
        </Grid>{" "}
        <Grid item xs={12} sm={3} className={classes.input}>
          <Percent
            name1="billDis"
            name2="billDisPer"
            name3="itemTotal"
            label="Discount"
            value={input}
            setValue={setInput}
            onChange={(e) => {
              setInput({
                ...input,
                [e.target.name]: e.target.value,
              });
            }}
            error={errors.billDis}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="roundOff"
            label="Round Off"
            value={input.roundOff}
            onChange={() => {}}
            error={errors.roundOff}
          />
        </Grid>
        <Grid item xs={12} sm={5} className={classes.input}>
          <SmartAutoSuggest
            name1="agentName"
            code1="agentCode"
            name2="acName"
            code2="acCode"
            label="Payment Through"
            value={input}
            setValue={setInput}
            options1={generalAccName}
            options2={common.accounts}
            error={errors.agentName}
            style={{ height: "40px" }}
          />
        </Grid>
        <Grid item xs={12} sm={2} className={classes.input}>
          <Controls.Input
            name="netAmount"
            label="Net Amount"
            value={input.netAmount}
            onChange={() => {}}
            error={errors.netAmount}
            onFocus={() => {
              setIsPaused((prev) => ({ ...prev, netAmount: false }));
            }}
            onBlur={() => {
              setIsPaused((prev) => ({ ...prev, netAmount: true }));
            }}
            classname={classes.root}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lottie
                    options={play}
                    height={60}
                    width={30}
                    isStopped={isPaused.netAmount}
                  />
                </InputAdornment>
              ),
              classes: { root: classes.inputRoot },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} className={classes.input}>
          <button
            class="button"
            onClick={() => {
              setTabValue("1");
            }}
          >
            <span>Prev</span>
          </button>{" "}
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          className={classes.input}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            class="buttonSave"
            onClick={() => {
              setTabValue("1");
            }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",

              backgroundColor: "rgb(116, 100, 100)",
            }}
          >
            <LocalPrintshopIcon htmlColor="white" />
            <span>Submit & Print</span>
          </button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          className={classes.input}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            class="buttonSave"
            onClick={() => {
              setTabValue("1");

              handleSubmit(input, itemList);
            }}
            style={{
              backgroundColor: "blue",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DoneIcon htmlColor="white" style={{ marginRight: "20px" }} />
            <span>Submit</span>
          </button>
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
// <Grid item xs={12} sm="auto" className={classes.input}>
// <MenuPopupState setValues={setSettings} />
// </Grid>
