import initialState from './initialState';
import { SET_AUTH, SET_USER } from '../actions/actionTypes';

export default function amceReducer(state = initialState.amce, action) {
  let newState;
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        loggedIn: action.loggedIn,
        accessToken: action.accessToken
      }
    case SET_USER:
      var user = action.user;
      console.log(user);
      return {
        ...state,
        username: user ? action.user.username : null,
        firstName: user ? action.user.firstName : null,
        lastName: user ? action.user.lastName : null,
        email: user ? action.user.email : null,
        id: user ? action.user.id : null, // idcsId
        mobile: user ? action.user.mobile : null, // dealerId
        messages: user ? action.user.messages : null
      };
    default:
      return state;
  }
}