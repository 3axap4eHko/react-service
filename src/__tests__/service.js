import React, { Component, Children } from 'react';
import renderer from 'react-test-renderer';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fetchServices, withService } from '../index';

configure({ adapter: new Adapter() });

const store = {
  test: null,
};

const service = {
  onCall() {
    return new Promise(r => setInterval(r, 1000, 1));
  },
  onSuccess(result, props) {
    store['test'] = result;
  },
  onError(result, props) {

  },
};

@withService(service)
class ServiceTest extends Component {
  render() {
    return (
      <div>
        {store['test']}
      </div>
    );
  }
}

test('traverse class', async () => {

  const app = (
    <ServiceTest />
  );

  await fetchServices(app);
  const component = renderer.create(app);

  expect(component.toJSON().children[0]).toBe('1');
});
