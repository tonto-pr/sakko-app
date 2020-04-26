import * as React from "react";

import styled from "styled-components";
import { Button } from "./Button";
const ModalWrapper = styled.div`
  padding: 30px;
  position: fixed;
  min-width: 350px;
  width: 25%;
  left: 37.5%;
  top: 30%;
  background-color: white;
  border: solid 1px black;
  z-index: 10000;
  transform: translateX(-30px);
  display: flex;
  border-radius: 10px;
`;

const ChildWrapper = styled.div`
  padding: 0;
  margin: 0;
`;

const ModalCloseButton = styled(Button)`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
`;

export type ModalProps = {
  children: React.ReactNode;
  show: boolean;
  onCloseModal: () => void;
};

export const Modal: React.FunctionComponent<ModalProps> = (
  props: ModalProps
) => {
  return !props.show ? null : (
    <ModalWrapper>
      <ModalCloseButton id="closemodalbutton" onClick={props.onCloseModal}>
        X
      </ModalCloseButton>
      <ChildWrapper>{props.children}</ChildWrapper>
    </ModalWrapper>
  );
};
