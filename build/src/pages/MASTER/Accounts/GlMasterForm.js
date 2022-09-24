import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { Form } from "../../../components/useForm";
import BasicSelect from "../../Usermaster/basicselect";
import Controls from "../../../components/controls/Controls";
import AdvancedSelect from "../../../components/advancedBasicSelect";
import ControllableStates from "../../../components/selectsearchstate";
const OperateItems = ["CONTROL", "SUB"];
const OperateData = [
  { operateAs: "CONTROL", glOperateAs: "C" },
  { operateAs: "SUB", glOperateAs: "S" },
];
export default function Gimasterform(props) {
  const { values, setValues, records, setRecords, groupTypes, statusItems } =
    props;
  const [input, setInput] = useState({ glName: values.glName });
  function handleInputChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }
  function handleChange(e) {
    const { value, name } = e.target;
    setInput({ ...input, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let x = true;
    records.map((item, index) => {
      if (item.glCode == values.glCode) {
        const updatedRecords = records.map((p) =>
          p.glCode === values.glCode ? { ...input, ...values } : p
        );
        console.log(updatedRecords);
        setRecords(updatedRecords);
        x = false;
      }
    });
    if (x) {
      setRecords([
        ...records,
        {
          ...values,
          ...input,
          glCode:
            "GL" +
            (
              parseInt(records[records.length - 1].glCode.match(/(\d+)/)[0]) + 1
            ).toString(),
        },
      ]);
      console.log("new record");
      console.log(
        "GL" +
          (
            parseInt(records[records.length - 1].glCode.match(/(\d+)/)[0]) + 1
          ).toString()
      );
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
        (values.glGroupName == item.glGroupName) &
        (values.glGroupCode !== item.glGroupCode) &
        (item.glGroupStatus == "ACTIVE")
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
  //////////////////////////////////////////////////////////
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Controls.Input
            name="glCode"
            label="Code"
            value={null}
            onChange={handleInputChange}
            disabled="true"
            // error={errors.stateCode}
          />
          <Controls.Input
            name="glName"
            label="Name"
            value={input.glName}
            onChange={handleChange}
            // error={errors.stateCode}
          />
          <ControllableStates
            value={values}
            setValue={setValues}
            name="glGroupName"
            label="Gl Group"
            options={groupTypes}
          />

          <BasicSelect
            name="operateAs"
            label="Operate As"
            values={values}
            setValues={setValues}
            options={OperateItems}
          />
          <Controls.RadioGroup
            name="glStatus"
            label="Status"
            value={values.glStatus}
            onChange={handleInputChange}
            items={statusItems}
          />
        </Grid>
        <div>
          <Controls.Button type="submit" text="Submit" />
          <Controls.Button text="Reset" color="default" onClick={() => {}} />
        </div>
      </Form>
    </>
  );
}
