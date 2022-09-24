import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./index.css";
// import { Select as muiSelect } from "../../components/controls/Select";
import { MenuItem, Select } from "@material-ui/core";
// import Dropdown from "./controls/DropDown";
// import { usePopper, Dropdown } from "react-popper";
// import { DropdownItem } from "reactstrap";
import { Dropdown } from "../../components/controls/DropDown";
// import { SettingsInputAntenna } from "@material-ui/icons";
import { useForm, Form } from "../../components/useForm";
import { TreeView } from "@material-ui/lab";
// import Select from "../../components/controls/Select";
import { Handlesubmenuchange } from "./handleSubmenuchange";

const SidebarLabel = styled.span`
  margin-left: 16px;
`;
const DropdownLink = styled(Link)`
  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;
const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;
const DropdownItem = styled.div`
  justify-content: flex-start;
  height: 40px;
  padding-right: 10px;
  padding-left: 10px;
  align-items: center;

  &:hover {
    background-color: #00ffff;
  }
  &:active {
    font-weight: 700;
    color: #00ffff;
  }
`;

const initialFValues = {
  id: 0,
  roleCode: "",
  roleName: "",
  menuRight: "",
  editRight: "",
  addRight: "",
  deleteRight: "",
};

const Popupsidemenu = (props) => {
  const { data = [], setSubMenu } = props;
  const hello = useRef();
  const handleHi = (e) => {
    let value = e.target.getAttribute("value");
    // let value = hello.current.getAttribute("value");
    console.log(value);
    let x = false;
    setSubMenu(value);
  };

  console.log(data);
  return (
    <div className="d-tree">
      <ul className="d-flex d-tree-container flex-column">
        {data.map((tree) => (
          <TreeNode node={tree} handleHi={handleHi} hello={hello} />
        ))}
      </ul>
    </div>
  );
};

const TreeNode = (props) => {
  const { node, handleHi, hello } = props;
  const [childVisible, setChildVisiblity] = useState(false);

  const hasChild = node.subNav ? true : false;

  return (
    <MenuItem value={node.screenName} name="rolename">
      <div
        className="d-flex"
        onClick={(event) => {
          setChildVisiblity((v) => !v);
          // console.log(event.target);
        }}
        value={node.screenName}
      >
        {hasChild && (
          <div
            className={`d-inline d-tree-toggler ${
              childVisible ? "active" : ""
            }`}
          >
            <FontAwesomeIcon className="w3-text-white" icon="caret-right" />
          </div>
        )}

        <div className="col d-tree-head">
          <ul>
            <DropdownItem>
              <p
                onClick={handleHi}
                name="rolename"
                value={node.screenName}
                ref={hello}
              >
                {node.screenName}
              </p>
            </DropdownItem>
          </ul>
        </div>
      </div>
    </MenuItem>
  );
};
export default Popupsidemenu;
// {hasChild && childVisible && (
//   <div className="d-tree-content">
//     <ul className="d-flex d-tree-container flex-column">
//       <Popupsidemenu data={node.subNav} />
//     </ul>
//   </div>
// )}
