import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import LoginTextInput from '../../components/LoginTextInput';
import {
  DARK_BLUE,
  PRIMARY_BUTTON_BLUE,
} from '../../util/colors';
import {SigninWithOTPScreenService} from './SigninWithOTPScreenService.js';
import {FONT_FAMILY} from '../../util/constant.js';
import Svg, {Path,} from 'react-native-svg';
import Button2 from '../../components/Button2.js';
import { Loginstyles } from '../../Styles/LoginStyles.js';
import { Toast } from 'react-native-toast-notifications';

const SignInWithOtp = ({navigation}) => {
  const [usernameTextValue, setUsernameTextValue] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const {width, height} = Dimensions.get('window');

  const signInSendOTP = async () => {
    Toast.hideAll();
    const trimmedUsername = usernameTextValue.replace(/ /g, '');
     
    if (trimmedUsername.length === 0) {
       Toast.show( 'Please enter valid Member ID', 
       {type: 'danger',},
      );
      return;
    }

    setLoadingData(true);

    try {
      let response = await SigninWithOTPScreenService(usernameTextValue);
      setLoadingData(false);
      console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
      if (response.status === true) {
        Toast.show(
          response.message,
          {type: 'success',}
        );
        setUsernameTextValue('');
        navigation.navigate('VerifySigninOTP', {
          memberID: usernameTextValue,
        });
      } else {
        setLoadingData(false);
       Toast.show(
          response.message,
          {type: 'danger',},
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error in signInSendOTP:', error);
      setLoadingData(false);
      Toast.show( 'Failed to send OTP',{type: 'danger',});
    }
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

          <View style={[Loginstyles.innerContainer,{marginBottom: 30}]}>
                 <Image
                   source={require('../../assets/images/AeptaLogo.png')}
                   style={Loginstyles.logo}
                 />
                 <Text style={Loginstyles.headdingTitle}>AEPTA</Text>
                 
               </View>
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
     
      <Text style={Loginstyles.signInText}>Sign In with OTP</Text>
     
      <View style={[Loginstyles.card, ]}>
          {/* <View style={{ marginVertical: 20 }}> */}
        {/* <View>
          <Text 
          numberOfLines={4}
          style={Loginstyles.versionText}>
            Please enter the Member ID associated with your account.
            We will send you a OTP to Login.
          </Text>
        </View> */}
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.bold,
              color: 'black',
              marginTop: 20,
            }}>
            Member ID
          </Text>
          <LoginTextInput
            maxLength={10}
            keyboardType="email-address"
            placeholder="Member ID (001A)"
            canManageTextVisibility
            secureTextEntry={false}
            textValue={usernameTextValue}
            onChangeText={value => setUsernameTextValue(value)}
            // required={true}
            onDone={signInSendOTP}
          />
        </View>

        <Button2
          loading={loadingData}
          onPress={signInSendOTP}
          text={'Send OTP'}
        />
       <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Text style={Loginstyles.backToSignInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}

 
      </View>
  </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
   
  );
};
export default SignInWithOtp;
