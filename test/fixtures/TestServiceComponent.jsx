import React, { Component } from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { withService } from '../../src/index';
import { getValue } from '../redux/actions';

const serviceOptions = {
  contextTypes: {
    store: object,
  },
  service: ({}, { store }) => store.dispatch(getValue()),
};

@withService(serviceOptions)
@connect(({ value }) => ({ value }))
export default class TestServiceComponent extends Component {

  render() {
    const { value } = this.props;
    return (
      <div>{value}</div>
    );
  }
}
