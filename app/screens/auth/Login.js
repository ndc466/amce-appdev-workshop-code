import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, ImageBackground, KeyboardAvoidingView,
  Animated, Dimensions, Easing
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as amceActions from '../../redux/actions/amceActions';
import * as loanListActions from '../../redux/actions/loanListActions';
import PropTypes from 'prop-types';
import styles from "./styles";

import bgSrc from '../../assets/admin/wallpaper.png';
import logoImg from '../../assets/admin/logo.png';
import emailImg from '../../assets/admin/email.png';
import passwordImg from '../../assets/admin/password.png';
import spinner from '../../assets/admin/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      email: "nd.corc@utexas.edu",
      password: "Snickers2",
      redirect: false,
      loginFailed: false,
    };
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  }

  showPass = () => {
    this.state.press === false ? 
    this.setState({showPass: false, press: true}) :
    this.setState({showPass: true, press: false});
  }

  toRegister = () => {
    this.props.navigation.navigate("Register");
  }

  login = async () => {
    if (this.state.isLoading) return;

    let { email, password } = this.state;
    this.setState({isLoading: true});
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    try { 
      var result = await this.props.amceActions.login(email, password); 
      console.log(result);
      this.setState({isLoading: false});
      this.buttonAnimated.setValue(0);
      this.props.navigation.navigate("Home");
    }
    catch(error) {
      console.log(error);
      this.setState({ loginFailed: true });
      this.buttonAnimated.setValue(0);
      this.props.amceActions.logout();
    }
  }

  updateEmail = (email) => { this.setState({email}); }
  updatePassword = (password) => { this.setState({password}); }

  render = () => {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={styles.mainContainer}>
        <ImageBackground style={styles.picture} source={bgSrc}>
          <View style={styles.logoContainer}>
            <Image source={logoImg} style={styles.image} />
            <Text style={styles.text}>CREDIT UNION</Text>
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Image source={emailImg} style={styles.inlineImg} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize={'none'}
                returnKeyType={this.props.returnKeyType}
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={this.state.email}
                onChangeText={email => this.updateEmail(email)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Image source={passwordImg} style={styles.inlineImg} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                autoCorrect={false}
                autoCapitalize={'none'}
                returnKeyType={this.props.returnKeyType}
                secureTextEntry={this.state.showPass}
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={this.state.password}
                onChangeText={password => this.updatePassword(password)}
              />
            </View>
          </KeyboardAvoidingView>
          <View style={styles.buttonContainer}>
            <Animated.View style={{width: changeWidth}}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.login}
                activeOpacity={1}>
                {this.state.isLoading ? (
                  <Image source={spinner} style={styles.buttonImage} />
                ) : (
                  <Text style={styles.buttonText}>LOGIN</Text>
                )}
              </TouchableOpacity>
              <Animated.View style={[styles.circle, {transform: [{scale: changeScale}]}]}/>
            </Animated.View>
            <TouchableOpacity onPress={this.toRegister}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to us?    </Text>
              <TouchableOpacity onPress={this.toRegister}>
                <Text style={styles.signupTextButton}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signupContainer}/>
        </ImageBackground>
      </View>
    );
  }
};

Login.propTypes = {
  amceActions: PropTypes.object,
  loanListActions: PropTypes.object,
  loggedIn: PropTypes.bool,
  accessToken: PropTypes.string,
  username: PropTypes.string
};

function mapStateToProps(state) {
  console.log(state);
  return {
    loggedIn: state.amce.loggedIn,
    accessToken: state.amce.accessToken,
    username: state.amce.username
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
)(Login);