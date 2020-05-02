import * as React from "react";
import { useState } from "react";

import { Input } from "./Input";
import { Button } from "./Button";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

import styled from "styled-components";

const StyledSignUp = styled.div`
  width: 400px;
  padding: 0.5em;
  margin: auto;
  text-align: center;
`;

export type SignUpProps = {
  onSuccess: (user: types.ShapeOfUser) => void;
};

export const SignUp: React.FunctionComponent<SignUpProps> = (
  props: SignUpProps
) => {
  const [signUpData, setSignUpData] = useState<types.ShapeOfPlainUser>({
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
      [event.target.id]: event.target.value,
    });
  }

  async function handleSignUpClick(): Promise<void> {
    const response = await apiClient.user.post({
      body: runtime.client.json(signUpData),
    });
    if (response.status === 200) {
      props.onSuccess(response.value.value as types.ShapeOfUser);
    } else console.log(response.status);
  }

  return (
    <StyledSignUp>
      <Input
        id="username"
        placeholder="Username"
        value={signUpData.username}
        onChange={handleUserLoginChange}
      />
      <Input
        id="password"
        placeholder="Password"
        value={signUpData.password}
        onChange={handleUserLoginChange}
        type="password"
      />
      <Input
        id="email"
        placeholder="Email"
        value={signUpData.email}
        onChange={handleUserLoginChange}
        type="email"
      />
      <Button id="signupmodalbutton" onClick={handleSignUpClick}>
        Sign Up
      </Button>
    </StyledSignUp>
  );
};
