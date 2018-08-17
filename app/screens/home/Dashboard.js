import React, { Component } from "react";
import { RefreshControl } from "react-native";
import {
  Container, Title,Content,
  Card, CardItem
} from "native-base";
import { Grid, Col, Row } from "react-native-easy-grid";

import styles from "./styles";
import { Dimensions } from 'react-native';

import Pie from '../../components/charts/Pie';

const screenWidth = Dimensions.get('window').width;

export default class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0,
      refreshing: false,
      total: (() => {
        var total = 0;
        for (var i = 0; i < this.props.loans.length; i++) {
          total += this.props.loans[i].value;
        }
        return total;
      })(),
      colors: [],
    };
  };

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.refresh();
  }

  componentDidMount = () => {
    var colors = [];
    for (var i = 0; i < this.props.loans.length; i++) {
      colors.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')');
    }
    this.setState({colors: colors});
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.loans !== this.props.loans) {
      this.setState({refreshing: false});
    }
  }

  _onPieItemSelected = (newIndex) => {
    this.setState({...this.state, activeIndex: newIndex});
  }

  _shuffle = (a) => {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
  }
  
  render() {
    var { loans } = this.props;

    var { total } = this.state;
    var loanData = loans.map(loan => {
      var number = (loan.value/total).toFixed(2);
      number = number*100;
      return { 
        name: loan.loanee, 
        number: number
      }
    })
    const height = 200;
    const width = 500;
    return (
      <Container style={styles.container}>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }>
          <Card style={styles.mb} transparent>
            <Grid>
              <Row size={1} style={styles.text}>
                <CardItem header>
                  <Title>Loan Values</Title>
                </CardItem>
              </Row>
              <Row size={9} style={{backgroundColor: 'transparent'}}>
                <Col size={1}>
                  <CardItem style={styles.cardItem}>
                    <Pie
                      pieWidth={150}
                      pieHeight={150}
                      onItemSelected={this._onPieItemSelected}
                      colors={styles.colors}
                      width={width}
                      height={height}
                      data={loanData}
                    />              
                  </CardItem>
                </Col>
              </Row>
            </Grid>
          </Card>
        </Content>
      </Container>
    );
  }
}