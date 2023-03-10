import axios from "axios";
import Config from "./Config";
import { Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import PropTypes from "prop-types";
const newParty = {
  transactnValue: null,
  transactnList: null,

  path: "/home",
  transactnOpen: false,
  partyOpen: false,
};
class AuthHandler {
  static login(usrCode, usrPassword, usrCompanyCode, callback) {
    axios
      .post(Config.loginUrl, {
        usrCode: usrCode,
        usrPassword: usrPassword,
        usrCompanyCode: usrCompanyCode,
      })
      .then(function (response) {
        // if (response.status === 200) {
        if (response.data.auth) {
          console.log(response.data);
          console.log(response.data.user);
          reactLocalStorage.set("token", response.data.token);
          reactLocalStorage.set("userName", response.data.userName);
          localStorage.setItem("userCode", response.data.userCode);
          localStorage.setItem("changeBranch", JSON.stringify({ open: false }));

          localStorage.setItem(
            "adm_userrights",
            JSON.stringify(response.data.adm_userrights)
          );
          localStorage.setItem("newParty", JSON.stringify(newParty));

          localStorage.setItem(
            "adm_softwareSettings",
            JSON.stringify(response.data.adm_softwareSettings)
          );
          reactLocalStorage.set("user", JSON.stringify(response.data.user));
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
  static getQuery() {
    return `?userCompanyCode=${localStorage.getItem(
      "userCompanyCode"
    )}&userCode=${localStorage.getItem("userCode")}`;
  }

  static logoutUser() {
    reactLocalStorage.remove("token");
    reactLocalStorage.remove("usrCode");
    reactLocalStorage.clear();
    localStorage.clear();
  }
}

export default AuthHandler;
