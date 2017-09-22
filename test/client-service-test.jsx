import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import TestServiceComponent from './fixtures/TestServiceComponent';
import createStore from './redux/createStore';


describe('Service client test suite', () => {

  it('Await service finish for Client Rendering', done => {

    const store = createStore({ value: 0 });
    const element = (
      <Provider store={store}>
        <TestServiceComponent />
      </Provider>
    );
    const root = document.createElement('div');
    document.body.appendChild(root);
    render(element, root, () => {
      setTimeout(() => {
        expect(root.innerHTML).equal('<div>100</div>');
        done();
      }, 1000);
    });
  });
});