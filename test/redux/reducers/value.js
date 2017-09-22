export default function (state = {}, action) {
  switch (action.type) {
    case 'GET_VALUE_PROCESS':
      break;
    case 'GET_VALUE_SUCCESS':
      return action.value;
    case 'GET_VALUE_ERROR':
      console.error(action.error);
      break;
  }
  return state;
}