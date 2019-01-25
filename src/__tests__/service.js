import React, { Component, Children } from 'react';
import renderer from 'react-test-renderer';
import { shallow, render } from 'enzyme';
import withService, { fetchServices, importData } from '../index';


beforeEach(() => {

});

test('withService HOC test', async () => {
  const counters = {
    service: 0,
    render: 0,
  };

  const service = () => ++counters.service && new Promise(r => setInterval(r, 1000, 'test'));

  @withService(service)
  class Data extends Component {
    render() {
      counters.render++;
      return <div>{JSON.stringify(this.props.data)}</div>;
    }
  }

  const app = (<Data />);

  const cache = await fetchServices(app);
  expect(counters.render).toBe(1);
  importData(cache);
  const component = renderer.create(app);
  expect(component.toJSON()).toMatchSnapshot();
  expect(counters.service).toBe(1);
  expect(counters.render).toBe(2);
  expect(Data.displayName).toBe('ServiceConnector-0-service(Data)');
});