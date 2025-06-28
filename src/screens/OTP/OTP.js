import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ENDPOINT, FONT_FAMILY} from '../../util/constant';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Button from '../../components/Button';
import {useSelector} from 'react-redux';
import * as api from '../../util/api';

const OTP = ({navigation}) => {
  const [OTP, setOTP] = useState();
  const userData = useSelector(state => state.auth.userData);

  async function callAPI() {
    let body = {};
    body.member_id = userData.data.data[0].MemberID;
    try {
      const apiRequestObject = {
        path: ENDPOINT.otp,
        body: body,
        Token: userData.data.token,
      };
      const response = await api.javascriptPost(apiRequestObject);
      console.log(response,'from oTP------------------------------------response--from oTP-----------------------');
      if (response.status) setOTP(response.data.otp);

      return response;
    } catch (err) {
      return {result: FAILURE};
    }
  }
  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle="dark-content"
      />

      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Image
            source={require('../../assets/images/AeptaLogo.png')}
            style={{height: 30, width: 30, borderRadius: 15}}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 5,
            }}>
            MB Club
          </Text>
        </View>

        <Text style={styles.OTPHeader}>OTP</Text>

        <Image
          resizeMode={'contain'}
          style={{height: height / 2, width: width - 80}}
          source={require('../../assets/images/OTPScreen.png')}
        />

        <View style={styles.OTPView}>
          <TextInput
            editable={false}
            selectTextOnFocus={false}
            autoFocus={false}
            style={{
              paddingVertical: 10,
              fontSize: 25,
              borderColor: 'black',
              color: 'black',
              marginHorizontal: 5,
              letterSpacing: 20,
              width: width,
              alignSelf: 'center',
              textAlign: 'center',
              fontFamily: FONT_FAMILY.bold,
              fontWeight: 'bold',
            }}
            maxLength={6}
            keyboardType="numeric"
            textContentType="oneTimeCode"
            disabled={true}>
            {OTP}
          </TextInput>

          <Button
            text={'Refresh Code'}
            onPress={() => {
              callAPI();
            }}
            height={50}
            width={width / 2}
          />
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop:
      Platform.OS === 'ios'
        ? getStatusBarHeight() + 50
        : getStatusBarHeight() + 30,
    paddingHorizontal: 20,
  },
  OTPHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  OTPView: {
    // height: 50,
    // width: Dimensions.get('window').width / 1.5,
    // borderWidth: 1,
    // borderColor: '#7E262F',
    // borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  OTPText: {
    // color: '#7E262F',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'SemiBold',
  },
  OTPHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default OTP;
