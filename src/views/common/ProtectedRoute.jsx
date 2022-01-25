import React from "react";
import { Route, Redirect } from "react-router";
import auth from "./../../services/authService";
const ProtectedRoute = ({ path, component: Component, render }) => {
  return (
    <Route
      path={path}
      render={(props) => {
        if (!auth.getCurrentUser())
          return (
            <Redirect
              //redirects to login (i.e login selection) , redirects to demanded page
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    ></Route>
  );
};

export default ProtectedRoute;
