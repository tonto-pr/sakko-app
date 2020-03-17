import React, { Component } from "react";

import styled from 'styled-components'

import variables from '../css/palette.js';

interface TitleProps {
  message: string
};

const RootContainer = styled.div`
  background-color: ${variables.darkGray};
  height: 100vh;
  width: 100vw;
`;

const Title = styled.div`
  font-size: 3em;
  text-align: center;
  line-height: 100vh;
  color: ${variables.lightBeige};
  font-family: 'Aldrich';
`;

export default class TitlePage extends Component<TitleProps, {}> {
  render() {
    const { message } = this.props;
    return (
      <RootContainer>
        <Title>{message}</Title>
      </RootContainer>
    );
  }
}
