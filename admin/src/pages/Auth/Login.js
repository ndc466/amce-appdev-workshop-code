import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import logo from '../../images/login-logo2.png';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';

import { Link, Redirect } from 'react-router-dom';

const NO_ACCOUNT = "Error: NoAccount";
const WRONG_PASSWORD = "Error: WrongPassword";
const NETWORK_ERROR = "Network Error";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: null,
      password: null,
      redirect: false,
      noAccount: false,
      wrongPassword: false,
      error: false
    };
  }

  updateEmail = (e) => { this.setState({email: e.target.value}); }
  updatePassword = (e) => { this.setState({password: e.target.value}); }

  login = async () => { 
    console.log("Logging in...");
    var { email, password } = this.state;
    try {
      var result = await this.props.amceActions.login(email, password);
      this.setState({ redirect: true });
    } 
    catch(error) {
      console.log("LOGIN ERROR: ", error);
      switch(error.message) {
        case NO_ACCOUNT: this.setState({noAccount: true});
        case WRONG_PASSWORD: this.setState({wrongPassword: true});
        default: this.setState({error: true});
      }
      setTimeout(() => {
        this.setState({noAccount: false, wrongPassword: false, error: false})
      }, 5000);
    };
  }

  getMessage = () => {
    var { noAccount, wrongPassword, error } = this.state;
    if (noAccount) {
      return (
        <Message negative>
          <Message.Header>The email you've entered doesn’t match any account.</Message.Header>
          <p>Sign up for an account.</p>
        </Message>
      )
    }
    if (wrongPassword) {
      return (
        <Message negative>
          <Message.Header>The password you’ve entered is incorrect.</Message.Header>
          <p>Forgot password?</p>
        </Message>
      )
    }
    if (error) {
      return (
        <Message negative>
          <Message.Header>Sorry we couldn't complete your request at this time</Message.Header>
        </Message>
      )
    }
    return null;
  }

  render() {
    const { redirect, loginFailed } = this.state;
    if (redirect) return <Redirect to='/'/>;
    return (
      <div className='proper-height'>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            {this.getMessage()}
            <Header as='h2' textAlign='center' style={{ color: "#006A8C" }}>
              <Image size='large' src={logo} style={{ height: "auto", width: "30%" }}/> Login to your account
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input 
                  fluid 
                  icon='mail' 
                  iconPosition='left' 
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.updateEmail} 
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  value={this.state.password}
                  onChange={this.updatePassword}
                />
                <Button color='teal' fluid size='large' 
                  onClick={this.login}>
                  Log In
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <Link to='/register'>Sign Up</Link>
            </Message>
          </Grid.Column>
        </Grid>        
      </div>
    );
  }
}

Login.propTypes = {
  amceActions: PropTypes.object,
  backend: PropTypes.object,
  loggedIn: PropTypes.bool,
  accessToken: PropTypes.string
};

function mapStateToProps(state) {
  return {
    backend: state.amce.backend,
    loggedIn: state.amce.loggedIn,
    accessToken: state.amce.accessToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    amceActions: bindActionCreators(amceActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);