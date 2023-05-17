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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Collapse from "@mui/material/Collapse";
const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  &:hover {
    background: #757575;
    color: "white";
    fontcolor: "white";
    cursor: pointer;
  }
`;
function getRights(node) {
  let adm_userrights = JSON.parse(localStorage.getItem("adm_userrights"));
  const settings = JSON.parse(localStorage.getItem("adm_softwareSettings"));
  let x = true;
  if (adm_userrights.menuRight) {
    x = adm_userrights.menuRight.includes(node.screenCode);
  }
  if (
    settings.saleStockUpdateUsing == "Invoice" &&
    node.screenName == "Dispatch Register"
  )
    x = false;
  if (
    settings.purcStockUpdateUsing == "Invoice" &&
    node.screenName == "Material Inward Register"
  )
    x = false;

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
  // function getIcon(data) {
  //   if (data.screenName == "ADMIN") {
  //     return <Icon size={12} icon={getIcon(node)} />;
  //   } else {
  //     return <i class="fa-solid fa-user-tie"></i>;
  //   }
  // }

  const hasChild = node.subNav ? true : false;
  return (
    <li className="nav-item">
      <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
        <DropdownLink
          to={node.pageLink}
          className="nav-link glow"
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "white",
          }}
          onClick={() => {
            localStorage.setItem("screenCode", node.screenCode);
          }}
        >
          <div className="glow">
            {node.screenName == "ADMIN" ? (
              <img src={man} height={22} color="red" />
            ) : node.screenName == "MASTER" ? (
              <Icon size={17} icon={cube} />
            ) : node.screenName == "INVENTORY" ? (
              <InventoryIcon fontSize="small" />
            ) : node.screenName == "Purchase" ? (
              <ShoppingCartIcon fontSize="small" />
            ) : node.screenName == "Inventory Transaction" ? (
              <FontAwesomeIcon icon="fas fa-cubes" />
            ) : node.screenName == "Sale" ? (
              <CurrencyRupeeIcon fontSize="small" />
            ) : node.screenName == "A/C Transaction" ? (
              <AccountBalanceIcon fontSize="small" />
            ) : node.screenName == "Report" ? (
              <ListAltIcon fontSize="small" />
            ) : node.screenName == "Purchase Report" ? (
              <ShoppingCartIcon
                fontSize="small"
                style={{
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "4px",
                  display: "inline-block",
                  borderColor: "white",
                }}
              />
            ) : node.screenName == "Sale Report" ? (
              <CurrencyRupeeIcon
                fontSize="small"
                style={{
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "4px",
                  display: "inline-block",
                  borderColor: "white",
                }}
              />
            ) : node.screenName == "Accounting Report" ? (
              <AccountBalanceIcon
                fontSize="small"
                style={{
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "4px",
                  display: "inline-block",
                  borderColor: "white",
                }}
              />
            ) : node.screenName == "Inventory Report" ? (
              <FontAwesomeIcon
                icon="fas fa-cubes"
                fontSize="small"
                style={{
                  border: "1px solid black",
                  borderRadius: "4px",
                  padding: "2px",
                  display: "inline-block",
                  borderColor: "white",
                }}
              />
            ) : (
              ""
            )}
            {/*<i class="fa fa-exchange" aria-hidden="true"></i> */}
            <span className="glow" style={{ marginLeft: "10px" }}>
              {node.screenName}
            </span>
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
        </DropdownLink>
      </div>
      <Collapse in={hasChild && childVisible} timeout={500}>
        <ul className="d-flex d-tree-container flex-column">
          <SubMenu data={node.subNav} />
        </ul>
      </Collapse>
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
