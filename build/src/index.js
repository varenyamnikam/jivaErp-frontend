import React from "react";
import Config from "./Utils/Config";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import LogoutComponent from "./pages/LogoutComponent";
import MainComponent from "./components/MainComponent";
import Dashboard from "./pages/dashboard";
import Rolemaster from "./pages/Rolemaster/rolemaster";
import Usermaster from "./pages/Usermaster/usermaster";
import Branchmaster from "./pages/Branchmaster/branchmaster";
import { PrivateRoute } from "./Utils/PrivateRoute";
import { PrivateRouteNew } from "./Utils/PrivateRouteNew";
import Countrymaster from "./pages/MASTER/Geography/countryMaster";
import Statemaster from "./pages/MASTER/Geography/stateMaster";
import Districtmaster from "./pages/MASTER/Geography/districtMaster";
import Talukamaster from "./pages/MASTER/Geography/talukaMaster";
import MarketingArea from "./pages/MASTER/Geography/marketingAreaMaster";
import AcGlGroup from "./pages/MASTER/Accounts/GlGroupMaster";
import AcGl from "./pages/MASTER/Accounts/GlMaster";
import AccountMaster from "./pages/MASTER/Accounts/accountsMaster";
import Customers from "./pages/MASTER/Accounts/CustomersMaster";
import Suppliers from "./pages/MASTER/Accounts/SupplierMaster";
import Employee from "./pages/MASTER/Accounts/EmployeesMaster";
import SignIn from "./pages/newLogin";
import RegisterForm from "./pages/register";
import Home from "./pages/home/Home";
ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={SignIn}></Route>
      <Route exact path="/register" component={RegisterForm}></Route>
      <Route
        exact
        path={Config.logoutPageUrl}
        component={LogoutComponent}
      ></Route>
      <PrivateRouteNew
        exact
        path="/home"
        page={<Dashboard />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        path="/Admin/RoleMaster"
        page={<Rolemaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Admin/UserMaster"
        page={<Usermaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Admin/Branch"
        page={<Branchmaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Geography/Country"
        page={<Countrymaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Geography/State"
        page={<Statemaster />}
      ></PrivateRouteNew>{" "}
      <PrivateRouteNew
        exact
        path="/Master/Geography/District"
        page={<Districtmaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Geography/Taluka"
        page={<Talukamaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Geography/MarketingArea"
        page={<MarketingArea />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/GlGroupMaster"
        page={<AcGlGroup />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/GlMaster"
        page={<AcGl />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/AccountMaster"
        page={<AccountMaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/Customers"
        page={<Customers />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/Suppliers"
        page={<Suppliers />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/Employees"
        page={<Employee />}
      ></PrivateRouteNew>
    </Switch>
  </Router>,

  document.getElementById("root")
);
// <Branchmaster />
