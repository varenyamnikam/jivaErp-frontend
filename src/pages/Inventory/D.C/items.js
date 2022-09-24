import React, { useEffect, useState } from "react";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import Controls from "../../../components/controls/Controls";
import { Grid } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import StaticDatePickerLandscape from "../../../components/calendarLandscape";
import useTable from "../../../components/useTable";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";
import Calculate from "../../../components/calculate";
import SmartAutoSuggest from "../../../components/smartAutoSuggest";
import DcValues from "./DcValues";
import Popup from "../../../components/Popup";
import Percent from "../../../components/percentageNew";

import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  TableContainer,
} from "@material-ui/core";

const headcells = [
  { id: "Product", label: "Product" },
  { id: "Quantity", label: "Quantity" },
  { id: "Rate", label: "Rate" },
  { id: "AMOUNT", label: "AMOUNT" },
  { id: "Delete", label: "Delete" },
];
const useStyles = makeStyles((theme) => ({
  // item: { minWidth: "200px", flexGrow: 1 },
}));

export default function ItemForm(props) {
  const { itemList, setItemList, records, products, prodOptions } = props;
  const { vouItems } = DcValues();
  const [item, setItem] = useState(vouItems);
  const [errors, setErrors] = useState({});
  const [headCells, setHeadCells] = useState(headcells);
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      let newRecords = items.filter((item) => {
        if (item.prodName !== "") return item;
      });
      console.log(newRecords);
      return newRecords;
    },
  });
  const [popup, setPopup] = useState(false);

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
    "cess",
    "itemAmount"
  );

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

  // console.log("0".toFixed(2));
  function getDisable(vouNo) {
    let x = false;
    records.map((items) => {
      if (items.vouNo == vouNo) {
        console.log(items);
        x = true;
        if (headCells.length == 5)
          setHeadCells(headCells.filter((item) => item.id !== "Delete"));
      }
    });
    return x;
  }
  let y = "";
  products.map((item) => {
    if (item.prodCode == item.prodCode) {
      y = item.UOM;
    }
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setItem({
      ...item,
      [name]: value,
    });
  };
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(itemList, headCells, filterFn);
  console.log(item, itemList);
  if (itemList.length == 1 && itemList[0].vouSrNo == 0 && item.vouSrNo !== 1)
    setItem({
      ...item,
      vouSrNo: 1,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;
    itemList.map((ite) => {
      if (ite.vouSrNo == item.vouSrNo) {
        console.log(ite, item);
        x = false;
      }
    });
    const newNo = itemList[itemList.length - 1].vouSrNo + 1;
    console.log(item, itemList, newNo);
    // if (item.cgst || item.sgst) {
    //   console.log("hi", item.cgst || item.sgst);
    //   setDisabled2(true);
    // }
    // if (!item.cgst || !item.sgst) {
    //   console.log("hi", item.cgst || item.sgst);
    //   setDisabled2(false);
    // }
    // if (item.igst) {
    //   console.log("hi", item.cgst || item.sgst);
    //   setDisabled1(true);
    // }
    // if (!item.igst) {
    //   console.log("hi", item.cgst || item.sgst);
    //   setDisabled1(false);
    // }

    if (x) {
      setItemList([...itemList, { ...item, vouSrNo: newNo }]);
      // setItem((prev) => ({
      //   ...vouItems,
      //   vouSrNo: prev.vouSrNo + 1,
      // }));
      setItem({
        ...vouItems,
        vouSrNo: newNo + 1,
      });
    } else {
      const updatedRecords = itemList.map((ite) =>
        ite.vouSrNo == item.vouSrNo ? item : ite
      );
      setItemList(updatedRecords);
      setItem({
        ...vouItems,
        vouSrNo: newNo,
      });
    }
  };
  function getTax() {
    if (item.cgst || item.sgst) {
      return (
        <>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="cgst"
              name2="cgstP"
              disabled={disabled1}
              name3="dqr"
              label="cgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.cgst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="sgst"
              name2="sgstP"
              disabled={disabled1}
              name3="dqr"
              label="sgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.sgst}
            />
          </Grid>
        </>
      );
    }
    if (item.igst) {
      return (
        <>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="igst"
              name2="igstP"
              disabled={true}
              name3="dqr"
              label="igst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.igst}
            />
          </Grid>
        </>
      );
    }
    if (!item.cgst && !item.sgst && !item.igst) {
      return (
        <>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="cgst"
              name2="cgstP"
              disabled={disabled1}
              name3="dqr"
              label="cgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.cgst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="sgst"
              name2="sgstP"
              disabled={disabled1}
              name3="dqr"
              label="sgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.sgst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="igst"
              name2="igstP"
              disabled={true}
              name3="dqr"
              label="igst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.igst}
            />
          </Grid>
        </>
      );
    }
  }
  return (
    <>
      <Popup
        title="Filter"
        openPopup={popup}
        setOpenPopup={setPopup}
        size="md"
        style={{ paddingRight: "10px" }}
      >
        <Grid container style={{ width: "98%" }} spacing={1}>
          <Grid item xs={12} sm={5} className={classes.input}>
            <SmartAutoSuggest
              name1="prodName"
              code1="prodCode"
              name2="prodName"
              code2="prodCode"
              label="Product"
              value={item}
              setValue={setItem}
              options1={prodOptions}
              options2={products}
              error={errors.prodName}
            />
          </Grid>
          <Grid item xs={12} sm={2} className={classes.item}>
            <Controls.Input
              name="description"
              label="Description"
              value={item.description}
              onChange={handleChange}
              error={errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={2} className={classes.input}>
            <Controls.Input
              name="batchNo"
              label="Batch No"
              value={item.batchNo}
              onChange={handleChange}
              error={errors.batchNo}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <StaticDatePickerLandscape
              name="expDate"
              label="Expiry Date"
              value={item}
              setValue={setItem}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="qty"
              label="Quantity"
              value={item.qty}
              onChange={handleChange}
              error={errors.qty}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="rate"
              label="Rate"
              value={item.rate}
              onChange={handleChange}
              error={errors.rate}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="discount"
              name2="disPer"
              name3="qr"
              label="discount"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.discount}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="cgst"
              name2="cgstP"
              disabled={true}
              name3="dqr"
              label="cgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.cgst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="sgst"
              name2="sgstP"
              disabled={true}
              name3="dqr"
              label="sgst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.sgst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="igst"
              name2="igstP"
              disabled={true}
              name3="dqr"
              label="igst"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.igst}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Percent
              name1="cess"
              name2="cessP"
              name3="dqr"
              disabled={true}
              label="cess"
              value={item}
              setValue={setItem}
              onChange={handleChange}
              error={errors.cess}
            />
          </Grid>
          <Grid item xs={12} sm={3} className={classes.input}>
            <Controls.Input
              name="itemAmount"
              label="Item Amount"
              value={item.itemAmount}
              onChange={handleChange}
              error={errors.itemAmount}
            />
          </Grid>
          <Grid
            item
            sm={12}
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              // marginRight: "10px",
            }}
          >
            <Controls.Button
              type="reset"
              text="Reset"
              color="default"
              onClick={() => {
                setItem(vouItems);
              }}
            />
            <Controls.Button
              type="submit"
              text="Submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            />
          </Grid>
        </Grid>
      </Popup>
      <Grid
        container
        style={{
          marginTop: "10px",
        }}
      >
        <Grid item sm={12} xs={12}>
          <TableContainer>
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPagingAndSorting().map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.prodName}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.rate}</TableCell>
                    <TableCell>{item.itemAmount}</TableCell>

                    {getDisable(item.vouNo) ? (
                      <></>
                    ) : (
                      <TableCell>
                        <Controls.ActionButton
                          color="primary"
                          onClick={() => {
                            setItem(item);
                            setPopup(true);
                          }}
                          disabled={getDisable(item.vouNo)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </Controls.ActionButton>
                        <Controls.ActionButton
                          color="secondary"
                          onClick={() => {
                            setItemList(
                              itemList.filter(
                                (ite) => ite.vouSrNo !== item.vouSrNo
                              )
                            );
                          }}
                          disabled={getDisable(item.vouNo)}
                        >
                          <DeleteIconOutline fontSize="small" />
                        </Controls.ActionButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </TblContainer>
          </TableContainer>
        </Grid>
        <Grid
          item
          sm={12}
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Controls.Button
            text="Add"
            variant="outlined"
            startIcon={<AddIcon />}
            style={{ marginTop: "10px" }}
            onClick={(e) => {
              setPopup(true);
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
// <StaticDatePickerLandscape
// value={values.}
// />
