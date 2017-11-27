import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

import value from './reducers/value';

export default function (initialState) {
  return createStore(
    combineReducers({
      value,
    }),
    initialState,
    applyMiddleware(
      thunkMiddleware,
//      loggerMiddleware,
    ),
  );
}
