import * as React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import { TitlePage } from "../components/TitlePage";
import ErrorPage from "../components/ErrorPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";

const LoggedInRoute: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/home">
        <TitlePage />
      </Route>
      <Route exact path="/login">
        <Redirect to="/home" />
      </Route>
      <Route exact path="/profile">
        <ProfilePage />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route>
        <ErrorPage />
      </Route>
    </Switch>
  );
};

export default LoggedInRoute;
