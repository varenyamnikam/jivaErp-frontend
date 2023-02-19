import React from "react";
import { Navigate } from "react-router-dom";
import AuthHandler from "../Utils/AuthHandler";

class LogoutComponent extends React.Component {
  render() {
    AuthHandler.logoutUser();
    return <Navigate to="/" />;
  }
}
export default LogoutComponent;
