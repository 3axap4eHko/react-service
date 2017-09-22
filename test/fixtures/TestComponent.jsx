import React, { Component } from 'react';

export default class TestComponent extends Component {

  static defaultProps = {
    value: 0,
    onComponentWillMount() {},
    onRender() {},
  };

  componentWillMount() {
    this.props.onComponentWillMount()
  }

  render() {
    const { value, onRender } = this.props;
    onRender();
    return (
      <div>{value}</div>
    );
  }
}