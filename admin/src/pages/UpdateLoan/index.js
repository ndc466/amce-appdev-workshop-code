import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loanListActions from '../../redux/actions/loanListActions';
import PropTypes from 'prop-types';
import { 
  Button, ButtonGroup, Card, CardTitle, CardBody, 
  Container, Row, Col, Alert, Form, FormGroup,
  Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Link } from 'react-router-dom';
import MaskedTextInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
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
/* const update_msg = {
  from: "Credit Union Loan Processor",
  to: 
  subject: "Profile Updated",
  message: "Your loan profile has been updated.",
  unread: true
}; */

class UpdateProfile extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loan: null,
      success: null
    };
  };
  
  componentDidMount = async () => {
    const { match: { params } } = this.props;
    console.log(params);
    var result = await this.props.loanListActions.getLoan(params.id)
    console.log(result.data);
    this.setState({
      loan: result.data
    });
  }

  updateId = (e) => { this.setState({loan: {...this.state.loan, systemId: e.target.value}}); }
  updateLoanee = (e) => { this.setState({loan: {...this.state.loan, loanee: e.target.value}}); }
  updateValue = (e) => { this.setState({loan: {...this.state.loan, value: e.target.value}}); }
  updateDealership = (e) => { this.setState({loan: {...this.state.loan, dealership: e.target.value}}); }
  updateName = (e) => { this.setState({loan: {...this.state.loan, contact_name: e.target.value}}); }
  updateMobile = (e) => { this.setState({loan: {...this.state.loan, contact_mobile: e.target.value}}); }

  getMessage = () => {
    var {loan} = this.state;
    return {
      from: loan.loanProcessor,
      to: loan.contact_name,
      subject: "Loan Profile Info Updated",
      body: "The loan profile information for loan ID #" + loan.systemId + " has been updated!",
      time: loan.lastNotification,
      unread: true,
      systemId: loan.systemId,
      loanId: loan.loanId,
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

  saveClose = () => {
    var loan = this.updateLoanInfo();
    var {history} = this.props;
    var message = this.getMessage();
    loan.messages.push(message);
    this.props.loanListActions.updateLoan(loan)
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
    var {history} = this.props;
    var message = this.getMessage();
    loan.messages.push(message);
    this.props.loanListActions.updateLoan(loan)
      .then(result => {
        console.log(result);
        this.setState({ success: true });
        setTimeout(function(){
          this.setState({ success: false });
        }.bind(this), 2500);
      }, error => { console.log(error); });
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
    var {loan, success} = this.state;
    if (!loan) { return <Container fluid="true" style={{ marginTop: '7em' }}/> }
    return (
      <Container fluid="true" style={{ marginTop: '7em' }}>
        <br/><br/>
        <Row>
          <Col sm="12" md={{ size: 10, offset: 1 }}>
            <Card body>
              { success ? this.showSuccess() : null }
              <CardTitle>
                <Row>
                  <Col sm="12" md={{ size: 'auto', offset: 1}}>
                  <h1 style={{fontSize: "35px"}}>Update Notification Profile</h1>
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
                                         onChange={this.updateId}/>
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={3}>Loanee</Label>
                    <Col sm={4}>
                      <Input type="name"
                             placeholder="e.g. Linda Sanchez"
                             value={loan.loanee}
                             onChange={this.updateLoanee}/>
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
                                         onChange={this.updateValue}/>
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="dealership" sm={3}>Dealership</Label>
                    <Col sm={4}>
                      <Input type="name" 
                             placeholder="e.g. Koons Tyson Chevy"
                             value={loan.dealership}
                             onChange={this.updateDealership}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleDate" sm={3}>Dealer Contact</Label>
                    <Col sm={4}>
                      <Input type="name"
                             placeholder="e.g. Paul Miller"
                             value={loan.contact_name}
                             onChange={this.updateName}/>
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
                                       onChange={this.updateMobile}/>
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
    )
  }
};

UpdateProfile.propTypes = {
  loanListActions: PropTypes.object,
  loans: PropTypes.array,
  token: PropTypes.string
};

function mapStateToProps(state) {
  console.log(state);
  return {
    loans: state.loanList.loans,
    token: state.loanList.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loanListActions: bindActionCreators(loanListActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateProfile);