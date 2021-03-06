import * as React from "react";

import styled from "styled-components";
import Feed from "./Feed";
import variables from "../css/palette";
import { GlobalContext } from "../lib/useGlobalContext";
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
            <Title>
              {value.globalContext.user.username}, welcome to sakko.app!
            </Title>
            <Feed />
          </StyledTitlePage>
        );
      }}
    </GlobalContext.Consumer>
  );
};
