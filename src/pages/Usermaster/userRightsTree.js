import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import AuthHandler from "../../Utils/AuthHandler";
import { cube } from "react-icons-kit/ionicons/cube";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const initialUserRights = {
  id: 0,
  userCode: "",
  screenCode: "",
  menuRight: "",
  editRight: "",
  addRight: "",
  deleteRight: "",
};
export default function ControlledTreeView(props) {
  const { values, setValues, userRights } = props;
  let data = AuthHandler.getMenuItem();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    console.log("hi", nodeIds);
    setSelected(nodeIds);
    let x = true;
    userRights.map((item) => {
      if (item.userCode == values.userCode && item.screenCode == nodeIds) {
        console.log("hi", item, values);
        x = false;
        if (
          values.menuRight !== item.menuRight ||
          values.editRight !== item.editRight ||
          values.addRight !== item.addRight ||
          values.deleteRight !== item.deleteRight
        )
          setValues(item);
      }
    });
    if (x)
      setValues({
        ...values,
        screenCode: nodeIds,
        menuRight: "Y",
        editRight: "Y",
        addRight: "Y",
        deleteRight: "Y",
      });
  };

  console.log(selected, values);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.screenCode}
      nodeId={nodes.screenCode}
      label={nodes.screenName}
      labelIcon={cube}
    >
      {Array.isArray(nodes.subNav)
        ? nodes.subNav.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  return data.map((item) => {
    return (
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        // sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {renderTree(item)}
      </TreeView>
    );
  });
}
