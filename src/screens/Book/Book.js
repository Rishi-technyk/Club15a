import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgUri from 'react-native-svg-uri';
import {FlatList} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import * as api from '../../util/api';
import {ENDPOINT} from '../../util/constant';
import {useSelector} from 'react-redux';
import { Toast } from 'react-native-toast-notifications';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Book = () => {
  const [options, setOptions] = useState(null);
  const userData = useSelector(state => state.auth.userData);
  const emptyList = () => (
    <FlatList
      data={[1, 1, 1, 1, 1, 1]}
      numColumns={3}
      renderItem={() => (
        <View style={{flexGrow: 1 / 3, flex: 1}}>
          <View style={{flex: 1, alignItems: 'center', marginBottom: 20}}>
            <ShimmerPlaceholder style={styles.roundShimmer} />
            <ShimmerPlaceholder style={{width: 50, marginTop: 20}} />
          </View>
        </View>
      )}
    />
  );
  const fetchOptions = async () => {
    let body = {};

    const apiRequestObject = {
      path: ENDPOINT.menus,
      body: body,
      Token: userData.data.token,
    };
    const response = await api.javascriptGet(apiRequestObject);

    if (response.status && response.data?.currentOptions)
      setOptions(response.data);
  };
  useEffect(() => {
    fetchOptions();
  }, []);

  const renderItem = (item, options) => {
    return (
      <View style={{flexGrow: 1 / 3, flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            item.navigate
              ? navigation.navigate(item.navigate)
              : Toast.show(item.item.name, 'Feature coming soon...',{
                type:'warning'
              });
          }}
          activeOpacity={0.6}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={styles.secondryIcon}>
              <SvgUri
                height={40}
                width={40}
                source={{
                  uri: `https://mbclublucknow.org/mbclublogin/public/icons/${item.item.icon}`,
                }}
              />
            </View>
            <Text style={{color: 'black', marginBottom: 20}}>
              {item.item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <Image
            source={require('../../assets/images/AeptaLogo.png')}
            style={{height: 30, width: 30, borderRadius: 15}}
          />
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 5,
            }}>
            MB Club
          </Text>
        </View>

        <Text style={styles.OTPHeader}>Book</Text>
      </View>
      <View
        style={{
          justifyContent: 'space-around',
          marginTop: 20,
          // alignItems: 'center',
          borderRadius: 5,
          padding: 10,
        }}>
        <FlatList
          data={options?.bookingOptions}
          ListEmptyComponent={emptyList}
          numColumns={3}
          contentContainerStyle={{marginHorizontal: 5, marginBottom: 10}}
          keyExtractor={(item, index) => item.name}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default Book;

const {height, width} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop:
      Platform.OS === 'ios'
        ? getStatusBarHeight() + 40
        : getStatusBarHeight() + 30,
    paddingHorizontal: 20,
  },
  OTPHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  OTPView: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  OTPText: {
    // color: '#7E262F',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'SemiBold',
  },
  OTPHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  secondryIcon: {
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  roundShimmer: {
    width: 50, // Set width for the shimmer
    height: 50, // Set height for the shimmer
    borderRadius: 50, // Make it round
  },
});
