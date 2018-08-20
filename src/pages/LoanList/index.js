import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import * as amceActions from '../../redux/actions/amceActions';
import { 
  Container, Grid, Header, Table,
  Segment, Button, Message
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';

import LoadingState from './LoadingState';
import Loan from './Loan';

class LoanList extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: false, redirect: false };
  }

  componentDidMount = async () => {
    const { loggedIn } = this.props;
    if (!loggedIn) { this.setState({redirect: true}) }
    else {
      this.setState({loading: true})
      await this.props.loanListActions.fetchLoans();
      this.setState({loading: false})
    }
  }
  
  deleteLoan = (index) => {
    var loans = this.props.loans;
    var loanId = loans[index].loanId;
    console.log("loanId: ", loanId);
    this.props.loanListActions.deleteLoan(loanId)
      .then(result => {
        console.log(result.data);
        loans.splice(index, 1);
      });
    this.props.loanListActions.updateLoans(loans);
  }
  
  updateStatus = (index, newStatus) => {
    var loan = this.props.loans[index];
    console.log(newStatus);
    loan.status = newStatus;
    loan.lastNotification = new Date().toLocaleString();
    var msg = {
      from: loan.loanProcessor, 
      to: loan.contact_name,
      subject: "Loan Status Updated",
      body: (loan.status === "Current") ?
      "The status of this loan has been changed to \"Current\" again!" : 
      "The status of this loan has been changed to \"Completed\"!",
      time: loan.lastNotification,
      unread: true,
      systemId: loan.systemId,
      loanId: loan.loanId,
      msgId: uuid()
    }
    loan.messages.push(msg);
    this.props.loanListActions.updateLoan(loan)
      .then(result => {
        console.log(result);
      }, error => { console.log(error); });
  }
  
  getLoans = () => {
    var loans = [];
    for (var i = 0; i < this.props.loans.length; i++) {
      loans.push(
        <Loan loan={this.props.loans[i]} 
              index={i} 
              deleteLoan={this.deleteLoan}
              updateStatus={this.updateStatus}>
        </Loan>
      );
    }
    return (
      <Table.Body>{loans}</Table.Body>
    );
  }
  
  handleSort = (param) => () => {
    if (this.props.column !== param) {
      this.props.loanListActions.sortLoans(param)
      return
    }
    this.props.loanListActions.sortLoans()
  }

  getMessage = () => {
    if (this.props.location.state === undefined) { return null; }
    var loanCreated = this.props.location.state.loanCreated;
    if (loanCreated === true) {
      return (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>Loan notification profile created successfully!</p>
        </Message>
      )
    }
    if (loanCreated === false) {
      return (
        <Message negative>
          <Message.Header>Uh oh!</Message.Header>
          <p>Something went wrong. Loan notification profile not created!</p>
        </Message>
      )
    }
    return null;
  }

  render() {
    const { column, direction } = this.props;
    const { redirect, loading } = this.state;
    if (redirect) return <Redirect to='/login' />
    if (loading) { return <LoadingState /> }
    return (
      <div>
        <Container fluid style={{ marginTop: '7em' }}>
          {this.getMessage()}
          <Grid>
            <Grid.Row>
              <Grid.Column width={1} />
              <Grid.Column width={14}>
                <Segment.Group style={{overflowX: "scroll"}}>
                  <Segment style={{paddingLeft: "28px", paddingTop: "28px", paddingBottom: "80px"}}>
                    <Header size="large" className="LoanListTitle">Dealer Notifier</Header>
                    <Link to='/create_loan'>
                      <Button size="big" className="float-right" style={{fontSize: "20px", color: "black"}}>
                        Create Notification Profile
                      </Button>
                    </Link>
                  </Segment>
                  <Segment.Group>
                    <Table sortable striped selectable unstackable>
                      <Table.Header>
                        <Table.Row className="title">
                          <Table.HeaderCell sorted={column === 'systemId' ? direction : null} onClick={this.handleSort('systemId')}>Loan ID</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'loanee' ? direction : null} onClick={this.handleSort('loanee')}>Loanee</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'value' ? direction : null} onClick={this.handleSort('value')}>Loan Value</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'dealership' ? direction : null} onClick={this.handleSort('dealership')}>Dealership</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'contact_name' ? direction : null} onClick={this.handleSort('contact_name')}>Dealer Contact</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'status' ? direction : null} onClick={this.handleSort('status')}>Status</Table.HeaderCell>
                          <Table.HeaderCell sorted={column === 'lastNotification' ? direction : null} onClick={this.handleSort('lastNotification')}>Last Notification</Table.HeaderCell>
                          <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      {this.getLoans()}
                    </Table>
                  </Segment.Group>
                </Segment.Group>
              </Grid.Column>
              <Grid.Column width={1} />
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

LoanList.propTypes = {
  loanListActions: PropTypes.object,
  amceActions: PropTypes.object,
  loans: PropTypes.array,
  column: PropTypes.string,
  direction: PropTypes.string,
  messages: PropTypes.array,
  
  loggedIn: PropTypes.bool,
  accessToken: PropTypes.string,
  username: PropTypes.string  
};

function mapStateToProps(state) {
  var { loans, column, direction, messages } = state.loanList;
  var { loggedIn, accessToken } = state.amce;
  return {
    loans, column, direction, messages,
    loggedIn, accessToken
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
)(LoanList);