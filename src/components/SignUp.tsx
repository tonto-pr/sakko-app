import * as React from "react";
import { useState, useContext } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import * as Cookies from "js-cookie";
import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../app";
import { loginExpiryTime, domain, defaultPath } from "../constants";

export const SignUp: React.FunctionComponent = () => {
  const context = useContext(GlobalContext);
  const history = useHistory();
  const [signUpData, setSignUpData] = useState<types.ShapeOfUser>({
    username: "",
    email: "",
    password: "",
  });

  const apiClient = api.client(axiosAdapter.bind);

  function handleUserLoginChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setSignUpData({
      ...signUpData,
      [event.target.placeholder]: event.target.value,
    });
  }

  async function handleSignUpClick(): Promise<void> {
    const response = await apiClient.user.post({
      body: runtime.client.json(signUpData),
    });
    if (response.status === 200) {
      const user = response.value.value;
      Cookies.set("access-token", user.access_token, {
        expires: loginExpiryTime,
        domain: domain,
        path: defaultPath,
      });
      context.setGlobalContext({
        ...context.globalContext,
        user,
        loggedIn: true,
      });
      history.push("/home");
    } else console.log(response.status);
  }

  return (
    <InputGroup>
      <FormControl placeholder="username" onChange={handleUserLoginChange} />
      <FormControl
        placeholder="password"
        onChange={handleUserLoginChange}
        type="password"
      />
      <FormControl
        placeholder="email"
        onChange={handleUserLoginChange}
        type="email"
      />
      <Button onClick={handleSignUpClick}>Sign Up</Button>
    </InputGroup>
  );
};
