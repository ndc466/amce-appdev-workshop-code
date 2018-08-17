import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Container } from 'semantic-ui-react';
import logo from '../../images/login-logo2.png';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      success: null
    };
  }

  updateFirstName = (e) => { this.setState({firstName: e.target.value}); }
  updateLastName = (e) => { this.setState({lastName: e.target.value}); }
  updateEmail = (e) => { this.setState({email: e.target.value}); }
  updatePassword = (e) => { this.setState({password: e.target.value}); }

  register = () => {
    var { firstName, lastName, email, password } = this.state;
    try { 
      this.props.amceActions.register(firstName, lastName, email, password);
      this.setState({success: true});
    }
    catch(error) {  }
    setTimeout(() => {
      this.setState({success: null})
    }, 5000);
  }

  getMessage = () => {
    var { success } = this.state;
    if (success === true) {
      return (
        <Message success>
          <Message.Header>Your user registration was successful</Message.Header>
          <p>You may now <Link to='/login'>login</Link> with the email you provided</p>
        </Message>
      );
    }
    if (success === false) {
      return (
        <Message negative>
          <Message.Header>Your user registration was not successful</Message.Header>
          <p>Please contact your administrator for more information.</p>
        </Message>
      );
    }
    return null;
  }

  render() {
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}
        </style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              {this.getMessage()}
              <Header as='h2' textAlign='center' style={{ color: "#006A8C" }}>
                <Image size='large' src={logo} style={{ height: "auto", width: "30%" }}/> Create a new account
              </Header>
              <Form size='large'>
                <Segment stacked>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      icon='user' 
                      iconPosition='left' 
                      placeholder='First name'
                      value={this.state.firstName}
                      onChange={this.updateFirstName}
                    />
                    <Form.Input 
                      fluid
                      icon='user' 
                      iconPosition='left' 
                      placeholder='Last name'
                      value={this.state.lastName}
                      onChange={this.updateLastName}
                    />
                  </Form.Group>
                  <Form.Input
                    fluid
                    icon='mail'
                    iconPosition='left'
                    placeholder='email'
                    type='email'
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
                  <Button color='teal' fluid size='large' onClick={this.register}>
                    Register
                  </Button>
                </Segment>
              </Form>
              <Message>
                Already a member? <Link to='/login'>Log In</Link>
              </Message>
            </Grid.Column>
          </Grid>        
      </div>
    );
  }
}

Register.propTypes = {
  amceActions: PropTypes.object,
  backend: PropTypes.object,
  loggedIn: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    backend: state.amce.backend,
    loggedIn: state.amce.loggedIn
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
)(Register);