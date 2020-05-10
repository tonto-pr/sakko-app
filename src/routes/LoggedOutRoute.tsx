import * as React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import { Login } from "../components/Login";
import ErrorPage from "../components/ErrorPage";

const LoggedOutRoute: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route>
        <ErrorPage />
      </Route>
    </Switch>
  );
};

export default LoggedOutRoute;
