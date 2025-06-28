import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import LoginContainer from '../src/screens/Login/LoginComponent';
import SigninWithOTPScreen from '../src/screens/Login/SigninWithOTPScreen';
import VerifySigninOTPScreen from '../src/screens/Login/VerifySigninOTP';
import ForgotPasswordScreen from '../src/screens/ForgotPassword/ForgotPasswordScreen';
import VerifyForgotPasswordOTPScreen from '../src/screens/ForgotPassword/VerifyForgotPasswordOTPScreen';
import DownloadStatement from '../src/screens/DownloadStatement/DownloadStatement';
import HomeContainer from '../src/screens/Home/HomeComponent';
import ViewStatement from '../src/screens/ViewStatement/ViewStatement';
import CardRecharge from '../src/screens/CardRecharge/CardRecharge';
import OTP from '../src/screens/OTP/OTP';
import Transaction from '../src/screens/Transaction/Transaction';
import ChangePassword from '../src/screens/ChangePassword/ChangePassword';
import WebViewAll from '../src/screens/WebView/WebViewAll';
import NotificationListScreen from '../src/screens/Notification/Notification';
import NotificationDetailScreen from '../src/screens/Notification/NotificationDetails';
import ContactDetailsComponent from './screens/WebView/Contact';
import PaymentWebViewComponent from './screens/WebView/PaymentWebViewComponent';
import PDFView from './screens/PDF/PdfComponent';
import AffilatedClubScreen from './screens/AffilatedClub/AffilatedClubScreen';
import {useSelector} from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DARK_BLUE} from './util/colors';
import {CustomDrawerContent} from './Navigation/CustomDrawerContaient';
import Profile from './screens/Settings/Profile';
import Contact from './screens/WebView/Contact';
import Info from './screens/WebView/Info';
import Facilities from './screens/Facilities';
import ChoosePlayer from './screens/ChoosePlayer';
import AllFacilities from './screens/AllFacilities';
import PickPlayers from './screens/PickPlayers';
import MyBookings from './screens/Bookings/MyBookings';
import BookingCancelled from './screens/Bookings/BookingCancelled';
const AuthStack = createStackNavigator();
const DrawerNav = createDrawerNavigator();

const DrawerNavigator = ({navigation}) => {
  return (
    <DrawerNav.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'black',
        },

        title: 'Home',
        headerTitleStyle: {color: 'red'},
        drawerIcon: ({color, size}) => (
          <Icon name="user" size={size} color="white" />
        ),
        drawerStyle: {
          backgroundColor: DARK_BLUE,
          width: '70%',
        },

        drawerLabelStyle: {
          fontSize: 29,
          color: 'red',
        },

        headerLeft: () => (
          <Icon
            name="menu"
            size={30}
            color="white"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
          />
        ),
      }}>
      <DrawerNav.Screen name="Home" component={HomeContainer} />
    </DrawerNav.Navigator>
  );
};

const AppDrawerNavigator = () => {
  const userData = useSelector(state => state.auth.userData);
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 300,
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: 300,
            },
          },
        },
      }}>
      {!userData?.data?.data[0]?.MemberID ? (
        <AuthStack.Screen name="LoginScreen" component={LoginContainer} />
      ) : (
        <AuthStack.Screen name="Home" component={DrawerNavigator} />
      )}
      <AuthStack.Screen
        name="Invoice"
        component={ViewStatement}
        screenOptions={{ headerShown: false }}
      />
      
      <AuthStack.Screen
        name="Transactions"
        component={Transaction}
        screenOptions={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Recharge"
        component={CardRecharge}
        screenOptions={{ headerShown: false }}
      />
      <AuthStack.Screen name="ChangePassword" component={ChangePassword} />
      <AuthStack.Screen name="Profile" component={Profile} />
      <AuthStack.Screen name="AffilatedClub" component={AffilatedClubScreen} />
      <AuthStack.Screen
        name="DownloadStatement"
        component={DownloadStatement}
      />
      <AuthStack.Screen
        name="Notification"
        component={NotificationListScreen}
      />
      <AuthStack.Screen name="OTP" component={OTP} />
      <AuthStack.Screen
        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
      />
      <AuthStack.Screen name="ContactUs" component={ContactDetailsComponent} />
      <AuthStack.Screen name="WebViewAll" component={WebViewAll} />
      <AuthStack.Screen name="PDFView" component={PDFView} />
      <AuthStack.Screen name="Contact" component={Contact} />
      <AuthStack.Screen name="Info" component={Info} />
      <AuthStack.Screen name="Facility" component={Facilities} />
      <AuthStack.Screen
        name="PaymentWebView"
        component={PaymentWebViewComponent}
      />

      <AuthStack.Screen
        name="SigninWithOTPScreen"
        component={SigninWithOTPScreen}
      />
      <AuthStack.Screen
        name="VerifySigninOTP"
        component={VerifySigninOTPScreen}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        name="VerifyForgotPassOTPScreen"
        component={VerifyForgotPasswordOTPScreen}
      />
      <AuthStack.Screen name="Facilities" component={Facilities} />
      <AuthStack.Screen name="ChoosePlayer" component={ChoosePlayer} />
      <AuthStack.Screen name="AllFacilities" component={AllFacilities} />
      <AuthStack.Screen name="PickPlayers" component={PickPlayers} />
      <AuthStack.Screen name="Bookings" component={MyBookings} />
      <AuthStack.Screen name="BookingCancelled" component={BookingCancelled} />
    </AuthStack.Navigator>
  );
};
export default AppDrawerNavigator;

// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Text,
//   Image,
//   StatusBar,
//   Platform,
// } from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import LoginContainer from '../src/screens/Login/LoginComponent';
// import SigninWithOTPScreen from '../src/screens/Login/SigninWithOTPScreen';
// import VerifySigninOTPScreen from '../src/screens/Login/VerifySigninOTP';
// import ForgotPasswordScreen from '../src/screens/ForgotPassword/ForgotPasswordScreen';
// import VerifyForgotPasswordOTPScreen from '../src/screens/ForgotPassword/VerifyForgotPasswordOTPScreen';
// import DownloadStatement from '../src/screens/DownloadStatement/DownloadStatement';
// import HomeContainer from '../src/screens/Home/HomeComponent';
// import ViewStatement from '../src/screens/ViewStatement/ViewStatement';
// import CardRecharge from '../src/screens/CardRecharge/CardRecharge';
// import OTP from '../src/screens/OTP/OTP';
// import Transaction from '../src/screens/Transaction/Transaction';
// import Setting from '../src/screens/Settings/Setting';
// import ChangePassword from '../src/screens/ChangePassword/ChangePassword';
// import WebViewAll from '../src/screens/WebView/WebViewAll';
// import NotificationListScreen from '../src/screens/Notification/Notification';
// import NotificationDetailScreen from '../src/screens/Notification/NotificationDetails';
// import ContactDetailsComponent from '../src/screens/Settings/Contact';
// import PaymentWebViewComponent from './screens/WebView/PaymentWebViewComponent';
// import PDFView from './screens/PDF/PdfComponent';
// import AffilatedClubScreen from './screens/AffilatedClub/AffilatedClubScreen';
// import Book from './screens/Book/Book';
// import {useSelector} from 'react-redux';
// const AuthStack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// function MyTabBar({state, descriptors, navigation}) {
//   return (
//     <View
//       style={{
//         flexDirection: 'column',
//         backgroundColor: 'white',
//         paddingBottom: Platform.OS == 'ios' ? 20 : 0,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           backgroundColor: 'transparent',
//           height: 60,
//           justifyContent: 'center',
//           alignItems: 'center',
//           borderTopWidth: 1,
//           borderTopColor: '#fff',
//         }}>
//         {state.routes.map((route, index) => {
//           const {options} = descriptors[route.key];
//           const label =
//             options.tabBarLabel !== undefined
//               ? options.tabBarLabel
//               : options.title !== undefined
//               ? options.title
//               : route.name;

//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: 'tabPress',
//               target: route.key,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           let iconName;
//           let color;
//           let size;
//           if (route.name === 'Dashboard') {
//             iconName = isFocused
//               ? require('./assets/images/Dashboard.png')
//               : require('./assets/images/DashboardDark.png');
//             color = isFocused ? 'black' : 'gray';
//             size = {height: 30, width: 30};
//           } else if (route.name === 'Invoice') {
//             iconName = isFocused
//               ? require('./assets/images/StatementActive.png')
//               : require('./assets/images/StatementInactive.png');

