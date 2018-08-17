import React, { Component } from "react";
import {
  Container, Header, Title, Content, Button, Icon,
  Left, Right, Body, Text, Segment
} from "native-base";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as amceActions from '../../redux/actions/amceActions';
import * as loanListActions from '../../redux/actions/loanListActions';
import PropTypes from 'prop-types';
import PTRView from 'react-native-pull-to-refresh';

import IconBadge from 'react-native-icon-badge';

import PushCtrl from '../../components/PushCtrl';
import Splash from './Splash';
import Dashboard from './Dashboard';
import LoanList from './LoanList';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      seg: 1, badgeCount: 3,
      loading: false, redirect: false
    };
  }

  componentWillMount = async () => {
    var { loggedIn } = this.props;
    if (!loggedIn) { this.setState({redirect: true}) }
    else {
      console.log("loggedIn = ", loggedIn);
      this.setState({loading: true, redirect: false})
      await this.props.loanListActions.fetchLoans();
      this.setState({loading: false})
    }
  };

  _refresh = () => {
    this.props.loanListActions.fetchLoans();
    return new Promise((resolve) => {
      setTimeout(()=>{resolve()}, 2000)
    });
  }
  
  render() {
    var { navigation, messages, totalUnread, loggedIn, loading, loans } = this.props;
    console.log("messages: ", messages);
    if (!loggedIn) { navigation.navigate("Login"); }
    if (loans == null) { this.props.loanListActions.fetchLoans(); return <Splash/> }
    if (loading) { return <Splash /> }
    return (
      <Container>
        {(loggedIn) ? <PushCtrl /> : null}
        <PTRView onRefresh={this._refresh}>
          <Container style={{ backgroundColor: "#FBFAFA" }}>
            <Header hasTabs>
              <Left>
                <Button transparent onPress={() => navigation.openDrawer()}>
                  <Icon name="ios-menu" />
                </Button>
              </Left>
              <Body>
                <Title>Loan Profiles</Title>
              </Body>
              <Right>
                <IconBadge MainElement={
                  <Button transparent onPress={() => navigation.navigate("Notifications")}>
                    <Icon name="ios-notifications" style={{fontSize: 35}}/>
                  </Button>
                }
                BadgeElement={
                  <Text style={{color:'#FFFFFF'}}>{totalUnread/* messages.length */}</Text>
                }
                IconBadgeStyle={
                  {
                    width:20,
                    height:20,
                    backgroundColor: 'red'
                  }
                }
                Hidden={totalUnread === 0} />
              </Right>
            </Header>
            <Segment>
              <Button first active={this.state.seg === 1 ? true : false}
                      onPress={() => this.setState({ seg: 1 })}>
                <Text>Dashboard</Text>
              </Button>
              <Button active={this.state.seg === 2 ? true : false}
                      onPress={() => this.setState({ seg: 2 })}>
                <Text>Loan List</Text>
              </Button>
            </Segment>

            <Content padder>
              {this.state.seg === 1 && <Dashboard loans={this.props.loans} refresh={this.refresh} navigate={this.props.navigation.navigate}/>}
              {this.state.seg === 2 && <LoanList loans={this.props.loans} refresh={this.refresh} navigate={this.props.navigation.navigate}/>}
            </Content>
          </Container>
        </PTRView>
      </Container>
    );
  }
}

Home.propTypes = {
  loanListActions: PropTypes.object,
  loans: PropTypes.array,
  messages: PropTypes.array,
  totalUnread: PropTypes.number,

  amceActions: PropTypes.object,
  loggedIn: PropTypes.bool,
  accessToken: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  id: PropTypes.string,
  mobile: PropTypes.string
};

function mapStateToProps(state) {
  var { loans, messages, totalUnread, loading, loaded } = state.loanList;
  var { loggedIn, accessToken, firstName, lastName, email, id, mobile } = state.amce;
  return {
    loans, messages, totalUnread, loading, loaded,
    loggedIn, accessToken, firstName, lastName, email, id, mobile
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
)(Home);