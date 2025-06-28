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

const PaymentWebViewComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {data} = route.params;
  const userData = useSelector(state => state.auth.userData);
  const [Data, setData] = useState(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [loading, setLoading] = useState(true);
 useEffect(() => {
  if (!paymentInitiated) {
    setPaymentInitiated(true);
    startPayment();
  }
}, [paymentInitiated]);
  const startPayment = () => {
    const options = {
      description: 'Payment for order',
      image: 'https://teebooking.aepta.in/public/member/assets/img/dsoi-logo-name.png', 
      currency: 'INR',
      key: data.razorpayKey, 
      amount: data.amount * 100,  
      name: userData?.data?.data[0]?.DisplayName || 'User',
      prefill: {
        email: userData?.data?.data[0]?.Email || '',
        contact: userData?.data?.data[0]?.Phone || '',
      },
      theme: {color: '#222642'},
    };

    RazorpayCheckout.open(options)
      .then(async paymentData => {
        console.log('\x1b[36m%s\x1b[0m', paymentData, '---------------------- paymentData ---------------------');
        if (paymentData?.razorpay_payment_id) {
      
          const paydata=await JSON.stringify(paymentData)
          const payload = {
            path: ENDPOINT.process_payment,
            body: {
              razorpay_order_id: data.orderId,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_response:paydata,
              status: true,
            },
            Token: userData?.data?.token,
          };
          let response = await api.javascriptPost(payload);
       console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
          setData(response.data)
          setLoading(false)
        }else{
           const paydata=await JSON.stringify(paymentData)
          const payload = {
            path: ENDPOINT.process_payment,
            body: {
              razorpay_order_id: data.orderId ,
              razorpay_payment_id: paymentData.razorpay_payment_id ||'N/A',
              razorpay_response:paydata,
              status: false,
            },
            Token: userData?.data?.token,
          };
          let response = await api.javascriptPost(payload);
       console.log('\x1b[36m%s\x1b[0m', response, '---------------------- response ---------------------');
          setData(response.data)
          setLoading(false)
        }
      })
      
      .catch(async error => {
    console.log('\x1b[36m%s\x1b[0m', error, '---------------------- error ---------------------');
        const payload = {
          path: ENDPOINT.process_payment,
          body: {
            razorpay_order_id: data.orderId ||data.razorpayKey,
            razorpay_payment_id: error.payment_id||'N/A',
            razorpay_response: JSON.stringify(error),
            status: false,
          },
          Token: userData?.data?.token,
        };
     

        let response = await api.javascriptPost(payload);
        setData(response.data)
        setLoading(false)
      });
  };



  return (
   
    
     <View style={styles.container}>
   
    
      <Header title={'Payment Detail'}/>
    <View
         style={{
           backgroundColor: 'white',
          
           flex: 1,
          
         }}>
        
         <ScrollView showsVerticalScrollIndicator={false}>
           <View
             style={{
               paddingBottom: 5,
               justifyContent: 'center',
               paddingHorizontal: 20,
               paddingTop: 30,
             }}>
             <Text style={styles.headerStyle}>Member Name</Text>
             <Text style={styles.textStyle}>
               {Data?.MemberName ? Data.MemberName : 'Not Available'}
             </Text>
           </View>
           <View
             style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               paddingHorizontal: 20,
               paddingTop: 30,
               paddingBottom: 5,
             }}>
             <View style={{width: width / 2}}>
               <Text style={styles.headerStyle}>C ID</Text>
               <Text style={styles.textStyle}>
                 {Data?.MemberSCID ? Data.MemberSCID : 'Not Available'}
               </Text>
             </View>
             <View style={{width: width / 2 - 100}}>
               <Text style={styles.headerStyle}>M ID</Text>
               <Text style={styles.textStyle}>
                 {Data?.MemberID ? Data.MemberID : 'Not Available'}
               </Text>
             </View>
           </View>

           <View
             style={{
               paddingBottom: 5,
               justifyContent: 'center',
               paddingHorizontal: 20,
               paddingTop: 30,
             }}>
             <Text style={styles.headerStyle}>{route.params.type} Amount</Text>
             <Text style={styles.textStyle}>
               {Data?.paid_amount ? Data.paid_amount : 'Not Available'}
             </Text>
           </View>

           <View
             style={{
               paddingBottom: 5,
               justifyContent: 'center',
               paddingHorizontal: 20,
               paddingTop: 30,
             }}>
             <Text style={styles.headerStyle}>Merchant Reference No</Text>
             <Text style={styles.textStyle}>
               {Data?.reference_number
                 ? Data.reference_number
                 : 'Not Available'}
             </Text>
           </View>

           <View

             style={{
               paddingBottom: 5,
               justifyContent: 'center',
               paddingHorizontal: 20,
               paddingTop: 30,
             }}>
             <Text style={styles.headerStyle}>Payment Status</Text>
             <Text style={styles.textStyle}>
               {Data?.Status ? Data.Status : 'Not Available'}
             </Text>
           </View>

           <View
             style={{
               paddingBottom: 5,
               justifyContent: 'center',
               paddingHorizontal: 20,
               paddingTop: 30,
             }}>
             <Text style={styles.headerStyle}>Transaction ID</Text>
             <Text style={styles.textStyle}>
               {data.orderId ? data.orderId : 'Not Available'}
             </Text>
           </View>
         </ScrollView>
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
