import React from 'react';
import { Provider } from 'react-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetch } from '../src/index';
import TestServiceComponent from './fixtures/TestServiceComponent';
import createStore from './redux/createStore';


function TestComponent({ text }) {
  return <div>{text}</div>;
}

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

  it('Await service finish for stateless Server Rendering', done => {

    const store = createStore({ value: 0 });
    const element = (
      <Provider store={store}>
        <TestComponent text="test" />
      </Provider>
    );
    fetch(element)
      .then(() => {
        expect(renderToStaticMarkup(element)).equal('<div>test</div>');
        done();
      });
  });
});