import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import BackIcon from '../../assets/svg/BackButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import {triggerLogout} from '../../store/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {javascriptGet, javascriptPost} from '../../util/api';
import {ENDPOINT} from '../../util/constant';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
// import { triggerLogout, loginUser } from '../../redux/CommonAction';

const Version = DeviceInfo.getVersion().toUpperCase();
const Setting = () => {
  const [url, seturl] = useState(null);
  const navigation = useNavigation();
  const fetchUrl = async () => {
    try {
      const apiRequestObject = {
        path: 'documents',
        body: {
          ws_type: ENDPOINT.documents,
        },
      };

      const response = await javascriptGet(apiRequestObject);
      console.log(response, '===========================');
      seturl(response.data);
    } catch (err) {
      return {result: FAILURE};
    }
  };
  useEffect(() => {
    fetchUrl();
  }, []);

  const dispatch = useDispatch();

  var arr = [
    {
      id: 1,
      name: 'Change Password',
      navigation: 'ChangePassword',
      goNext: 1,
    },
    {
      id: 2,
      name: 'Privacy Policy',
      navigation: 'WebViewAll',
      url: url?.privacy_policy,
    },
    {
      id: 3,
      name: 'Terms And Condition',
      navigation: 'WebViewAll',

      url: url?.terms_and_condition,
    },
    {
      id: 3,
      name: 'Disclaimer',
      navigation: 'WebViewAll',
      url: url?.disclaimer,
    },
    {
      id: 4,
      name: 'Cancellation & Refund Policy',
      navigation: 'WebViewAll',
      url: url?.cancellation_policy,
    },
    {
      id: 5,
      name: 'About Us',
      navigation: 'WebViewAll',
      url: url?.about_us,
    },
    {
      id: 6,
      name: 'Contact Us',
      navigation: 'WebViewAll',
      url: url?.contact_us,
    },
    {
      id: 6,
      name: 'Sign Out',
      navigation: 'Notices',
      confirm: 1,
    },
  ];

  const _promptForLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await AsyncStorage.clear();

            dispatch(triggerLogout());
            navigation.reset({
              routes: [{name: 'LoginScreen'}],
            });
          },
        },
        {text: 'No'},
      ],
      {cancelable: false},
    );
  };

  const RenderItems = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          item.confirm == 1
            ? _promptForLogout()
            : navigation.navigate(item.navigation, {
                url: item.url,
                name: item.name,
              })
        }
        style={styles.card}>
        <Text style={styles.titleText}>{item.name}</Text>
        {item.goNext == 1 && (
          <Image
            source={require('../../assets/images/next.png')}
            style={{height: 30, width: 30}}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}>
            <BackIcon />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../assets/images/AeptaLogo.png')}
                style={{height: 25, width: 25, borderRadius: 15, marginLeft: 5}}
              />
              <Text style={{marginLeft: 5, color: 'black'}}>MB Club</Text>
            </View>
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Settings
          </Text>

          <View style={{flex: 1}} />
        </View>

        <ScrollView>
          <View style={styles.body}>
            <FlatList data={arr} renderItem={RenderItems} />
          </View>
        </ScrollView>
        <View>
          <Text style={{marginBottom: 20, textAlign: 'center', fontSize: 14}}>
            Version: {Version}
          </Text>
        </View>
      </View>
    </>
  );
};

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:
      Platform.OS === 'ios'
        ? getStatusBarHeight() + 50
        : getStatusBarHeight() + 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerlogo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 100,
  },

  body: {
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    height: 60,
    width: width - 20,
    marginVertical: 10,
    elevation: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default Setting;
