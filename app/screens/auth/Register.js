import React, { Component } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, Image,
  ImageBackground, Animated,
  KeyboardAvoidingView,
  Dimensions, Easing
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
import usernameImg from '../../assets/admin/username.png';
import mobileImg from '../../assets/admin/mobile.png';
import passwordImg from '../../assets/admin/password.png';
import eyeImg from '../../assets/admin/eye_black.png';
import spinner from '../../assets/admin/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true, press: false, isLoading: false,
      redirect: false, registerFailed: false,
      firstName: "Lisa", lastName: "Mitchell",
      email: "nd.corc@utexas.edu", mobile: "8326221587", password: "Snickers2"
    };
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  }

  showPass = () => {
    this.state.press === false ? 
    this.setState({showPass: false, press: true}) :
    this.setState({showPass: true, press: false});
  }

  toLogin = () => { this.props.navigation.navigate("Login"); }

  register = async () => {
    console.log("REGISTERING ...", this.state);
    if (this.state.isLoading) return;
    let { firstName, lastName, email, mobile, password } = this.state;
    this.setState({isLoading: true});
    Animated.timing(this.buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    try { 
      var result = await this.props.amceActions.register(firstName, lastName, email, mobile, password); 
      console.log(result);
      this.setState({isLoading: false});
      this.buttonAnimated.setValue(0);
      this.props.navigation.navigate("Login");
    }
    catch(error) { 
      console.log(error);
      this.setState({ registerFailed: true });
    }
  }
  
  updateFirstName = (firstName) => { this.setState({firstName}); }
  updateLastName = (lastName) => { this.setState({lastName}); }
  updateEmail = (email) => { this.setState({email}); }
  updateMobile = (mobile) => { this.setState({mobile}); }
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
            <Text style={styles.text}>REACT NATIVE</Text>
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.registerFormContainer}>
            <View style={styles.row}>
              <View style={styles.firstNameWrapper}>
                <Image source={usernameImg} style={styles.inlineImg} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  placeholderTextColor="white"
                  underlineColorAndroid="transparent"
                  value={this.state.firstName}
                  onChangeText={firstName => this.updateFirstName(firstName)}
                />
              </View>
              <View style={styles.lastNameWrapper}>
                <Image source={usernameImg} style={styles.lastNameInlineImg} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                  placeholderTextColor="white"
                  underlineColorAndroid="transparent"
                  value={this.state.lastName}
                  onChangeText={lastName => this.updateLastName(lastName)}
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Image source={emailImg} style={styles.inlineImg} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize={'none'}
                returnKeyType={'done'}
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={this.state.email}
                onChangeText={email => this.updateEmail(email)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Image source={mobileImg} style={styles.inlineImg} />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                autoCorrect={false}
                autoCapitalize={'none'}
                returnKeyType={this.props.returnKeyType}
                placeholderTextColor="white"
                underlineColorAndroid="transparent"
                value={this.state.mobile}
                onChangeText={mobile => this.updateMobile(mobile)}
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
          <View style={styles.registerButtonContainer}>
            <Animated.View style={{width: changeWidth}}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.register}
                activeOpacity={1}>
                {this.state.isLoading ? (
                  <Image source={spinner} style={styles.buttonImage} />
                ) : (
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>
              <Animated.View style={[styles.circle, {transform: [{scale: changeScale}]}]}/>
            </Animated.View>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account?    </Text>
              <TouchableOpacity onPress={() => {this.props.navigation.navigate("Login");}}>
                <Text style={styles.signupTextButton}>Login</Text>
              </TouchableOpacity>
            </View>            
          </View>
          <View style={styles.signupContainer}/>
        </ImageBackground>
      </View>
    );
  }
};

Register.propTypes = {
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
)(Register);