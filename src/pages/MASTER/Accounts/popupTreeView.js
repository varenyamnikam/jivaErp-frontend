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
import ControllableStates from "../../../components/selectsearchstate";
import MarketingTreeView from "../Geography/marketingTreeView";
import { right } from "@popperjs/core";
import AccountsTreeView from "./accountsTreeView";
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
let dataBase = [
  {
    mktAreaCode: "50001",
    parentAreaCode: "0",
    mktArea: "India",
    child: ["50002", "1"],
  },
  {
    mktAreaCode: "50002",
    parentAreaCode: "50001",
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function PopupMarketingArea(prop) {
  const { setButtonPopup, setValue, value } = prop;
  const classes = useStyles;
  const [values, setValues] = useState(value);
  console.log(value);
  const [dataBases, setDataBases] = useState(dataBase);
  const [disable, setDisable] = useState(false);
  const [expanded, setExpanded] = useState([values.parentAreaCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  function getNewCode() {
    return (
      parseInt(dataBases[dataBases.length - 1].mktAreaCode) + 1
    ).toString();
  }

  function handleSubmit() {
    // setExpanded(["0"]);
    console.log(values);
    setValue({
      ...value,
      ...values,
    });
  }

  // if (values.acName) {
  //   employeeData.map((item) => {
  //     if ((values.acName == item.acName) & (values.acCode !== item.acCode)) {
  //       setValues({ ...values, acCode: item.acCode });
  //     }
  //   });
  // }
  // if (!values.acName && values.acCode) {
  //   employeeData.map((item) => {
  //     if (values.acCode == item.acCode) {
  //       setValues({ ...values, acName: item.acName });
  //     }
  //   });
  // }
  console.log(dataBases);

  return (
    <>
      <div className="wrapper">
        <div>
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
                    <AccountsTreeView
                      values={values}
                      setValues={setValues}
                      dataBase={dataBases}
                      expanded={expanded}
                      setExpanded={setExpanded}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div style={{ marginLeft: 105 }}>
                      {" "}
                      <div style={{ marginBottom: 20 }}>
                        <Controls.Input
                          name="mktArea"
                          label=" Area"
                          value={values.mktArea}
                          onChange={handleChange}
                          style={{ width: "100%" }}
                          // error={errors.talukaName}
                        />
                      </div>
                    </div>
                  </Grid>{" "}
                </Grid>
                <div style={{ marginLeft: 705, marginBottom: 25 }}>
                  <Controls.Button
                    onClick={(e) => {
                      handleSubmit(e);
                      setButtonPopup(false);
                    }}
                    text="Choose"
                  />
                </div>
              </div>
            </section>
          </Paper>
        </div>
      </div>
    </>
  );
}
