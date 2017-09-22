import {
  GET_VALUE_PROCESS,
  GET_VALUE_SUCCESS,
  GET_VALUE_FAILURE,
} from '../types';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_VALUE_PROCESS:
      break;
    case GET_VALUE_SUCCESS:
      return action.value;
    case GET_VALUE_FAILURE:
      console.error(action.error);
      break;
  }
  return state;
}