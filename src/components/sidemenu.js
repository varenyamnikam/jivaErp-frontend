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
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="index3.html" className="brand-link">
        <img
          src="../dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">AdminLTE 3</span>
      </a>

      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="../dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              Alexander Pierce
            </a>
          </div>
        </div>

        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>

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
