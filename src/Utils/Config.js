import React from "react";
import AuthHandler from "./AuthHandler";

const Config = () => {
  const PORT = process.env.PORT ? process.env.PORT : "3001";
  const url = "https://backend-4u9g.onrender.com";
  // const url = "http://localhost:3001";

  const getUrlWithQuery = (endpoint) => url + endpoint + AuthHandler.getQuery();

  const loginUrl = getUrlWithQuery("/api/login");
  const register = getUrlWithQuery("/api/register");
  const homeUrl = getUrlWithQuery("/api/home");
  const userUrl = getUrlWithQuery("/api/adm_userrole");
  const userRightsUrl = getUrlWithQuery("/api/adm_userrights");
  const showRights = getUrlWithQuery("/api/post_userrights");
  const deleteUserRoleUrl = getUrlWithQuery("/api/delete_adm_userrole");
  const logoutPageUrl = `/${AuthHandler.getQuery()}`;
  const resetUrl = getUrlWithQuery("/api/delete_adm_userrights");
  const usermasterUrl = getUrlWithQuery("/api/adm_usermaster");
  const addUser = getUrlWithQuery("/api/post_adduser");
  const deleteUser = getUrlWithQuery("/api/post_deleteuser");
  const updateUser = getUrlWithQuery("/api/post_updateuser");
  const location = getUrlWithQuery("/api/mst_location");
  const Branch = getUrlWithQuery("/api/adm_branch");
  const addlocation = getUrlWithQuery("/api/post_addlocation");
  const marketareaemployee = getUrlWithQuery("/api/post_marketarea");
  const getacGlGroup = getUrlWithQuery("/api/post_acGlGroup");
  const getacGl = getUrlWithQuery("/api/post_acGl");
  const addacglgroup = getUrlWithQuery("/api/post_addAcGlGroup");
  const getaccounts = getUrlWithQuery("/api/post_accounts");
  const getmktArea = getUrlWithQuery("/api/post_mktArea");
  const getacadress = getUrlWithQuery("/api/post_acadress");
  const addacadress = getUrlWithQuery("/api/post_addacadress");
  const getAcTypes = getUrlWithQuery("/api/post_acTypes");
  const getDeptTypes = getUrlWithQuery("/api/post_deptTypes");
  const random = getUrlWithQuery("/api/random");
  const unit = getUrlWithQuery("/api/mst_unit");
  const prodCompany = getUrlWithQuery("/api/mst_prodCompany");
  const prodType = getUrlWithQuery("/api/mst_prodTypes");
  const prodMaster = getUrlWithQuery("/api/mst_prodMaster");
  const finYear = getUrlWithQuery("/api/adm_finYear");
  const accounts = getUrlWithQuery("/api/mst_accounts");
  const acglgroup = getUrlWithQuery("/api/mst_acglgroup");
  const acgl = getUrlWithQuery("/api/mst_acgl");
  const acadress = getUrlWithQuery("/api/mst_acadress");
  const paymentTerms = getUrlWithQuery("/api/mst_paymentTerms");
  const dc = getUrlWithQuery("/api/inv_dc");
  const soft = getUrlWithQuery("/api/soft");
  const ledger = getUrlWithQuery("/api/inv_ledger");
  const both = getUrlWithQuery("/api/inv_both");
  const batch = getUrlWithQuery("/api/batch");
  const accounting = getUrlWithQuery("/api/accounting");
  const stockReport = getUrlWithQuery("/api/stockReport");
  const acReport = getUrlWithQuery("/api/acReport");
  const bankReport = getUrlWithQuery("/api/bankReport");
  const mktArea = getUrlWithQuery("/api/mst_mktArea");
  const none = getUrlWithQuery("/api/inv_none");
  const trialBalance = getUrlWithQuery("/api/trialBalance");
  const stockConversion = getUrlWithQuery("/api/inv_stockConversion");
  const tally = getUrlWithQuery("/api/tally");
  const whatsapp = getUrlWithQuery("/api/whatsapp");

  return {
    loginUrl,
    register,
    homeUrl,
    userUrl,
    userRightsUrl,
    showRights,
    deleteUserRoleUrl,
    logoutPageUrl,
    resetUrl,
    usermasterUrl,
    addUser,
    deleteUser,
    updateUser,
    location,
    Branch,
    addlocation,
    marketareaemployee,
    getacGlGroup,
    getacGl,
    addacglgroup,
    getaccounts,
    getmktArea,
    getacadress,
    addacadress,
    getAcTypes,
    getDeptTypes,
    random,
    unit,
    prodCompany,
    prodType,
    prodMaster,
    finYear,
    accounts,
    acglgroup,
    acgl,
    acadress,
    paymentTerms,
    dc,
    soft,
    ledger,
    both,
    batch,
    accounting,
    stockReport,
    acReport,
    bankReport,
    mktArea,
    none,
    trialBalance,
    stockConversion,
    tally,
    whatsapp,
  };
};

export default Config;
