import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './components/App';
import createStore from './redux/createStore';

const store = createStore({ value: 0 });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'));
