import { Dimensions } from 'react-native';
//import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const MARGIN = 40;

export default {
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
  },
  registerFormContainer: {
    flex: 2,
    alignItems: 'center',
  },
  signupContainer: {
    flex: 1,
    top: 65,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    top: -5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  registerButtonContainer: {
    flex: 1,
    top: -20,
    paddingTop: 30,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  picture: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonImage: {
    width: 24,
    height: 24,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  signupText: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  signupTextButton: {
    color: 'white',
    backgroundColor: 'transparent',
    textDecorationLine: 'underline'
  },
  forgotPassword: {
    marginTop: 25,
    color: 'white',
    backgroundColor: 'transparent',
    textDecorationLine: 'underline'
  },
  haveAccount: {
    marginTop: 45,
    color: 'white',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  btnEye: {
    position: 'absolute',
    top: 55,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F035E0',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#F035E0',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#F035E0',
  },
  input: {
    color: '#ffffff',
    fontWeight: "bold",
    marginHorizontal: 20,
    borderRadius: 20
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginTop: 10,
    marginHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 40,
    borderRadius: 20,
  },   
  firstNameWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: (DEVICE_WIDTH - 40)/2,
    height: 40,
    marginLeft: 20,
    marginRight: 5,
    paddingTop: 12,
    paddingLeft: 40,
    borderRadius: 20,
  },
  lastNameWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: (DEVICE_WIDTH - 40)/2,
    height: 40,
    marginRight: 20,
    marginLeft: 5,
    paddingTop: 12,
    paddingLeft: 35,
    borderRadius: 20,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 25,
    top: 9,
  },
  lastNameInlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 20,
    top: 9,
  },
  row: {
    flexDirection: "row",
    height: 40
  }
}