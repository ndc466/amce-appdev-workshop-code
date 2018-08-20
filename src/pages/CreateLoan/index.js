import React, { Component } from 'react';
import { 
  Button, ButtonGroup, Card, CardTitle, CardBody,
  Container, Row, Col, Alert, Label,
  Form, FormGroup, Input, InputGroup, InputGroupAddon 
} from 'reactstrap';
import { Link } from 'react-router-dom';
import MaskedTextInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import * as amceActions from '../../redux/actions/amceActions';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';

const loanValueMask = createNumberMask({
  prefix: '$',
  allowDecimal: true
});
const loanIdMask = createNumberMask({
  prefix: '',
  allowDecimal: false,
  includeThousandsSeparator: false,
  allowLeadingZeroes: true
});

class CreateLoan extends Component {

  constructor(props) {
    super(props);
    var { firstName, lastName } = this.props;
    this.state = {
      loan: {
        loanProcessor: firstName + " " + lastName, 
        loanId: "", 
        systemId: "123", 
        value: "$12,345", 
        lastNotification: "", 
        status: "Current", 
        dealership: "Fred Haas", 
        loanee: "John Henry", 
        contact_mobile: "(832) 622-1587", 
        contact_name: "Lisa Mitchell", 
        messages: []
      },
      saved: false, success: false, error: false
    };
  }

  componentWillMount = () => { // HERE WE ARE TRIGGERING THE ACTION
    /*
    this.props.loanListActions.fetchLoans();
    this.props.loanListActions.fetchToken(); 
    */
  }

  updateId = (e) => { this.setState({loan: {...this.state.loan, systemId: e.target.value}}); }
  updateLoanee = (e) => { this.setState({loan: {...this.state.loan, loanee: e.target.value}}); }
  updateValue = (e) => { this.setState({loan: {...this.state.loan, value: e.target.value}}); }
  updateDealership = (e) => { this.setState({loan: {...this.state.loan, dealership: e.target.value}}); }
  updateName = (e) => { this.setState({loan: {...this.state.loan, contact_name: e.target.value}}); }
  updateMobile = (e) => { this.setState({loan: {...this.state.loan, contact_mobile: e.target.value}}); }

  getMessage = () => {
    var {loan, saved} = this.state;
    return {
      from: loan.loanProcessor,
      to: loan.contact_name,
      subject: (saved ? "Loan Profile Info Updated" : "New Loan Notification Profile Created"),
      body: (saved ? 
      "The loan profile information for loan ID #" + loan.systemId + " has been updated!" :
      "A Credit Union loan notification profile has just been created with loan ID #" + loan.systemId),
      time: loan.lastNotification,
      unread: true,
      systemId: loan.systemId,
      loanId: null,
      msgId: uuid()
    }
  }

  updateLoanInfo = () => {
    var {loan} = this.state;
    loan.contact_mobile = loan.contact_mobile.replace(/\D/g,'');
    if (typeof loan.value === "string") { loan.value = parseInt(loan.value.replace("$", "").replace(",", ""), 10); }
    loan.lastNotification = new Date().toLocaleString();
    console.log(loan);
    return loan;
  }

  createOrUpdate = (loan) => {
    var {saved} = this.state;
    return (saved ? this.props.loanListActions.updateLoan(loan) :
                    this.props.loanListActions.createLoan(loan));
  }

  saveClose = async () => {
    var loan = this.updateLoanInfo();
    var {amceActions, history} = this.props;
    var message = this.getMessage();
    loan.messages.push(message);
    this.createOrUpdate(loan)
      .then(result => {
        console.log(result);
        history.push({
          pathname: '/',
          state: { loanCreated: "true" }
        });
      }, error => {
        console.log(error) 
        history.push({
          pathname: '/',
          state: { loanCreated: "false" }
        });
      });
  }

  saveContinue = () => {
    var loan = this.updateLoanInfo();
    var {amceActions} = this.props;
    var message = this.getMessage();
    loan.messages.push(message);
    this.createOrUpdate(loan)
      .then(result => {
        this.setState({saved: true, success: true});
        setTimeout(() => {
          this.setState({success: true});
        }, 2500);
      }, error => {console.log(error)});
  }
  
  showSuccess = () => {
    return (
      <Alert color="success">
        <h2 className="alert-heading">Success!</h2>
        <p>
          The loan notification profile has been successfully saved!
        </p>
      </Alert>
    );
  }


  render() {
    var { loan, success } = this.state;
    return (
      <div>
      <Container fluid="true" style={{ marginTop: '7em' }}>
        <br/><br/>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Card body>
              { success ? this.showSuccess() : null }
              <CardTitle>
                <Row>
                  <Col sm="12" md={{ size: 'auto', offset: 1}}>
                  <h1 style={{fontSize: "35px"}}>Create Notification Profile</h1>
                  </Col>
                </Row>
              </CardTitle>
              <CardBody>
                <Form>
                  <FormGroup row>
                    <Label sm={3}>Loan ID</Label>
                    <Col sm={4}>
                      <InputGroup>
                        <MaskedTextInput mask={loanIdMask}
                                         className="form-control"
                                         placeholder="Enter loan ID"
                                         value={loan.systemId}
                                         onChange={this.updateId} />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={3}>Loanee</Label>
                    <Col sm={4}>
                      <Input type="name"
                             placeholder="e.g. Linda Sanchez"
                             value={loan.loanee}
                             onChange={this.updateLoanee} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={3}>Loan Value</Label>
                    <Col sm={4}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <MaskedTextInput mask={loanValueMask}
                                         className="form-control"
                                         placeholder="Enter an amount"
                                         value={loan.value}
                                         onChange={this.updateValue} />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="dealership" sm={3}>Dealership</Label>
                    <Col sm={4}>
                      <Input type="name" 
                             placeholder="e.g. Koons Tyson Chevy"
                             value={loan.dealership}
                             onChange={this.updateDealership} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleDate" sm={3}>Dealer Contact</Label>
                    <Col sm={4}>
                      <Input type="name"
                             placeholder="e.g. Paul Miller"
                             value={loan.contact_name}
                             onChange={this.updateName} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="mobile" sm={3}>Dealer Contact Mobile</Label>
                    <Col sm={4}>
                      <MaskedTextInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                       className="form-control"
                                       placeholder="(123) 456-7890"
                                       guide={false}
                                       value={loan.contact_mobile}
                                       onChange={this.updateMobile} />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                    <Col>
                      <ButtonGroup className="float-right">
                        <Button outline color="primary" size="lg" onClick={this.saveClose}>
                          Save and Close
                        </Button>
                        &nbsp;
                        <Button outline color="primary" size="lg" onClick={this.saveContinue}>
                          Save and Continue
                        </Button>
                        &nbsp;
                        <Link to='/'>
                          <Button outline color="primary" size="lg">Cancel</Button>
                        </Link>
                      </ButtonGroup>
                    </Col>     
                    </Row> 
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

CreateLoan.propTypes = {
  loanListActions: PropTypes.object,
  amceActions: PropTypes.object,  
  firstName: PropTypes.string,
  lastName: PropTypes.string
};

function mapStateToProps(state) {
  var { firstName, lastName } = state.amce;
  return {
    firstName: firstName,
    lastName: lastName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    amceActions: bindActionCreators(amceActions, dispatch),
    loanListActions: bindActionCreators(loanListActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLoan);