import * as React from "react";
import styled from "styled-components";
import variables from "../css/palette";

const StyledButton = styled.button`
  outline: none;
  width: 100px;
  height: 30px;
  margin: 5px 5px 5px 5px;
  border-radius: 10px;
  font-size: 1em;
  color: ${variables.darkGray};
  border: solid 1px ${variables.darkGray};
  :active {
    border: solid 3px ${variables.lightOrange};
  }
`;

export type ButtonProps = {
  onClick: () => void;
  id: string;
  className?: string;
  children: React.ReactNode;
};

export const Button: React.FunctionComponent<ButtonProps> = (
  props: ButtonProps
) => {
  return (
    <StyledButton
      className={props.className}
      id={props.id}
      onClick={props.onClick}
    >
      {props.children}
    </StyledButton>
  );
};
