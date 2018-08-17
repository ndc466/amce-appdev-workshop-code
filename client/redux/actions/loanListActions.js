import * as types from './actionTypes';
import _ from 'lodash';
import axios from 'axios';
import config from '../../../config';
import amce from '../../components/AMCe';
import PushNotification from 'react-native-push-notification';

export const setLoans = (loans) => {
  return {type: types.SET_LOANS, loans: loans};
}

export const setLoading = () => {
  console.log("LOADING...");
  return {type: types.SET_LOADING}
}

const getMessages = (loans) => {
  var readMsgs = [];
  var unreadMsgs = [];
  var totalUnread = 0;
  for (var i = 0; i < loans.length; i++) {
    var loan = loans[i];
    for (var j = 0; j < loan.messages.length; j++) {
      var msg = loan.messages[j];
      msg.loanId = loan.loanId;
      if (msg.unread) { unreadMsgs.push(msg); totalUnread++; }
      else { readMsgs.push(msg); }
    }
  }
  unreadMsgs = _.sortBy(unreadMsgs, 'time');
  readMsgs = _.sortBy(readMsgs, 'time');
  var messages = unreadMsgs.concat(readMsgs);
  return { messages, totalUnread };
}

export const setUnread = (unreadMsgs) => {
  console.log("(ACTION) setUnread()");
  PushNotification.setApplicationIconBadgeNumber(unreadMsgs.length);
  return async (dispatch, getState) => {
    dispatch({type: types.SET_UNREAD, unreadMsgs: unreadMsgs})
    dispatch({type: types.UPDATE_UNREAD, unreadMsgs: unreadMsgs});
  }
}

export const fetchLoans = () => {
  console.log("(ACTION) fetchLoans()")
  return async (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    dispatch({type: types.SET_LOADING});
    var result = await amce.storage.getEach('Loans', accessToken);
    var loans = result.map(loan => loan.data);
    loans = _.sortBy(loans, ['status', 'loanee']);
    dispatch({type: types.SET_LOANS, loans: loans});
    var { messages, totalUnread } = getMessages(loans);
    PushNotification.setApplicationIconBadgeNumber(totalUnread);
    dispatch({type: types.SET_MESSAGES, messages: messages, totalUnread: totalUnread})
  };
}

export const readAllMessages = () => {
  return async (dispatch, getState) => {
    var loans = getState().loanList.loans;
    var accessToken = getState().amce.accessToken;
    for (var i = 0; i < loans.length; i++) {
      var loan = loans[i];
      console.log("LOAN: ", loans[i]);
      for (var j = 0; j < loan.messages.length; j++) {
        loan.messages[j].unread = false;
      }
      try { var result = amce.custom.updateLoan(loan, loan.loanId, accessToken); }
      catch(error) { throw error; }
    }
    dispatch(fetchLoans());
  }
}

export const readMessages = (loan) => {
  return async (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    for (var i = 0; i < loan.messages.length; i++) {
      loan.messages[i].unread = false;
    }
    try { var result = amce.custom.updateLoan(loan, loan.loanId, accessToken); }
    catch(error) { throw error; }
    dispatch(fetchLoans());
  }
}

export const updateLoan = (loan, loanId) => {
  console.log("(ACTION) updateLoan()", loanId);
  return async (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    try { var result = await amce.custom.updateLoan(loan, loanId, accessToken); }
    catch(error) { throw error; }
    dispatch(fetchLoans());
  }
}

export const fetchDealer = () => {
  return async dispatch => {
    try { var result = await axios.get(config.BASE_URL+'/dealers', config.HEADERS); }
    catch(error) { throw error; }
    var dealer = result.data;
    dispatch(getDealer(dealer));
  };
}

export const getDealer = (dealer) => {
  return {type: types.GET_LOANS, token: dealer.token, notifications: dealer.notifications};
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

/* export const createLoan = (loan) => {
  return (dispatch, getState) => {
    var accessToken = getState().amce.accessToken;
    return amce.custom.createLoan(loan, accessToken)
      .then(result => {
        dispatch(fetchLoans());
        return result;
      }, error => {
        console.log(error);
        return error;
      })
  }
} */

/* export const deleteLoan = (loanId) => {
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
} */