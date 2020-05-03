import * as React from "react";
import styled from "styled-components";
import variables from "../../css/palette";

const NavigationBarBase = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${variables.greenGray};
  z-index: 5000;
  position: fixed;
  padding-top: 15px;
  text-align: center;
`;

export type NavigationBarProps = {
  id: string;
  children: React.ReactNode;
};

const NavigationBar: React.FunctionComponent<NavigationBarProps> = (
  props: NavigationBarProps
) => {
  return <NavigationBarBase>{props.children}</NavigationBarBase>;
};

export default NavigationBar;
