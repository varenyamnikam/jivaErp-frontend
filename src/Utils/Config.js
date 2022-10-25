import React, { useEffect, useState } from "react";
import AuthHandler from "./AuthHandler";

const PORT = process.env.PORT;

// console.log(userCompanyCode, userCode);
class Config {
  static query = AuthHandler.getQuery();
  //FOR TEST URL
  // static loginUrl = "/login";
  // static register = "/register";
  // static homeUrl = "/home";
  // static userUrl = "/adm_userrole";
  // // static postuserroleUrl = "/post_userrole"  ;
  // static userRightsUrl = "/adm_userrights";
  // static showRights = "/post_userrights";
  // static deleteUserRoleUrl = "/delete_adm_userrole";
  // static logoutPageUrl = "/login";
  // static resetUrl = "/delete_adm_userrights";
  // static usermasterUrl = "/adm_usermaster";
  // static addUser = "/post_adduser";
  // static deleteUser = "/post_deleteuser";
  // static updateUser = "/post_updateuser";
  // static location = "/post_location";
  // static Branch = "/adm_branch";
  // static deleteBranch = "/post_deletebranch";
  // static updateBranch = "/post_updatebranch";
  // static addlocation = "/post_addlocation";
  // static marketareaemployee = "/post_marketarea";
  // static getacGlGroup = "/post_acGlGroup";
  // static getacGl = "/post_acGl";
  // static addacglgroup = "/post_addAcGlGroup";
  // static getaccounts = "/post_accounts";
  // static getmktArea = "/post_mktArea";
  // static getacadress = "/post_acadress";
  // static addacadress = "/post_addacadress";
  // static getAcTypes = "/post_acTypes";
  // static getDeptTypes = "/post_deptTypes";
  // static random = "/random";
  // static unit = "/mst_unit";
  // static prodCompany = "/mst_prodCompany";
  // static prodType = "/mst_prodTypes";
  // static prodMaster = "/mst_prodMaster";
  // static finYear = "/adm_finYear";
  // static accounts = "/mst_accounts";
  // static acglgroup = "/mst_acglgroup";
  // static acgl = "/mst_acgl";
  // static acadress = "/mst_acadress";
  // static paymentTerms = "/mst_paymentTerms";
  // static dc = "/inv_dc";
  // static soft = "/soft";

  static loginUrl = "http://Localhost:3001/login";
  static registerUrl = "http://Localhost:3001/register";
  static homeUrl = "http://Localhost:3001/home";
  static userUrl = "http://localhost:3001/adm_userrole";
  // static postuserroleUrl = "http://localhost:3001/post_userrole" ;
  static userRightsUrl = "http://localhost:3001/adm_userrights";
  static showRights = "http://localhost:3001/post_userrights";
  static deleteUserRoleUrl = "http://localhost:3001/delete_adm_userrole";
  static logoutPageUrl = "/login";
  static resetUrl = "http://localhost:3001/delete_adm_userrights";
  static usermasterUrl = "http://localhost:3001/adm_usermaster";
  static addUser = "http://localhost:3001/post_adduser";
  static deleteUser = "http://localhost:3001/post_deleteuser";
  static updateUser = "http://localhost:3001/post_updateuser";
  static location = "http://localhost:3001/post_location";
  static Branch = "http://localhost:3001/adm_branch";
  static deleteBranch = "http://localhost:3001/post_deletebranch";
  static updateBranch = "http://localhost:3001/post_updatebranch";
  static addlocation = "http://localhost:3001/post_addlocation";
  static marketareaemployee = "http://localhost:3001/post_marketarea";
  static getacGlGroup = "http://localhost:3001/post_acGlGroup";
  static getacGl = "http://localhost:3001/post_acGl";
  static addacglgroup = "http://localhost:3001/post_addAcGlGroup";
  static getaccounts = "http://localhost:3001/post_accounts";
  static getmktArea = "http://localhost:3001/post_mktArea";
  static getacadress = "http://localhost:3001/post_acadress";
  static addacadress = "http://localhost:3001/post_addacadress";
  static getAcTypes = "http://localhost:3001/post_acTypes";
  static getDeptTypes = "http://localhost:3001/post_deptTypes";
  static random = "http://localhost:3001/random";
  static unit = "http://localhost:3001/mst_unit";
  static prodCompany = "http://localhost:3001/mst_prodCompany";
  static prodType = "http://localhost:3001/mst_prodTypes";
  static prodMaster = "http://localhost:3001/mst_prodMaster";
  static finYear = "http://localhost:3001/adm_finYear";
  static accounts = "http://localhost:3001/mst_accounts";
  static acglgroup = "http://localhost:3001/mst_acglgroup";
  static acgl = "http://localhost:3001/mst_acgl";
  static acadress = "http://localhost:3001/mst_acadress";
  static paymentTerms = "http://localhost:3001/mst_paymentTerms";
  static mktArea = "http://localhost:3001/mst_mktArea";
  static register = "http://localhost:3001/register";
  static dc = "http://localhost:3001/inv_dc";
  static ledger = "http://localhost:3001/inv_ledger";
  static both = "http://localhost:3001/inv_both";

  static soft = "http://localhost:3001/soft";

  static sidebarItem = [
    { index: "0", title: "Home", url: "/home", icons: "home" },
    { index: "1", title: "Role", url: "/Admin/RoleMaster" },
  ];
}

