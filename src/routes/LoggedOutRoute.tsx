import * as React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import { Login } from "../components/Login";

const LoggedOutRoute: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};

export default LoggedOutRoute;
