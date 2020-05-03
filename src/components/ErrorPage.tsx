import * as React from "react";

import styled from "styled-components";

import variables from "../css/palette";

const Error = styled.div`
  margin: auto;
  font-size: 3em;
  color: ${variables.darkGray};
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
`;

const StyledErrorPage = styled.div`
  margin: auto;
`;

const ErrorPage: React.FunctionComponent = () => {
  return (
    <StyledErrorPage>
      <Error>Sorry, that page does not exist :(</Error>
    </StyledErrorPage>
  );
};

export default ErrorPage;
