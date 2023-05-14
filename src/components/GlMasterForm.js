import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { Form } from "./useForm";
import Controls from "./controls/Controls";
import AdvancedSelect from "./advancedBasicSelect";
import ControllableStates from "./selectsearchstate";
import axios from "axios";
import Config from "../Utils/Config";
import AuthHandler from "../Utils/AuthHandler";
import UnusedAutosuggest from "./unusedautosuggest";
const OperateItems = ["CONTROL", "SUB"];
const OperateData = [
  { operateAs: "CONTROL", glOperateAs: "C" },
  { operateAs: "SUB", glOperateAs: "S" },
];
export default function Gimasterform(props) {
  const userCode = localStorage.getItem("userCode");
  const userCompanyCode = localStorage.getItem("userCompanyCode");
  const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;

  const {
    values,
    setValues,
    records,
    setRecords,
    groupTypes,
    statusItems,
    initialFilterValues,
    setNotify,
    setButtonPopup,
  } = props;
  const groupTypeOptions = groupTypes.map((item) => {
    return item.glGroupName;
  });
  const [errors, setErrors] = useState(initialFilterValues);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    Object.keys(temp).map((x) => {
      check(x);
    });
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  useEffect(() => {
    if (!Object.values(errors).every((x) => x == "")) validate();
  }, [values]);

  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(validate(), errors);
    if (validate()) {
      let x = true;
      records.map((item, index) => {
        if (item.glCode == values.glCode) {
          const updatedRecords = records.map((p) =>
            p.glCode === values.glCode ? { ...values, ...values } : p
          );
          console.log(updatedRecords);
          setRecords(updatedRecords);
          x = false;
        }
      });
      console.log(x);
      if (x) {
        console.log(values);
        const token = AuthHandler.getLoginToken();
        const body = { hello: "hello" };
        axios
          .put(
            Config.acgl + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setRecords([...records, response.data.values]);
            setNotify({
              isOpen: true,
              message: response.data.message,
              type: "success",
            });
            setButtonPopup(false);
          })
          .catch((error) => {
            setNotify({
              isOpen: true,
              message: "Unable to connect to servers",
              type: "warning",
            });
          });
      } else {
        const token = AuthHandler.getLoginToken();
        console.log("updated");
        axios
          .patch(
            Config.acgl + query,
            { values },
            {
              headers: {
                authorization: "Bearer" + token,
              },
            }
          )
          .then((response) => {
            console.log("hi....", response.data.values);
            setNotify({
              isOpen: true,
              message: "Account updated  successfully",
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
        setButtonPopup(false);
      }
    }
  }
  // if (values.glOp) {
  //   employeeData.map((item) => {
  //     if ((values.acName == item.acName) & (values.glOperateAs !== item.glOperateAs)) {
  //       setValues({ ...values, glOperateAs: item.glOperateAs });
  //     }
  //   });
  // }
  if (values.operateAs) {
    OperateData.map((item) => {
      if (
        (values.operateAs == item.operateAs) &
        (values.glOperateAs !== item.glOperateAs)
      ) {
        setValues({ ...values, glOperateAs: item.glOperateAs });
      }
    });
  }
  if (!values.operateAs && values.glOperateAs) {
    OperateData.map((item) => {
      if (values.glOperateAs == item.glOperateAs) {
        setValues({ ...values, operateAs: item.operateAs });
      }
    });
  }
  ///////////////code=>name || name=>code///////////////
  if (values.glGroupName) {
    console.log("hi...");
    groupTypes.map((item) => {
      if (
        values.glGroupName == item.glGroupName &&
        values.glGroupCode !== item.glGroupCode &&
        item.glGroupStatus == "Active"
      ) {
        console.log(values.glGroupCode, values.glGroupName);
        setValues({ ...values, glGroupCode: item.glGroupCode });
      }
    });
  }
  if (!values.glGroupName && values.glGroupCode) {
    console.log("hi...");
    groupTypes.map((item) => {
      if (values.glGroupCode == item.glGroupCode) {
        setValues({ ...values, glGroupName: item.glGroupName });
      }
    });
  }
  if (values.glGroupName && values.glGroupCode) {
    console.log("hi...update name");
    groupTypes.map((item) => {
      if (
        values.glGroupCode == item.glGroupCode &&
        values.glGroupName !== item.glGroupName
      ) {
        console.log("hi...update ", item);
        setValues({ ...values, glGroupName: item.glGroupName });
      }
    });
  }

  //////////////////////////////////////////////////////////
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="glCode"
              label="Code"
              value={values.glCode}
              onChange={handleInputChange}
              disabled="true"
              // error={errors.stateCode}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.Input
              name="glName"
              label="Name"
              value={values.glName}
              onChange={handleChange}
              error={errors.glName}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <UnusedAutosuggest
              value={values}
              setValue={setValues}
              name="glGroupName"
              label="Gl Group"
              options={groupTypeOptions}
              error={errors.glGroupName}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <UnusedAutosuggest
              value={values}
              setValue={setValues}
              name="operateAs"
              label="Operate As"
              options={OperateItems}
              error={errors.operateAs}
            />{" "}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controls.RadioGroup
              name="glStatus"
              label="Status"
              value={values.glStatus}
              onChange={handleChange}
              items={statusItems}
              error={errors.glStatus}
            />
          </Grid>{" "}
        </Grid>

        <div>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={() => {}} />
        </div>
      </Form>
    </>
  );
}
