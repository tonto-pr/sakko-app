import * as React from "react";
import styled from "styled-components";
import variables from "../css/palette";

const StyledButton = styled.button`
  outline: none;
  width: 100px;
  height: 30px;
  margin: 5px 0 0 5px;
  border-radius: 10px;
  font-size: 1em;
  color: ${variables.darkGray};

  :focus {
    background-color: ${variables.lightBeige};
  }
`;

export type ButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
  children: React.ReactNode;
};

export const Button: React.FunctionComponent<ButtonProps> = (
  props: ButtonProps
) => {
  return (
    <StyledButton id={props.id} onClick={props.onClick}>
      {props.children}
    </StyledButton>
  );
};
