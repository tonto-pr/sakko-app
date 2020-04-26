import * as React from "react";

import { Login } from "./Login";

import styled from "styled-components";

import variables from "../css/palette";

const Title = styled.div`
  margin: auto;
  font-size: 3em;
  color: ${variables.lightBeige};
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;

const StyledTitlePage = styled.div`
  margin: auto;
`;

export const TitlePage: React.FunctionComponent = () => {
  return (
    <StyledTitlePage>
      <Title>Welcome to sakko.app</Title>
      <Login />
    </StyledTitlePage>
  );
};
