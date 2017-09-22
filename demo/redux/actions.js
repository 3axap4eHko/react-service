import {
  GET_VALUE_PROCESS,
  GET_VALUE_SUCCESS,
  GET_VALUE_FAILURE,
} from './types';

export function getValue(value = 100) {
  return dispatch => {
    dispatch({ type: GET_VALUE_PROCESS });
    return new Promise(resolve => setTimeout(resolve, 300, value))
      .then(
        value => dispatch({ type: GET_VALUE_SUCCESS, value }),
        error => dispatch({ type: GET_VALUE_FAILURE, error }),
      );
  };
}