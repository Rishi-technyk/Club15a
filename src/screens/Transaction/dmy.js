import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  TextInput,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { PINK_COLOR, SECONDARY_COLOR } from '../../util/colors';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as api from '../../util/api';
import { SERVER_CODES, ENDPOINT } from '../../util/constant';
import { ApiRequestObject, ServiceResponse } from '../../util/types';
import { moderateScale, verticalScale, scale } from '../../util/scale';
import { FONT_FAMILY } from '../../util/constant';
import Modal from 'react-native-modal';
import ElevatedView from 'react-native-elevated-view';
import { SUCCESS, FAILURE } from '../../redux/ActionConstants';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import TransactionHistory from '../../assets/svg/TransactionHistory';
import CrossIcon from '../../assets/svg/CrossIcon';
import SettingIcon from '../../assets/svg/SettingIcon';
import DownIcon from '../../assets/svg/DownIcon';
import UpIcon from '../../assets/svg/UpIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import CheckBoxes from './CheckBoxes';
import BouncyCheckboxGroup, {
  ICheckboxButton,
} from 'react-native-bouncy-checkbox-group';
import DatePickerComp from './DatePicker';
import moment from 'moment';

import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';

const OTP = props => {
  const sheetRef = React.useRef(null);
  const sheetRef1 = React.useRef(null);
  const userData = useSelector(state => state.commonReducer);
  const userData1 = useSelector(state => state.commonReducer);
  const { MemberID, DisplayName } = useSelector(state => state.commonReducer.userProfile);
  const [show, setShow] = useState('wallet');



  const navigation = useNavigation();

  const [clearAllKey, setClearAllKey] = useState(false);

  const [data, setData] = useState([]);
  

  const [loading, setLoading] = useState(true);
  const [renderData, setRenderData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [FirstBoxPosition, setFirstBoxPosition] = useState('');
  const [ActiveAnswer, setActiveAnswer] = useState(-1);
  const [checkedBox, setCheckedBox] = useState(-1);
  const [checkedBoxLocation, setCheckedBoxLocation] = useState(-1);
  const [resetDate, setResetDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [location, setLocation] = useState(
    JSON.stringify(userData1?.userData?.data?.data[0]?.location?.split(',')),
  );
  const [locationList, setLocationList] = useState(
    userData1?.userData?.data?.data[0]?.location?.split(','),
  );
  const [payCheckState, setPayCheckState] = useState(
    userData1?.userData?.data?.data[0]?.paymode?.split(','),
  );
  useFocusEffect(
    React.useCallback(() => {
      // The screen is focused
      if (show === 'Credit' && sheetRef.current) {
        sheetRef.current.snapTo(0);
      }
      
      return () => {
        // The screen is unfocused, close the sheet
        if (sheetRef.current) {
          sheetRef.current.snapTo(0);
        }
      };
    }, [show])
  );
  async function callAPI(startDate, endDate, location, isFilter) {
    setLoading(true);
    let body = {};
    body.ws_type = ENDPOINT.transaction_filter;
    body.member_id = userData.userProfile.MemberID;

    const errorMessage = validateDateSelection(startDate, endDate);
    if (errorMessage) {
      setLoading(false);
      Toast.show(errorMessage,{type:'denger'});
     
      return; // Stop execution if there is an error
    }

    if (isFilter && show === "Credit") {
     
      body.ws_type = ENDPOINT.invoice_transaction_filter;

      body.start_date = startDate;

      body.end_date = endDate;
    }
    else if (isFilter) {

      body.ws_type = ENDPOINT.transaction_filter;
      body.locations = location;
      body.pay_mode = show === 'wallet' ? 'CARD' : 'CREDIT';

      body.start_date = startDate;

      body.end_date = endDate;

    } else if (show === "Credit") {
      body.ws_type = ENDPOINT.invoice;
    } else {
      body.ws_type = ENDPOINT.transaction;
      body.pay_mode = show === 'wallet' ? 'CARD' : 'CREDIT';
    }


    try {
      const apiRequestObject = {
        path: '',
        body: body,
      };
      const response = await api.javascriptPost(apiRequestObject);

      setData(response.data);


      if (!isFilter) {
        setTotalPrice(response.data[0].Balance);
      }

      var total = 0;

      setLoading(false);

      return response;
    } catch (err) {
      setLoading(false);
      return { result: FAILURE };
    }
  }

  // Add these functions for date validation
  function areDatesSelected(startDate, endDate) {
    if (startDate && endDate) {
      return true;
    }

    if (startDate === "" && endDate === "") {
      return true;
    }

    // Check if one date is selected and the other is not
    if ((startDate && !endDate) || (!startDate && endDate)) {
      return false;
    }

    // If neither condition is met, return false
    return false;
  }

  function isStartDateGreaterThanEndDate(startDate, endDate) {
    return new Date(startDate) > new Date(endDate);
  }

  function isEndDateLessThanStartDate(startDate, endDate) {
    return new Date(endDate) < new Date(startDate);
  }

  function validateDateSelection(startDate, endDate) {
    if (!areDatesSelected(startDate, endDate)) {
      return "Please select both start and end date";
    } else if (isStartDateGreaterThanEndDate(startDate, endDate)) {
      return "Start date cannot be greater than end date";
    } else if (isEndDateLessThanStartDate(startDate, endDate)) {
      return "End date cannot be less than start date";
    } else {
      return ""; // No error
    }
  }
  useEffect(() => {
    const a = navigation.addListener('focus', () => {
      callAPI('', '', '', '', false);
    });
    return a;
  }, [navigation, show]);

  useEffect(() => {
    callAPI('', '', '', '', false);
  }, [show]);

  function applyFilter() {
    if (
      checkedBox == -1 &&
      checkedBoxLocation == -1 &&
      startDate == '' &&
      endDate == '' &&
      !clearAllKey
    ) {
      Toast.show('Please select atleast one filter',{type:'warning'});
      return;
    }
    if (checkedBox == -1 && checkedBoxLocation == -1) {
      var payMode = [];
      var location = [];
    } else {
      if (checkedBoxLocation != -1) {
        var location = locationList[checkedBoxLocation].split(',');
      } else {
        // var location = locationList;
        var location = [];
      }
      if (checkedBox != -1) {
        var payMode = payCheckState[checkedBox].split(',');
      } else {
        // var payMode = payCheckState;
        var payMode = [];
      }
    }

    if (clearAllKey) {
      callAPI('', '', '', '', false);
    } else {
      callAPI(startDate, endDate, location, payMode, true);
    }

    clearAll();
    setClearAllKey(false);

    sheetRef1.current.snapTo(0);
  }

  function TransactionCard(item, index) {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
       
          onPress={() => {
            if (show !== 'Credit') {
              setRenderData(item);
              sheetRef.current.snapTo(1);
            }
          }}
          activeOpacity={0.5}
          style={{
            height: height / 10,
            width: width - 30,
            backgroundColor: 'white',
            marginVertical: 8,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <View style={styles.cardView}>
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* <View style={styles.indexView}>
                                <Text style={styles.indexText}>{index + 1}</Text>
                            </View> */}
              <View style={{ justifyContent: 'center' }}>

                {item?.LocationName ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={styles.locationName}>
                        {item?.LocationName?.length > 10 ? `${item?.LocationName?.substring(0, 15)}...` : item?.LocationName}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.locationName}>
                        {moment(item.BillDate).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={styles.locationName}>
                        {item?.particulars?.length > 10 ? `${item?.particulars?.substring(0, 15)}...` : item?.particulars}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.locationName}>
                        {moment(item?.voucher_date).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                  </View>
                )}

                {/* <Text style={styles.amountText}>₹ {item.Amount}</Text> */}
                {item?.Amount ? (
                  <View style={styles.amountText}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: item?.Amount < 0 ? 'red' : '#79CA14',
                        }}>
                        {item?.Amount < 0 ? 'Dr' : 'Cr'} Rs {Math.abs(item?.Amount)}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 18, color: 'black' }}>
                        Balance: {item.Balance}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.amountText}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: parseFloat(item?.debit_amt) > 0 ? 'red' : '#79CA14',
                        }}>
                        {parseFloat(item?.debit_amt) > 0 ? 'Dr' : 'Cr'} Rs {parseFloat(item?.debit_amt) > 0 ? item?.debit_amt : item?.credit_amt}
                      </Text>
                    </View>
                    {<View>
                      <Text style={{ fontSize: 14, color: 'black' }}>
                        Vch No. : {item.voucher_no}
                      </Text>
                    </View>}
                  </View>
                )}

                {item?.narrations && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ fontSize: 14, color: 'black', paddingHorizontal: 10, }}>
                      {item?.narrations}
                    </Text>
                  </View>
                )}

              </View>
            </View>
            {show !== 'Credit' ? (
              <View>
                <Image
                  source={require('../../assets/images/next.png')}
                  style={{ height: 30, width: 30 }}
                />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }




  function toggleFirstBox() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFirstBoxPosition(FirstBoxPosition === 'left' ? 'right' : 'left');
  }

  function clearAll() {
    setClearAllKey(true);
    setCheckedBox(-1);
    setCheckedBoxLocation(-1);
    setResetDate(true);
    setStartDate('');
    setEndDate('');
    setTimeout(() => {
      setResetDate(false);
    }, 1000);
  }

  const renderFilterContent = () => {
    var arr = [
      {
        title: 'Location',
        type: 'checkboxes',
        updatedContent: 1,
        content: locationList,
      },
      {
        title: 'Date Range',
        type: 'Input',
        content: [
          {
            title: 'Start Date',
            id: 1,
            placeholder: 'Please select start date',
          },
          {
            title: 'End Date',
            id: 2,
            placeholder: 'Please select end date',
          },
        ],
      },
    ];

    if (show === "Credit") {
     
      arr = arr.filter(item => item.title !== 'Location');
    }

    return (
      <View
        style={{
          height: height / 1.2,
          backgroundColor: 'white',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            marginBottom: 20,
          }}>
          <View>
            <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold' }}>
              Filters
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              sheetRef1.current.snapTo(0);
              setActiveAnswer(-1);
              setCheckedBox(-1);
              setCheckedBoxLocation(-1);
            }}
            activeOpacity={0.5}
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CrossIcon />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {arr.map((item, index) =>
            (payCheckState == undefined || payCheckState == null) &&
              item.title == 'By Payment Mode' ? null : (locationList ==
                undefined ||
                locationList == null) &&
                item.title == 'Location' ? null : (
              <TouchableOpacity
                onPress={() => {
                  toggleFirstBox();
                  if (ActiveAnswer === index) {
                    setActiveAnswer('');
                  } else {
                    setActiveAnswer(index);
                  }
                }}
                activeOpacity={0.5}
                style={{
                  width: width - 45,
                  height: ActiveAnswer === index ? 300 : 60,
                  backgroundColor: 'white',
                  marginVertical: 10,
                  elevation: 5,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: moderateScale(16),
                    }}>
                    {item.title}
                  </Text>
                  {ActiveAnswer === index ? (
                    <View style={{}}>
                      <UpIcon />
                    </View>
                  ) : (
                    <View style={{}}>
                      <DownIcon />
                    </View>
                  )}
                </View>

                {ActiveAnswer === index && (
                  <View
                    style={{
                      borderBottomColor: '#dedede',
                      borderBottomWidth: 1,
                    }}
                  />
                )}
                <View>
                  {ActiveAnswer === index && item.type == 'checkboxes' ? (
                    item.updatedContent == 1 ? (
                      item.content.map((items, indexes) => {
                        return (
                          <View style={{ paddingVertical: 20 }}>
                            <TouchableOpacity
                              onPress={() => {
                                item.title == 'Location'
                                  ? setCheckedBoxLocation(indexes)
                                  : setCheckedBox(indexes);
                              }}
                              style={{
                                height: 40,
                                width: width - 75,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 5,
                              }}>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: moderateScale(16),
                                }}>
                                {items}
                              </Text>
                              <View>
                                {item.title == 'Location' ? (
                                  <CheckBoxes
                                    setCheckedBox={setCheckedBoxLocation}
                                    checkedBox={checkedBoxLocation}
                                    index={indexes}
                                  />
                                ) : (
                                  <CheckBoxes
                                    setCheckedBox={setCheckedBox}
                                    checkedBox={checkedBox}
                                    index={indexes}
                                  />
                                )}
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    ) : (
                      item.content.map((items, indexes) => {
                        return (
                          <View
                            style={{
                              paddingVertical: 25,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingHorizontal: 5,
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: moderateScale(16),
                                }}>
                                {items.title}
                              </Text>
                            </View>
                            <View>
                              {item.title == 'Location' ? (
                                <CheckBoxes
                                  setCheckedBox={setCheckedBoxLocation}
                                  checkedBox={checkedBoxLocation}
                                  index={indexes}
                                />
                              ) : (
                                <CheckBoxes
                                  setCheckedBox={setCheckedBox}
                                  checkedBox={checkedBox}
                                  index={indexes}
                                />
                              )}
                            </View>
                          </View>
                        );
                      })
                    )
                  ) : item.type == 'Input' ? (
                    <View>
                      <View style={{}}>
                        <Text
                          style={[styles.headerStyle, { marginVertical: 10 }]}>
                          {item.content[0].title}
                        </Text>
                        <DatePickerComp
                          placeholder={item.content[0].placeholder}
                          setResetDate={resetDate}
                          stateDate={setStartDate}
                        />
                      </View>
                      <View style={{}}>
                        <Text
                          style={[styles.headerStyle, { marginVertical: 10 }]}>
                          {item.content[1].title}
                        </Text>
                        <DatePickerComp
                          placeholder={item.content[1].placeholder}
                          setResetDate={resetDate}
                          stateDate={setEndDate}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={clearAll}
            activeOpacity={0.5}
            style={{
              height: 50,
              backgroundColor: '#f5ffe9',
              width: 145,
              borderRadius: 8,
              borderColor: '#79ca14',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(14),
              }}>
              Clear All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
           
            onPress={applyFilter}
            activeOpacity={0.5}
            style={{
              height: 50,
              backgroundColor: '#79ca14',
              width: 145,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: moderateScale(14),
              }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 20,
        height: '100%',
        borderTopEndRadius: 30,
        borderTopLeftRadius: 30,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
          marginBottom: 20,
        }}>
        <View>
          <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold' }}>
            Transaction Details
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => sheetRef.current.snapTo(0)}
          activeOpacity={0.5}
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CrossIcon />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>

        {renderData?.BillNo ? (
          <View style={{ width: width / 1.7 }}>
            {/* <Text style={styles.headerStyle}>Location Name</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.LocationName}</Text> */}
            <Text style={styles.headerStyle}>Bill Number</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              {renderData?.BillNo}
            </Text>
          </View>
        ) : (
          <View style={{ width: width / 1.7 }}>
            <Text style={[styles.headerStyle]}>Voucher No.</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(15),
              }}>
              {renderData?.voucher_no}
            </Text>
          </View>
        )}

        {renderData?.BillDate ?
          (
            <View style={{ width: width / 2.5 }}>
              <Text style={[styles.headerStyle]}>Bill Date</Text>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: moderateScale(16),
                }}>
                {moment(renderData?.BillDate).format('DD-MM-YYYY')}
              </Text>
            </View>
          ) : (
            <View style={{ width: width / 2.5 }}>
              <Text style={[styles.headerStyle]}>Voucher Date</Text>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: moderateScale(15),
                }}>
                {moment(renderData?.voucher_date).format('DD-MM-YYYY')}
              </Text>
            </View>
          )}

      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>

        {renderData?.LocationName ? (
          <View style={{ width: width / 1.7 }}>
            {/* <Text style={styles.headerStyle}>Balance</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.Balance}</Text> */}
            <Text style={styles.headerStyle}>Location Name</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              {renderData?.LocationName}
            </Text>
          </View>
        ) : (
          <View style={{ width: width / 1.7 }}>
            {/* <Text style={styles.headerStyle}>Location Name</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.LocationName}</Text> */}
            <Text style={styles.headerStyle}>Member id</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(15),
              }}>
              {renderData.member_id}
            </Text>
          </View>
        )}

        {renderData?.Amount ? (
          <View style={{ width: width / 2.5 }}>
            <Text style={styles.headerStyle}>Amount</Text>
            <Text
              style={{
                color: renderData.Amount < 0 ? 'red' : '#79CA14',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              {Math.abs(renderData.Amount)}
            </Text>
          </View>
        ) : (
          <View style={{ width: width / 2.5 }}>
            <Text style={styles.headerStyle}>Amount</Text>
            <Text
              style={{
                fontSize: 15,
                color: parseFloat(renderData?.debit_amt) > 0 ? 'red' : '#79CA14',
              }}>
              {parseFloat(renderData?.debit_amt) > 0 ? 'Dr' : 'Cr'} Rs {parseFloat(renderData?.debit_amt) > 0 ? renderData?.debit_amt : renderData?.credit_amt}
            </Text>
          </View>
        )}
      </View>


      {renderData?.particulars ?
        (<View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 20,
          }}>
          <View style={{ width: width / 1.7 }}>
            {/* <Text style={styles.headerStyle}>Balance</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.Balance}</Text> */}
            <Text style={styles.headerStyle}>Particulars</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(14),
              }}>
              {renderData?.particulars}
            </Text>
          </View>
        </View>
        ) : ("")}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>

        {renderData.PayMode ? (
          <View style={{ width: width / 1.7 }}>
            <Text style={styles.headerStyle}>Pay Mode</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              {renderData.PayMode}
            </Text>
          </View>
        ) : (
          <View style={{ width: width / 1.7 }}>
            <Text style={styles.headerStyle}>Narration</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(14),
              }}>
              {renderData.narrations}
            </Text>
          </View>
        )}

        {renderData?.Balance ? (
          <View style={{ width: width / 2.5 }}>
            {/* <Text style={styles.headerStyle}>Balance</Text>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.Balance}</Text> */}
            <Text style={styles.headerStyle}>Balance</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              {renderData?.Balance}
            </Text>
          </View>
        ) : (""

        )}
      </View>
    </View>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent={true}
          barStyle="dark-content"
        />

