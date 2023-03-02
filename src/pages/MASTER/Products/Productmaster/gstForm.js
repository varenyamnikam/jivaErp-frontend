import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../../../components/useForm";
import Controls from "../../../../components/controls/Controls";
import * as roleService from "../../../../services/roleService";
import AuthHandler from "../../../../Utils/AuthHandler";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Config from "../../../../Utils/Config";
import {
  Paper,
  makeStyles,
  Grid,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../../../components/useTable";
import DeleteIconOutline from "@mui/icons-material/DeleteOutline";
import StaticDatePickerLandscape from "../../../../components/calendarLandscape";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const useStyles = makeStyles((theme) => ({
  right: { display: "flex", justifyContent: "flex-end" },
}));
const initialInput = {
  startDate: new Date(),
  cgst: "",
  sgst: "",
  cess: "",
};
const headCells = [
  { id: "Date", label: "Date" },
  { id: "CGST", label: "CGST" },
  { id: "SGST", label: "SGST" },
  { id: "CESS", label: "CESS" },
];
export default function GstForm(props) {
  const { values, setRecords, records, setNotify, setPopup, setValues } = props;
  const [input, setInput] = useState(initialInput);
  const [errors, setErrors] = useState({ cgst: "", sgst: "", cess: "" });
  const [gstTable, setGstTable] = useState(
    values.gst.length == 0 ? [initialInput] : values.gst
  );
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(gstTable, headCells, {
      fn: (item) => item,
    });
  const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("cgst");
    check("sgst");
    check("startDate");
    console.log(gstTable);
    gstTable.map((item) => {
      console.log(
        new Date(item.startDate),
        new Date(),
        new Date(item.startDate).setHours(0, 0, 0, 0) ==
          new Date().setHours(0, 0, 0, 0)
      );
    });

    const duplicateDate = gstTable.find(
      (item) =>
        new Date(item.startDate).setHours(0, 0, 0, 0) ==
          new Date(input.startDate).setHours(0, 0, 0, 0) &&
        Number(item.cgst) !== 0 &&
        Number(item.sgst) !== 0
    );
    console.log(duplicateDate);
    if (duplicateDate) temp.startDate = "This date already exists";
    else {
      temp.startDate = "";
    }
    setErrors(temp);
    return Object.values(temp).every((x) => x == "" || x == null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleSubmit = () => {
    if (validate()) {
      input.cgst = input.cgst;
      input.sgst = input.sgst;
      input.cess = input.cess;
      const updatedTable = [...gstTable, input];

      const arr = updatedTable.filter(
        (item) => item.cgst || item.sgst || item.cess
      );
      const newValue = { ...values, gst: arr };
      let x = true;
      let newrecord = records.map((item) => {
        if (item.prodCode == values.prodCode) x = false;
        return item.prodCode == values.prodCode ? newValue : item;
      });
      if (!x) newrecord.push(newValue);
      console.log(newrecord, arr, newValue);
      setGstTable(updatedTable);
      const msg = {
        isOpen: true,
        message: `gst info. of ${values.prodName} for ${new Date(
          input.startDate
        ).toLocaleDateString()} inserted  `,
        type: "success",
      };
      updateGstInDb(newValue, newrecord, msg);
    }
  };
  const handleDelete = (date) => {
    const updatedTable = gstTable.filter((item) => item.startDate !== date);
    const newValue = { ...values, gst: updatedTable };
    const newrecord = records.map((item) => {
      return item.prodCode == values.prodCode ? newValue : item;
    });
    console.log(newrecord, updatedTable, newValue);
    setRecords(newrecord);
    setGstTable(updatedTable);
    const msg = {
      isOpen: true,
      message: `gst info. of ${values.prodName} for ${new Date(
        date
      ).toLocaleDateString()} deleted  `,
      type: "warning",
    };
    updateGstInDb(newValue, newrecord, msg);
  };
  function updateGstInDb(input, newrecord, msg) {
    const token = AuthHandler.getLoginToken();
    if (values.prodCode == "X X X X") {
      console.log(input, newrecord);
      setValues(input);
      setRecords(newrecord);
      setPopup(false);
    } else {
      axios
        .patch(
          // Config.addUser,
          Config.prodMaster + query,
          { input },
          {
            headers: {
              authorization: "Bearer" + token,
            },
          }
        )
        .then((response) => {
          setPopup(false);
          console.log(newrecord);
          setInput(input);
          setRecords(newrecord);
          setNotify(msg);
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Unable to connect to servers",
            type: "warning",
          });
        });
    }
  }
  console.log(input, gstTable, errors);
  return (
    <>
      {" "}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          {" "}
          <TableContainer>
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPagingAndSorting().map((item, i) => {
                  return (
                    Number(item.cgst) !== 0 &&
                    Number(item.sgst) !== 0 && (
                      <TableRow key={item._id}>
                        {" "}
                        <TableCell>
                          {new Date(item.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.cgst}</TableCell>
                        <TableCell>{item.sgst}</TableCell>
                        <TableCell
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {Number(item.cess)}{" "}
                          <Controls.ActionButton
                            color="secondary"
                            onClick={(e) => {
                              handleDelete(item.startDate);
                            }}
                          >
                            <DeleteIconOutline fontSize="small" />
                          </Controls.ActionButton>
                        </TableCell>
                      </TableRow>
                    )
                  );
                })}
              </TableBody>
            </TblContainer>
          </TableContainer>{" "}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Controls.Input
                name="prodName"
                label="Product"
                value={values.prodName}
                disabled={true}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <StaticDatePickerLandscape
                name="startDate"
                label="Effect Date"
                value={input}
                setValue={setInput}
                error={errors.startDate}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controls.Input
                name="cgst"
                label="CGST"
                value={input.cgst}
                onChange={handleInputChange}
                error={errors.cgst}
                type={"number"}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Controls.Input
                name="sgst"
                label="SGST"
                value={input.sgst}
                onChange={handleInputChange}
                error={errors.sgst}
                type={"number"}
              />
            </Grid>
            {settings.useCessitem == "Yes" && (
              <Grid item xs={12} sm={12}>
                <Controls.Input
                  name="cess"
                  label="Cess"
                  value={input.cess}
                  onChange={handleInputChange}
                  error={errors.cess}
                  type={"number"}
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sm={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Controls.Button
                type="submit"
                text="Submit"
                onClick={handleSubmit}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
