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

     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/;
    return passwordRegex.test(passwordText);
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

    if (newpasswordTextValue.trim().length === 0) {
      Toast.show("Invalid Password.", { type: "warning" });
    }  else if (newpasswordTextValue !== cpasswordTextValue) {
      Toast.show("New Password & Confirm Password should be same.", {
        type: "danger",
      });
    }else  if (!isValidPassword(newpasswordTextValue)) {
       Toast.show("New Password does not meet password policy", {
        type: "danger",
      });
     }
     else {
      let details = {
        password: newpasswordTextValue,
        old_password: passwordTextValue,
        conf_password: cpasswordTextValue,
      };
      try {
        setLoading(true);
        let response = await changePassword(details, userData.data.token);

      
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
          placeholderTextColor={'grey'}
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
          placeholderTextColor={'grey'}
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
          placeholderTextColor={'grey'}
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
           <Text style={Loginstyles.headdingTitle}>Club 15A</Text>
           
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
           <Text style={{color:'grey',fontFamily:FONT_FAMILY.normal}}>Password Policy: Minimum 9 characters Must Contain a one of uppercase and lowercase letters, numbers, and symbols</Text>
            

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