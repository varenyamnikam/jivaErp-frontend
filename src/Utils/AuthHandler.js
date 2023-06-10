import axios from "axios";
import Config from "../Utils/Config";
import { Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import PropTypes from "prop-types";
import { user } from "react-icons-kit/fa/user";
const newParty = {
  transactnValue: null,
  transactnList: null,

  path: "/home",
  transactnOpen: false,
  partyOpen: false,
};
let temp = [];

function flattenArray(array) {
  array.map((item) => {
    if (item.pageLink && item.pageLink !== "#") {
      temp.push({
        screenName: item.screenName,
        link: item.pageLink,
        ...item,
      });
    }
    if ("subNav" in item) {
      flattenArray(item.subNav);
    }
  });
  return temp;
}

class AuthHandler {
  static login(usrCode, usrPassword, usrCompanyCode, callback) {
    console.log(Config().loginUrl);
    axios
      .post(Config().loginUrl, {
        usrCode: usrCode,
        usrPassword: usrPassword,
        usrCompanyCode: usrCompanyCode,
      })
      .then(function (response) {
        // if (response.status === 200) {
        if (response.data.auth) {
          console.log(response.data);
          console.log(response.data.user);
          // localStorage.clear();
          reactLocalStorage.set("token", response.data.token);
          reactLocalStorage.set("userName", response.data.userName);
          localStorage.setItem("userCode", response.data.userCode);

          localStorage.setItem(
            "adm_userrights",
            JSON.stringify(response.data.adm_userrights)
          );
          localStorage.setItem("newParty", JSON.stringify(newParty));

          localStorage.setItem(
            "adm_softwareSettings",
            JSON.stringify(response.data.adm_softwareSettings)
          );
          const usr = response.data.user;
          const obj = {
            ...usr,
            currentBranchCode: usr.defaultBranchCode,
            currentBranchName: usr.defaultBranchName,
            currentFinYear: usr.defaultFinYear,
            currentYearCode: usr.defaultYearCode,
            currentYearEnd: usr.defaultYearEnd,
            currentYearStart: usr.defaultYearStart,
          };
          console.log(obj);
          localStorage.setItem("user", JSON.stringify(obj));
          localStorage.setItem(
            "userCompanyCode",
            response.data.userCompanyCode
          );
          reactLocalStorage.set(
            "userCompanyName",
            response.data.userCompanyName
          );

          reactLocalStorage.set(
            "adm_screen",
            JSON.stringify(response.data.result)
          );
          reactLocalStorage.set(
            "company",
            JSON.stringify(response.data.company)
          );

          //reactLocalStorage.set("refresh", response.data.refresh)
          if (response.data.Status == "Active")
            callback({ error: false, message: "Login Successfull..." });
          else {
            callback({ error: true, message: "User is Inactive..." });
          }
        } else {
          callback({ error: true, message: "wrong userName/password" });
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          callback({
            error: true,
            message: "Error During Login Invalid Login Details..",
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          callback({
            error: true,
            message: "unable to connect to servers",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });
  }

  static loggedIn() {
    if (reactLocalStorage.get("token")) {
      return true;
    } else {
      return false;
    }
  }
  static getLoginToken() {
    return reactLocalStorage.get("token");
  }
  static getResetParty() {
    return newParty;
  }

  static getMenuItem() {
    return JSON.parse(reactLocalStorage.get("adm_screen"));
  }
  static menuArr() {
    return flattenArray(JSON.parse(reactLocalStorage.get("adm_screen")));
  }

  static getUserRole() {
    return JSON.parse(reactLocalStorage.get("adm_userrole"));
  }

  static getUserName() {
    return reactLocalStorage.get("userName");
  }
  static getUserCode() {
    console.log("hi**", localStorage.getItem("userCode"));
    return localStorage.getItem("userCode");
  }

  static getUserCompanyCode() {
    console.log("hi**", localStorage.getItem("userCode"));
    return localStorage.getItem("userCompanyCode");
  }
  static getUser() {
    if (localStorage.getItem("user"))
      return JSON.parse(localStorage.getItem("user"));
    else {
      return null;
    }
  }
  static getCompany() {
    return JSON.parse(localStorage.getItem("company"));
  }
  static setCompany(values) {
    reactLocalStorage.set("company", JSON.stringify(values));
  }
  static getImage() {
    return localStorage.getItem("recent-image");
  }
  static getSettings(updatedSettings) {
    return JSON.parse(localStorage.getItem("adm_softwareSettings"));
  }
  static setNewParty(newParty) {
    localStorage.setItem("newParty", JSON.stringify(newParty));
  }
  static getNewParty() {
    return JSON.parse(localStorage.getItem("newParty"));
  }
  static updateSettings(updatedSettings) {
    localStorage.setItem(
      "adm_softwareSettings",
      JSON.stringify(updatedSettings)
    );
  }
  static getUserRights() {
    return JSON.parse(localStorage.getItem("adm_userrights"));
  }
  static setScreenCode(code) {
    localStorage.setItem("screenCode", code);
  }
  static getColour() {
    return JSON.parse(localStorage.getItem("newParty"));
  }

  static getQuery() {
    const user = AuthHandler.getUser()
      ? AuthHandler.getUser()
      : { userCode: null, userCompanyCode: null };

    const userCode = user.userCode;
    const userCompanyCode = user.userCompanyCode;
    const query = `?userCompanyCode=${userCompanyCode}&userCode=${userCode}`;
    return query;
  }
  static getUrl() {
    // return "http://localhost:3001/";
    return "http://147.182.252.2:3001";
  }
  static canAdd() {
    const userRights = JSON.parse(localStorage.getItem("adm_userrights"));
    let menuObj = this.menuArr().find(
      (item) => item.pageLink == window.location.pathname
    );
    const screenCode = menuObj ? menuObj.screenCode : "";

    return userRights.addRight.includes(screenCode);
  }
  static canEdit() {
    const userRights = JSON.parse(localStorage.getItem("adm_userrights"));
    let menuObj = this.menuArr().find(
      (item) => item.pageLink == window.location.pathname
    );
    const screenCode = menuObj ? menuObj.screenCode : "";
    return userRights.editRight.includes(screenCode);
  }
  static canDelete() {
    const userRights = JSON.parse(localStorage.getItem("adm_userrights"));
    let menuObj = this.menuArr().find(
      (item) => item.pageLink == window.location.pathname
    );
    const screenCode = menuObj ? menuObj.screenCode : "";
    console.log(menuObj, screenCode, window.location.pathname, this.menuArr());

    return userRights.deleteRight.includes(screenCode);
  }

  static logoutUser() {
    reactLocalStorage.remove("token");
    reactLocalStorage.remove("usrCode");
    reactLocalStorage.clear();
    localStorage.clear();
  }
}
export default AuthHandler;
