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
import BasicSelect from "../../../Usermaster/basicselect";
import UnusedAutosuggest from "../../../../components/unusedautosuggest";

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
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const {
    records,
    setRecords,
    values,
    setValues,
    initialValues,
    initialFilterValues,
    setNotify,
    unitNames,
    prodCompanyNames,
    prodTypesNames,
  } = props;
  const [input, setInput] = useState(values);
  const [errors, setErrors] = useState(initialFilterValues);
  console.log(values, records);
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

    setErrors({
      ...temp,
    });

    if (fieldValues == input) return Object.values(temp).every((x) => x == "");
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
        if (item.prodCode == input.prodCode && input.prodCode !== "X X X X") {
          x = false;
        }
      });
      if (x) {
        console.log(input);
        setRecords([...records, input]);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .post(
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
            setNotify({
              isOpen: true,
              message: "item updated  successfully",
              type: "success",
            });
            setRecords([...records, response.data.values]);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        //   roleService.updateuser(input);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
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
            const newrecord = records.filter((item) => {
              return item.prodCode !== input.prodCode;
            });
            console.log(newrecord);
            setRecords([...newrecord, input]);

            setNotify({
              isOpen: true,
              message: "item updated  successfully",
              type: "success",
            });
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
  };
  return (
    <Form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Controls.Input
            name="prodCode"
            label="Product Code"
            value={input.prodCode}
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
          <UnusedAutosuggest
            name="itemType"
            label="Item Type"
            value={input}
            setValue={setInput}
            options={prodTypesNames}
            error={errors.itemType}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <UnusedAutosuggest
            name="prodCompany"
            label="Company Name"
            value={input}
            setValue={setInput}
            options={prodCompanyNames}
            error={errors.prodCompany}
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
            justifyContent: "center",
            paddingTop: "50px",
          }}
        >
          <Controls.Button text="Reset" color="default" onClick={handleReset} />
          <Controls.Button type="submit" text="Submit" />
        </Grid>
      </Grid>
    </Form>
  );
}
