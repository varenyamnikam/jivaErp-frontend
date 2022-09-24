import React from "react";
import { Redirect } from "react-router-dom";
import AuthHandler from "../Utils/AuthHandler";

class LogoutComponent extends React.Component {
  render() {
    AuthHandler.logoutUser();
    return <Redirect to="/" />;
  }
}
export default LogoutComponent;
