import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
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
const data = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};
export default function ControlledTreeView() {
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const handleExpandClick = () => {
    // setExpanded((oldExpanded) =>
    //   oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    // );
  };

  const handleSelectClick = () => {
    // setSelected((oldSelected) =>
    //   oldSelected.length === 0
    //     ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    //     : []
    // );
  };
  function getChildren(childArr) {
    let childrens = [];
    dataBase.map((obj) => {
      childArr.map((childCode) => {
        if (childCode == obj.mktAreaCode) {
          childrens.push(obj);
        }
      });
    });
    return childrens;
  }
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  return (
    <Box sx={{ height: 270, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {renderTree(data)}
      </TreeView>
    </Box>
  );
}
