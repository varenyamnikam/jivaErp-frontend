import { Icon } from "react-icons-kit";
import { home } from "react-icons-kit/icomoon/home";
import AuthHandler from "../Utils/AuthHandler";
import { Link, NavLink } from "react-router-dom";
import SubMenu from "./SubMenu";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import MyAutocomplete from "./searchSideMenu";
import { reactLocalStorage } from "reactjs-localstorage";
import { FcManager } from "react-icons/fc";

const Sidemenu = (props) => {
  const matches = useMediaQuery("(min-width:1000px)");
  const recentImageDataUrl = localStorage.getItem("recent-image");

  function getImage() {
    return recentImageDataUrl
      ? recentImageDataUrl
      : "../dist/img/AdminLTELogo.png";
  }

  // let SidebarData = AuthHandler.getMenuItem();
  let SidebarData = AuthHandler.getMenuItem();
  const User = AuthHandler.getUser();
  // const SidebarData = Data.filter((item) => item.screenCode == "Master");
  console.log(User);
  let userName = User.userName ? User.userName : "User";
  const userCompanyName = reactLocalStorage.get("userCompanyName");

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/home" className="brand-link">
        <img
          src={getImage()}
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">{userCompanyName}</span>
      </Link>

      <div className="sidebar" style={{ overflow: "scroll" }}>
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="../dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <Link to="/Admin/UserMaster" className="d-block">
              {userName}
            </Link>
          </div>
        </div>

        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <MyAutocomplete data={SidebarData} />
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
