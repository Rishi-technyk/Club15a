import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import LoginTextInput from "../../components/LoginTextInput";
import { DARK_BLUE, PRIMARY_BUTTON_BLUE } from "../../util/colors";
import { FONT_FAMILY } from "../../util/constant";
import _ from "lodash";
import { forgotPassword } from "./ForgotPasswordService.js";
import Svg, { Path, Rect } from "react-native-svg";
import { Loginstyles } from "../../Styles/LoginStyles.js";
import Button2 from "../../components/Button2.js";
import { Toast } from "react-native-toast-notifications";
const InputType = {
  username: "username",
  password: "password",
};

const ForgotPasswordScreen = ({ navigation }) => {
  const [usernameTextValue, setUsernameTextValue] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const keyboardMargin = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  const forgotPasswordHandler = async () => {
    // navigation.navigate('VerifyForgotPassOTPScreen', { memberID: usernameTextValue })
    const trimmedUsername = usernameTextValue.replace(/ /g, "");

    if (trimmedUsername.length === 0) {
      Toast.show("Forgot Password", "Please enter valid Member ID", {
        type: "warning",
      });
      return;
    }

    try {
      setLoadingData(true);
      const response = await forgotPassword(usernameTextValue);

      if (response.status) {
        Toast.show(response.message, {
          type: "success",
        });
        navigation.navigate("VerifyForgotPassOTPScreen", {
          memberID: usernameTextValue,
        });
        setUsernameTextValue("");
      } else {
        Toast.show("Failed to send OTP", {
          type: "warning",
        });
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Toast.show("An unexpected error occurred", { type: "danger" });
    } finally {
      setLoadingData(false);
    }
  };

  const onChangeText = (text, type) => {
    setUsernameTextValue(text);
  };

  const renderNameField = () => {
    return (
      <LoginTextInput
      onDone={forgotPasswordHandler}
        maxLength={10}
        keyboardType="email-address"
        placeholder="Enter your Member ID (001A)"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={usernameTextValue}
        onChangeText={(value) => onChangeText(value, InputType.username)}
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
        style={{ position: "absolute", flex: 1 }}
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
      <View style={[Loginstyles.innerContainer,{marginBottom:30}]}>
        <Image
          source={require("../../assets/images/AeptaLogo.png")}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>AEPTA</Text>
      </View>
        <Text style={Loginstyles.signInText}>Forgot Password</Text>
     
      <View style={Loginstyles.card}>
        {/* <View style={{ marginVertical: 20 }}>
          <Text
          numberOfLines={4}
            style={{
              color: "#717483",
              fontFamily: FONT_FAMILY.normal,
           
            
            }}
          >
            Please enter the Member ID associated with
            your account. We will send you a link to reset your password.
          </Text>
        </View> */}
        <View style={{ marginVertical: 20 }}>
          <Text style={Loginstyles.inputLabel}>Member ID</Text>
          {renderNameField()}
        </View>

        <Button2
          onPress={forgotPasswordHandler}
          text={"Forgot Password"}
          loading={loadingData}
        />
        <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={Loginstyles.backToSignInText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;