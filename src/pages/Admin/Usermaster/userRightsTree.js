import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import AuthHandler from "../../../Utils/AuthHandler";
import { cube } from "react-icons-kit/ionicons/cube";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
export default function ControlledTreeView(props) {
  const { values, setValues, right, initialUserRights } = props;
  let data = AuthHandler.getMenuItem();
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds, name) => {
    console.log("hi", nodeIds, name);
    setSelected(nodeIds);
    let x = true;
    let menuArr = right.menuRight;
    let editArr = right.editRight;
    let addArr = right.addRight;
    let deleteArr = right.deleteRight;
    // const rightsArr = [menuArr, editArr, addArr, deleteArr];
    if (menuArr.includes(nodeIds)) setValues({ ...values, menuRight: "Y" });
    else {
      setValues(initialUserRights);
    }
    function getYorN(arr) {
      return arr.includes(nodeIds) ? "Y" : "N";
    }
    setValues({
      ...values,
      screenCode: nodeIds,
      screenName: name,
      menuRight: getYorN(menuArr),
      editRight: getYorN(editArr),
      addRight: getYorN(addArr),
      deleteRight: getYorN(deleteArr),
    });
    // rightsArr.map((arr) => {
    //   arr.map((item) => {
    //     if (item.userCode == values.userCode && item.screenName == name) {
    //       console.log("hi", item, values);

    //       if (
    //         values.menuRight !== item.menuRight ||
    //         values.editRight !== item.editRight ||
    //         values.addRight !== item.addRight ||
    //         values.deleteRight !== item.deleteRight
    //       ) {
    //         x = false;
    //         setValues({ ...item, screenCode: nodeIds, screenName: name });
    //       }
    //     }
    //   });
    // });
    // if (x) {
    //   setValues({
    //     ...values,
    //     screenName: name,
    //     screenCode: nodeIds,
    //     menuRight: "Y",
    //     editRight: "Y",
    //     addRight: "Y",
    //     deleteRight: "Y",
    //   });
    //   console.log("hi");
    // }
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.screenName}
      nodeId={nodes.screenCode}
      label={nodes.screenName}
      labelIcon={cube}
      onClick={(e) => {
        handleSelect(e, nodes.screenCode, nodes.screenName);
      }}
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
        // sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {renderTree(item)}
      </TreeView>
    );
  });
}
