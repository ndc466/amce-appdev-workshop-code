import config from '../../config';
import axios from 'axios';
import utf8 from 'utf8'
import base64 from 'base-64'
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
      dealers: "/mobile/custom/SidebandNotificationsAPI/dealers/"
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
  var bytes = utf8.encode(config.oAuth.clientId+":"+config.oAuth.clientSecret);
  var encoded = base64.encode(bytes);
  var authToken = "Basic "+ encoded;
  email = encodeURIComponent(email);
  password = encodeURIComponent(password);
  var scope = encodeURIComponent(config.baseUrl+'urn:opc:resource:consumer::all');
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

const authHeader = authToken => {return{headers: { "Authorization": "Bearer "+ authToken }}}

const createUserConfig = args => {
  var [first, last, email, mobile, password] = args;
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
    ],
    phoneNumbers: [
      {
        primary: true,
        type: "mobile",
        value: mobile
      }
    ]
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

const getAccessToken = async () => {
  console.log("GENERATING ACCESS TOKEN ...");
  var reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
  var bytes = utf8.encode(config.oAuth.clientId+":"+config.oAuth.clientSecret);
  var encoded = base64.encode(bytes);
  var authToken = "Basic "+ encoded;
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

const getResourceOwnerToken = async () => {
  var reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
  var bytes = utf8.encode(config.oAuth.clientId+":"+config.oAuth.clientSecret);
  var encoded = base64.encode(bytes);
  var authToken = "Basic "+ encoded;
  var scope = encodeURIComponent('urn:opc:resource:consumer::all');
  var username = encodeURIComponent(config.auth.username);
  var password = encodeURIComponent(config.auth.password);
  var scope = encodeURIComponent(config.baseUrl+'urn:opc:resource:consumer::all');
  var grant = 'grant_type=password&username='+username+'&password='+password+'&scope='+scope;
  var headers = {
    headers: {
      "Authorization": authToken,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    }
  }
  var reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
  try { var result = await axios.post(reqUrl, grant, headers); }
  catch(error) {
    console.log("ERROR (getResourceOwnerToken): ", error);
    throw error;
  }
  return authHeader(result.data.access_token);
}

const auth = {
  login: async (email, password) => {
    var headers = await getAccessToken();
    var groupId = config.auth.groupIds.Dealers;
    var filter = "?filter=groups.value+eq+%22"+groupId+"%22";
    var reqUrl = config.idcsUrl + endpoints.idcs.users + filter;
    try { var result = await axios.get(reqUrl, headers); }
    catch(error) { console.log("GET MEMBERS ERROR", error); throw error; }
    var members = result.data.Resources.map(user => {
      return user.userName;
    });
    if (!members.includes(email)) throw Error("NoAccount");
    var reqUrl = config.idcsUrl + endpoints.idcs.oAuthToken;
    var { data, headers } = getLoginConfig(email, password);
    return axios.post(reqUrl, data, headers);
  },
  getUser: async (email) => {
    var headers = await getAccessToken();
    var filter = "?filter=userName+sw+%22"+email+"%22";
    var reqUrl = config.idcsUrl + endpoints.idcs.users + filter;
    console.log('Get User: ', reqUrl);
    return axios.get(reqUrl, headers);
  },
  register: async (groupId, args) => {
    var [first, last, email, mobile, password] = args;
    console.log('Creating User...');
    var reqUrl = config.idcsUrl + endpoints.idcs.users;
    var headers = await getAccessToken();
    var data = createUserConfig(args);
    console.log(headers, data);
    try { var result = await axios.post(reqUrl, data, headers); }
    catch(error) { console.log("USER NOT CREATED"); throw error; }
    console.log('USER CREATED');
    var filter = "?filter=userName+sw+%22"+encodeURIComponent(email)+"%22";
    reqUrl = config.idcsUrl + endpoints.idcs.users + filter;
    result = await axios.get(reqUrl, headers);
    var userId = result.data.Resources[0].id
    console.log('USER ID ACQUIRED: ', userId);
    data = getPasswordConfig(password);
    reqUrl = config.idcsUrl + endpoints.idcs.passwordChanger + userId;
    result = await axios.put(reqUrl, data, headers);
    console.log('PASSWORD SET');
    reqUrl = config.idcsUrl + endpoints.idcs.groups + groupId;
    var data = updateGroupConfig(result.data.id);
    return axios.patch(reqUrl, data, headers);
  },
  getGroupId: (groupName) => {
    var groupsUrl = config.idcsUrl + endpoints.idcs.groups.splice(-1,1);
    var filter = "?filter=displayName+sw+%22"+groupName+"%22";
    var reqUrl = groupsUrl + filter;
    console.log(reqUrl);
    return axios.get(reqUrl);
  }
}

const storage = {
  getAll: (collection, auth) => {
    var reqUrl = config.baseUrl + endpoints.mobile.storage + collection + '/objects';
    console.log(reqUrl);
    return axios.get(reqUrl, authHeader(auth));
  },
  getById: (collection, objectId, auth) => {
    var reqUrl = config.baseUrl + endpoints.mobile.storage + collection + '/objects/' + objectId;
    return axios.get(reqUrl, authHeader(auth));
  },
  getEach: (collection, auth) => {
    return storage.getAll(collection, auth)
      .then(result => {
        var promises = result.data.items.map(object => {
          return storage.getById(collection, object.id, auth);
        });
        return Promise.all(promises);
      })
  }
}

const devices = { 
  register: async (deviceToken, user) => {
    try { var headers = await getResourceOwnerToken(); }
    catch(error) { throw error; }
    console.log("(REGISTER) headers = ", headers);
    var reqUrl = config.baseUrl + endpoints.mobile.devices + "register";
    console.log("(REGISTER) reqUrl = ", reqUrl);
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
    console.log("(REGISTER) data = ", data);
    return axios.post(reqUrl, data, headers);
  }
}

const notifications = {
  create: (message, user, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.notifications;
    return axios.get(reqUrl, authHeader(auth));
  }
}

const custom = {
  getLoan: (loanId, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    return axios.get(reqUrl, auth);
  },
  createLoan: (loan, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans.slice(0, -1);
    var auth = authHeader(accessToken);
    return axios.post(reqUrl, loan, auth);
  },
  updateLoan: (loan, loanId, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    loan.fromDealer = true;
    return axios.put(reqUrl, loan, auth);
  },
  deleteLoan: (loanId, accessToken) => {
    var reqUrl = config.baseUrl + endpoints.mobile.custom.loans + loanId;
    var auth = authHeader(accessToken);
    return axios.delete(reqUrl, auth);
  },
  registerDevice: (token, mobile, accessToken) => {
    var auth = authHeader(accessToken);
    var reqUrl = config.baseUrl + endpoints.mobile.custom.dealers + mobile;
    return axios.put(reqUrl, token, auth);
  }
}

const amce = { auth, storage, devices, notifications, custom };

export default amce;