{loading && <View style={{backgroundColor:"rgba(0, 0,0, 0.3)",flex:1,position:"absolute",top:0,bottom:0,left:0,right:0}}>
                <View style={{backgroundColor:"transparent",flex:1,alignItems:"center",justifyContent:"center"}}>
                    <ActivityIndicator size='large' color={SECONDARY_COLOR} animating={loading} />
                </View>
                </View>}

        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}>
              <Image
                source={require('../../assets/images/dsoidelhi.png')}
                style={{ height: 30, width: 30, borderRadius: 15 }}
              />
              <Text style={{ color: 'black', fontSize: 20, marginBottom: 5, marginLeft: 5 }}>DSOI Delhi</Text>

            </View>

            <Text style={styles.header}>Transaction History</Text>



            <View style={styles.rowView}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShow('wallet')}
                style={
                  show === 'wallet'
                    ? { ...styles.topView, backgroundColor: '#F5FFE9' }
                    : styles.topView
                }>
                <Text
                  style={
                    show === 'wallet' ? styles.boldText : styles.simpleText
                  }>
                  Member A/c
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShow('Credit')}
                style={
                  show === 'Credit'
                    ? { ...styles.topView, backgroundColor: '#F5FFE9' }
                    : styles.topView
                }>
                <Text
                  style={
                    show === 'postpaid' ? styles.boldText : styles.simpleText
                  }>
                  Credit A/c
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={{ width: width / 2.2, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: FONT_FAMILY.Cinzel,
                    fontWeight: 'bold',
                    paddingTop: 10,
                  }}
                  numberOfLines={2}>
                  {DisplayName}

                  {/* ₹ {Math.abs(totalPrice)} */}
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(15),
                    fontFamily: FONT_FAMILY.Cinzel,
                  }}
                  numberOfLines={2}>
                  Member ID: {MemberID}
                </Text>

              </View>
              <View style={{ transform: [{ scale: 0.9 }], marginTop: 20 }}>
                <TransactionHistory />
              </View>
            </View>

            <View style={styles.transactionListHeaderStyle}>
              <View>
                <Text style={styles.transactionListHeaderText}>
                  Transaction List
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('DownloadStatement', { data: show })
                  }
                  style={{ justifyContent: 'center', marginRight: 20 }}>
                  <Image
                    style={{ height: 20, width: 20 }}
                    source={require('../../assets/images/download.png')}
                  />
                </TouchableOpacity>

                {(payCheckState == undefined || payCheckState == null) &&
                  (locationList == undefined || locationList == null) ? null : (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      sheetRef1.current.snapTo(1);
                    }}>
                    <SettingIcon />
                  </TouchableOpacity>
                )} </View>

            </View>
          </View>
          <FlatList
            data={data}
            renderItem={({ item, index }) => TransactionCard(item, index)}

            keyExtractor={(item, index) => index.toString()}
          />

        </View>

        <BottomSheet
          ref={sheetRef}
          snapPoints={[0, height / 2, 0]}
          borderRadius={10}
          renderContent={renderContent}
        />
        <BottomSheet
          ref={sheetRef1}
          snapPoints={[0, height / 1.2, 0]}
          borderRadius={10}
          renderContent={renderFilterContent}
          enabledInnerScrolling={true}
          enabledContentGestureInteraction={false}
        />
      </View>
    </>
  );
};

