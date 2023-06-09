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
import RichObjectTreeView from "../../../components/newTreeView";
import UnusedAutosuggest from "../../../components/unusedautosuggest";
import { NotifyMsg } from "../../../components/notificationMsg";
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
const initialEValues = { acName: "", acCode: "X X X X" };
const initialFilterEValues = { acName: "", acCode: "" };
const user = AuthHandler.getUser();
let dataBase = [
  {
    mktAreaCode: "5001",
    parentAreaCode: "0",
    mktArea: "India",
    child: [],
    assignTo: "",
    userCompanyCode: user.userCompanyCode,
    entryBy: user.userCode,
    entryOn: new Date(),
  },
];
export default function MarketingArea() {
  const classes = useStyles;
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    mktArea: "", //parent area is the label
    acName: "",
    newArea: "",
    ///acCode
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
  const [employeeData, setEmployeeData] = useState([initialEValues]);
  const [dataBases, setDataBases] = useState(dataBase);
  const [editText, setEditText] = useState("EDIT");
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  const url = Config.accounts;
  const handleErr = (error) => {
    setNotify(NotifyMsg(4));
    console.log(error);
  };

  useEffect(() => {
    // if (!loading) {
    //   const token = AuthHandler.getLoginToken();
    //   axios
    //     .get(Config.mktArea , {
    //       headers: {
    //         authorization: "Bearer" + token,
    //       },
    //     })
    //     .then((response) => {
    //       console.log(
    //         response.data.mst_mktArea.length,
    //         response.data.mst_mktArea
    //       );
    //       if (response.data.mst_mktArea.length !== 0) {
    //         setDataBases(response.data.mst_mktArea);
    //       } else {
    //         setDataBases([{ ...dataBase[0], mktAreaCode: "" }]);
    //       }
    //     })
    //     .finally(() => {
    //       setLoading(true);
    //     });
    // }

    if (loading) {
      // console.log(employeeData);
      const handleRes = (response) => {
        console.log(response.data);
        if (response.data.mst_accounts.length !== 0) {
          setEmployeeData(() => {
            const temp = response.data.mst_accounts.filter((item) => {
              return item.preFix == "E";
            });
            if (temp.length !== 0) {
              return temp;
            } else {
              return [initialFilterEValues];
            }
          });
        }
        if (response.data.mst_mktArea.length !== 0) {
          setDataBases(response.data.mst_mktArea);
        }
      };

      roleService.axiosGet(url, handleRes, handleErr, () => {
        setLoading(false);
      });
    }
  });
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    function check(key) {
      if (key in fieldValues)
        temp[key] = fieldValues[key] ? "" : "This field is required.";
    }
    if (editText == "EDIT") {
      check("acName");
      check("newArea");
      check("mktArea");
      setErrors({
        ...temp,
      });
    } else {
      check("acName");
      check("mktArea");
      setErrors({
        ...temp,
      });
    }
    return Object.values(temp).every((x) => x == "");
  };
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
    const url = Config.mktArea;

    if (validate()) {
      if (editText == "EDIT") {
        dataBases.map((item, index) => {
          if (item.mktAreaCode == values.mktAreaCode) {
            // const updatedDataBase = dataBases.map((p) =>
            //   p.mktAreaCode === values.mktAreaCode
            //     ? {
            //         ...p,
            //         child: [...p.child, getNewCode()],
            //         mktArea: values.mktArea,
            //       }
            //     : p
            // );
            const parent = dataBases.filter((i) => {
              if (i.mktAreaCode == values.mktAreaCode) {
                console.log(i);
                return i;
              }
            });
            console.log(parent);
            const input = {
              parentAreaCode: values.mktAreaCode,
              mktArea: values.newArea,
              mktAreaCode: "",
              assignTo: values.acCode,
              child: [],
              parent: parent[0],
            };
            const handleRes = (response) => {
              setDataBases(response.data.mst_mktArea);
              console.log(response.data.mst_mktArea);
              setNotify(NotifyMsg(1));
            };

            roleService.axiosPut(url, input, handleRes, handleErr, () => {});

            console.log("hi");
          }
        });
      } else {
        const input = {
          mktAreaCode: values.mktAreaCode,
          mktArea: values.mktArea,
          assignTo: values.acCode,
        };
        dataBases.map((item, index) => {
          if (item.mktAreaCode == values.mktAreaCode) {
            const updatedDataBase = dataBases.filter(
              (p) => p.mktAreaCode !== values.mktAreaCode
            );
            const handleRes = (response) => {
              setDataBases([...updatedDataBase, response.data.values]);
              console.log([...updatedDataBase, response.data.values]);
              setNotify(NotifyMsg(2));
            };
            roleService.axiosPatch(url, input, handleRes, handleErr, () => {});
            console.log([...updatedDataBase, values]);
          }
        });
        setEditText(editText == "EDIT" ? "CANCEL" : "EDIT");
        setDisable((prev) => {
          return !prev;
        });
      }
    }
  };
  // acCode -> acName or acName to acCode
  if (values.acName) {
    employeeData.map((item) => {
      if ((values.acName == item.acName) & (values.acCode !== item.acCode)) {
        setValues({ ...values, acCode: item.acCode });
      }
    });
  }
  if (!values.acName && values.assignTo) {
    employeeData.map((item) => {
      if (values.assignTo == item.acCode) {
        setValues({ ...values, acName: item.acName });
      }
    });
  }
  /////////////////////////////////
  function getLabel() {
    if (editText == "EDIT") {
      return "Assigned To";
    } else {
      return "Assign parent area To";
    }
  }
  console.log(dataBases);
  const employeeOptions = employeeData.map((item) => {
    return item.acName;
  });
  return (
    <>
      <PageHeader
        title="Marketing Area Master"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      />

      <section className="content">
        <div className="card">
          <div className="card-body">
            <section className="content">
              <div style={{ padding: 20, margin: 20 }}>
                {" "}
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={6}>
                    {" "}
                    <RichObjectTreeView
                      values={values}
                      setValues={setValues}
                      dataBase={dataBases}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <Controls.Input
                          name="mktArea"
                          label="Parent area"
                          value={values.mktArea}
                          onChange={handleChange}
                          style={{ width: "100%" }}
                          error={errors.mktArea}
                        />
                      </Grid>{" "}
                      <Grid item xs={12} sm={12}>
                        <Controls.Input
                          name="newArea"
                          label="Market area"
                          value={values.newArea}
                          onChange={handleChange}
                          style={{ width: "100%" }}
                          disabled={disable}
                          error={errors.newArea}
                        />
                      </Grid>{" "}
                      <Grid item xs={12} sm={12}>
                        <UnusedAutosuggest
                          value={values}
                          setValue={setValues}
                          name={"acName"}
                          label={getLabel()}
                          disable="false"
                          options={employeeOptions}
                          error={errors.acName}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
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
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </section>
            <Notification notify={notify} setNotify={setNotify} />
            <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            />
          </div>
        </div>
      </section>
    </>
  );
}
