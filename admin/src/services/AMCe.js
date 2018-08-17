import axios from 'axios';
import { Base64 } from 'js-base64';
import config from '../config';
/**
 *
 */

 const endpoints = {
  mobile: {
    storage: "/mobile/platform/storage/collections/",
    notifications: "/mobile/system/notifications/notifications/",
    devices: "/mobile/platform/devices/",
    users: "/mobile/platform/users/",
    policies: "/mobile/platform/appconfig/client",
    custom: {
      loans: "/mobile/custom/SidebandNotificationsAPI/loans/",
      dealers: "/mobile/custom/SidebandNotificationsAPI/dealers/",
      messages: "/mobile/custom/SidebandNotificationsAPI/messages/"
    }
  },
  idcs: {
    oAuthToken: "/oauth2/v1/token",
    users: "/admin/v1/Users",
    groups: "/admin/v1/Groups/",
    passwordChanger: "/admin/v1/UserPasswordChanger/"
  }
}

const schemas = {
  createUser: [ "urn:ietf:params:scim:schemas:core:2.0:User" ],
  updateGroup: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
}

const getLoginConfig = (email, password) => {
  var authToken = "Basic "+ Base64.encode(config.oAuth.clientId+":"+config.oAuth.clientSecret);
  email = encodeURIComponent(email)
  password = encodeURIComponent(password)
  var scope = encodeURIComponent(config.baseUrl+'urn:opc:resource:consumer::all offline_access');
  var grant = 'grant_type=password&username='+email+'&password='+password+'&scope='+scope;
  var headers = {
    headers: {
      "Authorization": authToken,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }
  }
  return {
    data: grant,
    headers: headers
  }
}

const createUserConfig = args => {
  var [first, last, email, password] = args;
  var data = { 
    schemas: schemas.createUser,
    name: {
      givenName: first,
      familyName: last
    },
    username: email,
    emails: [
      {
        value: email,
        type: "home",
        primary: true
      }
    ]
  };
  var headers = {
    headers: {
      "Authorization": "Bearer " + config.auth.accessToken,
      "Content-Type": "application/json"
    }
  };
  return data;
}

const getPasswordConfig = password => {
  return {
    password: password,
    schemas: ["urn:ietf:params:scim:schemas:oracle:idcs:UserPasswordChanger"]
  }
}

const updateGroupConfig = userId => {
  var data = {
    schemas: schemas.updateGroup,
    Operations: [
      {
        op: "add",
        path: "members",
        value: [
          {
            value: userId,
            type: "User"
          }
        ]
      }
    ]
  };
  return data;
}

const getHeaders = () => { return {
  headers: {
    "Authorization": "Bearer " + config.auth.accessToken,
    "Content-Type": "application/json"
  }
}; }
const authHeader = authToken => { return{headers: { "Authorization": "Bearer "+ authToken }} }
const getAccessToken = async () => {
  var reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
  var authToken = "Basic "+ Base64.encode(config.oAuth.clientId+":"+config.oAuth.clientSecret);
  var scope = encodeURIComponent('urn:opc:idm:__myscopes__');
  var grant = 'grant_type=client_credentials&scope='+scope;
  var headers = {
    headers: {
      "Authorization": authToken,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }
  }
  var result = await axios.post(reqUrl, grant, headers);
  console.log("GET TOKEN RESULT: ", result);
  return{headers: { "Authorization": "Bearer "+ result.data.access_token }}
}

const auth = {
  login: async (email, password) => {
    var headers = await getAccessToken();
    var groupId = config.auth.groupIds.LoanProcessors;
    var filter = "?filter=groups.value+eq+%22"+groupId+"%22";
    var reqUrl = config.idcsUrl + endpoints.idcs.users + filter;
    try { var result = await axios.get(reqUrl, headers); }
    catch(error) { console.log("GET MEMBERS ERROR", error); throw error; }
    var members = result.data.Resources.map(user => {
      return user.userName;
    });
    if (!members.includes(email)) throw Error("NoAccount"); 
    reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
    var { data, headers } = getLoginConfig(email, password);
    return axios.post(reqUrl, data, headers);
  },
  getUser: (username, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.users + username;
    var auth = authHeader(accessToken);
    console.log('Get User: ', reqUrl);
    return axios.get(reqUrl, auth);
  },
  register: async (groupId, args) => {
    var [first, last, email, password] = args;
    console.log('Create User');
    var reqUrl = config.idcsUrl + endpoints.idcs.users;
    var headers = await getAccessToken();
    var data = createUserConfig(args);
    var result = await axios.post(reqUrl, data, headers);
    console.log('USER CREATED');
    var filter = "?filter=userName+sw+%22"+encodeURIComponent(email)+"%22";
    reqUrl = config.idcsUrl + endpoints.idcs.users + filter;
    result = await axios.get(reqUrl, headers);
    var userId = result.data.Resources[0].id;
    console.log('USER ID ACQUIRED: ', userId);
    data = getPasswordConfig(password);
    reqUrl = config.idcsUrl + endpoints.idcs.passwordChanger + userId;
    result = await axios.put(reqUrl, data, headers);
    console.log('PASSWORD SET');
    reqUrl = config.idcsUrl + endpoints.idcs.groups + groupId;
    var data = updateGroupConfig(result.data.id);
    return axios.patch(reqUrl, data, headers);
  }
}

