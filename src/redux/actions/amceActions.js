import * as types from './actionTypes';
import config from '../../config';
import amce from '../../services/AMCe';

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
    var groupId = config.auth.groupIds.LoanProcessors;
    try { var result = await amce.auth.register(groupId, args); }
    catch(error) { throw error; }
    console.log("REGISTER RESULT: ", result);
    return result.data;
  }
}

export const login = (email, password) => {
  return async (dispatch, getState) => {
    try { var result = await amce.auth.login(email, password); }
    catch(error) { throw error; }
    let auth = result.data;
    dispatch(setAuth(auth));
    try { result = await amce.auth.getUser(email, auth.access_token); }
    catch(error) { throw error; } // likely CORS related
    var user = result.data;
    dispatch(setUser(user));
    return user;
  }
}

export const logout = () => {
  console.log("logging out ...");
  return dispatch => { 
    dispatch(setAuth());
    dispatch(setUser());
    dispatch({type: "USER_LOGOUT"});
  }
}

export const sendAppUrl = mobile => {
  return null;
}

const getPayload = message => {
  return {
    aps: {
      alert: {
        title: message.subject,
        body: message.body
      },
      sound: "default"
    },
    metadata: {
      from: message.from,
      time: message.time,
      loanId: message.loanId
    }
  }
}

/* export const notifyDealer = (message, loan) => {
  console.log("Notify Dealer Action Called...")
  return (dispatch, getState) => {
    var { accessToken } = getState().amce;
    return amce.custom.getDealer(loan.contact_mobile, accessToken)
      .then(result => {
        console.log(result);
        return amce.custom.sendNotification(getPayload(message), loan.contact_mobile, accessToken)
        //return amce.notifications.create(getPayload(message), loan.contact_mobile, accessToken)
      }, error => {
        //dispatch(sendAppUrl(contact_mobile));
        var dealer = {
          mobile: loan.contact_mobile,
          firstName: loan.contact_name.split(' ')[0],
          lastName: loan.contact_name.split(' ')[1],
          loans: [loan.loanId],
          messages: [message]
        }
        return amce.custom.createDealer(dealer, accessToken);
      })
      .then(result => {
        console.log(result);
        return result;
      }, error => {
        console.log(error);
        return error;
      });
  }
} */