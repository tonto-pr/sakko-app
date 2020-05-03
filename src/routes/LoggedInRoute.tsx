import * as React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import { TitlePage } from "../components/TitlePage";
import ErrorPage from "../components/ErrorPage";
const LoggedInRoute: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/home">
        <TitlePage />
      </Route>
      <Route path="/login">
        <Redirect to="/home" />
      </Route>
      <Route path="/">
        <ErrorPage />
      </Route>
    </Switch>
  );
};

export default LoggedInRoute;