const storage = {
  getAll: async (collection, accessToken) => {
    console.log("(Storage) Getting All Metadata...")
    var reqUrl = config.baseUrl + endpoints.mobile.storage + collection + '/objects';
    var auth = authHeader(accessToken);
    return axios.get(reqUrl, auth);
  },
  getById: (collection, objectId, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.storage + collection + '/objects/' + objectId;
    return axios.get(reqUrl, authHeader(accessToken));
  },
  getEach: async (collection, accessToken) => {
    console.log("(Storage) Getting All Objects...")
    var result = await storage.getAll(collection, accessToken);
    const promises = result.data.items.map(async object => {
      const promise = await storage.getById(collection, object.id, accessToken);
      promise.data.loanId = object.id;
      return promise;
    });
    return Promise.all(promises);
  },
  create: (collection, object, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.storage + collection + '/objects';
    var auth = authHeader(accessToken);
    console.log(reqUrl);
    console.log(object);
    console.log(auth);
    return axios.post(reqUrl, object, auth);
  }
}

const devices = { 
  register: (deviceToken, user, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.devices + "register";
    var data = {
      mobileClient: {
        id: "com.creditunion.client.app",
        version: "1.0",
        platform: "IOS"
      },
      notificationProvider: "APNS",
      notificationToken: deviceToken,
      user: user
    };
    var auth = authHeader(accessToken);
    return axios.post(reqUrl, data, auth);
  }
}

const notifications = {
  create: (payload, user, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.notifications;
    var auth = authHeader(accessToken);
    var data = {
      message: payload,
      users: [user]
    }
    console.log('payload', payload);
    console.log('data', data);
    return axios.post(reqUrl, data, auth);
  }
}

const custom = {
  getLoan: (loanId, accessToken) => {
    console.log("Getting Loan...")
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    return axios.get(reqUrl, auth);
  },
  createLoan: async (loan, accessToken) => {
    /** 
     * Creates Loan -> Get's Dealer -> if(dealerExists) => notify(); else => createDealer()
     */
    console.log("Creating Loan...")
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans.slice(0, -1);
    var auth = authHeader(accessToken);
    return axios.post(reqUrl, loan, auth);
  },
  updateLoan: (loan, loanId, accessToken) => {
    console.log("Updating Loan...")
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    return axios.put(reqUrl, loan, auth);
  },
  deleteLoan: (loanId, accessToken) => {
    console.log("Deleting Loan...")
    console.log("loanId: ", loanId);
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    console.log("reqUrl: ", reqUrl);
    console.log("auth: ", auth);
    return axios.delete(reqUrl, auth);
  },
  getDealer: (mobile, accessToken) => {
    console.log("Getting Dealer...")
    var reqUrl = config.baseUrl + endpoints.mobile.custom.dealers + mobile;
    var auth = authHeader(accessToken);
    console.log("reqUrl: ", reqUrl);
    console.log("mobile: ", mobile);
    console.log("auth: ", auth);
    return axios.get(reqUrl, auth);
  },
  createDealer: (dealer, accessToken) => {
    console.log("Creating Dealer...")
    var reqUrl = config.baseUrl + endpoints.mobile.custom.dealers + dealer.mobile;
    var auth = authHeader(accessToken);
    return axios.put(reqUrl, dealer, auth);
  },
  sendNotification: (payload, user, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.custom.messages;
    var auth = authHeader(accessToken);
    var data = {
      message: payload,
      users: [user]
    }
    console.log('payload', payload);
    console.log('data', data);
    return axios.post(reqUrl, data, auth);
  }
}

const amce = { auth, storage, devices, notifications, custom };

export default amce;