const { height, width } = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: getStatusBarHeight() + 20,
    paddingHorizontal: 20,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  elevatedView: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 6,
    borderRadius: 10,
    height: 220,
    width: Dimensions.get('window').width - 20,
    paddingHorizontal: 20,
  },
  titleText: {
    color: PINK_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleValue: {
    // color: '#FE8371',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataNotFoundText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,

  },
  card: {
    backgroundColor: '#F5FFE9',
    height: height / 5,
    width: width - 40,
    marginTop: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // alignItems: 'center',
  },
  transactionListHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
    paddingVertical: 20,
  },
  transactionListHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  indexView: {
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: '#79CA14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  locationName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  amountText: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.3,
  },
  headerStyle: {
    color: '#5D5D5D',
    fontSize: moderateScale(12),
    paddingBottom: 5,
  },
  rowView: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    height: moderateScale(35),
    borderRadius: 10,
    backgroundColor: 'lightgray',
    marginTop: 20,
  },
  topView: {
    flex: 0.5,
    backgroundColor: 'lightgray',
    height: moderateScale(35),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleText: {
    fontSize: 15,
    fontWeight: '500',
  },
  boldText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
function mapStateToProps(state) {
  const { commonReducer } = state;
  return {
    ...commonReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}

const MyComponent = connect(mapStateToProps, mapDispatchToProps)(OTP);
export default OTP;
