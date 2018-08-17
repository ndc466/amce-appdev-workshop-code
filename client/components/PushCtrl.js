import React, { Component } from 'react';
import { PushNotificationIOS, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loanListActions from '../redux/actions/loanListActions';
import * as amceActions from '../redux/actions/amceActions';
import PropTypes from 'prop-types';
import amce from './AMCe';

class PushCtrl extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    let scope = this;
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: (token) => {
        console.log('TOKEN VALUE: ' + token.token );
        var { mobile, accessToken, unreadMsgs } = scope.props;
        console.log("mobile: ", mobile);
        try { var result = amce.devices.register(token.token, mobile); }
        catch(error) { console.log("(REGISTER) error", error); }
        //PushNotification.setApplicationIconBadgeNumber(0);
      },
      onNotification: (notification) => { // (required) Called when a remote or local notification is opened or received
        console.log( 'NOTIFICATION:', notification );
        var { unreadMsgs } = scope.props;
        // process the notification
        if (notification.foreground) {
          var { title, body } = notification.message;
          Alert.alert(title, body);
        }
        PushNotification.setApplicationIconBadgeNumber(unreadMsgs.length+1);
        this.props.loanListActions.fetchLoans();
        //this.props.amceActions.receiveMessage(notification);
        /*
        PushNotification.getApplicationIconBadgeNumber(number => {
          console.log('current badge number: ', number);
          PushNotification.setApplicationIconBadgeNumber(number+1);
          this.props.amceActions.addUnreadMsg(notification);
        }); */

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      senderID: "YOUR GCM SENDER ID", // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      permissions: { // IOS ONLY (optional): default: all - Permissions to register.
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true, // Should the initial notification be popped automatically
                                    // default: true
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true
    });
  }

  render() {
    return null;
  }
}

PushCtrl.propTypes = {
  loanListActions: PropTypes.object,

  amceActions: PropTypes.object,
  accessToken: PropTypes.string,
  mobile: PropTypes.string,
  unreadMsgs: PropTypes.array
};

const mapStateToProps = (state) => {
  var { accessToken, mobile, unreadMsgs } = state.amce;
  return { accessToken, mobile, unreadMsgs };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loanListActions: bindActionCreators(loanListActions, dispatch),
    amceActions: bindActionCreators(amceActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PushCtrl);