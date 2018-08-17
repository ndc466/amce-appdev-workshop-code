const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
  },
  colors: [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
  ],
  chart: {
    width: deviceWidth / 1.65,
    height: deviceHeight / 3,
    padding: {
      left: 45,
      right: 45
    },
    innerRadius: deviceWidth / 2 / 4
  },
  imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: null,
    alignSelf: 'stretch'
  },
  text: {
    alignSelf: "center",
    color: "#D8D8D8",
  },
  mb: {
    marginBottom: 15
  },
  cardItem: {
    backgroundColor: 'transparent',
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5
  }
};
