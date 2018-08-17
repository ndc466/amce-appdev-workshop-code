import React, { Component } from "react";
import { ImageBackground, Image, View, StatusBar, TouchableHighlight, Alert } from "react-native";
import { 
  Container, Header, Left, Right, Title, Icon, Body, Separator,
  Badge, Button, H3, Text, Spinner, Content, List, CardItem, Card
 } from "native-base";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';

import styles from "./styles";

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadMsgs: [],
      readMsgs: [],
      totalUnread: 0
    };
  };

  componentDidMount = () => {
    console.log("Getting all relevant notifications...", );
    var { messages } = this.props;
    var unreadMsgs = [];
    var readMsgs = [];
    var total = 0;
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].unread) {
        unreadMsgs.push(messages[i]);
        total++;
      }
      else { readMsgs.push(messages[i]); }
    }
    this.setState({
      unreadMsgs: unreadMsgs,
      readMsgs: readMsgs,
      totalUnread: total
    });
  };

  componentWillUnmount = () => {
    console.log("Reading messages...");
    this.props.loanListActions.readAllMessages();
  }

  toLoanProfile = (i) => {
    var { unreadMsgs, messages, loans } = this.props;
    var total = unreadMsgs.concat(messages);
    var loanId = total[i].loanId;
    for (var j = 0; j < loans.length; j++) {
      if (loans[j].loanId = loanId) {
        this.props.navigate("LoanProfile", {index: j});
      }
    }
  }

  getNotifications = () => {
    var { messages } = this.props;
/*     if (totalUnread < 5) { var remaining = 5 - totalUnread; }
    var total = unreadMsgs.concat(messages); */
    var notifications = [];
    for (var i = 0; i < messages.length; i++) {
      if ((!messages[i].unread) && (i >= 5)) { break; }
      var msg = messages[i];
      var bgColor = (msg.unread) 
      ? { backgroundColor: 'rgba(251,111,111,1)' }
      : { backgroundColor: 'rgba(255,255,255,1)' }
      notifications.push(
        <Card style={{ marginTop: 10, marginBottom: 10 }}>
          <CardItem bordered style={bgColor} 
                    onPress={() => this.toLoanProfile(i)}>
            <Left>
              <Text style={styles.bold}>{"Loan ID"}</Text>
            </Left>
            <Body>
              <Text>{msg.systemId}</Text>
            </Body>
          </CardItem>
          <Separator style={{height: 1}}/>
          <CardItem bordered style={bgColor} 
                    onPress={() => this.toLoanProfile(i)}>
            <Left>
              <Text style={styles.bold}>{"From"}</Text>
            </Left>
            <Body>
              <Text>{msg.from}</Text>
            </Body>
          </CardItem>
          <Separator style={{height: 1}}/>
          <CardItem bordered style={bgColor} 
                    onPress={() => this.toLoanProfile(i)}>
            <Left>
              <Text style={styles.bold}>{"Subject"}</Text>
            </Left>
            <Body>
              <Text>{msg.subject}</Text>
            </Body>
          </CardItem>
          <Separator style={{height: 1}}/>
          <CardItem bordered style={bgColor} 
                    onPress={() => this.toLoanProfile(i)}>
            <Left>
              <Text style={styles.bold}>{"Message"}</Text>
            </Left>
            <Body>
              <Text>{msg.body}</Text>
            </Body>
          </CardItem>
        </Card>
      );
    }
    return notifications;
  }

  render() {
    const { navigation, loggedIn, loading, loaded } = this.props;
    if (!loggedIn) { navigation.navigate("Login"); }
    if (!loaded) { 
      this.props.loanListActions.fetchLoans(); 
      return <Container className=""/>;
    }
    if (loading) return <Container className=""/>;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{"Notifications"}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.getNotifications()}
        </Content>
      </Container> 
    );
  }
}

Notifications.propTypes = {
  loanListActions: PropTypes.object,
  loans: PropTypes.array,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  messages: PropTypes.array,
  totalUnread: PropTypes.number,

  amceActions: PropTypes.object,
  unreadMsgs: PropTypes.array,
  loggedIn: PropTypes.bool
};

function mapStateToProps(state) {
  var { loans, loading, loaded, messages, totalUnread } = state.loanList;
  var { loggedIn, unreadMsgs } = state.amce;
  return {
    loans, loading, loaded, loggedIn, unreadMsgs, messages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loanListActions: bindActionCreators(loanListActions, dispatch),
    amceActions: bindActionCreators(amceActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);