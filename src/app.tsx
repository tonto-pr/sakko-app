import * as React from "react";
import { TitlePage } from "./components/TitlePage";
import styled from "styled-components";

const RootContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
`;

export const App: React.FunctionComponent = () => {
  return (
    <RootContainer>
      <TitlePage />
    </RootContainer>
  );
};
