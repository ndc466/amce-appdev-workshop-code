/* 
{
  "aps":{
    "alert":{
      "title":"Game Request",
      "subtitle":"Five Card Draw",
      "body":"Bob wants to play poker"
    },
    "sound":"default",
    "category":"GAME_INVITATION"
  },
  "gameID":"12345678"
}

{
  "payload":{
    "services":{
      "apns":{
        "aps":{
          "alert":{
            "title":"Game Request",
            "body":"Bob wants to play poker"
          },
          "sound":"default",
        }
      }
    }
  }
}
*/
/*
{
	"payload": {
    "services": {
      "apns": {
    		"aps": {
    			"alert": {
        			"title": "New Loan Notification Profile Created",
        			"body": "A Credit Union loan notification profile has just been created with loan ID #123"
    			},
    			"sound": "default"
    		},
    		"metadata": {
    			"from": "Tim Jeffries",
    			"time": "8/9/2018, 5:03:00 PM",
    			"loanId": "123",
    			"msgIndex": 0
    		}        
      }
    }
	},
	"users": ["8326221587"]
}

{
  "template": {
    "name": "#default",
    "parameters": {
      "title": "Sale On Now!",
      "body": "50% off until Saturday",
      "badge": 5,
      "sound": "alarm.wav",
      "metadata": {
        "acme1": "value1",
        "acme2": ["value2", "value3"]
      }
    }
  }
}

{
  "message": "Hi! Our storewide sale is tomorrow.",
  "users": ["8326221587"]
}
*/