import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "black",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,

    "& .MuiAutocomplete-popupIndicator": {
      color: "white",
      boxShadow: "none",
      opacity: 0,
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "white",
      boxShadow: "none",
    },
  },
  inputRoot: {
    color: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "& $input": {
      "&::placeholder": {
        color: "white",
      },
      color: "white",
    },
  },
  paper: {
    backgroundColor: "grey", // Set background color of menu to grey
  },
  input: {
    "&::placeholder": {
      color: "white",
    },
    color: "white",
  },
  icon: {
    color: "white",
  },
}));

const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

export default function MyAutocomplete({ data }) {
  let history = useNavigate();
  const [inputValue, setInputValue] = React.useState("");
  const classes = useStyles();
  let temp = [];
  function flattenArray(array = data) {
    array.map((item) => {
      if (item.pageLink && item.pageLink !== "#") {
        temp.push({ screenName: item.screenName, link: item.pageLink });
      }
      if ("subNav" in item) {
        flattenArray(item.subNav);
      }
    });
  }
  flattenArray(data);
  console.log(temp);
  //   const nestedObjects = [
  //     { name: "hi", subnav: [{ name: "hello", subnav: [{ name: "foo" }] }] },
  //     { name: "jiji" },
  //   ];

  return (
    <Autocomplete
      options={temp}
      classes={{
        root: classes.root,
        inputRoot: classes.inputRoot,
      }}
      getOptionLabel={(option) => option.screenName}
      onChange={(event, newValue, reason) => {
        if (reason == "clear") setInputValue("");
        else {
          console.log(newValue.link);
          history(newValue.link);
          setInputValue(newValue);
        }
        //other codes go here like setting the value of input
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search"
          variant="outlined"
          size="small"
          value={inputValue}
          InputProps={{
            ...params.InputProps,
            className: classes.input,
          }}
        />
      )}
      onBlur={() => {
        setInputValue("");
      }}
    />
  );
}
