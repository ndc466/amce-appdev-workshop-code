import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as amceActions from './redux/actions/amceActions';
import PropTypes from 'prop-types';
import './App.css';

import Navigation from './components/Navigation';
import { Login, Register } from './pages/Auth';
import LoanList from './pages/LoanList';
import Messages from './pages/Messages';
import CreateLoan from './pages/CreateLoan';
import UpdateLoan from './pages/UpdateLoan';
import NotifyDealer from './pages/NotifyDealer';
import Page404 from './pages/Page404';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: null
    };
  };

  componentDidMount = () => {
    /* 
    axios.get(config.BASE_URL+'/dealers', config.HEADERS)
    .then(res => {
      this.setState({
        token: res.data.token
      })
    })
     */
  };
  
  render() {
    return (
      <div className="App">
        <Navigation />
        <Switch className="App">
          <Route exact path='/' render={(props) => <LoanList {...props} token={this.state.token} />}/>
          <Route path='/login' render={(props) => <Login {...props} />}/>
          <Route path='/register' render={(props) => <Register {...props} />}/>
          <Route path='/messages/:id' render={(props) => <Messages {...props} token={this.state.token} />}/>
          <Route path='/update_loan/:id' render={(props) => <UpdateLoan {...props} token={this.state.token} /> }/>
          <Route path='/notify_dealer/:id' render={(props) => <NotifyDealer {...props} token={this.state.token} />}/>
          <Route path='/create_loan' render={(props) => <CreateLoan {...props} token={this.state.token} /> }/>
          <Route component={Page404}/>
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  amceActions: PropTypes.object,
  loans: PropTypes.array,
  loggedIn: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    loans: state.loanList.loans,
    loggedIn: state.amce.loggedIn
  };
}

const mapDispatchToProps = dispatch => {
  return {
    amceActions: bindActionCreators(amceActions, dispatch)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
