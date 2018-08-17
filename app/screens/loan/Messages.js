import React, { Component } from 'react';
import { View } from 'react-native';
import { 
  Container, Header, Left, Right, Title, Icon, Body, Separator,
  Badge, Button, H3, Text, Spinner, Content, List, CardItem, Card
 } from "native-base";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from "./styles";

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {
    var { loans, navigation } = this.props;
    var loan = loans[navigation.state.params.index];
    this.props.loanListActions.readMessages(loan);
  }

  getMessages = () => {
    var { loans, navigation } = this.props;
    var loan = loans[navigation.state.params.index];
    var messages = [];
    loan.messages = _.orderBy(loan.messages, 'unread', 'desc');
    for (let i = 0; i < loan.messages.length; i++) {
      var bgColor = (loan.messages[i].unread) 
      ? { backgroundColor: 'rgba(251,111,111,1)' }
      : { backgroundColor: 'rgba(255,255,255,1)' }
      messages.push(
        <Card style={{marginTop: 10, marginBottom: 10}}>
          <CardItem bordered style={bgColor}>
            <Left>
              <Text style={styles.bold}>{"From"}</Text>
            </Left>
            <Body>
              <Text>{loan.messages[i].from}</Text>
            </Body>
          </CardItem>
          <Separator style={{height: 1}}/>
          <CardItem bordered style={bgColor}>
            <Left>
              <Text style={styles.bold}>{"Subject"}</Text>
            </Left>
            <Body>
              <Text>{loan.messages[i].subject}</Text>
            </Body>
          </CardItem>
          <Separator style={{height: 1}}/>
          <CardItem bordered style={bgColor}>
            <Left>
              <Text style={styles.bold}>{"Message"}</Text>
            </Left>
            <Body>
              <Text>{loan.messages[i].body}</Text>
            </Body>
          </CardItem>
        </Card>
      );
    }
    return messages;
  }

  render() {
    const { navigation, loading } = this.props;
    if (loading) return <Container className=""/>;
    return(
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Messages</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {this.getMessages()}
        </Content>
      </Container>
    );
  }
}

Messages.propTypes = {
  loanListActions: PropTypes.object,
  loans: PropTypes.array,

  amceActions: PropTypes.object,
  unreadMsgs: PropTypes.array,
  loggedIn: PropTypes.bool
};

function mapStateToProps(state) {
  var { loans, loading, loaded /*unreadMsgs*/ } = state.loanList;
  var { unreadMsgs, loggedIn } = state.amce;
  return {
    loans, loading, loaded, unreadMsgs, loggedIn
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
)(Messages);