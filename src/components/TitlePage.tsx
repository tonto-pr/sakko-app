import * as React from "react";

import styled from "styled-components";

import variables from "../css/palette";
import { GlobalContext } from "../app";

const Title = styled.div`
  margin: auto;
  font-size: 3em;
  color: ${variables.darkGray};
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;

const StyledTitlePage = styled.div`
  margin: auto;
`;

export const TitlePage: React.FunctionComponent = () => {
  return (
    <GlobalContext.Consumer>
      {(value): React.ReactNode => {
        return (
          <StyledTitlePage>
            <Title>{value.user.username}, welcome to sakko.app!</Title>
          </StyledTitlePage>
        );
      }}
    </GlobalContext.Consumer>
  );
};
