import * as React from "react";
import * as Cookies from "js-cookie";

import * as types from "../../generated/common.types.generated";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import { useState } from "react";

const defaultContext = {
  user: {
    username: "",
    email: "",
  },
  loggedIn: false,
};

type GlobalContextType = {
  user: types.ShapeOfUser;
  loggedIn: boolean;
};

type GlobalContextProps = {
  globalContext: GlobalContextType;
  setGlobalContext: React.Dispatch<React.SetStateAction<GlobalContextType>>;
};

export const GlobalContext = React.createContext<GlobalContextProps>({
  globalContext: defaultContext,
  setGlobalContext: () => null,
});

const useGlobalContext = (): [
  GlobalContextType,
  React.Dispatch<React.SetStateAction<GlobalContextType>>,
  boolean
] => {
  const apiClient = api.client(axiosAdapter.bind);
  const [globalContext, setGlobalContext] = useState<GlobalContextType>(
    defaultContext
  );
  const [loading, setLoading] = useState<boolean>(true);
  const browserAccessToken = Cookies.get("access-token");
  if (loading && !globalContext.loggedIn) {
    apiClient.login
      .post({
        body: runtime.client.json({ access_token: browserAccessToken }),
      })
      .then((response) => {
        if (response.status === 200) {
          setGlobalContext({
            user: response.value.value,
            loggedIn: true,
          });
        }
      })
      .finally(() => setLoading(false));
  }

  return [globalContext, setGlobalContext, loading];
};

export default useGlobalContext;
