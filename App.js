import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar,
  LogBox,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import BaseContainer from "./src/BaseContainer";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSuccess } from "./src/store/actions/authActions";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DARK_BLUE, LIGHT_GREEN, SECONDARY, SECONDARY_COLOR } from "./src/util/colors";
import {  ToastProvider,  } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/Ionicons";
import { FONT_FAMILY } from "./src/util/constant";

const client = new QueryClient();
const Application = () => {
  const hideSplashScreen = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    SplashScreen.hide();
  };
  const fetchData = async () => {
    const dispatch = useDispatch();

    try {
      const userdata = await AsyncStorage.getItem("user");

      const Data = await JSON.parse(userdata);
      console.log(Data, "---------------Data---------------");
      if (Data) {
        dispatch(loginSuccess(Data));
      }
    } catch (error) {
      console.log(error, "---------------error---------------");
    }
  };
  useEffect(() => {
    hideSplashScreen();
  
    fetchData();
  }, []);
 return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor={DARK_BLUE} />
        <ToastProvider
       placement="top"
       duration={2000}
       animationType="zoom-in"
       animationDuration={300}
       successColor={'rgba(120, 202, 20, 0.78)'}
       style={{borderRadius:30,fontFamily:FONT_FAMILY.normal}}
        infoColor="'rgba(218, 183, 26, 0.7)'"
       dangerColor="red"
       successIcon={
        <Icon name="checkmark-done-circle-outline" size={20} color={LIGHT_GREEN} />
       }
        dangerIcon={
          <Icon name="close-circle-outline" size={20} color={'white'} />
        }
        warningIcon={
          <Icon name="warning-outline" size={20} color={'white'} />
        }
       warningColor="orange"
       normalColor="gray"
       swipeEnabled={true}>
          <QueryClientProvider client={client}>
            <NavigationContainer>
              <SafeAreaProvider
              >
                <SafeAreaView
                 edges={["top",]}
                  forceInset={{ top: "always", bottom: "always" }}
                 style={{ flex: 1, backgroundColor: DARK_BLUE, }} >
                  <PaperProvider>
                    <BaseContainer />
                   
                  </PaperProvider>
                </SafeAreaView>
              </SafeAreaProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

export default Application;

//12126
//aepta2024
