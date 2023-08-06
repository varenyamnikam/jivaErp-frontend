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
        OutstandingReport
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
(function ($) {
  "use strict";

  setTimeout(function () {
    if (
      window.___browserSync___ === undefined &&
      Number(localStorage.getItem("AdminLTE:Demo:MessageShowed")) <
        new Date().getTime()
    ) {
      localStorage.setItem(
        "AdminLTE:Demo:MessageShowed",
        new Date().getTime() + 15 * 60 * 1000
      );
      // eslint-disable-next-line no-alert
    }
  }, 1000);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function createSkinBlock(colors, callback, noneSelected) {
    var $block = $("<select />", {
      class: noneSelected
        ? "custom-select mb-3 border-0"
        : "custom-select mb-3 text-light border-0 " +
          colors[0].replace(/accent-|navbar-/, "bg-"),
    });

    if (noneSelected) {
      var $default = $("<option />", {
        text: "None Selected",
      });

      $block.append($default);
    }

    colors.forEach(function (color) {
      var $color = $("<option />", {
        class: (typeof color === "object" ? color.join(" ") : color)
          .replace("navbar-", "bg-")
          .replace("accent-", "bg-"),
        text: capitalizeFirstLetter(
          (typeof color === "object" ? color.join(" ") : color)
            .replace(/navbar-|accent-|bg-/, "")
            .replace("-", " ")
        ),
      });

      $block.append($color);
    });
    if (callback) {
      $block.on("change", callback);
    }

    return $block;
  }

  var $sidebar = $(".control-sidebar");
  var $container = $("<div />", {
    class: "p-3 control-sidebar-content",
  });

  $sidebar.append($container);

  // Checkboxes

  $container.append('<h5>Customize AdminLTE</h5><hr class="mb-2"/>');

  var $dark_mode_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("dark-mode"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("dark-mode");
    } else {
      $("body").removeClass("dark-mode");
    }
  });
  var $dark_mode_container = $("<div />", { class: "mb-4" })
    .append($dark_mode_checkbox)
    .append("<span>Dark Mode</span>");
  $container.append($dark_mode_container);

  $container.append("<h6>Header Options</h6>");
  var $header_fixed_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("layout-navbar-fixed"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("layout-navbar-fixed");
    } else {
      $("body").removeClass("layout-navbar-fixed");
    }
  });
  var $header_fixed_container = $("<div />", { class: "mb-1" })
    .append($header_fixed_checkbox)
    .append("<span>Fixed</span>");
  $container.append($header_fixed_container);

  var $dropdown_legacy_offset_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".main-header").hasClass("dropdown-legacy"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".main-header").addClass("dropdown-legacy");
    } else {
      $(".main-header").removeClass("dropdown-legacy");
    }
  });
  var $dropdown_legacy_offset_container = $("<div />", { class: "mb-1" })
    .append($dropdown_legacy_offset_checkbox)
    .append("<span>Dropdown Legacy Offset</span>");
  $container.append($dropdown_legacy_offset_container);

  var $no_border_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".main-header").hasClass("border-bottom-0"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".main-header").addClass("border-bottom-0");
    } else {
      $(".main-header").removeClass("border-bottom-0");
    }
  });
  var $no_border_container = $("<div />", { class: "mb-4" })
    .append($no_border_checkbox)
    .append("<span>No border</span>");
  $container.append($no_border_container);

  $container.append("<h6>Sidebar Options</h6>");

  var $sidebar_collapsed_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("sidebar-collapse"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("sidebar-collapse");
      $(window).trigger("resize");
    } else {
      $("body").removeClass("sidebar-collapse");
      $(window).trigger("resize");
    }
  });
  var $sidebar_collapsed_container = $("<div />", { class: "mb-1" })
    .append($sidebar_collapsed_checkbox)
    .append("<span>Collapsed</span>");
  $container.append($sidebar_collapsed_container);

  $(document).on(
    "collapsed.lte.pushmenu",
    '[data-widget="pushmenu"]',
    function () {
      $sidebar_collapsed_checkbox.prop("checked", true);
    }
  );
  $(document).on("shown.lte.pushmenu", '[data-widget="pushmenu"]', function () {
    $sidebar_collapsed_checkbox.prop("checked", false);
  });

  var $sidebar_fixed_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("layout-fixed"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("layout-fixed");
      $(window).trigger("resize");
    } else {
      $("body").removeClass("layout-fixed");
      $(window).trigger("resize");
    }
  });
  var $sidebar_fixed_container = $("<div />", { class: "mb-1" })
    .append($sidebar_fixed_checkbox)
    .append("<span>Fixed</span>");
  $container.append($sidebar_fixed_container);

  var $sidebar_mini_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("sidebar-mini"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("sidebar-mini");
    } else {
      $("body").removeClass("sidebar-mini");
    }
  });
  var $sidebar_mini_container = $("<div />", { class: "mb-1" })
    .append($sidebar_mini_checkbox)
    .append("<span>Sidebar Mini</span>");
  $container.append($sidebar_mini_container);

  var $sidebar_mini_md_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("sidebar-mini-md"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("sidebar-mini-md");
    } else {
      $("body").removeClass("sidebar-mini-md");
    }
  });
  var $sidebar_mini_md_container = $("<div />", { class: "mb-1" })
    .append($sidebar_mini_md_checkbox)
    .append("<span>Sidebar Mini MD</span>");
  $container.append($sidebar_mini_md_container);

  var $sidebar_mini_xs_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("sidebar-mini-xs"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("sidebar-mini-xs");
    } else {
      $("body").removeClass("sidebar-mini-xs");
    }
  });
  var $sidebar_mini_xs_container = $("<div />", { class: "mb-1" })
    .append($sidebar_mini_xs_checkbox)
    .append("<span>Sidebar Mini XS</span>");
  $container.append($sidebar_mini_xs_container);

  var $flat_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("nav-flat"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("nav-flat");
    } else {
      $(".nav-sidebar").removeClass("nav-flat");
    }
  });
  var $flat_sidebar_container = $("<div />", { class: "mb-1" })
    .append($flat_sidebar_checkbox)
    .append("<span>Nav Flat Style</span>");
  $container.append($flat_sidebar_container);

  var $legacy_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("nav-legacy"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("nav-legacy");
    } else {
      $(".nav-sidebar").removeClass("nav-legacy");
    }
  });
  var $legacy_sidebar_container = $("<div />", { class: "mb-1" })
    .append($legacy_sidebar_checkbox)
    .append("<span>Nav Legacy Style</span>");
  $container.append($legacy_sidebar_container);

  var $compact_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("nav-compact"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("nav-compact");
    } else {
      $(".nav-sidebar").removeClass("nav-compact");
    }
  });
  var $compact_sidebar_container = $("<div />", { class: "mb-1" })
    .append($compact_sidebar_checkbox)
    .append("<span>Nav Compact</span>");
  $container.append($compact_sidebar_container);

  var $child_indent_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("nav-child-indent"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("nav-child-indent");
    } else {
      $(".nav-sidebar").removeClass("nav-child-indent");
    }
  });
  var $child_indent_sidebar_container = $("<div />", { class: "mb-1" })
    .append($child_indent_sidebar_checkbox)
    .append("<span>Nav Child Indent</span>");
  $container.append($child_indent_sidebar_container);

  var $child_hide_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("nav-collapse-hide-child"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("nav-collapse-hide-child");
    } else {
      $(".nav-sidebar").removeClass("nav-collapse-hide-child");
    }
  });
  var $child_hide_sidebar_container = $("<div />", { class: "mb-1" })
    .append($child_hide_sidebar_checkbox)
    .append("<span>Nav Child Hide on Collapse</span>");
  $container.append($child_hide_sidebar_container);

  var $no_expand_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".main-sidebar").hasClass("sidebar-no-expand"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".main-sidebar").addClass("sidebar-no-expand");
    } else {
      $(".main-sidebar").removeClass("sidebar-no-expand");
    }
  });
  var $no_expand_sidebar_container = $("<div />", { class: "mb-4" })
    .append($no_expand_sidebar_checkbox)
    .append("<span>Disable Hover/Focus Auto-Expand</span>");
  $container.append($no_expand_sidebar_container);

  $container.append("<h6>Footer Options</h6>");
  var $footer_fixed_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("layout-footer-fixed"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("layout-footer-fixed");
    } else {
      $("body").removeClass("layout-footer-fixed");
    }
  });
  var $footer_fixed_container = $("<div />", { class: "mb-4" })
    .append($footer_fixed_checkbox)
    .append("<span>Fixed</span>");
  $container.append($footer_fixed_container);

  $container.append("<h6>Small Text Options</h6>");

  var $text_sm_body_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $("body").hasClass("text-sm"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $("body").addClass("text-sm");
    } else {
      $("body").removeClass("text-sm");
    }
  });
  var $text_sm_body_container = $("<div />", { class: "mb-1" })
    .append($text_sm_body_checkbox)
    .append("<span>Body</span>");
  $container.append($text_sm_body_container);

  var $text_sm_header_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".main-header").hasClass("text-sm"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".main-header").addClass("text-sm");
    } else {
      $(".main-header").removeClass("text-sm");
    }
  });
  var $text_sm_header_container = $("<div />", { class: "mb-1" })
    .append($text_sm_header_checkbox)
    .append("<span>Navbar</span>");
  $container.append($text_sm_header_container);

  var $text_sm_brand_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".brand-link").hasClass("text-sm"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".brand-link").addClass("text-sm");
    } else {
      $(".brand-link").removeClass("text-sm");
    }
  });
  var $text_sm_brand_container = $("<div />", { class: "mb-1" })
    .append($text_sm_brand_checkbox)
    .append("<span>Brand</span>");
  $container.append($text_sm_brand_container);

  var $text_sm_sidebar_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".nav-sidebar").hasClass("text-sm"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".nav-sidebar").addClass("text-sm");
    } else {
      $(".nav-sidebar").removeClass("text-sm");
    }
  });
  var $text_sm_sidebar_container = $("<div />", { class: "mb-1" })
    .append($text_sm_sidebar_checkbox)
    .append("<span>Sidebar Nav</span>");
  $container.append($text_sm_sidebar_container);

  var $text_sm_footer_checkbox = $("<input />", {
    type: "checkbox",
    value: 1,
    checked: $(".main-footer").hasClass("text-sm"),
    class: "mr-1",
  }).on("click", function () {
    if ($(this).is(":checked")) {
      $(".main-footer").addClass("text-sm");
    } else {
      $(".main-footer").removeClass("text-sm");
    }
  });
  var $text_sm_footer_container = $("<div />", { class: "mb-4" })
    .append($text_sm_footer_checkbox)
    .append("<span>Footer</span>");
  $container.append($text_sm_footer_container);

  // Color Arrays

  var navbar_dark_skins = [
    "navbar-primary",
    "navbar-secondary",
    "navbar-info",
    "navbar-success",
    "navbar-danger",
    "navbar-indigo",
    "navbar-purple",
    "navbar-pink",
    "navbar-navy",
    "navbar-lightblue",
    "navbar-teal",
    "navbar-cyan",
    "navbar-dark",
    "navbar-gray-dark",
    "navbar-gray",
  ];

  var navbar_light_skins = [
    "navbar-light",
    "navbar-warning",
    "navbar-white",
    "navbar-orange",
  ];

  var sidebar_colors = [
    "bg-primary",
    "bg-warning",
    "bg-info",
    "bg-danger",
    "bg-success",
    "bg-indigo",
    "bg-lightblue",
    "bg-navy",
    "bg-purple",
    "bg-fuchsia",
    "bg-pink",
    "bg-maroon",
    "bg-orange",
    "bg-lime",
    "bg-teal",
    "bg-olive",
  ];

  var accent_colors = [
    "accent-primary",
    "accent-warning",
    "accent-info",
    "accent-danger",
    "accent-success",
    "accent-indigo",
    "accent-lightblue",
    "accent-navy",
    "accent-purple",
    "accent-fuchsia",
    "accent-pink",
    "accent-maroon",
    "accent-orange",
    "accent-lime",
    "accent-teal",
    "accent-olive",
  ];

  var sidebar_skins = [
    "sidebar-dark-primary",
    "sidebar-dark-warning",
    "sidebar-dark-info",
    "sidebar-dark-danger",
    "sidebar-dark-success",
    "sidebar-dark-indigo",
    "sidebar-dark-lightblue",
    "sidebar-dark-navy",
    "sidebar-dark-purple",
    "sidebar-dark-fuchsia",
    "sidebar-dark-pink",
    "sidebar-dark-maroon",
    "sidebar-dark-orange",
    "sidebar-dark-lime",
    "sidebar-dark-teal",
    "sidebar-dark-olive",
    "sidebar-light-primary",
    "sidebar-light-warning",
    "sidebar-light-info",
    "sidebar-light-danger",
    "sidebar-light-success",
    "sidebar-light-indigo",
    "sidebar-light-lightblue",
    "sidebar-light-navy",
    "sidebar-light-purple",
    "sidebar-light-fuchsia",
    "sidebar-light-pink",
    "sidebar-light-maroon",
    "sidebar-light-orange",
    "sidebar-light-lime",
    "sidebar-light-teal",
    "sidebar-light-olive",
  ];

  // Navbar Variants

  $container.append("<h6>Navbar Variants</h6>");

  var $navbar_variants = $("<div />", {
    class: "d-flex",
  });
  var navbar_all_colors = navbar_dark_skins.concat(navbar_light_skins);
  var $navbar_variants_colors = createSkinBlock(navbar_all_colors, function () {
    var color = $(this).find("option:selected").attr("class");
    var $main_header = $(".main-header");
    $main_header.removeClass("navbar-dark").removeClass("navbar-light");
    navbar_all_colors.forEach(function (color) {
      $main_header.removeClass(color);
    });

    $(this).removeClass().addClass("custom-select mb-3 text-light border-0 ");

    if (navbar_dark_skins.indexOf(color) > -1) {
      $main_header.addClass("navbar-dark");
      $(this).addClass(color).addClass("text-light");
    } else {
      $main_header.addClass("navbar-light");
      $(this).addClass(color);
    }

    $main_header.addClass(color);
  });

  var active_navbar_color = null;
  $(document).ready(function () {
    $(".main-header")[0].classList.forEach(function (className) {
      if (
        navbar_all_colors.indexOf(className) > -1 &&
        active_navbar_color === null
      ) {
        active_navbar_color = className.replace("navbar-", "bg-");
      }
    });
  });

  $navbar_variants_colors
    .find("option." + active_navbar_color)
    .prop("selected", true);
  $navbar_variants_colors
    .removeClass()
    .addClass("custom-select mb-3 text-light border-0 ")
    .addClass(active_navbar_color);

  $navbar_variants.append($navbar_variants_colors);

  $container.append($navbar_variants);

  // Sidebar Colors

  $container.append("<h6>Accent Color Variants</h6>");
  var $accent_variants = $("<div />", {
    class: "d-flex",
  });
  $container.append($accent_variants);
  $container.append(
    createSkinBlock(
      accent_colors,
      function () {
        var color = $(this).find("option:selected").attr("class");
        var $body = $("body");
        accent_colors.forEach(function (skin) {
          $body.removeClass(skin);
        });

        var accent_color_class = color.replace("bg-", "accent-");

        $body.addClass(accent_color_class);
      },
      true
    )
  );

  var active_accent_color = null;
  $("body")[0].classList.forEach(function (className) {
    if (accent_colors.indexOf(className) > -1 && active_accent_color === null) {
      active_accent_color = className.replace("navbar-", "bg-");
    }
  });

  // $accent_variants.find('option.' + active_accent_color).prop('selected', true)
  // $accent_variants.removeClass().addClass('custom-select mb-3 text-light border-0 ').addClass(active_accent_color)

  $container.append("<h6>Dark Sidebar Variants</h6>");
  var $sidebar_variants_dark = $("<div />", {
    class: "d-flex",
  });
  $container.append($sidebar_variants_dark);
  var $sidebar_dark_variants = createSkinBlock(
    sidebar_colors,
    function () {
      var color = $(this).find("option:selected").attr("class");
      var sidebar_class = "sidebar-dark-" + color.replace("bg-", "");
      var $sidebar = $(".main-sidebar");
      sidebar_skins.forEach(function (skin) {
        $sidebar.removeClass(skin);
        $sidebar_light_variants
          .removeClass(skin.replace("sidebar-dark-", "bg-"))
          .removeClass("text-light");
      });

      $(this)
        .removeClass()
        .addClass("custom-select mb-3 text-light border-0")
        .addClass(color);

      $sidebar_light_variants.find("option").prop("selected", false);
      $sidebar.addClass(sidebar_class);
      $(".sidebar").removeClass("os-theme-dark").addClass("os-theme-light");
    },
    true
  );
  $container.append($sidebar_dark_variants);

  var active_sidebar_dark_color = null;
  $(document).ready(function () {
    $(".main-sidebar")[0].classList.forEach(function (className) {
      var color = className.replace("sidebar-dark-", "bg-");
      if (
        sidebar_colors.indexOf(color) > -1 &&
        active_sidebar_dark_color === null
      ) {
        active_sidebar_dark_color = color;
      }
    });
  });

  $sidebar_dark_variants
    .find("option." + active_sidebar_dark_color)
    .prop("selected", true);
  $sidebar_dark_variants
    .removeClass()
    .addClass("custom-select mb-3 text-light border-0 ")
    .addClass(active_sidebar_dark_color);

  $container.append("<h6>Light Sidebar Variants</h6>");
  var $sidebar_variants_light = $("<div />", {
    class: "d-flex",
  });
  $container.append($sidebar_variants_light);
  var $sidebar_light_variants = createSkinBlock(
    sidebar_colors,
    function () {
      var color = $(this).find("option:selected").attr("class");
      var sidebar_class = "sidebar-light-" + color.replace("bg-", "");
      var $sidebar = $(".main-sidebar");
      sidebar_skins.forEach(function (skin) {
        $sidebar.removeClass(skin);
        $sidebar_dark_variants
          .removeClass(skin.replace("sidebar-light-", "bg-"))
          .removeClass("text-light");
      });

      $(this)
        .removeClass()
        .addClass("custom-select mb-3 text-light border-0")
        .addClass(color);

      $sidebar_dark_variants.find("option").prop("selected", false);
      $sidebar.addClass(sidebar_class);
      $(".sidebar").removeClass("os-theme-light").addClass("os-theme-dark");
    },
    true
  );
  $container.append($sidebar_light_variants);

  var active_sidebar_light_color = null;
  $(document).ready(function () {
    $(".main-sidebar")[0].classList.forEach(function (className) {
      var color = className.replace("sidebar-light-", "bg-");
      if (
        sidebar_colors.indexOf(color) > -1 &&
        active_sidebar_light_color === null
      ) {
        active_sidebar_light_color = color;
      }
    });
  });

  if (active_sidebar_light_color !== null) {
    $sidebar_light_variants
      .find("option." + active_sidebar_light_color)
      .prop("selected", true);
    $sidebar_light_variants
      .removeClass()
      .addClass("custom-select mb-3 text-light border-0 ")
      .addClass(active_sidebar_light_color);
  }

  var logo_skins = navbar_all_colors;
  $container.append("<h6>Brand Logo Variants</h6>");
  var $logo_variants = $("<div />", {
    class: "d-flex",
  });
  $container.append($logo_variants);
  var $clear_btn = $("<a />", {
    href: "#",
  })
    .text("clear")
    .on("click", function (e) {
      e.preventDefault();
      var $logo = $(".brand-link");
      logo_skins.forEach(function (skin) {
        $logo.removeClass(skin);
      });
    });

  var $brand_variants = createSkinBlock(
    logo_skins,
    function () {
      var color = $(this).find("option:selected").attr("class");
      var $logo = $(".brand-link");

      if (color === "navbar-light" || color === "navbar-white") {
        $logo.addClass("text-black");
      } else {
        $logo.removeClass("text-black");
      }

      logo_skins.forEach(function (skin) {
        $logo.removeClass(skin);
      });

      if (color) {
        $(this)
          .removeClass()
          .addClass("custom-select mb-3 border-0")
          .addClass(color)
          .addClass(
            color !== "navbar-light" && color !== "navbar-white"
              ? "text-light"
              : ""
          );
      } else {
        $(this).removeClass().addClass("custom-select mb-3 border-0");
      }

      $logo.addClass(color);
    },
    true
  ).append($clear_btn);
  $container.append($brand_variants);

  var active_brand_color = null;
  $(document).ready(function () {
    $(".brand-link")[0].classList.forEach(function (className) {
      if (logo_skins.indexOf(className) > -1 && active_brand_color === null) {
        active_brand_color = className.replace("navbar-", "bg-");
      }
    });
  });

  if (active_brand_color) {
    $brand_variants.find("option." + active_brand_color).prop("selected", true);
    $brand_variants
      .removeClass()
      .addClass("custom-select mb-3 text-light border-0 ")
      .addClass(active_brand_color);
  }
})(jQuery);
