import * as types from './actionTypes';
import config from '../../../config';
import amce from '../../components/AMCe';

export const fetchBackend = () => {
  console.log("Fetching backend...");
}

export const setAuth = (auth=null) => {
  return { 
    type: types.SET_AUTH, 
    loggedIn: auth ? true : false, 
    accessToken: auth ? auth.access_token : null
  }
}

export const setUser = (user=null) => {
  return { type: types.SET_USER, user: user }
}

export const register = (...args) => {
  return async (dispatch, getState) => {
    var groupId = config.auth.groupIds.Dealers;
    try { var result = await amce.auth.register(groupId, args); }
    catch(error) { throw error; }
    console.log("REGISTER RESULT: ", result);
    return result.data;
  }
}

export const login = (email, password) => {
  console.log("(ACTION) login()")
  return async (dispatch, getState) => {
    try { var result = await amce.auth.login(email, password); }
    catch(error) { throw error; };
    var auth = result.data;
    console.log("USER AUTH TOKEN", auth);
    dispatch(setAuth(auth));
    try { result = await amce.auth.getUser(email); }
    catch(error) { console.log("GET USER ERROR"); throw error; }
    var user = result.data.Resources[0];
    console.log("USER: ", user);
    dispatch(setUser(user));
    return user;
  }
}

export const logout = () => {
  console.log("(ACTION) logout()");
  return dispatch => { 
    dispatch(setAuth());
    dispatch(setUser());
    dispatch({type: "USER_LOGOUT"});
    return;
  }
}

export const setMessages = (messages) => {
  console.log("(ACTION) setMessages()")
  return dispatch => {
    dispatch({type: types.SET_MESSAGES, messages: messages})
  }
}