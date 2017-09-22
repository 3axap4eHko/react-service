import React from 'react';
import { Provider } from 'react-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetch } from '../src/index';
import TestServiceComponent from './fixtures/TestServiceComponent';
import createStore from './redux/createStore';

describe('Service server test suite', () => {

  it('Await service finish for SSR', done => {
    const store = createStore({ value: 0 });
    const element = (
      <Provider store={store}>
        <TestServiceComponent />
      </Provider>
    );
    fetch(element)
      .then(() => {
        expect(renderToStaticMarkup(element)).equal('<div>100</div>');
        done();
      });
  });
});