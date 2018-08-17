import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content, Text, List, ListItem, Icon,
  Container, Left, Right, Badge
} from "native-base";
import styles from "./style";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';

const creditunionCover = require("../../assets/creditunionCover.png");
const datas = [
  {
    name: "Home",
    route: "Home",
    icon: "home",
    bg: "#9F897C",
    types: "5"
  },
  {
    name: "Logout",
    icon: "log-out",
    bg: "#9F897C",
    types: "5"
  }
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  logout = () => {
    this.props.amceActions.logout();
    this.props.navigation.navigate("Login");
  }

  navigate = (data) => {
    if (data.name === "Home") {
      this.props.navigation.navigate(data.route);
    } else {
      this.logout();
    }
  }

  render() {
    return (
      <Container>
        <Content bounces={false} style={{ flex: 1, backgroundColor: "#fff", top: -1 }}>
          <Image style={styles.drawerCover} source={creditunionCover} />
          <List dataArray={datas} renderRow={data =>
            <ListItem button noBorder onPress={() => this.navigate(data)}>
              <Left>
                <Icon active name={data.icon} style={{ color: "#777", fontSize: 26, width: 30 }} />
                <Text style={styles.text}>{data.name}</Text>
              </Left>
            </ListItem>
            }/>
        </Content>
      </Container>
    );
  }
}

SideBar.propTypes = {
  amceActions: PropTypes.object,
  loggedIn: PropTypes.bool,
  username: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,

  loanListActions: PropTypes.object,
  loans: PropTypes.array
};

function mapStateToProps(state) {
  return {
    loggedIn: state.amce.loggedIn,
    username: state.amce.username,
    firstName: state.amce.firstName,
    lastName: state.amce.lastName,

    loans: state.loanList.loans
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
)(SideBar);