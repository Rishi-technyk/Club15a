import {
  Image,
  Text,
  View,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import * as api from "../util/api";
import {  SECONDARY_COLOR } from "../util/colors";
import { useSelector } from "react-redux";

import NewButton from "./Button";
import UniversalModal from "./UniversalModal";

const OTPModal = ({ visible, setVisible, data }) => {
  const [OTP, setOTP] = useState();
  const [loader, setLoader] = useState(false);
  const { userData } = useSelector((state) => state.auth);

    async function callAPI() {
    try {
      const apiRequestObject = {
        path: ENDPOINT.otp,
        body: {
         
        },
        Token: userData.data.token,
      };
        setLoader(true)
      const response = await api.javascriptGet(apiRequestObject); 
      console.log(response.data.otp,'------------------------------------response-------------------------');
      setLoader(false);
        setOTP(response.data.otp);
    
      return response;
    } catch (err) {
      console.log(err,'------------------------------------err-------------------------');
      return { result: FAILURE };
    }
  }
  useEffect(() => {
    callAPI();
  }, []);
  return (
    <UniversalModal

     
      dismissable={true}
      statusBarTranslucent={true}
      visible={visible}
      title={"OTP"}
      setVisible={setVisible}>

        <View style={{flex:1}}>
        
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image
              resizeMode={"contain"}
              style={{ height: 100,  marginBottom: 20 }}
              source={require("../assets/images/OTPScreen.png")}
            />
            <Text
              style={{
                fontFamily: FONT_FAMILY.bold,
                fontSize: 30,
                letterSpacing: 20,
                color:'black'
              }}>
              {OTP}
            </Text>
          </View>
          <View style={{marginHorizontal:20}}>

          <NewButton text={"Refresh OTP"} onPress={callAPI} loading={loader} />
          </View>
        </View>
    </UniversalModal>
  );
};

export default React.memo(OTPModal);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  innerModalCont: {
    flex: 0.5,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    borderRadius: 10,
  },
  listRow: { flexDirection: "row", margin: 20 },
  downloadText: {
    color: "black",
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 15,
  },
  submitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: SECONDARY_COLOR,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  cancelText: {
    color: "red",
    fontFamily: FONT_FAMILY.light,
    textAlign: "right",
  },
  confirmText: {
    color: "white",
    fontFamily: FONT_FAMILY.bold,
    marginHorizontal: 10,
  },
  headerStyle: { fontFamily: FONT_FAMILY.normal, marginLeft: 10 },
});
