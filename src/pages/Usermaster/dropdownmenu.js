import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Weddings: {
    borderRadius: "5px",
    // boxShadow: "0 0 0 40px white",
    padding: "10px",
    border: "1px groove grey",
    margin: "10px",
    height: "70px",
    width: "260px",
    marginLeft: "10px",
    marginRight: "400px",
  },
}));
// const options = [
//
//   { option: "ChopdaBranch", spacedOption: "Chopda Branch" },
//   {
//     option: "GubbaColdStoragePvtLtd",
//     spacedOption: "Gubba Cold Storage Pvt Ltd",
//   },
//   { option: "JalgaonHeadOffice", spacedOption: "Jalgaon Head Office" },
//   { option: "PALDHIBRANCH", spacedOption: "PALDHI BRANCH" },
// ];

export default function DropDownMenu(props) {
  const { setValues, values, name, label, options } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const open = Boolean(anchorEl);
  const classes = useStyles();
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    handleChange(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (index) => {
    setValues({
      ...values,
      [name]: options[index].option,
    });
    console.log({ [name]: options[index].option });
  };
  // options.unshift({ option: "", spacedOption: "" });
  // console.log(options)
  return (
    <div className={classes.Weddings}>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: "background.paper" }}
        style={{ padding: "0px" }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          style={{ padding: "0px" }}
        >
          <ListItemText
            primary={label}
            secondary={options[selectedIndex].spacedOption}
            sx={{ fontSize: "150px", width: 200 }}
            onChange={handleChange}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option.spacedOption}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
