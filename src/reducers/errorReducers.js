import { GET_ERRORS } from "../actions/types";
const initialState = {
  error: "",
  openToast: false 
};
export default function (state = initialState, action) {
  switch (action.type) {

    case GET_ERRORS:
      return {
        ...state,
        error: action.payload,
        openToast: true,
      }
      case 'CLOSE_TOAST':
        return {
          ...state,
          openToast: false,
        }
    default:
      return state;
  }
}