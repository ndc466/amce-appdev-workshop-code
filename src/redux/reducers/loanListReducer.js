import initialState from './initialState';
import {
  FETCH_LOANS, SET_LOANS, SET_LOADING, CLEAR_DATA,
  UPDATE_LOAN, UPDATE_LOANS, SORT_LOANS, UPDATE_UNREAD
} from '../actions/actionTypes';
import { PURGE } from 'redux-persist';
import _ from 'lodash';
import storage from 'redux-persist/lib/storage';

export default function loanListReducer(state = initialState.loanList, action) {
  let newState;
  switch (action.type) {
    case SET_LOANS:
      console.log('(REDUCER) SET_LOANS')
      storage.removeItem(`persist:loans`);
      return {
        loans: action.loans,
        column: "status",
        direction: "ascending",
        loading: false,
        loaded: true
      }
    case SET_LOADING:
      console.log('(REDUCER) SET_LOADING');
      return { ...state, loading: true, loaded: false } 
    case FETCH_LOANS:
      console.log('(REDUCER) FETCH_LOANS');
      return action;
    case UPDATE_LOAN:
      newState = state;
      console.log(newState.loans[action.index]);
      newState.loans[action.index] = action.loan;
      return {
        ...state,
        loans: newState.loans
      }
    case UPDATE_LOANS: return { ...state, loans: action.loans }
    case UPDATE_UNREAD: return { ...state, unreadMsg: action.unreadMsg }
    case CLEAR_DATA: return initialState.loanList;
    case SORT_LOANS:
      newState = state;
      if (action.param === null) {
        newState.column = state.column;
        newState.loans = state.loans.reverse();
        newState.direction = state.direction === 'ascending' ? 'descending' : 'ascending';
      } else {
        newState.column = action.param;
        newState.loans = _.sortBy(state.loans, [action.param]);
        newState.direction = 'ascending'
      }
      return {
        ...state,
        column: newState.column,
        direction: newState.direction,
        loans: newState.loans
      };
    case PURGE:
      console.log("PURGING!!!!"); 
      return state;
    default:
      return state;
  }
}