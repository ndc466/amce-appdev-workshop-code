import * as types from './actionTypes';
import _ from 'lodash';
import { PURGE } from 'redux-persist';
import amce from '../../services/AMCe';

export const setLoans = (loans) => {
  return {type: types.SET_LOANS, loans: loans};
}

export const setLoading = () => {
  console.log("LOADING...");
  return {type: types.SET_LOADING}
}

export const fetchLoans = () => {
  console.log("(ACTION) fetchLoans()")
  return async (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    dispatch({type: types.SET_LOADING});
    var result = await amce.storage.getEach('Loans', accessToken);
    var loans = result.map(loan => loan.data);
    loans = _.sortBy(loans, ['status', 'loanee'])
    dispatch({type: types.SET_LOANS, loans: loans});
  };
}

export const updateLoans = (loans) => {
  return {type: types.UPDATE_LOANS, loans: loans}
}

export const updateUnread = (unreadMsg) => {
  return dispatch => {
    dispatch({type: types.UPDATE_UNREAD, unreadMsg: unreadMsg});
  }
}

export const clearData = () => {
  return dispatch => {
    dispatch({type: PURGE, key: "root", result: () => null});
    dispatch({type: types.CLEAR_DATA});
    dispatch({type: PURGE, key: "root", result: () => null});
  }
}

export const sortLoans = (param=null) => {
  return {type: types.SORT_LOANS, param: param}
}

export const getLoan = (loanId) => {
  return (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    return amce.custom.getLoan(loanId, accessToken);
  }
}

export const createLoan = (loan) => {
  return async (dispatch, getState) => {
    console.log("LOAN = ", loan);
    var accessToken = getState().amce.accessToken;
    console.log("accessToken=", accessToken);
    try { var result = await amce.custom.createLoan(loan, accessToken); }
    catch(error) { console.log(error); throw error; }
    dispatch(fetchLoans());
    return result;
  }
}

export const updateLoan = (loan) => {
  return (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    return amce.custom.updateLoan(loan, loan.loanId, accessToken) 
      .then(result => {
        dispatch(fetchLoans());
        return result;
      }, error => {
        return error;
      })
  }
}

export const deleteLoan = (loanId) => {
  console.log("loanId: ", loanId);
  return (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    return amce.custom.deleteLoan(loanId, accessToken)
      .then(result => {
        dispatch(fetchLoans());
        return result;
      }, error => {
        console.log(error);
        return error;
      })
  }
}