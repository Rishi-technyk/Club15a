import {StyleSheet} from 'react-native';
import {
  BLACK_COLOR,
  DARK_BLUE,
  GREY_COLOR,
  LIGHT_BLUE,
  PRIMARY_BUTTON_BLUE,
  PRIMARY_COLOR,
} from '../util/colors';
import {FONT_FAMILY} from '../util/constant';
import {forgotPassword} from '../screens/ForgotPassword/ForgotPasswordService';

export const Loginstyles = StyleSheet.create({
  container: {
    backgroundColor: DARK_BLUE,
    // paddingHorizontal: 40,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 30,
   
  },
  logo: {height: 30, width: 30, borderRadius: 20, resizeMode: 'cover'},
  headdingTitle: {
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
    marginLeft: 5,
    fontFamily: FONT_FAMILY.normal,
  },
  welcomeText: {
    fontFamily: FONT_FAMILY.normal,
    color: 'white',
    fontSize: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    margin:30,
    // justifyContent: 'center',
  },
  signInText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.normal,
    marginLeft: 30,
    // marginBottom: 30,
  },
  submitButton: {
    borderColor: PRIMARY_BUTTON_BLUE,
    borderWidth: 2,
    padding: 20,
    marginTop: 20,
    marginHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: PRIMARY_BUTTON_BLUE,
    fontSize: 15,
    fontFamily: FONT_FAMILY.bold,
  },

  forgotPasswordText: {
    color: LIGHT_BLUE,
    paddingBottom: 10,
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: FONT_FAMILY.light,
  },
  versionText: {
    color: GREY_COLOR,
    fontSize: 14,
    fontFamily: FONT_FAMILY.light,
  },
  dividor: {
    flex: 1,
    borderColor: 'grey',
    borderBottomWidth: 1,
    height: 0,
    margin: 10,
  },
  forgotButton: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionContainer: {marginBottom: 20, alignItems: 'center'},
  backToSignInButton: {
    // marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToSignInText: {
    color: GREY_COLOR,
    fontSize: 14,
    paddingVertical: 20,
    fontFamily: FONT_FAMILY.normal,
  },
  inputLabel: {
    color: '#717483',
    fontSize: 16,
    paddingBottom: 10,
    fontFamily: FONT_FAMILY.normal,
  },
});