//             color = isFocused ? 'black' : 'gray';
//             size = 25;
//           } else if (route.name === 'Recharge') {
//             color = isFocused ? 'black' : 'gray';
//             iconName = isFocused
//               ? require('./assets/images/RechargeIcnActive.png')
//               : require('./assets/images/RechargeInactive.png');
//             size = 25;
//           } else if (route.name === 'Book') {
//             color = isFocused ? 'black' : 'gray';
//             iconName = isFocused
//               ? require('./assets/images/OtpActive.png')
//               : require('./assets/images/OtpInactive.png');
//             size = 25;
//           } else if (route.name === 'Transactions') {
//             iconName = isFocused
//               ? require('./assets/images/TransactionsActive.png')
//               : require('./assets/images/TransactionsInactive.png');
//             color = isFocused ? 'black' : 'gray';
//             size = {height: 30, width: 30};
//           }
//           const icon = (
//             <Image style={{height: 30, width: 30}} source={iconName} />
//           );

//           const onLongPress = () => {
//             navigation.emit({
//               type: 'tabLongPress',
//               target: route.key,
//             });
//           };

//           return (
//             <TouchableOpacity
//               accessibilityRole="button"
//               accessibilityStates={isFocused ? ['selected'] : []}
//               accessibilityLabel={options.tabBarAccessibilityLabel}
//               testID={options.tabBarTestID}
//               onPress={() => {
//                 onPress();
//               }}
//               onLongPress={onLongPress}
//               style={{flex: 1, alignItems: 'center'}}>
//               {icon}
//               <Text style={{color: isFocused ? 'black' : 'gray', fontSize: 10}}>
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

// const HomeStackNavigator = () => {
//   return (
//     <>
//       <StatusBar
//         backgroundColor={'transparent'}
//         translucent={true}
//         barStyle="light-content"
//       />
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//         }}
//         tabBar={props => (
//           <MyTabBar key={props.state.history[0].key} {...props} />
//         )}>
//         <Tab.Screen
//           name="Dashboard"
//           component={HomeContainer}
//           screenOptions={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="Book"
//           component={Book}
//           screenOptions={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="Invoice"
//           component={ViewStatement}
//           screenOptions={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="Recharge"
//           component={CardRecharge}
//           screenOptions={{headerShown: false}}
//         />
//         <Tab.Screen
//           name="Transactions"
//           component={Transaction}
//           screenOptions={{headerShown: false}}
//         />
//       </Tab.Navigator>
//     </>
//   );
// };

// const AppDrawerNavigator = ({route}) => {
//   const userData = useSelector(state => state.auth.userData);

//   return (
//     <AuthStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}>
//       {!userData?.data?.token ? (
//         <AuthStack.Screen name="LoginScreen" component={LoginContainer} />
//       ) : (
//         <AuthStack.Screen name="Home" component={HomeStackNavigator} />
//       )}
//       <AuthStack.Screen name="Setting" component={Setting} />
//       <AuthStack.Screen name="AffilatedClub" component={AffilatedClubScreen} />
//       <AuthStack.Screen
//         name="DownloadStatement"
//         component={DownloadStatement}
//       />
//       <AuthStack.Screen
//         name="Notification"
//         component={NotificationListScreen}
//       />
//       <AuthStack.Screen name="OTP" component={OTP} />
//       <AuthStack.Screen
//         name="NotificationDetailScreen"
//         component={NotificationDetailScreen}
//       />
//       <AuthStack.Screen name="ChangePassword" component={ChangePassword} />
//       <AuthStack.Screen name="ContactUs" component={ContactDetailsComponent} />
//       <AuthStack.Screen name="WebViewAll" component={WebViewAll} />
//       <AuthStack.Screen name="PDFView" component={PDFView} />
//       <AuthStack.Screen
//         name="PaymentWebView"
//         component={PaymentWebViewComponent}
//       />

//       <AuthStack.Screen
//         name="SigninWithOTPScreen"
//         component={SigninWithOTPScreen}
//       />
//       <AuthStack.Screen
//         name="VerifySigninOTP"
//         component={VerifySigninOTPScreen}
//       />
//       <AuthStack.Screen
//         name="ForgotPassword"
//         component={ForgotPasswordScreen}
//       />
//       <AuthStack.Screen
//         name="VerifyForgotPassOTPScreen"
//         component={VerifyForgotPasswordOTPScreen}
//       />
//     </AuthStack.Navigator>
//   );
// };
// export default AppDrawerNavigator;
