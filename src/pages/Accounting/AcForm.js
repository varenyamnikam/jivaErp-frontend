import React, { useEffect, useState } from "react";
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
import Divider from "@mui/material/Divider";
import UnusedAutosuggest from "../../components/unusedautosuggest";
import Validate from "./Validate";
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
import { NotifyMsg } from "../../components/notificationMsg";
import * as roleService from "../../services/roleService";

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
    initialFilterValues,
    vouItems,
    notify,
    setNotify,
    setButtonPopup,
  } = props;
  initialValues.narration = "";

  const [otherErrors, setOtherErrors] = useState(initialFilterValues);
  const [disabled1, setDisabled1] = useState(false);
  const [errors, setErrors] = useState(initialFilterValues);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      let newRecords = items.filter((item) => item.vouNo && item.srNo);
      return newRecords;
    },
  });
  const [otherValues, setOtherValues] = useState(initialValues);

  let headcells = [
    { id: "A/c Name", label: "A/c Name" },
    { id: "Debit", label: "Debit" },
    { id: "Credit", label: "Credit" },
    { id: "Edit", label: "Edit" },
  ];
  console.log(initialValues);
  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterAndSorting,
  } = useTable(itemList, headcells, filterFn);
  console.log(accounts);

  const banks = accounts.filter(
    (item) =>
      item.acGroupCode === (bankValues.docCode[0] == "B" ? "A1016" : "A1018")
  );
  const others = accounts.filter((item) => item.preFix !== "G");

  const bankOptions = banks.map((item) => item.acName);
  const otherOptions = others.map((item) => item.acName);
  console.log(others, otherOptions);

  let y = true;
  records.map((item) => {
    if (item.vouNo == bankValues.vouNo) {
      console.log(item);
      y = false;
    }
  });

  function getVouNo() {
    return y ? " NEW " : bankValues.vouNo;
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
      narration: bankValues.narration,
    });
  };

  const user = AuthHandler.getUser();
  //for new vouNo
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
  console.log(errors);
  console.log(initialValues);
  const query = `?&yearStart=${user.yearStartDate}`;

  const url = Config.accounting + query;

  function finalCalc(obj) {
    let temp = 0;
    if (obj.docCode == "BP" || obj.docCode == "CP") {
      temp = Number(obj.debit) - Number(obj.credit);
      obj.credit = temp;
      obj.debit = 0;
    } else if (obj.docCode == "BR" || obj.docCode == "CR") {
      temp = Number(obj.credit) - Number(obj.debit);
      obj.credit = 0;
      obj.debit = temp;
    } else {
      //for jv no use of bankvalues
      obj.debit = 0;
      obj.credit = 0;
    }
    console.log(obj, obj.docCode);
    return obj;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const handleErr = (err) => {
      setNotify(NotifyMsg(4));
      console.error(err);
    };
    if (Validate(bankValues, errors, setErrors, true, setNotify)) {
      setButtonPopup(false);
      let x = true;
      records.map((ite) => {
        if (ite.vouNo == bankValues.vouNo && ite.vouNo) {
          console.log(ite, bankValues);
          x = false;
        }
      });
      let Fil = itemList.filter((item) => item.vouNo && item.srNo);
      if (bankValues.docCode !== "JV") {
        console.log(Fil);
        Fil = Fil.map((item, i) => {
          return { ...item, srNo: i + 1, vouNo: bankValues.vouNo };
        });
        // bankValues.srNo = 1;
        let obj = finalCalc(bankValues);
        Fil.push(obj);
        console.log(Fil);
      } else {
        console.log(Fil);
        Fil = Fil.map((item, i) => {
          return { ...item, srNo: i + 1, vouNo: bankValues.vouNo };
        });
      }
      const user = JSON.parse(localStorage.getItem("user"));
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
          handleErr
        );
      } else {
        const handleRes = (res) => {
          console.log(res.data.itemList);
          let newArr = records.filter(
            (item) => item.vouNo !== bankValues.vouNo
          );
          console.log(records, newArr, [...Fil, bankValues]);
          // Fil = Fil.filter((item) => item.srNo !== 1);
          setRecords([...newArr, ...Fil]);
          setNotify(NotifyMsg(2));
        };
        roleService.axiosPatch(
          url,
          {
            values: bankValues,
            itemList: Fil,
          },
          handleRes,
          handleErr
        );
      }
      console.log(initialFilterValues);
      setErrors(initialFilterValues);
    }
  };
  function calc(list) {
    let credit = 0;
    let debit = 0;
    let net = 0;
    list.map((item) => {
      if (item.srNo) {
        //dont add bank debit/credit
        credit += Number(item.credit);
        debit += Number(item.debit);
      }
    });
    let obj = { credit: credit, debit: debit };
    return obj;
  }
  console.log(itemList);
  useEffect(() => {
    let obj = calc(itemList);
    let credit = obj.credit;
    let debit = obj.debit;

    if (credit !== bankValues.credit || debit !== bankValues.debit) {
      setBankValues({ ...bankValues, credit: credit, debit: debit });
    }
  }, [itemList]);
  const handleAdd = () => {
    console.log(otherValues);

    console.log(
      Validate(otherValues, otherErrors, setOtherErrors, false, setNotify)
    );
    if (Validate(otherValues, otherErrors, setOtherErrors, false, setNotify)) {
      let x = true;
      itemList.map((ite) => {
        if (ite.srNo == otherValues.srNo && ite.vouNo == otherValues.vouNo) {
          console.log(ite, otherValues);
          x = false;
        }
        ite.narration = bankValues.narration;
      });
      console.log(x);

      if (x) {
        function findMaxSrNo(arr) {
          return arr.reduce((max, obj) => {
            const srNo = parseInt(obj.srNo);
            return srNo > max ? srNo : max;
          }, 0);
        }

        const latest = [
          ...itemList,
          {
            ...otherValues,
            srNo: findMaxSrNo(itemList) + 1,
          },
        ];
        console.log(latest);

        setItemList(latest);
        setOtherValues(initialValues);
      } else {
        const newItemList = itemList.map((ite) => {
          if (ite.srNo == otherValues.srNo && ite.vouNo == otherValues.vouNo) {
            return otherValues;
          } else {
            return ite;
          }
        });
        console.log(newItemList);

        setItemList(newItemList);
        setOtherValues(initialValues);
      }
      console.log(bankValues, itemList, x);
    }
    console.log(initialValues);
  };
  function getName(code) {
    let name = "";
    accounts.map((item) => {
      if (item.acCode == code) name = item.acName;
    });
    return name;
  }
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
            <Controls.Input
              name="vouNo"
              label="Voucher No"
              disabled={true}
              value={getVouNo()}
              onChange={handleChange}
              error={errors.vouNo}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Controls.Input
              name="docCode"
              label="Doc code"
              disabled={true}
              value={bankValues.docCode}
              onChange={handleChange}
              error={errors.docCode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StaticDatePickerLandscape
              name="vouDate"
              size="small"
              label="Voucher Date"
              value={bankValues}
              setValue={setBankValues}
            />
          </Grid>
          {bankValues.docCode !== "JV" && (
            <Grid item xs={12} sm={6}>
              <SmartAutoSuggest
                name1="acName"
                code1="acCode"
                name2="acName"
                code2="acCode"
                label={bankValues.docCode[0] == "B" ? "Bank" : "Cash"}
                value={bankValues}
                setValue={setBankValues}
                options1={bankOptions}
                options2={banks}
                error={errors.acCode}
              />
            </Grid>
          )}
          {bankValues.docCode !== "JV" && (
            <Grid item xs={12} sm={6}>
              <Controls.Input
                name="narration"
                label="Narration"
                value={bankValues.narration}
                onChange={handleChange}
                error={errors.narration}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} style={{ margin: "4px" }}>
            <Divider
              variant="middle"
              color="blue"
              sx={{ borderBottomWidth: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SmartAutoSuggest
              name1="acName"
              code1="acCode"
              name2="acName"
              code2="acCode"
              label="Accounts"
              value={otherValues}
              setValue={setOtherValues}
              options1={otherOptions}
              options2={others}
              error={otherErrors.acCode}
            />
          </Grid>{" "}
          <Grid item xs={12} sm={2}>
            <Controls.Input
              name="debit"
              type="number"
              label="Debit"
              value={otherValues.debit}
              onChange={handleOtherChange}
              error={otherErrors.debit}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Controls.Input
              name="credit"
              label="Credit"
              type="number"
              value={otherValues.credit}
              onChange={handleOtherChange}
              error={otherErrors.credit}
            />
          </Grid>
          <Grid
            item
            sm={2}
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
              size="medium"
              onClick={(e) => {
                handleAdd();
              }}
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <TableContainer>
              <TblContainer>
                <TblHead />
                <TableBody>
                  {recordsAfterPagingAndSorting().map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{getName(item.acCode)}</TableCell>
                      <TableCell>{Number(item.debit)}</TableCell>
                      <TableCell>{Number(item.credit)}</TableCell>

                      <TableCell>
                        <Controls.EditButton
                          handleClick={() => {
                            setOtherValues(item);
                          }}
                        />
                        <Controls.DeleteButton
                          directDelete={() => {
                            const arr = itemList.filter(
                              (ite) => ite.srNo !== item.srNo
                            );
                            if (arr.length !== 0) {
                              setItemList(arr);
                            } else {
                              setItemList([initialValues]);
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TblContainer>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Controls.Input
              name="debit"
              label="Debit"
              value={bankValues.debit}
              onChange={handleChange}
              error={errors.debit}
              disabled={true}
            />
          </Grid>{" "}
          <Grid item xs={12} sm={3}>
            <Controls.Input
              name="credit"
              label="Credit"
              type="number"
              value={bankValues.credit}
              onChange={handleChange}
              error={errors.credit}
              disabled={true}
            />
          </Grid>{" "}
          <Grid
            item
            sm={6}
            xs={6}
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
