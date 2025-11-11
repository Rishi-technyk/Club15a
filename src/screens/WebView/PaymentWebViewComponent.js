import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {useRoute} from '@react-navigation/native';
import BackIcon from '../../assets/svg/BackButton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import * as api from '../../util/api';
import {ENDPOINT, FONT_FAMILY} from '../../util/constant';
import { SECONDARY_COLOR } from '../../util/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Header from '../../components/Header';
import WebView from 'react-native-webview';

const PaymentWebViewComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {data} = route.params;
  const userData = useSelector(state => state.auth.userData);
  const [Data, setData] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [loading, setLoading] = useState(false);

// const onShouldStartLoadWithRequest=(request) => {
//     const { url } = request;
//     if (
//       url.startsWith('upi://') ||
//       url.startsWith('tez://') ||
//       url.startsWith('phonepe://') ||
//       url.startsWith('paytmmp://')
//     ) {
//       Linking.canOpenURL(url)
//         .then((supported) => {
//           if (supported) {
//             Linking.openURL(url);
//           } else {
//             Alert.alert(
//               'UPI App not found',
//               'No UPI app found to handle this payment. Please install one.'
//             );
//           }
//         })
//         .catch((err) => console.log('Error opening UPI app: ', err));
//       return true; // block WebView navigation
//     }
//     return true; // allow other URLs
//   }

const onShouldStartLoadWithRequest = (request) => {
  console.log('\x1b[32m%s\x1b[0m', request, '---------------------- request ---------------------');
  const { url } = request;

  // 🔹 Check if it's a UPI deep link
  if (
    url.startsWith('upi://') ||
    url.startsWith('tez://') ||
    url.startsWith('phonepe://') ||
    url.startsWith('paytmmp://')
  ) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'UPI App not found',
            'No UPI app found to handle this payment. Please install one.'
          );
        }
      })
      .catch((err) => console.log('Error opening UPI app: ', err));
    return false; // block WebView from trying to load UPI link
  }

  // 🔹 Handle the callback/return URL from gateway (example: success/failure)
  if (url.includes("paymentResponse") || url.includes("status")) {
    console.log("✅ Payment Response URL:", url);
    // You can parse query params here
    // navigation.navigate('PaymentResult', { url });
  }

  return true; // allow other URLs to load in WebView
};
const openUPILink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url); // 🚀 Opens in UPI app or browser
    } else {
      Alert.alert("Not Supported", "No app found to handle this payment link.");
    }
  } catch (err) {
    console.error("Error opening UPI link:", err);
    Alert.alert("Error", "Something went wrong while opening the payment link.");
  }
};
useEffect(() => {
  openUPILink(data.url)
  
  const handleDeepLink = (event) => {
    console.log("🔄 Returned to app with URL:", event.url);

    if (event.url.includes("status=SUCCESS")) {
      Alert.alert("✅ Payment Success");
      navigation.replace("PaymentSuccessScreen");
    } else if (event.url.includes("status=FAILED")) {
      Alert.alert("❌ Payment Failed");
      navigation.replace("PaymentFailedScreen");
    } else {
      console.log("Other callback:", event.url);
    }
  };

  const subscription = Linking.addEventListener("url", handleDeepLink);

  return () => {
    subscription.remove();
  };
}, []);

  return (
   
    
     <View style={styles.container}>
   
    
      <Header title={'Payment '}/>
    <View
         style={{
           backgroundColor: 'white',
          
           flex: 1,
          
         }}>
              {/* <WebView
        automaticallyAdjustContentInsets={false}
        // ref={(ref) => (setWebView(ref))}
        source={{uri:data?.url||''}}
        // injectedJavaScriptBeforeContentLoaded={pucJavaScript}
        scrollEnabled
        scalesPageToFit={false}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        cacheEnabled={true}
        allowFileAccessFromFileURLs={true}
        setSupportMultipleWindows={true}
        domStorageEnabled={true}
        allowUniversalAccessFromFileURLs={true}
 onLoadStart={(syntheticEvent) => {
  console.log("🚀 onLoadStart URL:", syntheticEvent.nativeEvent.url);
}}
            startInLoadingState={true}
            
        onNavigationStateChange={ onShouldStartLoadWithRequest}
       onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('WebView error: ', nativeEvent);
    }}
    onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('HTTP error: ', nativeEvent);
    }}
      /> */}
       
       </View>
       {loading &&
       <View style={{ backgroundColor: "rgba(0, 0,0, 0.3)", flex: 1, position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
         <View style={{ backgroundColor: "transparent", flex: 1, alignItems: "center", justifyContent: "center" }}>
           <ActivityIndicator size='large' color={SECONDARY_COLOR} animating={loading} />
         </View>
       </View>

     }
     </View>

  );
};
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  card: {
    width: '95%',
    height: '85%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginTop: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15,
    textAlign: 'center',
    flex: 1,
  },
  payButton: {
    backgroundColor: '#F37254',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStyle:{
    fontFamily:FONT_FAMILY.bold,
    color:'black'
  },textStyle:{
    fontFamily:FONT_FAMILY.normal,
    color:'grey'
  }
});

export default PaymentWebViewComponent;
