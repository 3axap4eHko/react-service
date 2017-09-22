import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withService } from 'react-service';
import { getValue } from '../redux/actions';

@connect(({ value }) => ({ value }), { getValue })
@withService({ service: ({ getValue }) => getValue() })
export default class Value extends Component {
  render() {
    const { value } = this.props;
    return (
      <div>{value}</div>
    );
  }
}
