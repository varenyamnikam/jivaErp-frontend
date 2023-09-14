import React from "react";
import Config from "./Utils/Config";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import LogoutComponent from "./pages/LogoutComponent";
import MainComponent from "./components/MainComponent";
import Dashboard from "./pages/dashboard";
import Usermaster from "./pages/Admin/Usermaster/usermaster";
import Branchmaster from "./pages/Admin/BranchMaster/branchmaster";
import { PrivateRouteNew } from "./Utils/PrivateRouteNew";
import Countrymaster from "./pages/MASTER/Geography/countryMaster";
import Statemaster from "./pages/MASTER/Geography/stateMaster";
import Districtmaster from "./pages/MASTER/Geography/districtMaster";
import Talukamaster from "./pages/MASTER/Geography/talukaMaster";
import MarketingArea from "./pages/MASTER/Geography/marketingAreaMaster";
import AcGlGroup from "./pages/MASTER/Accounts/groupMaster";
import AcGl from "./components/GlMaster";
import AccountMaster from "./pages/MASTER/Accounts/accountsMaster";
import Customers from "./pages/MASTER/Accounts/CustomersMaster";
import Suppliers from "./pages/MASTER/Accounts/SupplierMaster";
import Employees from "./pages/MASTER/Accounts/EmployeesMaster";
import SignIn from "./pages/newLogin";
import RegisterForm from "./pages/register";
import Home from "./pages/home/Home";
import ProductMaster from "./pages/MASTER/Products/Productmaster/productMaster";
import FinancialYearMaster from "./pages/Admin//FinancialYear/financialYearMaster";
import AccountTypesMaster from "./pages/MASTER/Accounts/accountTypesMaster";
import DCMaster from "./pages/Inventory/D.C/dcMaster";
import PayTermMaster from "./pages/Inventory/paymentTermMaster";
import Settings from "./pages/Admin/SoftwareSettings/SoftwareSetting";
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
import StockMaster from "./pages/Stock/openingStockMaster";
import BR from "./pages/Accounting/BR/BrMaster";
import BP from "./pages/Accounting/BP/BpMaster";
import CR from "./pages/Accounting/CR/CrMaster";
import CP from "./pages/Accounting/CP/CpMaster";
import JV from "./pages/Accounting/JV/JvMaster";
import CV from "./pages/Accounting/CV/CvMaster";
import OB from "./pages/Accounting/OB/ObMaster";
import StockReport from "./pages/Stock/report/stockReport";
import POReport from "./pages/Report/trasnsactionReports/POReport";
import DCReport from "./pages/Report/trasnsactionReports/DCReport";
import GRNReport from "./pages/Report/trasnsactionReports/GRReport";
import SOReport from "./pages/Report/trasnsactionReports/SOReport";
import SIReport from "./pages/Report/trasnsactionReports/SIReport";
import SRReport from "./pages/Report/trasnsactionReports/SRReport";
import PVReport from "./pages/Report/trasnsactionReports/PVReport";
import PRReport from "./pages/Report/trasnsactionReports/PRReport";
import AcReport from "./pages/Report/acReport";
import JvReport from "./pages/Report/jvReport";
import BankBook from "./pages/Report/bankBook";
import CashBook from "./pages/Report/cashBook";
import ExpiryReport from "./pages/Stock/report/expiryReport";
import Sidemenu from "./components/sidemenu";
import TrialBalance from "./pages/Report/trialBalance";
import DayBook from "./pages/Report/dayBook";
import OutstandingReport from "./pages/Report/outstandingReport";
import ProdTypeMaster from "./pages/MASTER/Products/prodTypeMaster";
import ProductCompanyMaster from "./pages/MASTER/Products/prodCompanyMaster";
import StockConversionMaster from "./pages/Stock/transaction/stockConversionMaster";
import Tally from "./pages/Admin/tally/tally";
import jQuery from "jquery";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Router>
      <Switch>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/login" element={<SignIn />}></Route>
        <Route
          exact
          path="/home"
          element={<PrivateRouteNew Page={<Dashboard />} />}
        ></Route>
        <Route
          exact
          path="/Admin/UserMaster"
          element={<PrivateRouteNew Page={<Usermaster />} />}
        ></Route>
        <Route
          exact
          path="/Admin/Branch"
          element={<PrivateRouteNew Page={<Branchmaster />} />}
        ></Route>
        <Route
          path="/Admin/FinancialYearMaster"
          element={<PrivateRouteNew Page={<FinancialYearMaster />} />}
        ></Route>
        <Route
          path="/Admin/SoftwareSetting"
          element={<PrivateRouteNew Page={<Settings />} />}
        />
        <Route
          path="/Admin/Tally"
          element={<PrivateRouteNew Page={<Tally />} />}
        />
        <Route
          exact
          path="/Master/Geography/Country"
          element={<PrivateRouteNew Page={<Countrymaster />} />}
        ></Route>
        <Route
          exact
          path="/Master/Geography/State"
          element={<PrivateRouteNew Page={<Statemaster />} />}
        ></Route>{" "}
        <Route
          exact
          path="/Master/Geography/District"
          element={<PrivateRouteNew Page={<Districtmaster />} />}
        ></Route>
        <Route
          exact
          path="/Master/Geography/Taluka"
          element={<PrivateRouteNew Page={<Talukamaster />} />}
        ></Route>
        <Route
          exact
          path="/Master/Geography/MarketingArea"
          element={<PrivateRouteNew Page={<MarketingArea />} />}
        ></Route>
        <Route
          exact
          path="/Master/Accounts/AccountGroupMaster"
          element={<PrivateRouteNew Page={<AcGlGroup />} />}
        ></Route>
        <Route
          exact
          path="/Master/Accounts/AccountTypesMaster"
          element={<PrivateRouteNew Page={<AccountTypesMaster />} />}
        ></Route>
        <Route
          exact
          path="/Master/Accounts/AccountMaster"
          element={<PrivateRouteNew Page={<AccountMaster />} />}
        ></Route>
        <Route
          exact
          path="/Master/Accounts/Customers"
          element={<PrivateRouteNew Page={<Customers />} />}
        />
        <Route
          exact
          path="/Master/Accounts/Suppliers"
          element={<PrivateRouteNew Page={<Suppliers />} />}
        />
        <Route
          exact
          path="/Master/Accounts/Employees"
          element={<PrivateRouteNew Page={<Employees />} />}
        />
        <Route
          exact
          path="/Inventory/ProductMaster"
          element={<PrivateRouteNew Page={<ProductMaster />} />}
        />{" "}
        <Route
          exact
          path="/Inventory/ProductTypeMaster"
          element={<PrivateRouteNew Page={<ProdTypeMaster />} />}
        />
        <Route
          exact
          path="/Inventory/ProductCompanyMaster"
          element={<PrivateRouteNew Page={<ProductCompanyMaster />} />}
        />
        <Route
          exact
          path="/Inventory/D.C"
          element={<PrivateRouteNew Page={<DCMaster />} />}
        />
        <Route
          exact
          path="/Inventory/Q.T"
          element={<PrivateRouteNew Page={<QTMaster />} />}
        />
        <Route
          exact
          path="/Inventory/S.I"
          element={<PrivateRouteNew Page={<SIMaster />} />}
        />
        <Route
          exact
          path="/Inventory/G.R"
          element={<PrivateRouteNew Page={<GrMaster />} />}
        />
        <Route
          exact
          path="/Inventory/P.I"
          element={<PrivateRouteNew Page={<PIMaster />} />}
        />
        <Route
          exact
          path="/Inventory/S.O"
          element={<PrivateRouteNew Page={<SOMaster />} />}
        />
        <Route
          exact
          path="/Inventory/S.R"
          element={<PrivateRouteNew Page={<SRMaster />} />}
        />
        <Route
          exact
          path="/Inventory/P.O"
          element={<PrivateRouteNew Page={<POMaster />} />}
        />
        <Route
          exact
          path="/Inventory/P.V"
          element={<PrivateRouteNew Page={<PVMaster />} />}
        />
        <Route
          exact
          path="/Inventory/P.R"
          element={<PrivateRouteNew Page={<PRMaster />} />}
        />
        <Route
          exact
          path="/Inventory/C.N"
          element={<PrivateRouteNew Page={<CNMaster />} />}
        />
        <Route
          exact
          path="/Inventory/D.N"
          element={<PrivateRouteNew Page={<DNMaster />} />}
        />
        <Route
          exact
          path="/AcTransaction/BR"
          element={<PrivateRouteNew Page={<BR />} />}
        />
        <Route
          exact
          path="/AcTransaction/BP"
          element={<PrivateRouteNew Page={<BP />} />}
        />
        <Route
          exact
          path="/AcTransaction/CR"
          element={<PrivateRouteNew Page={<CR />} />}
        />
        <Route
          exact
          path="/AcTransaction/CP"
          element={<PrivateRouteNew Page={<CP />} />}
        />
        <Route
          exact
          path="/AcTransaction/JV"
          element={<PrivateRouteNew Page={<JV />} />}
        />
        <Route
          exact
          path="/AcTransaction/CV"
          element={<PrivateRouteNew Page={<CV />} />}
        />
        <Route
          exact
          path="/AcTransaction/OB"
          element={<PrivateRouteNew Page={<OB />} />}
        />
        <Route
          exact
          path="/Inventory/PaymentTerm"
          element={<PrivateRouteNew Page={<PayTermMaster />} />}
        />
        <Route
          exact
          path="/Inventory/StockMaster"
          element={<PrivateRouteNew Page={<StockMaster />} />}
        />
        <Route
          exact
          path="/Inventory/StockReport"
          element={<PrivateRouteNew Page={<StockReport />} />}
        />{" "}
        <Route
          exact
          path="/InventoryTransaction/OpeningStock"
          element={<PrivateRouteNew Page={<StockMaster />} />}
        />
        <Route
          exact
          path="/InventoryTransaction/StockConversion"
          element={<PrivateRouteNew Page={<StockConversionMaster />} />}
        />
        <Route
          exact
          path="/InventoryReport/StockReport"
          element={<PrivateRouteNew Page={<StockReport />} />}
        />
        <Route
          exact
          path="/InventoryReport/ExpiryReport"
          element={<PrivateRouteNew Page={<ExpiryReport />} />}
        />
        <Route
          exact
          path="/PurchaseReport/POReport"
          element={<PrivateRouteNew Page={<POReport />} />}
        />
        <Route
          exact
          path="/PurchaseReport/GRNReport"
          element={<PrivateRouteNew Page={<GRNReport />} />}
        />
        <Route
          exact
          path="/PurchaseReport/PVReport"
          element={<PrivateRouteNew Page={<PVReport />} />}
        />
        <Route
          exact
          path="/PurchaseReport/PRReport"
          element={<PrivateRouteNew Page={<PRReport />} />}
        />
        <Route
          exact
          path="/SaleReport/DispatchRegister"
          element={<PrivateRouteNew Page={<DCReport />} />}
        />{" "}
        <Route
          exact
          path="/SaleReport/SaleOrderReport"
          element={<PrivateRouteNew Page={<SOReport />} />}
        />
        <Route
          exact
          path="/SaleReport/SaleRegister"
          element={<PrivateRouteNew Page={<SIReport />} />}
        />
        <Route
          exact
          path="/SaleReport/SaleReturnRegister"
          element={<PrivateRouteNew Page={<SRReport />} />}
        />
        <Route
          exact
          path="/AccountingReport/AcReport"
          element={<PrivateRouteNew Page={<AcReport />} />}
        />
        <Route
          exact
          path="/AccountingReport/JVRegister"
          element={<PrivateRouteNew Page={<JvReport />} />}
        />
        <Route
          exact
          path="/AcReport/TrialBalance"
          element={<PrivateRouteNew Page={<TrialBalance />} />}
        />
        <Route
          exact
          path="/AccountingReport/BankBook"
          element={<PrivateRouteNew Page={<BankBook />} />}
        />
        <Route
          exact
          path="/AccountingReport/CashBook"
          element={<PrivateRouteNew Page={<CashBook />} />}
        />
        <Route
          exact
          path="/AccountingReport/DayBook"
          element={<PrivateRouteNew Page={<DayBook />} />}
        />
        <Route
          exact
          path="/AccountingReport/OutstandingReport"
          element={<PrivateRouteNew Page={<OutstandingReport />} />}
        />
      </Switch>
    </Router>
  </>
);
// SRReport from "./pages/Report/SRReport";
// import PVReport from "./pages/Report/PVReport";
// import PRReport
// reportWebVitals();
// <Branchmaster />
