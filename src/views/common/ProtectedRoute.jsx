import React from "react";
import { Route, Redirect } from "react-router";
import auth from "./../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      path={path}
      render={(props) => {
        const user = auth.getCurrentUser();

        try {
          if (!user || user.firstLogin == 1) {
            return (
              <Redirect
                //redirects to login (i.e login selection) , redirects to demanded page
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            );
          }
          return Component ? <Component {...props} /> : render(props);
        } catch (error) {
          window.location = "/admin/dashboard";
        }
      }}
    ></Route>
  );
};

export default ProtectedRoute;
