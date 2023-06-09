import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/PageHeader";
import AuthHandler from "../../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../../Utils/Config";
import * as roleService from "../../../../services/roleService";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import useTable from "../../../../components/useTable";
import Controls from "../../../../components/controls/Controls";
import PeopleOutlineTwoTone from "@material-ui/icons/PeopleOutlineTwoTone";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import { RestaurantRounded, Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import Usermasterpopup from "../../../../components/userMasterPopup";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CloseIcon from "@material-ui/icons/Close";
import Notification from "../../../../components/Notification";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import Input from "../../../../components/controls/Input";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "../../../../components/useForm";
import UnusedAutosuggest from "../../../../components/unusedautosuggest";
import { useNavigate } from "react-router-dom";
import SmartAutosuggest from "../../../../components/smartAutoSuggest";
import { NotifyMsg } from "../../../../components/notificationMsg";
const menuRightsItems = [
  { id: "Y", title: "Y" },
  { id: "N", title: "N" },
];
const statusItems = [
  { id: "Active", title: "Active" },
  { id: "Inactive", title: "Inactive" },
];
const defaultYearItems = [
  { id: "2021-22", title: "2021-22" },
  { id: "2022-23", title: "2022-23" },
];
const roleOptions = [
  "  Accounts Users",
  "Administrator",
  "HR Users",
  "Inventory Users",
  "Logistic Users",
  "Marketing User",
  "Processing Users",
  "Production User",
  "Purchase Users",
  "QC Users",
];

export default function Productform(props) {
  let history = useNavigate();

  const {
    records,
    setRecords,
    input,
    setInput,
    initialValues,
    initialFilterValues,
    setNotify,
    setFormPopup,
    unitNames,
    prodCompany,
    prodType,
    setGstPopup,
  } = props;
  const [errors, setErrors] = useState(initialFilterValues);
  console.log(input, records, prodCompany, prodType);
  console.log(errors);
  const validate = (fieldValues = input) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    check("itemType");
    // check("prodCompany");
    check("prodName");
    check("UOM");
    check("maintainStock");
    check("useBatchNo");
    check("prodStatus");
    records.map((item) => {
      if (
        item.prodName == fieldValues.prodName &&
        item.prodCode !== fieldValues.prodCode
      ) {
        temp.prodName = "This name already exists";
      }
    });
    let x = "prodName";
    let y = "prodCode";

    let found = records.find(
      (item) => item[x] == fieldValues[x] && item[y] !== fieldValues[y]
    );
    if (fieldValues[x])
      temp[x] = found ? `${found[x]} already exists at ${found[y]}` : "";

    setErrors({
      ...temp,
    });
    const hasRight = fieldValues[y]
      ? AuthHandler.canEdit()
      : AuthHandler.canAdd();
    if (!hasRight)
      fieldValues[y] ? setNotify(NotifyMsg(7)) : setNotify(NotifyMsg(6));

    if (fieldValues == input)
      return Object.values(temp).every((x) => x == "") && hasRight;
  };
  useEffect(() => {
    if (!Object.values(errors).every((x) => x == "")) validate();
  }, [input]);

  console.log(input);
  console.log(errors);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value + "clicked haha");
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleReset = (e) => {
    console.log(e.target);
    setInput(initialValues);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(input);
    if (validate()) {
      let x = true;
      records.map((item) => {
        if (item.prodCode == input.prodCode && input.prodCode) {
          x = false;
        }
      });
      const url = Config.prodMaster;
      const handleErr = (err) => {
        setNotify(NotifyMsg(4));
        console.error(err);
      };

      if (x) {
        // delete prodTypeName&&procCompany

        const handleRes = (res) => {
          setRecords([...records, res.data.values]);
          let newParty = AuthHandler.getNewParty();
          if (newParty.partyOpen) {
            let newParty = AuthHandler.getNewParty();
            newParty.partyOpen = false;
            AuthHandler.setNewParty(newParty)
            history(newParty.path);
          }
          setFormPopup(false);
          setNotify(NotifyMsg(1));
        };
        roleService.axiosPut(url, input, handleRes, handleErr, () => {});
      } else {
        const handleRes = (res) => {
          const newrecord = records.filter((item) => {
            return item.prodCode !== input.prodCode;
          });
          console.log(newrecord);
          setRecords([...newrecord, input]);
          console.log([...newrecord, input]);
          setFormPopup(false);
          setNotify(NotifyMsg(2));
        };
        roleService.axiosPatch(url, input, handleRes, handleErr);
      }
    }
  };
  const prodTypeOptions = prodType.map((item) => item.prodTypeName);
  const prodCompanyOptions = prodCompany.map((item) => item.prodCompanyName);

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="prodCode"
          label="Product Code"
          value={input.prodCode ? input.prodCode : "N E W"}
          disabled={true}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="prodName"
          label="Product Name"
          value={input.prodName}
          error={errors.prodName}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12} style={{ flexGrow: 1 }}>
        <Controls.Input
          name="barCode"
          label="Bar Code"
          value={input.barCode}
          error={errors.barCode}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12} style={{ paddingRight: "20px" }}>
        <SmartAutosuggest
          name1="prodTypeName"
          code1="prodTypeCode"
          name2="prodTypeName"
          code2="prodTypeCode"
          label="Item Type"
          prodTypeOptions
          value={input}
          setValue={setInput}
          options1={prodTypeOptions}
          options2={prodType}
          error={errors.prodTypeCode}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <SmartAutosuggest
          name1="prodCompanyName"
          code1="prodCompanyCode"
          name2="prodCompanyName"
          code2="prodCompanyCode"
          label="Company"
          value={input}
          setValue={setInput}
          options1={prodCompanyOptions}
          options2={prodCompany}
          error={errors.prodCompanyCode}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="prodDesc"
          label="Description"
          value={input.prodDesc}
          onChange={handleChange}
          error={errors.prodDesc}
        />
      </Grid>
      <Grid item sm={6} xs={12} style={{ flexGrow: 0.5 }}>
        <UnusedAutosuggest
          name="UOM"
          label="U.O.M"
          value={input}
          setValue={setInput}
          options={unitNames}
          error={errors.UOM}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="MRP"
          label="M.R.P"
          value={input.MRP}
          onChange={handleChange}
          error={errors.MRP}
        />
      </Grid>{" "}
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="HSNNo"
          label="HSN No."
          value={input.HSNNo}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.Input
          name="reorderLevel"
          label="Reorder Level"
          value={input.reorderLevel}
          onChange={handleChange}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="maintainStock"
          label="Maintain Stock"
          value={input.maintainStock}
          onChange={handleChange}
          items={menuRightsItems}
          error={errors.maintainStock}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="useBatchNo"
          label="Use Batch No."
          value={input.useBatchNo}
          onChange={handleChange}
          items={menuRightsItems}
          error={errors.useBatchNo}
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Controls.RadioGroup
          name="prodStatus"
          label="Product Status"
          value={input.prodStatus}
          onChange={handleChange}
          items={statusItems}
          error={errors.prodStatus}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "50px",
        }}
      >
        <Controls.Button text="Reset" color="default" onClick={handleReset} />
        <Controls.Button
          type="submit"
          text="G.S.T"
          variant="outlined"
          onClick={() => {
            if (validate()) setGstPopup(true);
          }}
        />
        <Controls.Button type="submit" text="Submit" onClick={handleSubmit} />
      </Grid>
    </Grid>
  );
}
