import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import config from "../config/config";

import * as types from "./types";
import { NotificationManager } from "react-notifications";

// Register User
export const registerUser = (userData, history) => dispatch => {
  dispatch(setUserLoading(true));
  axios
    .request({
      url: "/api/users/register",
      baseURL: config.apiBaseUrl,
      method: "post",
      data: userData
    })
    .then(response => {
      const { token } = response.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      console.log("registerResult", response.data);
      history.push("/dashboard");
    })
    .catch(err => {
      console.log("err", err);
      // dispatch({
      //   type: types.GET_ERRORS,
      //   payload: err.response.data
      // });
      if (err.response.data.title === "Email") {
        NotificationManager.error("Email already exist");
      }
      dispatch(setUserLoading(false));
    });
};

// Login - get user token
export const loginUser = (userData, history) => dispatch => {
  dispatch(setUserLoading(true));
  axios
    .request({
      url: "/api/users/login",
      baseURL: config.apiBaseUrl,
      method: "post",
      data: userData
    })
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      dispatch(setUserLoading(false));
      history.push("/dashboard");
    })
    .catch(err => {
      try {
        if (err.response.data.title === "Email") {
          NotificationManager.error("Email not found");
        }
        if (err.response.data.title === "Password") {
          NotificationManager.error("Password incorrect");
        }
      } catch (err) {
        NotificationManager.error("Server error");
      }
      dispatch(setUserLoading(false));
    });
};
// Set logged in user
export const setCurrentUser = decoded => {
  console.log("decode", decoded);
  return {
    type: types.SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = val => {
  return {
    type: types.USER_LOADING,
    payload: val
  };
};

// Log user out
export const logoutUser = history => dispatch => {
  console.log("logout123: ");
  axios
    .request({
      url: "/api/users/logout",
      baseURL: config.apiBaseUrl,
      method: "post"
    })
    .then(res => {
      console.log("logoutssss: ", res);
      localStorage.removeItem("jwtToken");
      setAuthToken(false);
      dispatch(setCurrentUser({}));
      dispatch(setUserLoading(false));
      history.push("/");
    })
    .catch(err => {
      console.log("logoutError: ", err);
      dispatch(setUserLoading(false));
      let errStatus = err.response.status;
      if (errStatus === 401) {
        localStorage.removeItem("jwtToken");
        setAuthToken(false);
        dispatch(setCurrentUser({}));
        history.push("/");
      } else {
        // dispatch({
        //   type: types.GET_ERRORS,
        //   payload: err.response.data
        // });
      }
    });
};
