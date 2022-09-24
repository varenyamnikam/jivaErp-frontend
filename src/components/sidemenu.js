import { Icon } from "react-icons-kit";
import { home } from "react-icons-kit/icomoon/home";
import AuthHandler from "../Utils/AuthHandler";
import { Link, NavLink } from "react-router-dom";
import SubMenu from "./SubMenu";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
const Sidemenu = (props) => {
  const matches = useMediaQuery("(min-width:1000px)");

  // let SidebarData = AuthHandler.getMenuItem();
  let SidebarData = AuthHandler.getMenuItem();
  // const User = AuthHandler.getUserCode();
  // const SidebarData = Data.filter((item) => item.screenCode == "Master");
  // console.log(SidebarData);
  function getAnchor() {
    console.log(matches);
    if (!matches) {
      return (
        <>
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "0px",
              paddingTop: "10px",
              color: "white",
            }}
          >
            <CloseIcon />
          </a>
          <Link
            to="/home"
            className="brand-link"
            style={{ marginLeft: "10px", paddingTop: "0px" }}
          >
            <Icon size={24} icon={home} style={{ marginRight: "7px" }} />
            <span className="brand-text font-weight-light">
              &nbsp;&nbsp;OAJ Seed ERP
            </span>
          </Link>
        </>
      );
    } else {
      return (
        <Link to="/home" className="brand-link" style={{ marginLeft: "10px" }}>
          <Icon size={24} icon={home} style={{ marginRight: "7px" }} />
          <span className="brand-text font-weight-light">
            &nbsp;&nbsp;OAJ Seed ERP
          </span>
        </Link>
      );
    }
  }
  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4"
      width={210}
    >
      {getAnchor()}
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <SubMenu data={SidebarData} />
          </ul>
        </nav>
      </div>
    </aside>
  );
};
export default Sidemenu;
