import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import LoginTextInput from "../../components/LoginTextInput";
import { DARK_BLUE, PRIMARY_BUTTON_BLUE } from "../../util/colors";
import { VerifySigninOTP } from "./VerifySigninOTPService.js";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import Svg, { Path, } from "react-native-svg";
import { loginSuccess } from "../../store/actions/authActions";
import { FONT_FAMILY } from "../../util/constant.js";
import Button2 from "../../components/Button2.js";
import { Loginstyles } from "../../Styles/LoginStyles.js";
import { Toast } from "react-native-toast-notifications";

const VerifySigninOTPScreen = ({ route, navigation }) => {
  const [usernameTextValue, setUsernameTextValue] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const { width, height } = Dimensions.get("window");
  const VerifySignInOTP = async () => {
  Toast.hideAll()
    if (usernameTextValue === "") {
      Toast.show("Please enter OTP", {
        type: "warning",
      });
      return;
    }

    const cleanedOTP = usernameTextValue.replace(/ /g, "");
    if (cleanedOTP.length === 0) {
      Toast.show("Please enter valid OTP", {
        type: "warning",
      });
      return;
    }

    const payload = {
      member_id: route.params?.memberID,
      otp: usernameTextValue,
    };
    setLoadingData(true);
    try {
      const response = await VerifySigninOTP(payload, data);

      if (response.status === true) {
        dispatch(loginSuccess(response));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
            },
          ],
        });
        Toast.show(
          response.message ? response.message : "OTP verified successfully",
          { type: "success" }
        );
      } else {
        // setLoadingData(false);
        Toast.show(
          response.message ? response.message : "Unable to verify OTP",
          {
            type: "danger",
          }
        );
      }
    } catch (error) {
      // setLoadingData(false);
      Toast.show(error.message, {
        type: "danger",
      });
    }
    setLoadingData(false);
  };

  const onChangeText = (text) => {
    setUsernameTextValue(text);
  };

  const renderNameField = () => {
    return (
      <LoginTextInput
        maxLength={6}
        keyboardType="decimal-pad"
        placeholder="Enter Your OTP"
        canManageTextVisibility
        secureTextEntry={false}
        textValue={usernameTextValue}
        onChangeText={(value) => onChangeText(value)}
        onDone={VerifySignInOTP}
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
      <View style={Loginstyles.innerContainer}>
        <Image
          source={require("../../assets/images/AeptaLogo.png")}
          style={Loginstyles.logo}
        />
        <Text style={Loginstyles.headdingTitle}>AEPTA</Text>
      </View>

      <View>
        <Text style={Loginstyles.signInText}>Verify OTP</Text>
      </View>
      <View style={Loginstyles.card}>
        <View>
          <Text style={Loginstyles.versionText}>
            Please Enter The Valid OTP For Member ID:{" "}
            <Text
              style={{
                color: "black",
                fontSize: 15,
                fontFamily: FONT_FAMILY.bold,
              }}
            >
              {route.params?.memberID}
            </Text>
          </Text>
        </View>

        <View style={{ marginVertical: 20 }}>{renderNameField()}</View>
        <Button2
          onPress={VerifySignInOTP}
          text={"Verify OTP"}
          loading={loadingData}
        />

        <TouchableOpacity
          style={Loginstyles.backToSignInButton}
          activeOpacity={0.8}
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
export default VerifySigninOTPScreen;
