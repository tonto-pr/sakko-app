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

export const Login: React.FunctionComponent = () => {
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

  function handleLoginButtonClick(): void {
    apiClient.login.post({
      body: runtime.client.json(userLogin),
    });
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
        <SignUp />
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