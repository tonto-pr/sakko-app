import * as React from "react";
import styled from "styled-components";
import variables from "../css/palette";

const StyledInput = styled.input`
  outline: none;
  padding: 10px;
  margin: 5px 5px 5px 5px;
  color: ${variables.darkGray};
  background: ${variables.white};
  border: solid 1px ${variables.normalGray};
  width: 300px;
  height: 30px;
  font-size: 1.5em;
  border-radius: 10px;
  :focus {
    background-color: ${variables.lightBeige};
  }
`;

export type InputProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
  id: string;
  type?: string;
  className?: string;
};

export const Input: React.FunctionComponent<InputProps> = (
  props: InputProps
) => {
  return (
    <StyledInput
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      type={props.type}
      className={props.className}
    />
  );
};
