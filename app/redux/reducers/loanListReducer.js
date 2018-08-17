import initialState from './initialState';
import {
  FETCH_LOANS, SET_LOANS, SET_LOADING, SET_UNREAD, SET_MESSAGES,
  FETCH_DEALER, GET_DEALER,
  UPDATE_LOAN, SORT_LOANS,
  NEW_NOTIFICATION, CLEAR_NOTIFICATIONS,
} from '../actions/actionTypes';
import _ from 'lodash';

export default function loanList(state = initialState.loanList, action) {
  let newState;
  switch (action.type) {
    case SET_LOANS:
      console.log('(ACTION) SET_LOANS')
      return {
        ...state,
        loans: action.loans,
        column: "status",
        direction: "ascending",
        loading: false,
        loaded: true
      }
    case SET_LOADING: 
      console.log('(ACTION) SET_LOADING');
      return { ...state, loading: true, loaded: false }
    case SET_MESSAGES:
    console.log('(ACTION) SET_MESSAGES');
    return { ...state, messages: action.messages, totalUnread: action.totalUnread }
    case SET_UNREAD:
      console.log('(ACTION) SET_UNREAD: ', action.unreadMsgs);
      return { ...state, unreadMsgs: action.unreadMsgs }
    case FETCH_LOANS:
      console.log('(ACTION) FETCH_LOANS')
      return action;
    case FETCH_DEALER:
      console.log('(ACTION) FETCH_DEALER')
      return action;  
    case GET_DEALER:
      console.log('(ACTION) RECEIVE_DEALER')
      return {
        ...state,
        token: action.token,
        notifications: action.notifications
      }
    case UPDATE_LOAN:
      newState = state;
      console.log(newState.loans[action.index]);
      newState.loans[action.index] = action.loan;
      return { ...state, loans: newState.loans }
    case SORT_LOANS:
      newState = state;
      if (action.param === null) {
        newState.column = state.column;
        newState.loans = state.loans.reverse();
        newState.direction = state.direction === 'ascending' ? 'descending' : 'ascending';
      } else {
        newState.column = action.param;
        newState.loans = _.sortBy(state.loans, [action.param]),
        newState.direction = 'ascending'
      }
      return {
        ...state,
        column: newState.column,
        direction: newState.direction,
        loans: newState.loans
      };
    case NEW_NOTIFICATION:
      newState = state;
      newState.notifications.push(action.notification);
      return {
        ...state,
        notifications: newState.notifications
      }
    case CLEAR_NOTIFICATIONS:
      newState = state;
      newState.notifications = [];
      return {
        ...state,
        notifications: newState.notifications
      }
    default:
      return state;
  }
}