import React, { useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "./ChangePasswordService";
import { loginUserFailure, triggerLogout } from "../../store/actions/authActions";
import {
  DARK_BLUE,
  PRIMARY_BUTTON_BLUE,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../../util/colors";
import Svg, { Path, Rect } from "react-native-svg";
import { FONT_FAMILY } from "../../util/constant";
import Button2 from "../../components/Button2";
import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { Loginstyles } from "../../Styles/LoginStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordTextValue, setPasswordTextValue] = useState("");
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);
  const [cpasswordTextValue, setCPasswordTextValue] = useState("");
  const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
  const [newpasswordTextValue, setnewPasswordTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get("window");
  const newPasswordTextInput = useRef(null);
  const passwordTextInput = useRef(null);
  const cpasswordTextInput = useRef(null);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const isValidPassword = (passwordText) => {
    const regex =
      /^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*[A-Z].*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*\d.*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*[A-Z].*)(?=.*\d.*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*\d.*)(?=.*[A-Z].*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$/;
    return regex.test(passwordText);
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleSecureEntryConfirm = () => {
    setSecureTextEntryConfirm(!secureTextEntryConfirm);
  };

  const toggleSecureEntryNew = () => {
    setSecureTextEntryNew(!secureTextEntryNew);
  };

  const onChangeText = (text, type) => {
    if (type === "passwordTextValue") {
      setPasswordTextValue(text);
    } else if (type === "cpasswordTextValue") {
      setCPasswordTextValue(text);
    } else if (type === "newpasswordTextValue") {
      setnewPasswordTextValue(text);
    }
  };

  const updatePassword = async () => {
    Toast.hideAll();
    const { Password } = userData.data.data[0];
    if (newpasswordTextValue.trim().length === 0) {
      Toast.show("Invalid Password.", { type: "warning" });
    }  else if (newpasswordTextValue !== cpasswordTextValue) {
      Toast.show("New Password & Confirm Password should be same.", {
        type: "danger",
      });
    } else {
      let details = {
        password: newpasswordTextValue,
        old_password: passwordTextValue,
        conf_password: cpasswordTextValue,
      };
      try {
        setLoading(true);
        let response = await changePassword(details, userData.data.token);

      
console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
        if (response.status) {
            dispatch(
          loginUserFailure(
            userData?.data?.data[0]?.MemberID,
            newpasswordTextValue
          )
        );
          setLoading(false);
          Toast.show(response.message, {
            type: "success",
          });
           await AsyncStorage.clear();

                dispatch(triggerLogout());
                navigation.reset({
                  routes: [{ name: "LoginScreen" }],
                });
        } else {
          setLoading(false);
          Toast.show(response.message, {
            type: "danger",
          });
        }
      } catch (error) {
        Toast.show(error.message, {
          type: "danger",
        });
        setLoading(false);
      }
    }
  };
  const renderPasswordField = () => {
    return (
      <View style={styles.textInput}>
        <View style={{ width: "93%" }}>
          <TextInput
            style={[
              styles.input,
              { paddingVertical: Platform.OS == "ios" && 20 },
            ]}
            ref={passwordTextInput}
            cursorColor={SECONDARY_COLOR}
            name="Password"
            placeholder="Current Password"
            secureTextEntry={secureTextEntry}
            value={passwordTextValue}
            onChangeText={(value) => onChangeText(value, "passwordTextValue")}
            required={true}
          />
        </View>
        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.eyeIconTouchable}
        >
          <Image
            source={
              secureTextEntry
                ? require("../../assets/images/eye.png")
                : require("../../assets/images/eyeClose.png")
            }
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderConfirmPasswordField = () => {
    return (
      <View style={styles.textInput}>
        <View style={{ width: "93%" }}>
          <TextInput
            style={[
              styles.input,
              { paddingVertical: Platform.OS == "ios" && 20 },
            ]}
            cursorColor={SECONDARY_COLOR}
            ref={cpasswordTextInput}
            name="Confirm New Password"
            placeholder="Confirm New Password"
            secureTextEntry={secureTextEntryConfirm}
            value={cpasswordTextValue}
            onChangeText={(value) => onChangeText(value, "cpasswordTextValue")}
            required={true}
          />
        </View>
        <TouchableOpacity
          onPress={toggleSecureEntryConfirm}
          style={styles.eyeIconTouchable}
        >
          <Image
            source={
              secureTextEntryConfirm
                ? require("../../assets/images/eye.png")
                : require("../../assets/images/eyeClose.png")
            }
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderNewPasswordField = () => {
    return (
      <View style={styles.textInput}>
        <View style={{ width: "93%" }}>
          <TextInput
            style={[
              styles.input,
              { paddingVertical: Platform.OS == "ios" && 20 },
            ]}
            ref={newPasswordTextInput}
            cursorColor={SECONDARY_COLOR}
            name="New Password"
            placeholder="New Password"
            secureTextEntry={secureTextEntryNew}
            value={newpasswordTextValue}
            onChangeText={(value) =>
              onChangeText(value, "newpasswordTextValue")
            }
            required={true}
          />
        </View>
        <TouchableOpacity
          onPress={toggleSecureEntryNew}
          style={styles.eyeIconTouchable}
        >
          <Image
            source={
              secureTextEntryNew
                ? require("../../assets/images/eye.png")
                : require("../../assets/images/eyeClose.png")
            }
            style={{ height: 20, width: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
   
    <KeyboardAvoidingView
     style={{ flex: 1, backgroundColor: DARK_BLUE }}
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
     keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
   >
     <TouchableWithoutFeedback
   
      onPress={Keyboard.dismiss}
      >
       <View
         keyboardShouldPersistTaps="handled"
         style={{
          flex: 1,
           flexGrow: 1,
           justifyContent: 'center',
           paddingHorizontal: 20,
           backgroundColor: DARK_BLUE,
         }}
       >
         <StatusBar backgroundColor={DARK_BLUE} />
   
         <View style={Loginstyles.innerContainer}>
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
           style={{ position: 'absolute', flex: 1 }}
         >
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
      
        <Text style={styles.signInText}>Change Password</Text>
        <View style={Loginstyles.card}
        >
          <View style={{ padding: 20 }}>
           
            

          <View>
            {/* <Text style={styles.headerStyle}>Current Password</Text> */}
            {renderPasswordField()}
          </View>
          <View style={{}}>
            {/* <Text style={styles.headerStyle}>New Password</Text> */}
            {renderNewPasswordField()}
          </View>
          <View style={{}}>
            {/* <Text style={styles.headerStyle}>Confirm New Password</Text> */}
            {renderConfirmPasswordField()}
          </View>

          <Button2 text={"Update"} onPress={updatePassword} loading={loading} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: -10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.forgotPasswordText}>Back to Home</Text>
          </TouchableOpacity>

          </View>
        </View>
 
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  container1: {
    backgroundColor: "white",
  },

  headerText: {
    flex: 2,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  body: {
    marginTop: 30,
  },

  signInText: {
    fontSize: 20,
    color: "white",
    textAlign: "left",
    fontFamily: FONT_FAMILY.normal,
    marginLeft: 40,
    paddingTop:10
  },

  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerStyle: {
    color: "#151831",
    fontFamily: FONT_FAMILY.semiBold,

    fontWeight: "bold",
  },
  textInput: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    marginBottom: 20,
  },
  input: { fontFamily: FONT_FAMILY.normal, color: "black" },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    paddingBottom: 10,
    textAlign: "center",
    paddingVertical: 20,
    fontFamily: FONT_FAMILY.light,
  },
});

export default ChangePassword;

// import React, {Component, useRef, useState} from 'react';
// import {
//   ActivityIndicator,
//   Text,
//   View,
//   TouchableOpacity,
//   StatusBar,
//   Alert,
//   Dimensions,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Image,
//   Platform,
// } from 'react-native';
// import {getStatusBarHeight} from 'react-native-status-bar-height';
// import {moderateScale} from '../../util/scale';
// import Modal from 'react-native-modal';
// import BackIcon from '../../assets/svg/BackButton';
// import Button from '../../components/Button';
// import {useDispatch, useSelector} from 'react-redux';
// import {changePassword} from './ChangePasswordService';
// import {loginUserFailure, triggerLogout} from '../../store/actions/authActions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useNavigation} from '@react-navigation/native';

// const ChangePassword = () => {
//   const [secureTextEntry, setSecureTextEntry] = useState(true);
//   const [passwordTextValue, setPasswordTextValue] = useState('');
//   const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);
//   const [cpasswordTextValue, setCPasswordTextValue] = useState('');
//   const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
//   const [newpasswordTextValue, setnewPasswordTextValue] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   const newPasswordTextInput = useRef(null);
//   const passwordTextInput = useRef(null);
//   const cpasswordTextInput = useRef(null);

//   const dispatch = useDispatch();
//   const userData = useSelector(state => state.auth.userData);

//   const isValidPassword = passwordText => {
//     const regex =
//       /^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*[A-Z].*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*\d.*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*[!@#$%^*()_+~`={}|:;"',.?\[\]\/-].*)(?=.*[A-Z].*)(?=.*\d.*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$|^(?=.*\d.*)(?=.*[A-Z].*)(?=.*[a-z].*)[\w!@#$%^*()_+~`={}|:;"',.?\[\]\/-]{8,14}$/;
//     return regex.test(passwordText);
//   };

//   const toggleSecureEntry = () => {
//     setSecureTextEntry(!secureTextEntry);
//   };

//   const toggleSecureEntryConfirm = () => {
//     setSecureTextEntryConfirm(!secureTextEntryConfirm);
//   };

//   const toggleSecureEntryNew = () => {
//     setSecureTextEntryNew(!secureTextEntryNew);
//   };

//   const onChangeText = (text, type) => {
//     if (type === 'passwordTextValue') {
//       setPasswordTextValue(text);
//     } else if (type === 'cpasswordTextValue') {
//       setCPasswordTextValue(text);
//     } else if (type === 'newpasswordTextValue') {
//       setnewPasswordTextValue(text);
//     }
//   };

//   const updatePassword = async () => {
//     if (!isValidPassword(newpasswordTextValue)) {
//       Alert.alert(
//         'Invalid Password',
//         'Your password must be at least 8 characters long and include an uppercase letter, a number, and a special character. (e.g. Passw0rd!)',
//       );
//       return;
//     }
//     if (newpasswordTextValue.trim().length === 0) {
//       Alert.alert(
//         'MB Club',
//         'Invalid Password.',
//         [{text: 'OK', onPress: () => {}}],
//         {cancelable: false},
//       );
//     } else if (newpasswordTextValue !== cpasswordTextValue) {
//       Alert.alert(
//         'MB Club',
//         'New Password & Confirm Password should be same.',
//         [{text: 'OK', onPress: () => {}}],
//         {cancelable: false},
//       );
//     } else {
//       let details = {
//         password: newpasswordTextValue,
//         old_password: passwordTextValue,
//         conf_password: cpasswordTextValue,
//       };
//       try {
//         setLoading(true);
//         let response = await changePassword(details, userData.data.token);
//         console.log(response, '---------------response---------------');
//         setLoading(false);

//         if (response) {
//           setLoading(false);
//           Alert.alert(
//             'Change Password',
//             response.message,
//             [
//               {
//                 text: 'OK',
//                 onPress: async () => {
//                   await AsyncStorage.clear();

//                   dispatch(triggerLogout());
//                   navigation.reset({
//                     routes: [{name: 'LoginScreen'}],
//                   });
//                 },
//               },
//             ],
//             {cancelable: false},
//           );
//         } else {
//           setLoading(false);
//           Alert.alert('Error', response.message);
//           navigation.navigate('Home');
//         }
//       } catch (error) {
//         Alert.alert('Error', error.message);
//         setLoading(false);
//       }
//     }
//   };

//   const renderPasswordField = () => {
//     return (
//       <View
//         style={{
//           borderWidth: 1,
//           borderRadius: 10,
//           height: 60,
//           justifyContent: 'center',
//           paddingHorizontal: 10,
//           borderColor: '#dedede',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: width - 20,
//         }}>
//         <View style={{width: '93%'}}>
//           <TextInput
//             ref={passwordTextInput}
//             name="Password"
//             placeholderTextColor={'grey'}
//             style={{color: 'black'}}
//             placeholder="Password"
//             secureTextEntry={secureTextEntry}
//             value={passwordTextValue}
//             onChangeText={value => onChangeText(value, 'passwordTextValue')}
//             required={true}
//           />
//         </View>
//         <TouchableOpacity
//           onPress={toggleSecureEntry}
//           style={styles.eyeIconTouchable}>
//           <Image
//             source={
//               secureTextEntry
//                 ? require('../../assets/images/eye.png')
//                 : require('../../assets/images/eyeClose.png')
//             }
//             style={{height: 20, width: 20}}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderConfirmPasswordField = () => {
//     return (
//       <View
//         style={{
//           borderWidth: 1,
//           borderRadius: 10,
//           height: 60,
//           justifyContent: 'center',
//           paddingHorizontal: 10,
//           borderColor: '#dedede',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: width - 20,
//         }}>
//         <View style={{width: '93%'}}>
//           <TextInput
//             ref={cpasswordTextInput}
//             style={{color: 'black'}}
//             name="Enter Confirm New Password"
//             placeholder="Enter Confirm New Password"
//             placeholderTextColor={'grey'}
//             secureTextEntry={secureTextEntryConfirm}
//             value={cpasswordTextValue}
//             onChangeText={value => onChangeText(value, 'cpasswordTextValue')}
//             required={true}
//           />
//         </View>
//         <TouchableOpacity
//           onPress={toggleSecureEntryConfirm}
//           style={styles.eyeIconTouchable}>
//           <Image
//             source={
//               secureTextEntryConfirm
//                 ? require('../../assets/images/eye.png')
//                 : require('../../assets/images/eyeClose.png')
//             }
//             style={{height: 20, width: 20}}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const renderNewPasswordField = () => {
//     return (
//       <View
//         style={{
//           borderWidth: 1,
//           borderRadius: 10,
//           height: 60,
//           justifyContent: 'center',
//           paddingHorizontal: 10,
//           borderColor: '#dedede',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: width - 20,
//         }}>
//         <View style={{width: '93%'}}>
//           <TextInput
//             ref={newPasswordTextInput}
//             name="Enter New Password"
//             placeholderTextColor={'grey'}
//             style={{color: 'black'}}
//             placeholder="Enter New Password"
//             secureTextEntry={secureTextEntryNew}
//             value={newpasswordTextValue}
//             onChangeText={value => onChangeText(value, 'newpasswordTextValue')}
//             required={true}
//           />
//         </View>
//         <TouchableOpacity
//           onPress={toggleSecureEntryNew}
//           style={styles.eyeIconTouchable}>
//           <Image
//             source={
//               secureTextEntryNew
//                 ? require('../../assets/images/eye.png')
//                 : require('../../assets/images/eyeClose.png')
//             }
//             style={{height: 20, width: 20}}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   function _renderLoader() {
//     return (
//       <Modal
//         isVisible={loading}
//         backdropColor={'black'}
//         animationIn="fadeIn"
//         animationOut="fadeOut"
//         style={{
//           position: 'absolute',
//           elevation: 10,
//           justifyContent: 'center',
//           alignItems: 'center',
//           right: 0,
//           left: 0,
//           bottom: 0,
//           top: 0,
//         }}>
//         <View>
//           <ActivityIndicator size="large" animating={loading} />
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <>
//       <StatusBar
//         backgroundColor={'transparent'}
//         translucent={true}
//         barStyle="dark-content"
//       />
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
//             activeOpacity={0.5}
//             onPress={() => navigation.goBack()}>
//             <BackIcon />
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <Image
//                 source={require('../../assets/images/AeptaLogo.png')}
//                 style={{height: 25, width: 25, borderRadius: 15, marginLeft: 5}}
//               />
//               <Text style={{marginLeft: 5, color: 'black'}}>MB Club</Text>
//             </View>
//           </TouchableOpacity>

//           <Text
//             style={{
//               flex: 1,
//               textAlign: 'center',
//               fontSize: 14,
//               fontWeight: 'bold',
//               color: 'black',
//             }}>
//             Change Password
//           </Text>

//           <View style={{flex: 1}} />
//         </View>

//         <ScrollView>
//           <View>
//             <View>
//               <Text style={styles.headerStyle}>Current Password</Text>
//               {renderPasswordField()}
//             </View>
//             <View style={{marginTop: 10}}>
//               <Text style={styles.headerStyle}>New Password</Text>
//               {renderNewPasswordField()}
//             </View>
//             <View style={{marginTop: 10}}>
//               <Text style={styles.headerStyle}>Confirm New Password</Text>
//               {renderConfirmPasswordField()}
//             </View>

//             <View style={{marginTop: 15}}>
//               <Button
//                 text={'Update'}
//                 onPress={() => {
//                   updatePassword();
//                   // this.payNowAction()
//                   // this.updatePassword();
//                   // this.sheetRef.current.snapTo(1)
//                 }}
//                 height={50}
//                 width={width - 20}
//                 noMargin={1}
//               />
//             </View>
//             {_renderLoader()}
//           </View>
//           <View style={{flex: 1, marginTop: 15}}>
//             <Text style={styles.heading}>Password Requirements:</Text>
//             <Text style={styles.criteria}>• Is at least 8 characters long</Text>
//             <Text style={styles.criteria}>• Contains an uppercase letter</Text>
//             <Text style={styles.criteria}>• Includes a number</Text>
//             <Text style={styles.criteria}>• Has a special character</Text>
//             <Text style={styles.example}>Example: Passw0rd!</Text>
//           </View>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// const {height, width} = Dimensions.get('window');
// const styles = StyleSheet.create({
//   heading: {color: 'black', fontSize: 18},
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container1: {
//     height: height,
//     backgroundColor: 'white',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingTop:
//       Platform.OS === 'ios'
//         ? getStatusBarHeight() + 50
//         : getStatusBarHeight() + 20,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerText: {
//     flex: 2,
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginLeft: 5,
//   },
//   body: {
//     marginTop: 30,
//   },
//   headerlogo: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginRight: -85,
//   },
//   card: {
//     backgroundColor: 'white',
//     height: 60,
//     width: width - 20,
//     marginVertical: 10,
//     elevation: 2,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   criteria: {color: 'grey', fontSize: 16},
//   headerStyle: {
//     color: '#151831',
//     fontSize: moderateScale(16),
//     paddingBottom: 5,
//     marginBottom: 10,
//     marginTop: 15,
//     fontWeight: 'bold',
//   },
// });

// export default ChangePassword;
