import React, { Component } from 'react';
import { render } from 'react-dom';
import { withService } from '../src/index';

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

describe('service provider test suite', () => {

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

  it('test internal service provider component render', done => {
    const id = `id_${Math.random()}`;
    const root = document.createElement('div');
    document.body.appendChild(root);
    let counter = 0;

    const ServiceTestComponent = withService({
      service() {
        return ++counter;
      },
      mapToProps(result) {
        return { value: result };
      },
      onSuccess() {
        const element = document.getElementById(id);
        element.innerText.should.be.equal('1');
        done();
      },
    })(TestComponent);

    render(<ServiceTestComponent
      id={id}
      value={0}
    />, root);
  });

  it('test internal service provider interval component render', done => {
    const id = `id_${Math.random()}`;
    const context = {
      counter: 0,
      cancelToken() {},
    };
    const root = document.createElement('div');
    document.body.appendChild(root);

    const ServiceTestComponent = withService({
      service(){
        return ++context.counter;
      },
      mapToProps(result) {
        return { value: result };
      },
      interval: 100,
      onSuccess() {
        const element = document.getElementById(id);
        element.innerText.should.be.equal(context.counter.toString());
        if (context.counter >= 3) {
          context.cancelToken();
          done();
        }
      },
      cancelToken: cancelToken => {
        context.cancelToken = cancelToken;
      },
    })(TestComponent);

    render(<ServiceTestComponent
      id={id}
      value={0}
    />, root);
  });

  it('test external service provider component render', done => {
    const id = `id_${Math.random()}`;
    const doneValue = 0;
    const root = document.createElement('div');
    document.body.appendChild(root);

    const ServiceTestComponent = withService({
      service: props => props.service(),
    })(TestComponent);

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

  it('test external service provider interval component render', done => {
    const id = `id_${Math.random()}`;
    const doneValue = 3;
    const root = document.createElement('div');
    document.body.appendChild(root);

    const ServiceTestComponent = withService({
      service: props => props.service(),
      interval: 100,
    })(TestComponent);

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