import * as React from "react";
import styled from "styled-components";
import variables from "../css/palette";
import { useHistory } from "react-router-dom";

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
  onClick?: () => void;
  id: string;
  link?: string;
  className?: string;
  children: React.ReactNode;
};

export const Button: React.FunctionComponent<ButtonProps> = (
  props: ButtonProps
) => {
  const history = useHistory();

  function onClickWithRedirect(): void {
    if (props.link) history.push(props.link);
    if (props.onClick) props.onClick();
  }

  return (
    <StyledButton
      className={props.className}
      id={props.id}
      onClick={onClickWithRedirect}
    >
      {props.children}
    </StyledButton>
  );
};
