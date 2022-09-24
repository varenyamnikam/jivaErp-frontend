import axios from "axios";
import Config from "./Config";
import { Redirect } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import PropTypes from "prop-types";

class AuthHandler {
  static login(usrCode, usrPassword, callback) {
    axios
      .post(Config.loginUrl, { usrCode: usrCode, usrPassword: usrPassword })
      .then(function (response) {
        // if (response.status === 200) {
        if (response.data.auth) {
          reactLocalStorage.set("token", response.data.token);
          reactLocalStorage.set("usrCode", response.data.userName);
          reactLocalStorage.set(
            "adm_screen",
            JSON.stringify(response.data.result)
          );

          //reactLocalStorage.set("refresh", response.data.refresh)
          console.log(response.data.token);
          callback({ error: false, message: "Login Successfull..." });
        } else {
          console.log(JSON.stringify(response.data));
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

  static getMenuItem() {
    return JSON.parse(reactLocalStorage.get("adm_screen"));
  }

  static getUserRole() {
    return JSON.parse(reactLocalStorage.get("adm_userrole"));
  }

  static getUserCode() {
    return reactLocalStorage.get("usrCode");
  }

  static logoutUser() {
    reactLocalStorage.remove("token");
    reactLocalStorage.remove("usrCode");
  }
}

export default AuthHandler;
