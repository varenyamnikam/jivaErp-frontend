import * as React from "react";
import { useState, useEffect } from "react";

import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// const label = { inputProps: { "aria-label": "Checkbox demo" } };
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Grid, makeStyles } from "@material-ui/core";
import { Handlesubmenuchange } from "../../Rolemaster/handleSubmenuchange";

const useStyles = makeStyles((theme) => ({
  Weddings: {
    borderRadius: "5px",
    // boxShadow: "0 0 0 40px white",
    padding: "5px",
    paddingRight: "125px",

    border: "1px groove grey",
    margin: "10px",

    marginLeft: "10px",
    // marginRight: "40px",
  },
  fedUp: {
    marginTop: "20px",
  },
  list: {
    marginLeft: "10px",
    padding: "0px",
  },
}));
const initialState = {
  ChopdaBranch: false,
  GubbaColdStoragePvtLtd: false,
  JalgaonHeadOffice: false,
  PALDHIBRANCH: false,
};

export default function ColorCheckboxes(props) {
  const { options, values, setValues, records } = props;
  const [x, setx] = useState(true);
  if (x) {
    records.map((record) => {
      if (values == record) {
        console.log(values);
        setx(false);
      }
    });
  }
  console.log(x);
  const classes = useStyles();
  const [checked, setChecked] = useState({});
  const [fedUp, setFedUp] = useState({
    option: "",
    spacedOption: "",
    disable: false,
  });
  useEffect(() => {
    setValues({ ...values, ...checked });
  }, [checked]);
  const haha = [];
  const huhu = [];
  options.map((item) => {
    Object.keys(values).map((value, index) => {
      if (value == item.option) {
        haha.push(value);
        const arr = Object.values(values);
        huhu.push(arr[index]);
      }
    });
  });
  function getInitialValues() {
    const noOptions = [];
    haha.map((item, index) => {
      noOptions.push({ [item]: huhu[index] });
    });
    return noOptions;
  }
  const [noOptions, setnoOptions] = useState(getInitialValues);
  if (x) {
    const newOptions = options.filter((record, index) => {
      return record.option !== "";
    });
    console.log(options, newOptions);
    const onClick = (e) => {
      console.log(e.target.checked);
      const value = e.target.checked;
      const name = e.target.value;
      setChecked({ ...checked, [name]: value });
      console.log(checked);
      // setValues({ ...values, ...checked });
    };
    if (values.DefaultBranchOptions) {
      console.log(values.DefaultBranchOptions);
      if (fedUp.option !== values.DefaultBranchOptions) {
        options.map((item) => {
          if (item.option == values.DefaultBranchOptions) {
            setFedUp({
              option: values.DefaultBranchOptions,
              spacedOption: item.spacedOption,
              disable: true,
            });
          }
          console.log(item.option);
          console.log(values[item.option]);
        });

        console.log("fedding up");
      }
    }
    options.map((item) => {
      console.log(item.option);
      console.log(values[item.option]);
    });

    console.log(fedUp);
    console.log(checked);
    if (fedUp.spacedOption) {
      console.log("if");
      const finalOptions = newOptions.filter((option) => {
        return option.option !== fedUp.option;
      });
      // useEffect(() => {
      //   setFinalOptions(
      //     newOptions.filter((option) => {
      //       return option.option !== fedUp.option;
      //     })

      //   );
      // }, [fedUp]);

      console.log(finalOptions);
      console.log(fedUp.disable);
      return (
        <div className={classes.Weddings}>
          <h5>Branch Rights</h5>
          <List>
            <ListItem>
              <Checkbox defaultChecked disabled color="success" />
              <p className={classes.fedUp}>{fedUp.spacedOption}</p>
            </ListItem>
            <div className={classes.list}>
              {finalOptions.map((option, index) => (
                <ListItem>
                  <FormControlLabel
                    label={option.spacedOption}
                    index={index}
                    onClick={onClick}
                    control={
                      <Checkbox
                        value={option.option}
                        // label={option.spacedOption}
                        index={index}
                        checked={option.checked}
                        // Checked={value.option}
                        onClick={(e) => onClick(e)}
                        color="success"
                      />
                    }
                  />
                </ListItem>
              ))}
            </div>
          </List>
        </div>
      );
    } else {
      console.log("else");

      return (
        <div className={classes.Weddings}>
          <h5>Branch Rights</h5>
          <List>
            <div>
              {newOptions.map((option, index) => (
                <ListItem>
                  <FormControlLabel
                    label={option.spacedOption}
                    index={index}
                    onClick={onClick}
                    control={
                      <Checkbox
                        value={option.option}
                        label={option.spacedOption}
                        index={index}
                        // checked={option.checked}
                        checked={values[option.option]}
                        // Checked={value.option}
                        onClick={(e) => onClick(e)}
                        color="success"
                      />
                    }
                  />
                </ListItem>
              ))}
            </div>
          </List>
        </div>
      );
    }
  } else {
    console.log(haha, huhu);
    const onClick = (e) => {
      const value = e.target.checked;
      const name = e.target.value;
      console.log(name, value);
    };
    return (
      <div className={classes.Weddings}>
        <h5>Branch Rights</h5>
        <List>
          <div>
            {haha.map((option, index) => (
              <ListItem>
                <FormControlLabel
                  label={haha[index]}
                  index={index}
                  onClick={onClick}
                  control={
                    <Checkbox
                      value={haha[index]}
                      label={haha[index]}
                      index={huhu[index]}
                      checked={huhu[index]}
                      // Checked={value.option}
                      onClick={(e) => onClick(e)}
                      color="success"
                    />
                  }
                />
              </ListItem>
            ))}
          </div>
        </List>
      </div>
    );
  }
}
// <Checkbox checked={huhu[index]} color="success" />
// <p className={classes.fedUp}>{haha[index]}</p>
