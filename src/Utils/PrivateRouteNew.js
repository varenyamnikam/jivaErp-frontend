import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthHandler from "./AuthHandler";
import MainComponent from "../components/MainComponent";
import jQuery from "jquery";
export var PrivateRouteNew = ({ page, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        AuthHandler.loggedIn() ? (
          <MainComponent page={page} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
