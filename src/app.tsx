import * as React from "react";
import { useState, useEffect } from "react";

import { TitlePage } from "./components/TitlePage";
import { Login } from "./components/Login";
import { Button } from "./components/Button";
import styled from "styled-components";
import * as Cookies from "js-cookie";
import { loginExpiryTime, domain, defaultPath } from "./constants";
import * as types from "../generated/common.types.generated";
import * as api from "../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";

const RootContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;

export type GlobalContextProps = {
  user: types.ShapeOfUser;
  loggedIn: boolean;
};

export const GlobalContext = React.createContext<GlobalContextProps>({
  user: {
    _id: "",
    username: "",
    email: "",
  },
  loggedIn: false,
});

export const App: React.FunctionComponent = () => {
  console.log(domain);
  const apiClient = api.client(axiosAdapter.bind);
  console.log("Before globalContext", Cookies.get());
  const [globalContext, setGlobalContext] = useState<GlobalContextProps>({
    user: {
      _id: "",
      username: "",
      email: "",
    },
    loggedIn: !!Cookies.get("access-token"),
  });

  useEffect(() => {
    async function effectHandle(): Promise<void> {
      const browserAccessToken = Cookies.get("access-token");
      if (browserAccessToken) {
        const response = await apiClient.login.post({
          body: runtime.client.json({ accessToken: browserAccessToken }),
        });
        if (response.status === 200) {
          console.log("Before loadLogin", Cookies.get());
          setGlobalContext({ ...globalContext, user: response.value.value });
          console.log("After loadLogin", Cookies.get());
        }
      }
    }
    effectHandle();
  }, []);

  function handleLoggedIn(user: types.ShapeOfUser): void {
    console.log("Before handleLoggedIn", Cookies.get());
    Cookies.set("access-token", user.accessToken, {
      expires: loginExpiryTime,
      domain: domain,
      path: defaultPath,
    });
    console.log("After handleLoggedIn", Cookies.get());
    setGlobalContext({ ...globalContext, user, loggedIn: true });
  }

  function handleLogOut(): void {
    console.log("Before handleLogOut", Cookies.get());
    Cookies.remove("access-token", {
      domain: domain,
      path: defaultPath,
    });
    console.log("After handleLogOut", Cookies.get());
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
    <GlobalContext.Provider value={globalContext}>
      <RootContainer>
        <Button onClick={handleLogOut} id="logout">
          Log out
        </Button>
        {globalContext.loggedIn ? (
          <TitlePage />
        ) : (
          <Login onSuccess={handleLoggedIn} />
        )}
      </RootContainer>
    </GlobalContext.Provider>
  );
};
