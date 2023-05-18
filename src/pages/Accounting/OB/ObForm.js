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
import { NotifyMsg } from "../../../components/notificationMsg";
import * as roleService from "../../../services/roleService";

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

const useStyles = makeStyles((theme) => ({
  // bankValues: { minWidth: "200px", flexGrow: 1 },
}));

export default function AcForm(props) {
  const {
    records,
    setRecords,
    itemList,
    setItemList,
    accounts,
    bankValues,
    setBankValues,
    initialValues,
    setButtonPopup,

    vouItems,
    notify,
    setNotify,
  } = props;
  let headcells =
    bankValues.docCode == "JV"
      ? [
          { id: "acName", label: "acName" },
          { id: "Credit", label: "Credit" },
          { id: "Debit", label: "Debit" },
          { id: "Edit", label: "Edit" },
        ]
      : [
          { id: "BankName", label: "BankName" },
          { id: "acName", label: "acName" },
          { id: "Credit", label: "Credit" },
          { id: "Debit", label: "Debit" },
          { id: "Edit", label: "Edit" },
        ];

  const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  console.log(settings);
  const [errors, setErrors] = useState({});
  const [headCells, setHeadCells] = useState(headcells);
  const [disabled1, setDisabled1] = useState(false);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      let newRecords = items.filter((item) => item.vouNo);
      return newRecords;
    },
  });
  const [popup, setPopup] = useState(false);
  const [otherValues, setOtherValues] = useState(initialValues);
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(itemList, headcells, filterFn);

  const banks = accounts.filter((item) => item.preFix !== "G");
  const others = accounts.filter((item) => item.preFix !== "G");

  const bankOptions = accounts.map((item) => item.acName);

  console.log(bankValues, otherValues);
  const token = AuthHandler.getLoginToken();
  let y = true;
  records.map((item) => {
    if (item.vouNo == bankValues.vouNo) {
      console.log(item);
      y = false;
    }
  });

  function getVouNo() {
    if (y) {
      return " NEW ";
    } else {
      return bankValues.vouNo;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setBankValues({
      ...bankValues,
      [name]: value,
    });
  };
  const handleOtherChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setOtherValues({
      ...otherValues,
      [name]: value,
    });
  };

  const user = AuthHandler.getUser();
  if (
    !bankValues.vouNo.includes(
      user.currentBranchCode + initialValues.docCode + user.defaultYearCode
    )
  )
    setBankValues({
      ...bankValues,
      vouNo:
        user.currentBranchCode + initialValues.docCode + user.defaultYearCode,
    });
  if (
    !otherValues.vouNo.includes(
      user.currentBranchCode + initialValues.docCode + user.defaultYearCode
    )
  )
    setOtherValues({
      ...otherValues,
      vouNo:
        user.currentBranchCode + initialValues.docCode + user.defaultYearCode,
    });
  console.log(headcells);

  const handleSubmit = (e) => {
    e.preventDefault();
    let x = true;
    records.map((ite) => {
      if (ite.vouNo == bankValues.vouNo) {
        console.log(ite, bankValues);
        x = false;
      }
    });
    let Fil = [
      {
        ...bankValues,
        acName: "",
      },
    ];

    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.error(err);
    };

    const query = `&yearStart=${user.yearStartDate}`;
    const url = Config.accounting + query;
    if (x) {
      const handleRes = (res) => {
        console.log(res.data.itemList);
        let max = res.data.max;
        let Fil = res.data.itemList;
        // Fil = Fil.filter((item) => item.srNo !== 1);
        console.log(Fil, { ...bankValues, vouNo: max });

        setRecords([...records, ...Fil]);
        setNotify(NotifyMsg(1));
      };
      roleService.axiosPut(
        url,
        {
          values: bankValues,
          itemList: Fil,
        },
        handleRes,
        handleErr,
        () => {
          setButtonPopup(false);
        }
      );
    } else {
      const handleRes = (res) => {
        console.log(res.data.itemList);
        let newArr = records.filter((item) => item.vouNo !== bankValues.vouNo);
        console.log(records, newArr, [...Fil, bankValues]);
        // Fil = Fil.filter((item) => item.srNo !== 1);
        const updatedArr = [...newArr, ...Fil].sort((a, b) =>
          a.vouNo.localeCompare(b.vouNo)
        );
        console.log(updatedArr);
        setRecords(updatedArr);
        setNotify(NotifyMsg(2));
      };
      roleService.axiosPatch(
        url,
        {
          values: bankValues,
          itemList: Fil,
        },
        handleRes,
        handleErr,
        () => {
          setButtonPopup(false);
        }
      );
    }
  };

  return (
    <>
      <Grid
        container
        style={{
          marginTop: "10px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <StaticDatePickerLandscape
              name="vouDate"
              size="small"
              label="Voucher Date"
              value={bankValues}
              setValue={setBankValues}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <SmartAutoSuggest
              name1="acName"
              code1="acCode"
              name2="acName"
              code2="acCode"
              label="Account"
              value={bankValues}
              setValue={setBankValues}
              options1={bankOptions}
              options2={banks}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controls.Input
              name="credit"
              label="credit"
              type="number"
              value={bankValues.credit}
              onChange={handleChange}
              error={errors.credit}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controls.Input
              name="debit"
              label="Debit"
              type="number"
              value={bankValues.debit}
              onChange={handleChange}
              error={errors.debit}
            />
          </Grid>

          <Grid
            item
            sm={6}
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
                setBankValues(vouItems);
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
      </Grid>
    </>
  );
}
// <StaticDatePickerLandscape
// value={bankValues.}
// />
