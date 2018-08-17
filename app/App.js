import React, { Component } from 'react';
import { Root } from "native-base";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

//import axios from 'axios';

import Home from "./screens/home";
import { Login, Register } from "./screens/auth";
import Notifications from "./screens/notifications/Notifications";
import LoanProfile from "./screens/loan/LoanProfile";
import Messages from "./screens/loan/Messages";
import SideBar from "./screens/sidebar";

import config from '../config';
import configureStore from './redux/store/configureStore';

const { store, persistor } = configureStore();

const Drawer = DrawerNavigator(
  {
    Home: { screen: Home },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    contentComponent: props => <SideBar {...props} />
  }
);

const AppNavigator = StackNavigator(
  {
    Drawer: { screen: Drawer },
    Notifications: { screen: Notifications },
    LoanProfile: { screen: LoanProfile },
    Messages: { screen: Messages },
    Login: { screen: Login },
    Register: { screen: Register }
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none"
  }
);

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { };
  };

  componentDidMount = () => { };
  
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <AppNavigator screenProps={{config: config}} />
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}