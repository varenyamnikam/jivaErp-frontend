import * as React from "react";
import { useTheme } from "@mui/material/styles";
import FilledInput from "@mui/material/FilledInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { makeStyles, IconButton } from "@material-ui/core";
import { BiHide } from "react-icons/bi";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
      justifyContent: "center",
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

const useStyles = makeStyles((theme) => ({
  root: {
    //color: "red",
  },
  selected: {
    color: "blue",
  },
}));

export default function MultipleSelectPlaceholder({
  headcells,
  setheadcells,
  initialHeadCells,
  selected,
  setSelected,
}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(event.target.value);
    setSelected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    let temp = typeof value === "string" ? value.split(",") : value;
    let arr = initialHeadCells.filter((item) => !temp.includes(item.label));
    console.log(temp, arr);
    setheadcells(arr);
  };
  const classes = useStyles();

  return (
    <div style={{ marginTop: "4px" }}>
      <FormControl sx={{ m: 10, width: 100, mt: 3 }} style={{ height: "40px" }}>
        <Select
          multiple
          displayEmpty
          value={selected}
          label="hi"
          onChange={handleChange}
          className={classes.root}
          input={
            <FilledInput
              className={classes.root}
              size="small"
              style={{ border: "none", backgroundColor: "red", color: "red" }}
            />
          }
          renderValue={(selected) => {
            return <BiHide size={20} />;
          }}
          style={{
            height: "40px",
            backgroundColor: "#87CEEB",
            color: "white",
            border: "none",
            paddingLeft: "10px",
            paddingRight: "0px",
            borderRadius: "5px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
          }}
          disableUnderline={true}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 100,
                justifyContent: "center",
                padding: "8px",
              },
            },
          }}
          inputProps={{
            "aria-label": "Without label",
            underline: {
              "&&&:before": {
                borderBottom: "none",
              },
              "&&:after": {
                borderBottom: "none",
              },
            },
          }}
        >
          {initialHeadCells.map((name) => (
            <MenuItem
              key={name.id}
              value={name.label}
              classes={{
                root: classes.root,
                selected: classes.selected,
              }}
            >
              {name.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
