import * as React from "react";
import { useState } from "react";

import { Input } from "./Input";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { SignUp } from "./SignUp";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

import styled from "styled-components";

const StyledLogin = styled.div`
  width: 400px;
  padding: 0.5em;
  margin: auto;
  text-align: center;
`;

export type LoginProps = {
  onSuccess: (user: types.ShapeOfUser) => void;
};

export const Login: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  const [userLogin, setUserLogin] = useState<types.ShapeOfUserLogin>({
    username: "",
    password: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const apiClient = api.client(axiosAdapter.bind);

  function handleUserLoginChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setUserLogin({
      ...userLogin,
      [event.target.id]: event.target.value,
    });
  }

  async function handleLoginButtonClick(): Promise<void> {
    const response = await apiClient.login.post({
      body: runtime.client.json(userLogin),
    });
    if (response.status === 200) {
      props.onSuccess(response.value.value as types.ShapeOfUser);
    } else console.log(response.status);
  }

  function handleSignUpClick(): void {
    setShowModal(true);
  }

  function onCloseModalHandler(): void {
    setShowModal(false);
  }

  return (
    <StyledLogin>
      <Modal show={showModal} onCloseModal={onCloseModalHandler}>
        <SignUp onSuccess={props.onSuccess} />
      </Modal>
      <Input
        id="username"
        placeholder="Username"
        value={userLogin.username}
        onChange={handleUserLoginChange}
      />
      <Input
        id="password"
        placeholder="Password"
        value={userLogin.password}
        onChange={handleUserLoginChange}
        type="password"
      />
      <Button id="login" onClick={handleLoginButtonClick}>
        Login
      </Button>
      <Button id="signup" onClick={handleSignUpClick}>
        Sign Up
      </Button>
    </StyledLogin>
  );
};
