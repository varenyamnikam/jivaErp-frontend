class Config {
  //FOR TEST URL
  static loginUrl = "http://Localhost:3001/login";
  static registerUrl = "http://Localhost:3001/register";
  static homeUrl = "/home";
  static userUrl = "http://localhost:3001/adm_userrole";
  static postuserroleUrl = "http://localhost:3001/post_userrole";
  static postuserroleRightsUrl = "http://localhost:3001/adm_userrights";
  static showRights = "http://localhost:3001/post_userrights";
  static deleteUserRoleUrl = "http://localhost:3001/delete_adm_userrole";
  static logoutPageUrl = "/logout";
  static resetUrl = "http://localhost:3001/delete_adm_userrights";
  static usermasterUrl = "http://localhost:3001/adm_usermaster";
  static addUser = "http://localhost:3001/post_adduser";
  static deleteUser = "http://localhost:3001/post_deleteuser";
  static updateUser = "http://localhost:3001/post_updateuser";
  static location = "http://localhost:3001/post_location";
  static addBranch = "http://localhost:3001/post_addbranch";
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

  static sidebarItem = [
    { index: "0", title: "Home", url: "/home", icons: "home" },
    { index: "1", title: "Role", url: "/Admin/RoleMaster" },
  ];
}

export default Config;
