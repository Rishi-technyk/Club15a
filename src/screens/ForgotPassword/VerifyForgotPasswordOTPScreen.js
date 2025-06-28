import React, {useState, useRef} from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import LoginTextInput from '../../components/LoginTextInput';
import {SECONDARY_COLOR, PRIMARY_BUTTON_BLUE, DARK_BLUE} from '../../util/colors';
import {VerifySigninOTP} from './VerifySigninOTPService.js';
import {Loginstyles} from '../../Styles/LoginStyles.js';
import Svg, {Path} from 'react-native-svg';
import {FONT_FAMILY} from '../../util/constant.js';
import Button2 from '../../components/Button2.js';
import { Toast } from 'react-native-toast-notifications';

const InputType = {
  username: 'username',
  password: 'password',
};

const VerifyForgotPasswordOTPScreen = ({route, navigation}) => {
  const [usernameTextValue, setUsernameTextValue] = useState('');

  const [passwordValue, setPasswordValue] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const keyboardMargin = useRef(new Animated.Value(0)).current;

  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoginScreen',
        },
      ],
    });
  };
  const VerifySignInOTP = async () => {
    Toast.hideAll()
    if (usernameTextValue === '') {
      Toast.show('Please enter OTP',{type:'warning'});
      return;
    }

    const cleanedOTP = usernameTextValue.replace(/ /g, '');
    if (cleanedOTP.length === 0) {
      Toast.show(
        'Please enter OTP',
        {type:'warning'}
      );
      return;
    }

    try {
      setLoadingData(true);

      const payload = {
        member_id: route.params?.memberID,
        otp: usernameTextValue,
        passwordValue: passwordValue,
      };
      let response = await VerifySigninOTP(payload);
      if (response.status) {
        setLoadingData(false);
        Toast.show(
          response.message,
        {type:'success'}
        );
        if (response.status === true) {
          // Assuming loginUserSuccessOTP and navigation to home are handled elsewhere
          navigateToHome();
        }
      } else {
        setLoadingData(false);
        Toast.show( 'Unable to verify OTP',{type:'danger'});
      }
    } catch (error) {
      setLoadingData(false);
      Toast.show( error.message,{type:'danger'});
    }
  };

  const onChangeText = (text, type) => {
    if (type === 'username') {
      setUsernameTextValue(text);
    } else if (type === 'password') {
      setPasswordValue(text);
    }
  };

  const renderNameField = () => {
    return (
      <LoginTextInput
        keyboardType="email-address"
        placeholder="Enter Your OTP"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={usernameTextValue}
        onChangeText={value => onChangeText(value, InputType.username)}
        // required={true}
      />
    );
  };

  const renderPasswordField = () => {
    return (
      <LoginTextInput
        // ref={input => this.newPasswordInput = input}
        // name="new password."
        keyboardType="email-address"
        placeholder="Enter Password"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={passwordValue}
        onChangeText={value => onChangeText(value, InputType.password)}
        onDone={() => {}}
        // required={true}
      />
    );
  };

  return (
   <KeyboardAvoidingView
       style={{ flex: 1, backgroundColor: DARK_BLUE }}
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
     >
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <View
           keyboardShouldPersistTaps="handled"
           style={{
             flex:1,
             flexGrow: 1,
             justifyContent: 'center',
             paddingHorizontal: 20,
             backgroundColor: DARK_BLUE,
           }}
         >
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{position: 'absolute', flex: 1}}>
        <Path
          d={`M 0 ${height * 0.45}
                                           C ${width * 0.5} ${height * 0.5}, 
                                             ${width * 0.2} ${height * 0.25}, 
                                             ${width} ${height * 0.2} 
                                           L ${width} ${height} 
                                           L 0 ${height} Z`}
          fill={PRIMARY_BUTTON_BLUE}
        />
      </Svg>
      <View style={Loginstyles.innerContainer}>
        <Image
          source={require('../../assets/images/AeptaLogo.png')}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>AEPTA</Text>
      </View>
      <View>
        <Text style={Loginstyles.signInText}>Verify OTP</Text>
      </View>
      <View style={Loginstyles.card}>
        <View style={{marginVertical: 20}}>
          <Text
            style={{
              color: '#717483',
              fontFamily: FONT_FAMILY.normal,
            }}>
            For Sing In, Please Enter The Valid OTP For Member ID:{' '}
            <Text
              style={{
                color: 'black',
                fontFamily: FONT_FAMILY.normal,
              }}>
              {route.params?.memberID}
            </Text>
          </Text>

          {renderNameField()}
          {renderPasswordField()}
        </View>

        <Button2
          onPress={VerifySignInOTP}
          text={'Verify'}
          loading={loadingData}
        />

        <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          onPress={() => navigation.goBack()}>
          <Text style={Loginstyles.backToSignInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
  );
};

const {height, width} = Dimensions.get('window');

export default VerifyForgotPasswordOTPScreen;
