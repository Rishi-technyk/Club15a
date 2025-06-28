import React, {useState} from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import BackIcon from '../../assets/svg/BackButton';
import {useNavigation} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const WebViewComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {url, name} = route.params;
  console.log(url, name, '---------------url,name---------------');
  const [loading, setLoading] = useState(true);
  return (
    <>
      <StatusBar barStyle="dark-content" />
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
              fontSize: 14,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {name}
          </Text>

          <View style={{flex: 1}} />
        </View>

        <View style={styles.card}>
          {/* <WebView
                        source={{ uri: url }}
                    /> */}
          <WebView
            source={{uri: url}}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 30 : getStatusBarHeight(),
  },
  card: {
    width: '95%',
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Add elevation for a shadow effect (Android)
    shadowColor: '#000', // Add shadow for a shadow effect (iOS)
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    marginTop: 5,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginLeft: 5,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 35,
  },
  backButton: {
    marginLeft: 15,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});

export default WebViewComponent;
