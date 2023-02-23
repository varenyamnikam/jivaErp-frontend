import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import AuthHandler from "./AuthHandler";
import MainComponent from "../components/MainComponent";
import jQuery from "jquery";
function checkAuth({ children }) {
  return AuthHandler.loggedIn() ? children : <Navigate to="/" />;
}
export var PrivateRouteNew = ({ Page, ...rest }) => {
  console.log(Page)
  return AuthHandler.loggedIn() ? (
    <MainComponent page={Page} />
  ) : (
    <Navigate to="/" />
  );
};
