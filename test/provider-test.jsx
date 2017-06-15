import React, { Component } from 'react';
import { render } from 'react-dom';
import { provider } from '../src/index';

class TestComponent extends Component {
  render() {
    return <span id={this.props.id}>{this.props.value}</span>;
  }
}

class ServiceWrapper extends Component {
  state = { value: 0 };

  service = () => {
    const { doneValue } = this.props;
    const { value } = this.state;
    if (value >= doneValue) {
      this.props.onDone();
    } else {
      this.setState({ value: value + 1 });
    }
  };

  render() {
    const { component: ServiceComponent, id } = this.props;
    const { value } = this.state;
    return (<ServiceComponent id={id} value={value} service={this.service} />);
  }
}

describe('provider test suite', () => {

  it('test component render', done => {
    const id = `id_${Math.random()}`;
    const root = document.createElement('div');
    document.body.appendChild(root);

    render(<TestComponent id={id} value={0} />, root, () => {
      const element = document.getElementById(id);
      element.innerText.should.be.equal('0');
      done();
    });
  });

  it('test service provider component render', done => {
    const id = `id_${Math.random()}`;
    const doneValue = 0;
    const root = document.createElement('div');
    document.body.appendChild(root);

    const ServiceTestComponent = provider(props => ({
      service: props.service,
    }))(TestComponent);

    render(<ServiceWrapper
        id={id}
        component={ServiceTestComponent}
        doneValue={doneValue}
        onDone={() => setTimeout(() => {
          const element = document.getElementById(id);
          element.innerText.should.be.equal(doneValue.toString());
          done();
        }, 500)}
      />,
      root);
  });

  it('test service provider interval component render', done => {
    const id = `id_${Math.random()}`;
    const doneValue = 3;
    const root = document.createElement('div');
    document.body.appendChild(root);

    const ServiceTestComponent = provider(props => ({
      service: props.service,
      interval: 100,
    }))(TestComponent);

    render(<ServiceWrapper
        id={id}
        component={ServiceTestComponent}
        doneValue={doneValue}
        onDone={() => {
          const element = document.getElementById(id);
          element.innerText.should.be.equal(doneValue.toString());
          done();
        }}
      />,
      root);
  });

});