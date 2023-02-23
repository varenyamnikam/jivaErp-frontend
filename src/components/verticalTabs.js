import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./index.css";
import { home } from "react-icons-kit/icomoon/home";
import { Icon } from "react-icons-kit";
import InventoryIcon from "@mui/icons-material/Inventory";
import { getIconButtonUtilityClass } from "@mui/material";
import { user } from "react-icons-kit/fa/user";
import { cube } from "react-icons-kit/ionicons/cube";
import man from "../img/man.png";
import "./glow.css";
import Accordion from "@mui/material/Accordion";
import Fade from "react-reveal/Fade";
import AuthHandler from "../Utils/AuthHandler";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

function getRights(node) {
  let adm_userrights = JSON.parse(localStorage.getItem("adm_userrights"));
  // let adm_userrights = [];
  let x = true;
  if (adm_userrights) {
    adm_userrights.map((right) => {
      if (
        right.screenCode == node.screenCode &&
        right.userCode == AuthHandler.getUserCode() &&
        right.menuRight == "N"
      ) {
        console.log("hi", node);
        x = false;
      }
    });
  }
  return x;
}
const SubMenu = ({ data = [] }) => {
  function getIcon(data) {
    if (data.screenName == "ADMIN") {
      return home;
    } else return "";
  }
  console.log(data);
  return (
    <>
      {data.map((tree) => (
        <> {getRights(tree) && <TreeNode node={tree} />} </>
      ))}
    </>
  );
};

const TreeNode = ({ node }) => {
  const [childVisible, setChildVisiblity] = useState(false);
  function getIcon(data) {
    if (data.screenName == "ADMIN") {
      return <Icon size={12} icon={getIcon(node)} />;
    } else {
      return <i className="fa-solid fa-user-tie"></i>;
    }
  }
  console.log(childVisible);
  const hasChild = node.subNav ? true : false;
  const className = `right fas fa-angle-left ${
    childVisible ? "fa-rotate-270" : ""
  }`;
  console.log(className);
  console.log(childVisible);

  return (
    <>
      <li className="nav-item" onClick={(e) => setChildVisiblity((v) => !v)}>
        <Link to={node.pageLink}>
          <a
            href="#"
            className="nav-link"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <i className="far fa-dot-circle nav-icon"></i>
              <p>{node.screenName}</p>
            </div>
            {hasChild ? (
              childVisible ? (
                <>
                  <ExpandMoreIcon />
                </>
              ) : (
                <>
                  <ChevronLeftIcon />
                </>
              )
            ) : (
              <></>
            )}
          </a>
        </Link>
        {hasChild ? (
          <ul className="nav nav-treeview">
            <SubMenu data={node.subNav} />
          </ul>
        ) : (
          <></>
        )}
      </li>
    </>
  );
};

export default SubMenu;
// <div className="col d-tree-head">
// <Link to={node.pageLink}>
//   <Icon size={12} icon={home} />

//   <span className="brand-text font-weight-light">
//     {node.screenName}
//   </span>
// </Link>
// </div>
// <div className="col d-tree-head">
// <DropdownLink to={node.pageLink}>
//   <SidebarLabel>{node.screenName}</SidebarLabel>
// </DropdownLink>
// </div>
// </div>
// <i
//               className={`right fas fa-angle-left ${
//                 node.screenName == childVisible ? "fa-rotate-270" : ""
//               }`}
//             ></i>
