import React, { Component } from "react";
import { ImageBackground, Image, View, StatusBar, TouchableHighlight, Alert } from "react-native";
import axios from 'axios';
import { 
  Container, Header, Left, Right, Title, Icon, Body, Separator,
  Badge, Button, H3, Text, Spinner, Content, List, CardItem, Card
 } from "native-base";
 import uuid from 'uuid/v1';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import PropTypes from 'prop-types';

import styles from "./styles";
const notify = require("../../assets/notify.png");

class LoanProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalUnread: 0,
      unreadMsgs: null,
      loan: null
    };
  };

  componentWillMount = () => {
    var { loans, navigation } = this.props;
    var loan = loans[navigation.state.params.index];
    var unreadMsgs = [];
    for (var i = 0; i < loan.messages.length; i++) {
      var msg = loan.messages[i];
      if ((msg.from === loan.loanProcessor) && msg.unread) {
        unreadMsgs.push(msg)
      }
    }
    this.setState({ loan: loan, unreadMsgs: unreadMsgs })
  };

  createAlert = async () => {
    let index = this.props.navigation.state.params.index;
    let loan = this.props.loans[index];
    loan.lastNotification = new Date().toLocaleString();
    loan.messages.push({
      from: loan.contact_name,
      to: loan.loanProcessor, 
      subject: "New Response in Loan System",
      message: "A new response has been entered into the Loan System.",
      time: loan.lastNotification,
      unread: true,
      systemId: loan.systemId,
      loanId: loan.loanId,
      msgId: uuid()
    });
    try { 
      var result = await this.props.loanListActions.updateLoan(loan, loan.loanId);
      Alert.alert("New notification message has been sent!");
    }
    catch(error) { 
      console.log(error);
      Alert.alert("Error: message not sent!")
    }
  }

  toMessages = () => {
    this.props.navigation.navigate("Messages", {
      index: this.props.navigation.state.params.index
    });
  }

  /* getUnreadMsgs = (loan) => {
    var unreadMsgs = [];
    for (var i = 0; i < loan.messages.length; i++) {
      var msg = loan.messages[i];
      if ((msg.from === loan.loanProcessor) && msg.unread) {
        unreadMsgs.push(msg)
      }
    }
    return unreadMsgs;
  } */

  render() {
    var { loans, navigation } = this.props;
    var { loan, unreadMsgs } = this.state;
    if (unreadMsgs === null) return <Container className=""/>;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Loan Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Card>
            <CardItem bordered>
              <Left>
                <Text>Loan ID</Text>
              </Left>
              <Body>
                <Text>{loan.systemId}</Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text>Loanee</Text>
              </Left>
              <Body>
                <Text>{loan.loanee}</Text>
              </Body>
            </CardItem>
            <CardItem bordered>
              <Left>
                <Text>Last Notified</Text>
              </Left>
              <Body>
                <Text>{loan.lastNotification}</Text>
              </Body>
            </CardItem>
            <CardItem bordered button onPress={() => this.toMessages()}>
              <Left>
                <Text>{"Messages    "}</Text>
                {
                  (unreadMsgs.length > 0) ? (
                  <Badge danger>
                    <Text>{unreadMsgs.length}</Text>
                  </Badge>) : null
                }
                {/* <Badge danger> I love Kurt Bringsjord
                  <Text>{(unreadMsgs.length > 0) ? unreadMsgs.length :  }</Text>
                </Badge> */}
              </Left>
              <Right>
                <Icon active name="arrow-forward"/>
              </Right>
            </CardItem>
            <CardItem cardBody
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableHighlight onPress={() => this.createAlert()}>
              <Image style={{
                       resizeMode: 'contain',
                       height: 155,
                       alignSelf: 'stretch'
                     }}
                     source={notify}/>
                </TouchableHighlight>
            </CardItem>
          </Card>
        </Content>
      </Container> 
    );
  }
}

LoanProfile.propTypes = {
  loanListActions: PropTypes.object,
  loans: PropTypes.array,
  messages: PropTypes.array,
  totalUnread: PropTypes.number,
};

function mapStateToProps(state) {
  var { loans, messages, totalUnread } = state.loanList;
  return { loans, messages, totalUnread };
}

function mapDispatchToProps(dispatch) {
  return {
    loanListActions: bindActionCreators(loanListActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanProfile);