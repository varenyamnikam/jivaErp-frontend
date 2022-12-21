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
import GrMaster from "./pages/Inventory/G.R/newGr";
import SIMaster from "./pages/Inventory/S.I/S.I";
import QTMaster from "./pages/Inventory/QT/qt";
import PIMaster from "./pages/Inventory/P.I/P.I";
import SOMaster from "./pages/Inventory/S.O/S.O";
import SRMaster from "./pages/Inventory/S.R/S.R";
import POMaster from "./pages/Inventory/P.O/P.O";
import PVMaster from "./pages/Inventory/P.V/P.V";
import PRMaster from "./pages/Inventory/P.R/P.R";
import CNMaster from "./pages/Inventory/C.N/C.N";
import DNMaster from "./pages/Inventory/D.N/D.N";
import StockMaster from "./pages/Stock/stockMaster";
import BR from "./pages/Accounting/BR/BrMaster";
import BP from "./pages/Accounting/BP/BpMaster";
import CR from "./pages/Accounting/CR/CrMaster";
import CP from "./pages/Accounting/CP/CpMaster";
import JV from "./pages/Accounting/JV/JvMaster";
import CV from "./pages/Accounting/CV/CvMaster";
import OB from "./pages/Accounting/OB/ObMaster";
import StockReport from "./pages/Stock/report/stockReport";
import POReport from "./pages/Report/POReport";
import DCReport from "./pages/Report/DCReport";

import AcReport from "./pages/Report/acReport";

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
      />
      <PrivateRouteNew
        exact
        path="/Master/Accounts/Suppliers"
        page={<Suppliers />}
      />
      <PrivateRouteNew
        exact
        path="/Master/Accounts/Employees"
        page={<Employees />}
      />
      <PrivateRouteNew
        exact
        path="/Inventory/ProductMaster"
        page={<ProductMaster />}
      />
      <PrivateRouteNew exact path="/Inventory/D.C" page={<DCMaster />} />
      <PrivateRouteNew exact path="/Inventory/Q.T" page={<QTMaster />} />
      <PrivateRouteNew exact path="/Inventory/S.I" page={<SIMaster />} />
      <PrivateRouteNew exact path="/Inventory/G.R" page={<GrMaster />} />
      <PrivateRouteNew exact path="/Inventory/P.I" page={<PIMaster />} />
      <PrivateRouteNew exact path="/Inventory/S.O" page={<SOMaster />} />
      <PrivateRouteNew exact path="/Inventory/S.R" page={<SRMaster />} />
      <PrivateRouteNew exact path="/Inventory/P.O" page={<POMaster />} />
      <PrivateRouteNew exact path="/Inventory/P.V" page={<PVMaster />} />
      <PrivateRouteNew exact path="/Inventory/P.R" page={<PRMaster />} />
      <PrivateRouteNew exact path="/Inventory/C.N" page={<CNMaster />} />
      <PrivateRouteNew exact path="/Inventory/D.N" page={<DNMaster />} />
      <PrivateRouteNew exact path="/AcTransaction/BR" page={<BR />} />
      <PrivateRouteNew exact path="/AcTransaction/BP" page={<BP />} />
      <PrivateRouteNew exact path="/AcTransaction/CR" page={<CR />} />
      <PrivateRouteNew exact path="/AcTransaction/CP" page={<CP />} />
      <PrivateRouteNew exact path="/AcTransaction/JV" page={<JV />} />
      <PrivateRouteNew exact path="/AcTransaction/CV" page={<CV />} />
      <PrivateRouteNew exact path="/AcTransaction/OB" page={<OB />} />
      <PrivateRouteNew
        exact
        path="/Inventory/PaymentTerm"
        page={<PayTermMaster />}
      />
      <PrivateRouteNew
        exact
        path="/Inventory/StockMaster"
        page={<StockMaster />}
      />
      <PrivateRouteNew
        exact
        path="/Inventory/StockReport"
        page={<StockReport />}
      />
      <PrivateRouteNew
        exact
        path="/Inventory/StockReport"
        page={<StockReport />}
      />
      <PrivateRouteNew exact path="/Report/POReport" page={<POReport />} />
      <PrivateRouteNew exact path="/Report/DCReport" page={<DCReport />} />
      <PrivateRouteNew exact path="/Report/AcReport" page={<AcReport />} />
    </Switch>
  </Router>,

  document.getElementById("root")
);
// <Branchmaster />
