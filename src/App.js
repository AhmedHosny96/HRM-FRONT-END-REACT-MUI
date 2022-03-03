import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import Login from "./views/pages/login.jsx";
import auth from "./services/authService";
import "assets/css/material-dashboard-react.css?v=1.10.0";
import { io } from "socket.io-client";
import ProtectedRoute from "./views/common/ProtectedRoute";
import ChangePassword from "./views/pages/changePassword";
import { useIdleTimer } from "react-idle-timer";
import { NotFound } from "views/common/NotFound.jsx";
const App = () => {
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState(null);

  const handleOnIdle = (event) => {
    console.log("last active", getLastActiveTime());
    auth.logout();
  };

  const handleOnActive = (event) => {
    // console.log("user is active", event);
    // console.log("time remaining", getRemainingTime());
  };

  useEffect(() => {
    setUser(auth.getCurrentUser());
    // setSocket(io("http://localhost:8900"));
  }, []);

  useEffect(() => {
    // socket?.emit("newUser", user);
    // console.log(user);
  }, [user]);

  // logout timer

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  console.log(process.env.REACT_APP_PUBLIC_URL);

  //TODO: render user
  //: render user

  return (
    <React.Fragment>
      <Switch>
        <ProtectedRoute
          path={`/admin`}
          render={(props) => <Admin {...props} user={user} socket={socket} />}
        />
        <Route
          path="/login"
          component={(props) => <Login {...props} user={user} />}
        />
        <Route path="/not-found" render={(props) => <NotFound {...props} />} />

        <Route
          path={"/change-password/:id/:token"}
          exact
          render={(props) => {
            if (user) {
              return (
                <Redirect
                  to={{
                    pathname: "/not-found",
                    state: { from: props.location },
                  }}
                />
              );
            }
            return <ChangePassword {...props} user={user} />;
          }}
        />

        <Route path="/rtl" component={RTL} />
        <Redirect from="/" to="/admin/dashboard" exact />
        <Redirect from="*" to="/not-found" />
      </Switch>
    </React.Fragment>
  );
};

export default App;
