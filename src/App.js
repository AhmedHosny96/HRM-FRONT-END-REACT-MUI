import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "./views/pages/login.jsx";
import auth from "./services/authService";
import "assets/css/material-dashboard-react.css?v=1.10.0";

import ProtectedRoute from "./views/common/ProtectedRoute";
import ChangePassword from "./views/pages/changePassword";
import IdleTimer from "react-idle-timer";
import { NotFound } from "views/common/NotFound.jsx";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  handleOnAction(event) {
    // console.log("user did something", event);
  }

  handleOnActive(event) {
    // console.log("user is active", event);
    // console.log("time remaining", this.idleTimer.getRemainingTime());
  }

  handleOnIdle(event) {
    // console.log("user session ended", event);
    // remove the token from localstorage
    // console.log("last active", this.idleTimer.getLastActiveTime());

    auth.logout();
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <IdleTimer
          timeout={1000 * 60 * 15}
          onActive={this.handleOnAction}
          onIdle={this.handleOnIdle}
          onAction={this.handleOnAction}
          debounce={250}
        />
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
            path="/not-found"
            render={(props) => <NotFound {...props} />}
          />

          <Route
            path={"/change-password/:token"}
            exact
            render={(props) => {
              if (user && user.firstLogin == 0) {
                return (
                  <Redirect
                    to={{
                      pathname: "/not-found",
                      state: { from: props.location },
                    }}
                  />
                );
              }

              return <ChangePassword {...props} user={this.state.user} />;
            }}
          />

          <Route path="/rtl" component={RTL} />
          <Redirect from="*" to="/not-found" />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