export default Config;
// export default function Config() {
//   console.log(userCompanyCode, userCode);
//   const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
//   //FOR TEST URL
//   // static loginUrl = "/login";
//   // static registerUrl = "/register";
//   // static homeUrl = "/home" + this.query;
//   // static userUrl = "/adm_userrole" + this.query;
//   // // static postuserroleUrl = "/post_userrole" + this.query;
//   // static userRightsUrl = "/adm_userrights" + this.query;
//   // static showRights = "/post_userrights" + this.query;
//   // static deleteUserRoleUrl = "/delete_adm_userrole" + this.query;
//   // static logoutPageUrl = "/login" + this.query;
//   // static resetUrl = "/delete_adm_userrights" + this.query;
//   // static usermasterUrl = "/adm_usermaster" + this.query;
//   // static addUser = "/post_adduser" + this.query;
//   // static deleteUser = "/post_deleteuser" + this.query;
//   // static updateUser = "/post_updateuser" + this.query;
//   // static location = "/post_location" + this.query;
//   // static Branch = "/adm_branch" + this.query;
//   // static deleteBranch = "/post_deletebranch" + this.query;
//   // static updateBranch = "/post_updatebranch" + this.query;
//   // static addlocation = "/post_addlocation" + this.query;
//   // static marketareaemployee = "/post_marketarea" + this.query;
//   // static getacGlGroup = "/post_acGlGroup" + this.query;
//   // static getacGl = "/post_acGl" + this.query;
//   // static addacglgroup = "/post_addAcGlGroup" + this.query;
//   // static getaccounts = "/post_accounts" + this.query;
//   // static getmktArea = "/post_mktArea" + this.query;
//   // static getacadress = "/post_acadress" + this.query;
//   // static addacadress = "/post_addacadress" + this.query;
//   // static getAcTypes = "/post_acTypes" + this.query;
//   // static getDeptTypes = "/post_deptTypes" + this.query;
//   // static random = "/random" + this.query;
//   // static unit = "/mst_unit" + this.query;
//   // static prodCompany = "/mst_prodCompany" + this.query;
//   // static prodType = "/mst_prodTypes" + this.query;
//   // static prodMaster = "/mst_prodMaster" + this.query;
//   // static finYear = "/adm_finYear" + this.query;
//   // static accounts = "/mst_accounts" + this.query;
//   // static acglgroup = "/mst_acglgroup" + this.query;
//   // static acgl = "/mst_acgl" + this.query;
//   // static acadress = "/mst_acadress" + this.query;
//   // static paymentTerms = "/mst_paymentTerms" + this.query;
//   const loginUrl = "http://Localhost:3001/login";
//   const registerUrl = "http://Localhost:3001/register";
//   const homeUrl = "http://Localhost:3001/home" + query;
//   const userUrl = "http://localhost:3001/adm_userrole" + query;
//   // const postuserroleUrl = "http://localhost:3001/post_userrole" + query;
//   const userRightsUrl = "http://localhost:3001/adm_userrights" + query;
//   const showRights = "http://localhost:3001/post_userrights" + query;
//   const deleteUserRoleUrl = "http://localhost:3001/delete_adm_userrole" + query;
//   const logoutPageUrl = "/login" + query;
//   const resetUrl = "http://localhost:3001/delete_adm_userrights" + query;
//   const usermasterUrl = "http://localhost:3001/adm_usermaster" + query;
//   const addUser = "http://localhost:3001/post_adduser" + query;
//   const deleteUser = "http://localhost:3001/post_deleteuser" + query;
//   const updateUser = "http://localhost:3001/post_updateuser" + query;
//   const location = "http://localhost:3001/post_location" + query;
//   const Branch = "http://localhost:3001/adm_branch" + query;
//   const deleteBranch = "http://localhost:3001/post_deletebranch" + query;
//   const updateBranch = "http://localhost:3001/post_updatebranch" + query;
//   const addlocation = "http://localhost:3001/post_addlocation" + query;
//   const marketareaemployee = "http://localhost:3001/post_marketarea" + query;
//   const getacGlGroup = "http://localhost:3001/post_acGlGroup" + query;
//   const getacGl = "http://localhost:3001/post_acGl" + query;
//   const addacglgroup = "http://localhost:3001/post_addAcGlGroup" + query;
//   const getaccounts = "http://localhost:3001/post_accounts" + query;
//   const getmktArea = "http://localhost:3001/post_mktArea" + query;
//   const getacadress = "http://localhost:3001/post_acadress" + query;
//   const addacadress = "http://localhost:3001/post_addacadress" + query;
//   const getAcTypes = "http://localhost:3001/post_acTypes" + query;
//   const getDeptTypes = "http://localhost:3001/post_deptTypes" + query;
//   const random = "http://localhost:3001/random" + query;
//   const unit = "http://localhost:3001/mst_unit" + query;
//   const prodCompany = "http://localhost:3001/mst_prodCompany" + query;
//   const prodType = "http://localhost:3001/mst_prodTypes" + query;
//   const prodMaster = "http://localhost:3001/mst_prodMaster" + query;
//   const finYear = "http://localhost:3001/adm_finYear" + query;
//   const accounts = "http://localhost:3001/mst_accounts" + query;
//   const acglgroup = "http://localhost:3001/mst_acglgroup" + query;
//   const acgl = "http://localhost:3001/mst_acgl" + query;
//   const acadress = "http://localhost:3001/mst_acadress" + query;
//   const paymentTerms = "http://localhost:3001/mst_paymentTerms" + query;
//   const mktArea = "http://localhost:3001/mst_mktArea" + query;
//   const register = "http://localhost:3001/register";

//   const sidebarItem = [
//     { index: "0", title: "Home", url: "/home", icons: "home" },
//     { index: "1", title: "Role", url: "/Admin/RoleMaster" },
//   ];
// }
