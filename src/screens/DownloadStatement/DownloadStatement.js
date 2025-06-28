import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    Linking,
    Platform,
  } from 'react-native';
  import React from 'react';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import {useState} from 'react';
  import DatePickerComp from '../Transaction/DatePicker';
  import {moderateScale} from '../../util/scale';
  import * as api from '../../util/api';
  
  import RNHTMLtoPDF from 'react-native-html-to-pdf';
  import {ENDPOINT} from '../../util/constant';
  import {useSelector} from 'react-redux';
  import {SECONDARY_COLOR} from '../../util/colors';
  import RNFS from 'react-native-fs';
  import moment from 'moment';
  import Loader from '../../components/Loader';
import { Toast } from 'react-native-toast-notifications';
  
  const addAlpha = (color, opacity) => {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  };
  
  const DownloadStatement = ({navigation, ...props}) => {
    const {data} = props.route.params;

    const userData = useSelector(state => state.auth.userData);
    const [click, setClick] = useState(null);
    const [resetDate, setResetDate] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loader, setLoader] = useState(false);
  
    const apiCallDownload = async () => {
      let body = {};
      let path={};
      // body.ws_type = ENDPOINT.transaction_download;
      path.ws_type = data === 'Credit' ? ENDPOINT.invoice_transaction_download : ENDPOINT.transaction_download;
      body.member_id = userData.data.data[0].MemberID;
      body.pay_mode = data === 'wallet' ? 'SmartCard' : 'CREDIT';
      body.start_date = startDate;
      body.end_date = endDate;
      if (data !== 'Credit') {
        body.pay_mode = data === 'member' ? 'SmartCard' : 'CREDIT';
      }
      
      try {
        const apiRequestObject = {
          path: path.ws_type,
          body: body,
          Token:userData.data.token
        };
        console.log(apiRequestObject, "---------------apiRequestObject---------------");
        
        setLoader(true);
        const response = await api.javascriptPost(apiRequestObject);
        console.log(response, "---------------response---------------");
        if (response.status === true) {
          onProceed(response.data);
        }else {
          setLoader(false);
          Toast.show(response.message?response.message :"Not Found",{
            type:'danger'
          });
          return { result: FAILURE };
        }
        
        setLoader(false);
      } catch (err) {
        setLoader(false);
        return {result: FAILURE};
      }
    };
  
    const arrData = [
      'Last 1 month',
      'Last 3 months',
      'Last 6 months',
      'Last 1 Year',
      'Select a duration',
    ];
  
    const onSelect = ind => {
      if (ind !== 4) {
        setStartDate('');
        setEndDate('');
        const monthNo = ind === 0 ? 1 : ind === 1 ? 3 : ind === 2 ? 6 : 12;
        const currDate = moment(new Date()).format('YYYY-MM-DD');
        setEndDate(currDate);
        var dateFrom = moment(currDate)
          .subtract(monthNo, 'months')
          .format('YYYY-MM-DD');
        setStartDate(dateFrom);
  
        setClick(ind);
      } else {
        setStartDate('');
        setEndDate('');
        setClick(ind);
      }
    };
  
    const onProceed = async filePath => {
      try {
        const randomNum = Date.now();
        let options = {
          html: filePath,
          fileName: `Transaction_${userData?.data?.data[0]?.MemberID}_${data}_${randomNum}`,
          directory: 'Documents',
        };
        const path =
          Platform.OS === 'ios'
            ? RNFS.LibraryDirectoryPath
            : RNFS.DownloadDirectoryPath;
        const destPath =
          path +
          '/' +
          `Transaction_${userData?.data?.data[0]?.MemberID}_${data}_${randomNum}.pdf`;
  
        let file = await RNHTMLtoPDF.convert(options);
        await RNFS.copyFile(file.filePath, destPath);
        setLoader(false);
        if (file) {
          Alert.alert(
            'File Downloaded Successfully',
            `${destPath}`,
            [
              {
                text: 'OK',
              },
              {
                text: 'Open File',
                onPress: () => {
                  RNFS.exists(destPath)
                    .then(exists => {
                      if (exists) {
                        navigation.navigate('PDFView', {
                          url: destPath,
                          title: 'Statement',
                        });
                      } else {
                        Alert.alert('File does not exist:', destPath);
                      }
                    })
                    .catch(error => {
                      Alert.alert('Error checking file existence', error.message);
                    });
                },
              },
            ],
            {cancelable: false},
          );
        }
      } catch (error) {
        setLoader(false);
        Alert.alert('Error during file download or open', error.message);
      }
    };
  
    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View style={styles.rowView}>
          <View
            style={{
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/back.png')}
                style={{height: 15, width: 15}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.downloadText}>Download Statement</Text>
          </View>
        </View>
        <View style={{flex: 1, marginTop: 20}}>
          <FlatList
            data={arrData}
            renderItem={({item, index}) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => onSelect(index)}
                    activeOpacity={0.7}
                    style={styles.listRow}>
                    <View
                      style={{
                        flex: 0.1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Image
                        source={
                          click === index
                            ? require('../../assets/images/circleFilled.png')
                            : require('../../assets/images/circle.png')
                        }
                        style={{height: 15, width: 15}}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.downloadText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                  {index === 4 && click === 4 ? (
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flex: 0.45}}>
                        <Text style={[styles.headerStyle, {marginVertical: 10}]}>
                          {'Start Date'}
                        </Text>
                        <DatePickerComp
                          placeholder={'Start Date'}
                          setResetDate={resetDate}
                          stateDate={setStartDate}
                        />
                      </View>
                      <View style={{flex: 0.45}}>
                        <Text style={[styles.headerStyle, {marginVertical: 10}]}>
                          {'End Date'}
                        </Text>
                        <DatePickerComp
                          placeholder={'End Date'}
                          setResetDate={resetDate}
                          stateDate={setEndDate}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
        {(click !== 4 || (click == 4 && startDate !== '' && endDate !== '')) &&
          click !== null && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={apiCallDownload}
              style={styles.button}>
              <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>
                Proceed
              </Text>
            </TouchableOpacity>
          )}
  
        {loader && (
          <View
            style={{
              backgroundColor: 'rgba(0, 0,0, 0.3)',
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator
                size="large"
                color={SECONDARY_COLOR}
                animating={loader}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  };
  export default DownloadStatement;
  
  const styles = StyleSheet.create({
    rowView: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      height: 50,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: addAlpha('#000000', 0.2),
    },
    listRow: {
      flexDirection: 'row',
      marginHorizontal: 24,
      marginBottom: 35,
    },
    downloadText: {
      fontSize: 16,
      fontWeight: '500',
      color: 'black'
    },
    button: {
      height: 40,
      backgroundColor: SECONDARY_COLOR,
      position: 'absolute',
      width: '50%',
      bottom: 20,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    headerStyle: {
      color: '#5D5D5D',
      fontSize: moderateScale(12),
      paddingBottom: 5,
    },
  });