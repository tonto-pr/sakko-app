import React, { Component } from "react";

interface TitleProps {
  message: string
};

export default class Title extends Component<TitleProps, {}> {
  render() {
    const { message } = this.props;
    return (
      <h1>
        {message}
      </h1>
    );
  }
}
