import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import AuthHandler from "../../../Utils/AuthHandler";
import axios from "axios";
import Config from "../../../Utils/Config";
import * as roleService from "../../../services/roleService";
import { Grid } from "@material-ui/core";
import {
  Paper,
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Controls from "../../../components/controls/Controls";
import PeopleOutlineTwoToneIcon from "@material-ui/icons/PeopleOutlineTwoTone";
import Notification from "../../../components/Notification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import MarketingTreeView from "./marketingTreeView";
import ControllableStates from "../../../components/selectsearchstate";
import { right } from "@popperjs/core";
const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: "10px",
  },
  searchInput: {
    width: "75%",
  },
  newButton: {
    position: "absolute",
    right: "10px",
  },
  space: {
    marginTop: "500px",
    padding: "100px",
  },
  container: {
    display: "grid",
    gridGap: theme.spacing(3),
    margin: "100px",
  },
}));
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

let dataBase = [
  {
    mktAreaCode: "50001",
    parentAreaCode: "0",
    mktArea: "India",
    child: ["50002", "1"],
  },
  {
    mktAreaCode: "50002",
    parentAreaCode: " 50001",
    mktArea: "Maharashtra",
    child: ["50003"],
  },
  {
    mktAreaCode: "50003",
    parentAreaCode: "50002",
    mktArea: "Khandesh",
    child: ["50004", "5"],
  },
  {
    mktAreaCode: "50004",
    parentAreaCode: "50003",
    mktArea: "Jalgaon",
    child: ["50005", "50006"],
  },
  {
    mktAreaCode: "5",
    parentAreaCode: "50003",
    mktArea: "Aurangabad",
    child: [],
  },

  {
    mktAreaCode: "50005",
    parentAreaCode: "50004",
    mktArea: "Bhadgaon",
    child: [],
  },
  {
    mktAreaCode: "50006",
    parentAreaCode: "50004",
    mktArea: "Bhusawal",
    child: [],
  },
];
export default function MarketingArea() {
  const classes = useStyles;
  const [values, setValues] = useState({
    mktArea: "",
    acName: "",
    newArea: "",
    assignTo: "",
  });
  console.log(values);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [employeeData, setEmployeeData] = useState([{}]);
  const [dataBases, setDataBases] = useState(dataBase);
  const [editText, setEditText] = useState("EDIT");
  const [disable, setDisable] = useState(false);

  // if (employeeData.length == 0) {
  //   GetData();
  // }
  // useEffect(() => {
  //   const token = AuthHandler.getLoginToken();
  //   const body = { hello: "hello" };
  //   axios
  //     .post(Config.marketareaemployee, body, {
  //       headers: {
  //         authorization: "Bearer" + token,
  //       },
  //     })
  //     .then((response) => {
  //       setEmployeeData(response.data);
  //     }),
  //     console.log("hi...");
  // });
  useEffect(() => {
    if (employeeData.length == 1) {
      const token = AuthHandler.getLoginToken();
      const body = { hello: "hello" };
      axios
        .post(Config.marketareaemployee, body, {
          headers: {
            authorization: "Bearer" + token,
          },
        })
        .then((response) => {
          console.log("res....", response.data.mst_accounts);
          setEmployeeData(response.data.mst_accounts);
        });
    }
  });
  // useEffect(() => {
  //   if (values.newArea !== placeHolder) {
  //     setPlaceholder(values.newArea);
  //   }
  // }, [values]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  function getNewCode() {
    return (
      parseInt(dataBases[dataBases.length - 1].mktAreaCode) + 1
    ).toString();
  }
  const handleSubmit = (e) => {
    if (editText == "EDIT") {
      console.log({
        parentAreaCode: values.mktAreaCode,
        mktArea: values.newArea,
        mktAreaCode: (
          parseInt(dataBases[dataBases.length - 1].mktAreaCode) + 1
        ).toString(),
        assignTo: values.acCode,
      });
      dataBases.map((item, index) => {
        if (item.mktAreaCode == values.mktAreaCode) {
          const updatedDataBase = dataBases.map((p) =>
            p.mktAreaCode === values.mktAreaCode
              ? { ...p, child: [...p.child, getNewCode()] }
              : p
          );
          console.log(updatedDataBase);
          setDataBases([
            ...updatedDataBase,
            {
              parentAreaCode: values.mktAreaCode,
              mktArea: values.newArea,
              mktAreaCode: (
                parseInt(dataBases[dataBases.length - 1].mktAreaCode) + 1
              ).toString(),
              assignTo: values.acCode,
              child: [],
            },
          ]);
          console.log("hi");
        }
      });
    } else {
      dataBases.map((item, index) => {
        if (item.mktAreaCode == values.mktAreaCode) {
          const updatedDataBase = dataBases.map((p) =>
            p.mktAreaCode === values.mktAreaCode
              ? { ...p, assignTo: values.acCode }
              : p
          );
          console.log(updatedDataBase);
          setDataBases(updatedDataBase);
        }
      });
      setEditText(editText == "EDIT" ? "CANCEL" : "EDIT");
      setDisable((prev) => {
        return !prev;
      });
    }
  };

  if (values.acName) {
    employeeData.map((item) => {
      if ((values.acName == item.acName) & (values.acCode !== item.acCode)) {
        setValues({ ...values, acCode: item.acCode });
      }
    });
  }
  if (!values.acName && values.acCode) {
    employeeData.map((item) => {
      if (values.acCode == item.acCode) {
        setValues({ ...values, acName: item.acName });
      }
    });
  }
  function getAutoSuggest() {
    if (editText == "EDIT") {
      return (
        <ControllableStates
          value={values}
          setValue={setValues}
          name={"acName"}
          label={"Assigned To"}
          disable="false"
          options={employeeData}
        />
      );
    } else {
      return (
        <ControllableStates
          value={values}
          setValue={setValues}
          name={"acName"}
          label={"Assign parent area To"}
          disable="false"
          options={employeeData}
        />
      );
    }
  }
  console.log(
    dataBases
    // (parseInt(dataBases[dataBases.length - 1].mktAreaCode) + 1).toString()
  );
  console.log(dataBases);

  return (
    <>
      <PageHeader
        title={"Marketing Area Master"}
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <div className="wrapper">
        <div className="content-wrapper">
          <br></br>
          <Paper className={classes.pageContent}>
            <section className={classes.space}>
              <div style={{ padding: 20, margin: 20 }}>
                {" "}
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={6}>
                    {" "}
                    <MarketingTreeView
                      values={values}
                      setValues={setValues}
                      dataBase={dataBases}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div style={{ marginLeft: 105 }}>
                      {" "}
                      <div style={{ marginBottom: 20 }}>
                        <Controls.Input
                          name="mktArea"
                          label="Parent area"
                          value={values.mktArea}
                          onChange={handleChange}
                          style={{ width: "100%" }}
                          // error={errors.talukaName}
                        />
                      </div>
                      <Controls.Input
                        name="newArea"
                        label="Market area"
                        value={values.newArea}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        disabled={disable}
                        // error={errors.talukaName}
                      />
                      {getAutoSuggest()}
                    </div>
                  </Grid>{" "}
                </Grid>
                <div style={{ marginLeft: 705, marginBottom: 25 }}>
                  <Controls.Button
                    value="Hello World"
                    text={editText}
                    color="default"
                    onClick={() => {
                      setEditText(editText == "EDIT" ? "CANCEL" : "EDIT");
                      setDisable((prev) => {
                        return !prev;
                      });
                      setValues({ ...values, newArea: "" });
                    }}
                  />

                  <Controls.Button onClick={handleSubmit} text="Submit" />
                </div>
              </div>
            </section>
          </Paper>
          <Notification notify={notify} setNotify={setNotify} />
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        </div>
      </div>
    </>
  );
}
