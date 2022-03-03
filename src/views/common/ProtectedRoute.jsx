import React from "react";
import { Route, Redirect } from "react-router";
import auth from "./../../services/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = auth.getCurrentUser();

        if (!user || user.firstLogin == 1) {
          return (
            <Redirect
              //redirects to login (i.e login selection) , redirects to demanded page
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        return Component ? <Component {...props} user={user} /> : render(props);
      }}
    ></Route>
  );
};

export default ProtectedRoute;
