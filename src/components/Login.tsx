import * as React from "react";
import { useState, useContext } from "react";
import * as Cookies from "js-cookie";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { SignUp } from "./SignUp";
import { GlobalContext } from "../lib/useGlobalContext";
import { loginExpiryTime, domain, defaultPath } from "../constants";

import * as api from "../../generated/client.generated";
import * as axiosAdapter from "@smartlyio/oats-axios-adapter";
import * as runtime from "@smartlyio/oats-runtime";
import * as types from "../../generated/common.types.generated";

import styled from "styled-components";
import { useHistory } from "react-router-dom";

const StyledLogin = styled.div`
  width: 400px;
  padding: 0.5em;
  margin: auto;
  text-align: center;
`;

export const Login: React.FunctionComponent = () => {
  const context = useContext(GlobalContext);
  const history = useHistory();
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
      [event.target.placeholder]: event.target.value,
    });
  }

  async function handleLogin(): Promise<void> {
    console.log(userLogin);
    const response = await apiClient.login.post({
      body: runtime.client.json(userLogin),
    });
    if (response.status === 200) {
      console.log(response.value);
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

  function handleSignUpClick(): void {
    setShowModal(true);
  }

  function onCloseModalHandler(): void {
    setShowModal(false);
  }

  return (
    <StyledLogin>
      <Modal centered show={showModal} onHide={onCloseModalHandler}>
        <Modal.Body>
          <SignUp />
        </Modal.Body>
      </Modal>
      <InputGroup>
        <FormControl placeholder="username" onChange={handleUserLoginChange} />
        <FormControl
          placeholder="password"
          onChange={handleUserLoginChange}
          type="password"
        />
        <Button id="login" onClick={handleLogin}>
          Log In
        </Button>
        <Button id="signup" onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </InputGroup>
    </StyledLogin>
  );
};
