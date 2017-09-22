import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withService } from '../../src/index';
import { getValue } from '../redux/actions';

const serviceOptions = {
  service: ({ getValue }) => getValue(),
};

@connect(({ value }) => ({ value }), { getValue })
@withService(serviceOptions)
export default class TestServiceComponent extends Component {

  render() {
    const { value } = this.props;
    return (
      <div>{value}</div>
    );
  }
}
