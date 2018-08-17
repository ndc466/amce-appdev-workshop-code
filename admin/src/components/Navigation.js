import React, { Component } from 'react';
import { Image, Menu } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import logo from '../images/creditunion-logo.jpg';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loanListActions from '../redux/actions/loanListActions';
import * as amceActions from '../redux/actions/amceActions';
import PropTypes from 'prop-types';

class Navigation extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true
    };
  }
  
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  logout = () => {
    this.props.amceActions.logout();
    this.props.loanListActions.clearLoans();
  }

  navButtons = () => {
    var { firstName, lastName, loggedIn, loading } = this.props;
    var name = firstName + ' ' + lastName;
    if (!loggedIn) {
      return (this.props.location.pathname !== "/login") ?
      (
        <Menu.Menu position='right'>
          <Menu.Item as='a' style={{ marginRight: '1em', textTransform: "uppercase" }}>
            <Link to='/login'>Login</Link>
          </Menu.Item>
        </Menu.Menu>
      ) : (
        <Menu.Menu position='right'>
          <Menu.Item as='a' style={{ marginRight: '1em', textTransform: "uppercase" }}>
            <Link to='/register'>Register</Link>
          </Menu.Item>
        </Menu.Menu>
      )
    } else {
      return (
        <Menu.Menu position='right'>
          <Menu.Item as='a' style={{ marginRight: '1em', textTransform: "uppercase" }}>
            <Link to='/'>{(!firstName) ? null : name}</Link>
          </Menu.Item>          
          <Menu.Item as='a' style={{ marginRight: '1em', textTransform: "uppercase" }}>
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.Item as='a' style={{ marginRight: '1em', textTransform: "uppercase" }}>
            <Link to='' onClick={this.logout}>Logout</Link>
          </Menu.Item>
        </Menu.Menu>
      );
    }
  }
  
  render() {
    return (
      <Menu fixed='top' borderless style={{fontSize:"20px"}}>
        <Menu.Item as='a' header style={{ textTransform: "uppercase", color: "#006A8C" }}>
          <Image size='mini' src={logo} style={{ marginRight: '2em', height: "auto", width: "15%" }} />
          Credit Union
        </Menu.Item>
        { this.navButtons() }
      </Menu>
    );
  }
}

Navigation.propTypes = {
  amceActions: PropTypes.object,
  loggedIn: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,

  loanListActions: PropTypes.object,
  loading: PropTypes.bool,
  loading: PropTypes.bool
};

function mapStateToProps(state) {
  var { loggedIn, firstName, lastName } = state.amce;
  var { loading, loaded } = state.loanList;
  return {
    loggedIn, firstName, lastName,
    loading, loaded
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loanListActions: bindActionCreators(loanListActions, dispatch),
    amceActions: bindActionCreators(amceActions, dispatch)
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation));