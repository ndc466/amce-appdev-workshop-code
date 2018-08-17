import initialState from './initialState';
import { SET_AUTH, SET_USER, UPDATE_UNREAD } from '../actions/actionTypes';

export default function amceReducer(state = initialState.amce, action) {
  let newState;
  switch (action.type) {
    case SET_AUTH:
      console.log('(REDUCER) SET_AUTH');
      return {
        ...state,
        loggedIn: action.loggedIn,
        accessToken: action.accessToken
      }
    case SET_USER:
      console.log('(REDUCER) SET_USER');
      var user = action.user;
      return {
        ...state,
        firstName: user ? user.name.givenName : null,
        lastName: user ? user.name.familyName : null,
        email: user ? user.emails[0].value : null,
        id: user ? user.id : null, // idcsId
        mobile: user ? user.phoneNumbers[0].value : null // dealerId
      };
    case UPDATE_UNREAD:
      console.log('(REDUCER) UPDATE_UNREAD: ', action.unreadMsgs);
      return { ...state, unreadMsgs: action.unreadMsgs }
    default:
      return state;
  }
}