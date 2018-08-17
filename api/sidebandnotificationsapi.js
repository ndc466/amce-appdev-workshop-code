/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */ 

/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service 
 */

const uuid = require('uuid/v1');
Array.prototype.peek = () => {
	return this[this.length-1];
}

const getPayload = (loan) => {
	var { systemId, loanId } = loan;
	var msgIndex = loan.messages.length;
	var message = loan.messages[msgIndex-1];
  return {
		name: "#default",
		parameters: {
			title: message.subject,
			body: message.body,
			sound: "alarm.wav",
			custom: {
				from: message.from,
				time: message.time,
				loanId: loanId,
				systemId: systemId,
				msgIndex: msgIndex
			}
		}
  };
}

const getDeletePayload = (loan) => {
	var { systemId, loanId } = loan;
  return {
		name: "#default",
		parameters: {
			title: "Loan Notification Profile Deleted",
			body: "The loan notification profile with loan ID #" + loanId + " has been deleted!",
			sound: "alarm.wav",
			custom: {
				from: loan.loanProcessor,
				time: new Date().toLocaleString(),
				loanId: loanId,
				systemId: systemId
			}
		}
  };	
}

module.exports = function(service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */


	service.put('/mobile/custom/SidebandNotificationsAPI/dealers/:dealerId', function(req,res) {
		var mobile = req.params.dealerId;
		var token = req.body.token;
		var msg;
		req.oracleMobile.storage.getById('Dealers', mobile)
			.then(result => {
				var dealer = result.result;
				dealer.deviceToken = token;
				return req.oracleMobile.storage.storeById('Dealers', mobile, JSON.stringify(dealer));
			}, error => {
				res.send({
					status: error.statusCode, 
					request: "Get dealer with mobile number",
					message: error.error
				});
			})
			.then(result => {
				var device = {
					mobileClient: {
						id: "com.creditunion.client.app",
						version: "1.0",
						platform: "IOS"
					},
					notificationProvider: "APNS",
					notificationToken: token,
					user: mobile
				}
				return req.oracleMobile.devices.register(device)
			}, error => {
				res.send({
					status: error.statusCode, 
					request: "Update dealer with token",
					message: error.error
				});
			})
			.then(result => {
				try { msg = JSON.parse(result.result); }
				catch(error) { msg = result.result; }
        res.send(result.statusCode, msg);
			}, error => {
				res.send({
					status: error.statusCode, 
					request: "Register device",
					message: error.error
				});
			})
		});

	service.delete('/mobile/custom/SidebandNotificationsAPI/dealers/:dealerId', function(req,res) {
		var result = {};
		var statusCode = 200;
		res.status(statusCode).send(result);
	});

	service.get('/mobile/custom/SidebandNotificationsAPI/dealers/:dealerId', function(req,res) {
		var msg;
		req.oracleMobile.storage.getById('Dealers', req.params.dealerId)
			.then(result => {
				try { msg = JSON.parse(result.result); }
				catch(error) { msg = result.result; }
        res.send(result.statusCode, msg);
			}, error => {
				try { msg = JSON.parse(error.error); }
				catch(error) { msg = error.error; }
				res.send(error.statusCode, msg);
			});
	});

	service.put('/mobile/custom/SidebandNotificationsAPI/loans/:loanId', function(req,res) {
		var loan = req.body;
		var fromDealer = loan.fromDealer;
		delete loan.fromDealer;
		loan.loanId = req.params.loanId;
		console.log(loan.loanId);
		req.oracleMobile.storage.storeById('Loans', loan.loanId, JSON.stringify(loan))
			.then(result => { // LOAN UPDATE SUCCESSFULL
				console.log("LOAN UPDATE SUCCESSFUL", result.result);
				if (fromDealer) { 
					res.send({
						status: result.statusCode,
						type: "FROM DEALER",
						message: result.result,
						id: loan.loanId
					});
					return;
				}
				var data = {
					template: getPayload(loan),
					users: [loan.contact_mobile]
				}
				return req.oracleMobile.notification.post(data); // => notifyDealer()
			}, error => { // LOAN UPDATE UNSUCCESSFUL
				console.log("LOAN UPDATE UNSUCCESSFUL"); 
				res.send({
					status: error.statusCode, 
					request: "POST loan/" + loan.loanId,
					message: error.error,
					id: loan.loanId
				});
			})
			.then(result => {	// NOTIFICATION SENT
				if (!result) { return; }
				res.send({
					status: result.statusCode,
					type: "POST notification",
					message: result.result,
					id: loan.loanId
				});
			}, error => { 
				console.log("Notification NOT sent!"); 
				res.send({
					status: error.statusCode, 
					type: "POST notification",
					message: error.error,
					id: loan.loanId
				});
			});
	});

	service.delete('/mobile/custom/SidebandNotificationsAPI/loans/:loanId', function(req,res) {
		console.log("DELETE Loan");
		var msg;
		req.oracleMobile.storage.getById("Loans", req.params.loanId)
			.then(result => { // LOAN FOUND
				var loan = JSON.parse(result.result);
				console.log("LOAN:", loan);
				loan['loanId'] = req.params.loanId;
				return loan;
			}, error => { 
				res.send(400, JSON.parse(error.error));
				return;
			}) // LOAN NOT FOUND
			.then(loan => {
				if (!loan) { return; }
				var data = {
					template: getDeletePayload(loan),
					users: [loan.contact_mobile]
				}
				return req.oracleMobile.notification.post(data);
			})
			.then(result => {
				console.log("Notification sent!"); 
				res.send({
					status: result.statusCode,
					type: "POST notification",
					message: result.result,
					id: loan.loanId
				});
			}, error => {
				console.log("Notification NOT sent!"); 
				res.send({
					status: 400, 
					type: "POST notification",
					message: error.error,
					id: loan.loanId
				});
			})
    req.oracleMobile.storage.remove('Loans', req.params.loanId)
			.then(result => {
				console.log(result);
				res.send(200, result.result);
			}, error => {
				try { msg = JSON.parse(error.error); }
				catch(error) { msg = error.error; }
				res.send(error.statusCode, msg);
			});
	});

	service.get('/mobile/custom/SidebandNotificationsAPI/loans/:loanId', function(req,res) {
		req.oracleMobile.storage.getById("Loans", req.params.loanId)
			.then(result => {
				var loan = JSON.parse(result.result);
				loan['loanId'] = req.params.loanId;
				res.send(200, loan);
			}, error => { res.send(400, JSON.parse(error.error)); });
	});

	service.post('/mobile/custom/SidebandNotificationsAPI/dealers', function(req,res) {
		var msg;
		var dealer = req.body;
    req.oracleMobile.devices.register(req.body)
      .then(result => {
        req.oracleMobile.storage.storeById('Dealers', "4755cd1c-8853-4c7c-86a8-e8cbfdcaa49c", JSON.stringify(dealer))
          .then(result => {
						try { msg = JSON.parse(result.result); }
						catch(error) { msg = result.result; }
            res.send(result.statusCode, msg);
          }, error => {
						try { msg = JSON.parse(error.error); }
						catch(error) { msg = error.error; }
            res.send(error.statusCode, msg);
          })
      }, error => {
				try { msg = JSON.parse(error.error); }
				catch(error) { msg = error.error; }
				res.send(error.statusCode, msg);
      });
	});

	service.get('/mobile/custom/SidebandNotificationsAPI/dealers', function(req,res) {
		var msg;
    req.oracleMobile.storage.getById("Dealers", "4755cd1c-8853-4c7c-86a8-e8cbfdcaa49c")
      .then(result => {
				try { msg = JSON.parse(result.result); }
				catch(error) { msg = result.result; }
        res.send(result.statusCode, msg);
      }, error => {
				try { msg = JSON.parse(error.error); }
				catch(error) { msg = error.error; }
				res.send(error.statusCode, msg);
			});
	});

	service.post('/mobile/custom/SidebandNotificationsAPI/loans', function(req,res) {
		console.log('LOAN = ', req.body);
		var msg;
		var loan = req.body;
		loan.loanId = uuid();
		req.oracleMobile.storage.storeById('Loans', loan.loanId, JSON.stringify(loan))
			.then(result => {
				console.log("LOAN CREATION SUCCESSFUL: ", result);
				return req.oracleMobile.storage.getById("Dealers", loan.contact_mobile); // => doesDealerExist()
			}, error => {
				console.log("LOAN CREATION UNSUCCESSFUL: ", error); 
				try { msg = JSON.parse(error.error); }
				catch(error) { msg = error.error; }
				res.send(error.statusCode, msg);
			})
			.then(result => {
				console.log("DEALER FOUND: ", result);
				var notification = {
					template: getPayload(loan),
					users: [loan.contact_mobile]
				}
				console.log("NOTIFICATION: ", notification);
				return req.oracleMobile.notification.post(notification); // => notifyDealer()
			}, error => { // DEALER NOT FOUND => createDealer()
				console.log("DEALER NOT FOUND: ", error);
				var dealer = {
					mobile: loan.contact_mobile,
          firstName: loan.contact_name.split(' ')[0],
					lastName: loan.contact_name.split(' ')[1],
					email: "",
					loans: [loan.loanId],
					deviceToken: ""
				}
				console.log("DEALER: ", dealer);
				console.log("CONTACT MOBILE: ", loan.contact_mobile);
				return req.oracleMobile.storage.storeById("Dealers", loan.contact_mobile, JSON.stringify(dealer));
			})
			.then(result => {	// NOTIFICATION SENT or DEALER CREATED
				console.log("NOTIFICATION SENT or DEALER CREATED: ", result);
				res.send({
					status: result.statusCode,
					type: "notification",
					message: result.result,
					id: loan.loanId
				});
			}, error => { // NOTIFICATION NOT SENT or DEALER NOT CREATED
				switch(error.error['o:errorCode']) {
					case 'MOBILE-74545':
						console.log("NOTIFICATION NOT SENT - DEVICE NOT REGISTERED");
						res.send({
							status: 200,
							message: "Device not registered yet"
						});
					default:
						try { msg = JSON.parse(error.error); }
						catch(error) { msg = error.error; }
						res.send(error.statusCode, msg);
				}
			})
	});

	service.get('/mobile/custom/SidebandNotificationsAPI/loans', function(req,res) {
    req.oracleMobile.storage.getAll('Loans')
			.then(result => {
					var data = JSON.parse(result.result);
					return data.items;
			})
			.then(result => {
				var loans = [];
				var itemsProcessed = 0;
				result.forEach((item, index, items) => {
					req.oracleMobile.storage.getById("Loans", item.id)
						.then(result => {
							itemsProcessed ++;
							obj = JSON.parse(result.result);
							obj['loanId'] = item.id;
							loans.push(obj);
							if (itemsProcessed === items.length) { res.send(200, loans); }
						});
				});
			});
  });

};
