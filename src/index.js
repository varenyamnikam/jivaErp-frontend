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
import Employees from "./pages/MASTER/Accounts/EmployeesMaster";
import SignIn from "./pages/newLogin";
import RegisterForm from "./pages/register";
import Home from "./pages/home/Home";
import ProductMaster from "./pages/MASTER/Products/Productmaster/productMaster";
import FinancialYearMaster from "./pages/Admin/financialYearMaster";
import AccountTypesMaster from "./pages/MASTER/Accounts/accountTypesMaster";
import DCMaster from "./pages/Inventory/D.C/dcMaster";
import PayTermMaster from "./pages/Inventory/paymentTermMaster";
import Settings from "./pages/Admin/SoftwareSetting";
ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={SignIn}></Route>
      <Route exact path="/register" component={RegisterForm}></Route>
      <Route exact path="/login" component={SignIn}></Route>
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
        path="/Admin/FinancialYearMaster"
        page={<FinancialYearMaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew path="/Admin/SoftwareSetting" page={<Settings />} />
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
        path="/Master/Accounts/AccountGroupMaster"
        page={<AcGlGroup />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Accounts/AccountTypesMaster"
        page={<AccountTypesMaster />}
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
        page={<Employees />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Master/Products/ProductsMaster"
        page={<ProductMaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Inventory/D.C"
        page={<DCMaster />}
      ></PrivateRouteNew>
      <PrivateRouteNew
        exact
        path="/Inventory/PaymentTerm"
        page={<PayTermMaster />}
      ></PrivateRouteNew>
    </Switch>
  </Router>,

  document.getElementById("root")
);
// <Branchmaster />
