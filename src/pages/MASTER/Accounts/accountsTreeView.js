import React, { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { getTreeItemUtilityClass } from "@mui/lab/TreeItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
let x = true;
let tempArr = ["0"];

export default function AccountsTreeView(props) {
  const { values, setValues, dataBase, expanded, setExpanded } = props;

  const [selected, setSelected] = useState(values.mktAreaCode);
  if (values.mktAreaCode && values.mktAreaCode == selected) {
    console.log("hi", values, selected);
    getExpansion(values.mktAreaCode);
  }
  console.log(values);
  function avoidReRender(code) {
    tempArr.map((a, Index) => {
      expanded.map((item, index) => {
        if (item[index] === a[Index]) {
          console.log(item[index], a[Index]);
          x = false;
        } else {
          x = true;
        }
      });
    });
  }

  function getExpansion(code) {
    avoidReRender(code);
    console.log(x);
    if (x) {
      dataBase.map((item) => {
        if (item.mktAreaCode == code && item.parentAreaCode !== 0) {
          tempArr.push(item.parentAreaCode);
          console.log(tempArr);
          if (tempArr[tempArr.length - 1] == "0") setExpanded([...tempArr]);

          getExpansion(item.parentAreaCode, tempArr);
        }
      });
    }
  }
  console.log(tempArr);
  console.log(selected, expanded);
  const hasNoChild = [];
  function getChild(child) {
    // console.log(child);
    let arr = [];
    dataBase.map((item) => {
      child.map((c) => {
        if (item.mktAreaCode == c) {
          arr.push(item);
        }
      });
    });
    // console.log(arr);
    return arr;
  }

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let child = undefined;
      if (treeItemData.child && treeItemData.child.length > 0) {
        child = getTreeItemsFromData(getChild(treeItemData.child));
      } else {
        hasNoChild.push(treeItemData);
      }
      return (
        <TreeItem
          key={treeItemData.mktAreaCode}
          nodeId={treeItemData.mktAreaCode}
          label={treeItemData.mktArea}
          data={treeItemData}
          children={child}
        />
      );
    });
  };
  console.log(getTreeItemsFromData(dataBase));
  function getName(code) {
    let name;
    dataBase.map((item) => {
      if (code == item.mktAreaCode) {
        console.log(item.mktArea);
        name = item.mktArea;
      }
    });
    return name;
  }

  useEffect(() => {
    console.log(getName(selected));
    // setValues({
    //   mktAreaCode: selected[0],
    //   mktArea: getName(selected[0]),
    // });
    tempArr = ["0"];
    dataBase.map((item) => {
      if (item.mktAreaCode == selected && values.mktAreaCode !== selected) {
        setValues({
          ...item,
        });
      }
    });
  }, [selected]);
  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };

  const handleToggle = (event, nodeIds) => {
    let x = true;
    console.log(hasNoChild);
    hasNoChild.map((item) => {
      nodeIds.map((nodeId) => {
        if (item.mktAreaCode == nodeId) {
          x = false;
          console.log("found");
        } else {
          console.log(item.mktAreaCode, nodeIds);
        }
      });
    });
    if (x) setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds[0]);
  };
  console.log(hasNoChild);
  // function insertData(arr) {
  //   let Ids = nodeIds;
  //   Ids.map((id) => {});
  // }

  return (
    <Box
      sx={{
        height: 270,
        flexGrow: 1,
        maxWidth: 400,
        overflowY: "auto",
      }}
    >
      <Box sx={{ mb: 1 }}>
        <DataTreeView treeItems={[dataBase[0]]} />
      </Box>
    </Box>
  );
}
// {mkt.map((item) => (
//   <TreeItem nodeId={item.mktAreaCode} label={item.mktArea} />
// ))}
