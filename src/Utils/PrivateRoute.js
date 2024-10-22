import React, { Component } from "react";
import { Route, Navigate } from "react-router-dom";
import AuthHandler from "./AuthHandler";

export var PrivateRoute = ({ component: Component, ...rest }) => {
  console.log({ ...rest });

  return (
    <Route
      {...rest}
      render={(props) =>
        AuthHandler.loggedIn() ? <Component {...props} /> : <Navigate to="/" />
      }
    />
  );
};
