import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "./views/pages/login.jsx";
import auth from "./services/authService";
import "assets/css/material-dashboard-react.css?v=1.10.0";

import ProtectedRoute from "./views/common/ProtectedRoute";
import ChangePassword from "./views/pages/changePassword";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    return (
      <React.Fragment>
        <Switch>
          <ProtectedRoute
            path="/admin"
            render={(props) => <Admin {...props} user={this.state.user} />}
          />
          <Route
            path="/login"
            component={(props) => <Login {...props} user={this.state.user} />}
          />
          <Route
            path={`/change-password/:id`}
            component={(props) => (
              <ChangePassword {...props} user={this.state.user} />
            )}
          />
          <Route path="/rtl" component={RTL} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
