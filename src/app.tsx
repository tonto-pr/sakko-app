import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "./components/Button";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import styled from "styled-components";
import * as Cookies from "js-cookie";
import { domain, defaultPath } from "./constants";
import * as types from "../generated/common.types.generated";
import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";

import LoggedInRoute from "./routes/LoggedInRoute";
import LoggedOutRoute from "./routes/LoggedOutRoute";

import { BrowserRouter as Router, Switch } from "react-router-dom";

const RootContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;

export type GlobalContextType = {
  user: types.ShapeOfUser;
  loggedIn: boolean;
};

export type GlobalContextProps = {
  globalContext: GlobalContextType;
  setGlobalContext: React.Dispatch<React.SetStateAction<GlobalContextType>>;
};

export const GlobalContext = React.createContext<GlobalContextProps>({
  globalContext: {
    user: {
      _id: "",
      username: "",
      email: "",
    },
    loggedIn: false,
  },
  setGlobalContext: () => null,
});

export const App: React.FunctionComponent = () => {
  const apiClient = api.client(axiosAdapter.bind);
  const [globalContext, setGlobalContext] = useState<GlobalContextType>({
    user: {
      _id: "",
      username: "",
      email: "",
    },
    loggedIn: !!Cookies.get("access-token"),
  });

  const context = { globalContext, setGlobalContext };

  useEffect(() => {
    async function effectHandle(): Promise<void> {
      const browserAccessToken = Cookies.get("access-token");
      if (browserAccessToken) {
        const response = await apiClient.login.post({
          body: runtime.client.json({ access_token: browserAccessToken }),
        });
        if (response.status === 200) {
          setGlobalContext({ ...globalContext, user: response.value.value });
        }
      }
    }
    effectHandle();
  }, []);

  function handleLogOut(): void {
    Cookies.remove("access-token", {
      domain: domain,
      path: defaultPath,
    });
    setGlobalContext({
      ...globalContext,
      user: {
        _id: "",
        username: "",
        email: "",
      },
      loggedIn: false,
    });
  }

  return (
    <Router>
      <GlobalContext.Provider value={context}>
        <RootContainer>
          <NavigationBar id="navbar">
            {globalContext.loggedIn && (
              <>
                <Button link="/home" id="home">
                  Home
                </Button>
                <Button onClick={handleLogOut} link="/" id="logout">
                  Log Out
                </Button>
                <Button link="/profile" id="profile">
                  Profile
                </Button>
              </>
            )}
          </NavigationBar>
          <Switch>
            {globalContext.loggedIn ? <LoggedInRoute /> : <LoggedOutRoute />}
          </Switch>
        </RootContainer>
      </GlobalContext.Provider>
    </Router>
  );
};
