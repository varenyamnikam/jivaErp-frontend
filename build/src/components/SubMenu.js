import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./index.css";
import { home } from "react-icons-kit/icomoon/home";
import { Icon } from "react-icons-kit";
import { getIconButtonUtilityClass } from "@mui/material";
import { user } from "react-icons-kit/fa/user";
import admin from "../img/admin.svg";
import { cube } from "react-icons-kit/ionicons/cube";
import man from "../img/man.png";
import "./glow.css";
import Accordion from "@mui/material/Accordion";
import Fade from "react-reveal/Fade";
const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const SubMenu = ({ data = [] }) => {
  function getIcon(data) {
    if (data.screenName == "ADMIN") {
      return home;
    } else return "";
  }
  console.log(data);
  return (
    <div className="d-tree">
      <ul className="d-flex d-tree-container flex-column">
        {data.map((tree) => (
          <TreeNode node={tree} />
        ))}
      </ul>
    </div>
  );
};

const TreeNode = ({ node }) => {
  const [childVisible, setChildVisiblity] = useState(false);
  function getIcon(data) {
    if (data.screenName == "ADMIN") {
      return <Icon size={12} icon={getIcon(node)} />;
    } else {
      return <i class="fa-solid fa-user-tie"></i>;
    }
  }

  const hasChild = node.subNav ? true : false;
  return (
    <li className="d-tree-node border-0">
      <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
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
          <Link to={node.pageLink}>
            {node.screenName == "ADMIN" ? (
              <img src={man} height={22} color="red" />
            ) : node.screenName == "MASTER" ? (
              <Icon size={17} icon={cube} />
            ) : (
              ""
            )}
            <span
              className="brand-text font-weight-light"
              style={{ marginLeft: "10px" }}
            >
              <span className="glow">{node.screenName}</span>
            </span>
          </Link>
        </div>
      </div>

      {hasChild && childVisible && (
        <div className="d-tree-content">
          <Fade left>
            <ul className="d-flex d-tree-container flex-column">
              <SubMenu data={node.subNav} />
            </ul>
          </Fade>
        </div>
      )}
    </li>
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
