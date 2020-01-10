import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import menuReducer from "./menuReducer"

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    menu: menuReducer
});