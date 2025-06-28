import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  ActivityIndicator,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {PINK_COLOR, SECONDARY_COLOR} from '../../util/colors';
import {ENDPOINT} from '../../util/constant';
import {moderateScale} from '../../util/scale';
import {FONT_FAMILY} from '../../util/constant';
import RBSheet from 'react-native-raw-bottom-sheet';
import CrossIcon from '../../assets/svg/CrossIcon';
import TransactionHistory from '../../assets/svg/TransactionHistory';
import SettingIcon from '../../assets/svg/SettingIcon';
import DownIcon from '../../assets/svg/DownIcon';
import UpIcon from '../../assets/svg/UpIcon';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CheckBoxes from './CheckBox';
import DatePickerComp from './DatePicker';
import {useSelector} from 'react-redux';
import * as api from '../../util/api';
import moment from 'moment';
import { Toast } from 'react-native-toast-notifications';

const Transaction = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState('member');
  const sheetRef = React.useRef(null);
  const sheetRef1 = React.useRef(null);
  const [ActiveAnswer, setActiveAnswer] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [FirstBoxPosition, setFirstBoxPosition] = useState('');
  const userData = useSelector(state => state.auth.userData);
  const [data, setData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [renderData, setRenderData] = useState({});

  const [clearAllKey, setClearAllKey] = useState(false);
  const [checkedBox, setCheckedBox] = useState(-1);
  const [checkedBoxLocation, setCheckedBoxLocation] = useState(-1);
  const [resetDate, setResetDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [locationList, setLocationList] = useState(
    userData?.data?.data[0]?.location?.length
      ? userData?.data?.data[0]?.location
      : '',
  );
  function validateDateSelection(startDate, endDate) {
    if (!areDatesSelected(startDate, endDate)) {
      return 'Please select both start and end date';
    } else if (isStartDateGreaterThanEndDate(startDate, endDate)) {
      return 'Start date cannot be greater than end date';
    } else if (isEndDateLessThanStartDate(startDate, endDate)) {
      return 'End date cannot be less than start date';
    } else {
      return ''; // No error
    }
  }

  const callAPI = async (startDate, endDate, location, isFilter) => {
    setLoading(true);

    let body = {};
    let path = {};
    if (isFilter && show === 'Credit') {
      path.ws_type = ENDPOINT.invoice_transaction_filter;
      body.start_date = startDate;
      body.end_date = endDate;
      body.member_id = userData.data.data[0].MemberID;
    } else if (isFilter) {
      body.locations = location;
      body.pay_mode = show === 'member' ? 'SmartCard' : 'CREDIT';
      body.start_date = startDate;
      body.end_date = endDate;
      body.member_id = userData.data.data[0].MemberID;
      path.ws_type = ENDPOINT.transaction_filter;
    } else if (show === 'Credit') {
      path.ws_type = ENDPOINT.invoice;
      body.member_id = userData.data.data[0].MemberID;
    } else {
      path.ws_type = ENDPOINT.transaction;
      body.pay_mode = show === 'member' ? 'SmartCard' : 'CREDIT';
      body.member_id = userData.data.data[0].MemberID;
    }

    try {
      const apiRequestObject = {
        path: path.ws_type,
        body: body,
        Token: userData.data.token,
      };

      const response = await api.javascriptPost(apiRequestObject);

      setData(response.data);
      setCardData(response);
      if (!isFilter) {
        setTotalPrice(response.data[0].Balance);
      }
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      return {result: FAILURE};
    }
  };

  useEffect(() => {
    callAPI('', '', '', false);
  }, [show]);

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
    sheetRef1.current.close();
  }

  const CreditAmt = cardData?.data?.length
    ? parseFloat(
        cardData?.data
          ?.reduce((acc, record) => {
            return acc + parseFloat(record.credit_amt);
          }, 0)
          .toFixed(2),
      )
    : '0.00';

  const DebitAmt = cardData?.data?.length
    ? parseFloat(
        cardData?.data
          .reduce((acc, record) => {
            return acc + parseFloat(record.debit_amt);
          }, 0)
          .toFixed(2),
      )
    : '0.00';

  function TransactionCard(item, index) {
    return (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            if (show !== 'Credit') {
              setRenderData(item);
              sheetRef.current.open();
            }
          }}
          activeOpacity={0.5}
          style={{
            height: show !== 'wallet' ? height / 7 : height / 10,
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
              <View style={{justifyContent: 'center'}}>
                {item?.LocationName ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text style={styles.locationName}>
                        {item?.LocationName?.length > 10
                          ? `${item?.LocationName?.substring(0, 15)}...`
                          : item?.LocationName}
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
                        {item?.particulars}
                        {/* {item?.particulars?.length > 10 ? `${item?.particulars?.substring(0, 15)}...` : item?.particulars} */}
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {item?.voucher_no ? (
                    <View style={styles.textContnetStyle}>
                      <Text style={{fontSize: 14, color: 'black'}}>
                        Vch No. : {item.voucher_no}
                      </Text>
                    </View>
                  ) : (
                    ''
                  )}
                  {item?.voucher_date && (
                    <View>
                      <Text style={styles.textContnetStyle}>
                        {moment(item?.voucher_date).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                  )}
                </View>
                {item?.Amount ? (
                  <View style={styles.amountText}>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          color: item?.Amount < 0 ? 'red' : '#79ca14',
                        }}>
                        ₹{Math.abs(item?.Amount)}{' '}
                        {item?.Amount < 0 ? 'Dr' : 'Cr'}
                      </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 18, color: 'black'}}>
                        Balance: ₹{item.Balance}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.amountText}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#79ca14',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        ₹{item?.credit_amt} Cr
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'red',
                        }}>
                        ₹{item?.debit_amt} Dr
                      </Text>
                    </View>
                  </View>
                )}

                {item?.narrations && (
                  <View style={styles.textContnetStyle}>
                    <Text style={{fontSize: 14, color: 'black'}}>
                      {item?.narrations}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* Conditional rendering for arrow image */}
            {show !== 'Credit' ? (
              <View style={{marginRight: 20}}>
                <Image
                  source={require('../../assets/images/next.png')}
                  style={{height: 30, width: 20}}
                />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function NoDataCard() {
    return (
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: 15,
          justifyContent: 'center',
          height: height / 7,
          width: width - 30,
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
          No data found
        </Text>
      </View>
    );
  }

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
          <Text style={{fontSize: moderateScale(18), fontWeight: 'bold'}}>
            Transaction Details
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => sheetRef.current.close()}
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
        <View style={{width: width / 1.7}}>
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

        <View style={{width: width / 2.5}}>
          <Text style={styles.headerStyle}>Bill Date</Text>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: moderateScale(16),
            }}>
            {moment(renderData?.BillDate).format('DD-MM-YYYY')}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>
        <View style={{width: width / 1.7}}>
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

        {renderData?.Amount ? (
          <View style={{width: width / 2.5}}>
            <Text style={styles.headerStyle}>Amount</Text>
            <Text
              style={{
                color: renderData.Amount < 0 ? 'red' : '#79CA14',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              ₹{Math.abs(renderData.Amount ? renderData.Amount : '0.00')}
            </Text>
          </View>
        ) : (
          <View style={{width: width / 2.5}}>
            <Text style={styles.headerStyle}>Amount</Text>
            <Text
              style={{
                fontSize: 15,
                color:
                  parseFloat(renderData?.debit_amt) > 0 ? 'red' : '#79CA14',
              }}>
              {parseFloat(renderData?.debit_amt) > 0 ? 'Dr' : 'Cr'} Rs{' '}
              {parseFloat(renderData?.debit_amt) > 0
                ? renderData?.debit_amt
                : renderData?.credit_amt}
            </Text>
          </View>
        )}
      </View>

      {renderData?.particulars ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 20,
          }}>
          <View style={{width: width / 1.7}}>
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
      ) : (
        ''
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>
        {renderData.PayMode ? (
          <View style={{width: width / 1.7}}>
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
          <View style={{width: width / 1.7}}>
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
          <View style={{width: width / 2.5}}>
            <Text style={styles.headerStyle}>Balance</Text>
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: moderateScale(16),
              }}>
              ₹{renderData?.Balance ? renderData?.Balance : '0.00'}
            </Text>
          </View>
        ) : (
          ''
        )}
      </View>
    </View>
  );

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

    if (show === 'Credit') {
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
            <Text style={{fontSize: moderateScale(18), fontWeight: 'bold'}}>
              Filters
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              sheetRef1.current.close();
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

        <ScrollView style={{flex: 1}}>
          {arr.map((item, index) =>
            // (payCheckState == undefined || payCheckState == null) &&
            item.title == 'By Payment Mode' ? null : (
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
                  height: ActiveAnswer === index ? 350 : 60,
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
                      item?.content?.map((items, indexes) => {
                        return (
                          <View style={{paddingVertical: 20}}>
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
                  ) : item.type == 'Input' && ActiveAnswer === index ? (
                    <View>
                      <View style={{}}>
                        <Text
                          style={[styles.headerStyle, {marginVertical: 10}]}>
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
                          style={[styles.headerStyle, {marginVertical: 10}]}>
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

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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

  function toggleFirstBox() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFirstBoxPosition(FirstBoxPosition === 'left' ? 'right' : 'left');
  }

  return (
    <>
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

        <Text style={styles.header}>Transaction History</Text>

        <View style={styles.rowView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShow('member')}
            style={
              show === 'member'
                ? {...styles.topView, backgroundColor: '#F5FFE9'}
                : styles.topView
            }>
            <Text
              style={show === 'member' ? styles.boldText : styles.simpleText}>
              Card A/c
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShow('Credit')}
            style={
              show === 'Credit'
                ? {...styles.topView, backgroundColor: '#F5FFE9'}
                : styles.topView
            }>
            <Text
              style={show === 'Credit' ? styles.boldText : styles.simpleText}>
              Subscription A/c
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          <View
            style={{
              width: width - 30,
              backgroundColor: '#F5FFE9',
              borderRadius: 20,
              justifyContent: 'space-between',
              padding: 10,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: FONT_FAMILY.Cinzel,
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                  numberOfLines={2}>
                  {userData?.data?.data[0]?.DisplayName
                    ? userData?.data?.data[0]?.DisplayName
                    : 'N/A'}
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(15),
                    fontFamily: FONT_FAMILY.Cinzel,
                    color: 'black',
                  }}
                  numberOfLines={2}>
                  Member ID:{' '}
                  {userData?.data?.data[0]?.MemberID
                    ? userData?.data?.data[0]?.MemberID
                    : 'N/A'}
                </Text>
              </View>
              <View style={{marginRight: 30}}>
                <TransactionHistory />
              </View>
            </View>

            {show === 'Credit' && (
              <View style={{}}>
                <Text style={styles.prepaidText}>A/c Summary </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 0.5, flexShrink: 0, flexWrap: 'nowrap'}}>
                    <Text style={styles.postpaidBalanceText}>
                      Opening Balance
                    </Text>
                    <Text style={styles.moneyText}>
                      ₹
                      {cardData?.opening_balance
                        ? cardData?.opening_balance
                        : '0.00'}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.equalFlex,
                      flexShrink: 0,
                      flexWrap: 'nowrap',
                    }}>
                    <Text style={styles.postpaidBalanceText}>
                      Closing Balance
                    </Text>
                    <Text style={styles.moneyText}>
                      ₹
                      {cardData?.closing_balance
                        ? cardData?.closing_balance
                        : '0.00'}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text style={styles.postpaidBalanceText}>Total Credit</Text>
                    <Text style={styles.moneyText}>
                      ₹{CreditAmt ? Number(CreditAmt).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                  <View
                    style={{
                      ...styles.equalFlex,
                      flexShrink: 0,
                      flexWrap: 'nowrap',
                    }}>
                    <Text style={styles.postpaidBalanceText}>Total Debit</Text>
                    <Text style={styles.moneyText}>
                      ₹{DebitAmt ? Number(DebitAmt).toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.transactionListHeaderStyle}>
          <View>
            <Text style={styles.transactionListHeaderText}>
              Transaction List
            </Text>
          </View>
          {data?.length > 0 && (show == 'member' || show == 'Credit') ? (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DownloadStatement', {data: show})
                }
                style={{justifyContent: 'center', marginRight: 20}}>
                <Image
                  style={{height: 20, width: 20}}
                  source={require('../../assets/images/download.png')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  sheetRef1.current.open();
                  setActiveAnswer('');
                }}>
                <SettingIcon />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={({item, index}) => TransactionCard(item, index)}
        ListEmptyComponent={<NoDataCard />}
        keyExtractor={(item, index) => index.toString()}
      />

      <RBSheet
        ref={sheetRef}
        height={Dimensions.get('window').height * 0.6}
        customStyles={{
          container: {
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
        {renderContent()}
      </RBSheet>

      <RBSheet
        ref={sheetRef1}
        height={Dimensions.get('window').height * 0.9}
        customStyles={{
          container: {borderTopRightRadius: 30, borderTopLeftRadius: 30},
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
        {renderFilterContent()}
      </RBSheet>

      {loading && (
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
              animating={loading}
            />
          </View>
        </View>
      )}
    </>
  );
};

const {height, width} = Dimensions.get('window');
var styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : getStatusBarHeight() + 30,
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
    color: 'black',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: 'black',
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
    color: 'black',
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
    color: 'black',
  },
  textContnetStyle: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    color: 'black',
    // width: width / 1.2,
  },
  amountText: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.2,
    color: 'black',
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
    color: 'black',
  },
  boldText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'black',
  },

  prepaidText: {
    fontSize: 19,
    fontWeight: '700',
    color: 'black',
    fontFamily: FONT_FAMILY.bold,
  },

  moneyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#79ca14',
    marginTop: 3,
    fontFamily: FONT_FAMILY.Muli,
  },
  equalFlex: {
    flex: 0.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  postpaidBalanceText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 5,
    fontFamily: FONT_FAMILY.Muli,
    color: 'black',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: FONT_FAMILY.Muli,
  },
});

export default Transaction;

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, ScrollView, LayoutAnimation, ActivityIndicator, TextInput, FlatList, StatusBar, TouchableOpacity, Alert, Platform } from 'react-native';
// import { PINK_COLOR, SECONDARY_COLOR } from '../../util/colors';
// import { ENDPOINT } from '../../util/constant';
// import { moderateScale } from '../../util/scale';
// import { FONT_FAMILY } from '../../util/constant';
// import RBSheet from 'react-native-raw-bottom-sheet';
// import CrossIcon from '../../assets/svg/CrossIcon';
// import TransactionHistory from '../../assets/svg/TransactionHistory';
// import SettingIcon from '../../assets/svg/SettingIcon';
// import DownIcon from '../../assets/svg/DownIcon';
// import UpIcon from '../../assets/svg/UpIcon';
// import { getStatusBarHeight } from 'react-native-status-bar-height';
// import CheckBoxes from './CheckBox';
// import DatePickerComp from './DatePicker';
// import { useSelector } from 'react-redux';
// import * as api from '../../util/api';
// import moment from 'moment';

// const Transaction = ({ navigation }) => {
//     const [loading, setLoading] = useState(false);
//     const [show, setShow] = useState('member');
//     const sheetRef = React.useRef(null);
//     const sheetRef1 = React.useRef(null);
//     const [ActiveAnswer, setActiveAnswer] = useState(-1);
//     const [date, setDate] = useState(new Date())
//     const [open, setOpen] = useState(false)
//     const [FirstBoxPosition, setFirstBoxPosition] = useState('');
//     const userData = useSelector((state) => state.auth.userData)
//     const [data, setData] = useState(null);
//     const [cardData, setCardData] = useState(null);
//     const [totalPrice, setTotalPrice] = useState(null);
//     const [renderData, setRenderData] = useState({});

//     const [clearAllKey, setClearAllKey] = useState(false);
//     const [checkedBox, setCheckedBox] = useState(-1);
//     const [checkedBoxLocation, setCheckedBoxLocation] = useState(-1);
//     const [resetDate, setResetDate] = useState(false);
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');

//     const [locationList, setLocationList] = useState(
//        "mloo"
//     );
//     function validateDateSelection(startDate, endDate) {
//         if (!areDatesSelected(startDate, endDate)) {
//             return "Please select both start and end date";
//         } else if (isStartDateGreaterThanEndDate(startDate, endDate)) {
//             return "Start date cannot be greater than end date";
//         } else if (isEndDateLessThanStartDate(startDate, endDate)) {
//             return "End date cannot be less than start date";
//         } else {
//             return ""; // No error
//         }
//     }

//     const callAPI = async (startDate, endDate, location, isFilter) => {

//         setLoading(true);

//         let body = {};
//         if (isFilter && show === "Credit") {

//             body.ws_type = ENDPOINT.invoice_transaction_filter;
//             body.start_date = startDate;
//             body.end_date = endDate;
//             body.member_id = userData.data.data[0].MemberID;
//         }
//         else if (isFilter) {

//             body.locations = location;
//             body.pay_mode = show === 'member' ? 'CARD' : 'CREDIT';
//             body.start_date = startDate;
//             body.end_date = endDate;
//             body.member_id = userData.data.data[0].MemberID;
//         } else if (show === "Credit") {
//             body.ws_type = ENDPOINT.invoice;
//             body.member_id = userData.data.data[0].MemberID;
//         } else {
//             body.ws_type = ENDPOINT.transaction;
//             body.pay_mode = show === 'member' ? 'CARD' : 'CREDIT';
//             body.member_id = userData.data.data[0].MemberID;
//         }

//         try {
//             const apiRequestObject = {
//                 path: body.ws_type,
//                 body: body,
//                 Token:userData.data.token
//             };
//             const response = await api.javascriptPost(apiRequestObject);
//         console.log(response, "---------------response---------------");
//             setData(response.data);
//             setCardData(response);
//             if (!isFilter) {
//                 setTotalPrice(response.data[0].Balance);
//             }
//             setLoading(false);
//             return response;

//         } catch (err) {
//             setLoading(false);
//             return { result: FAILURE };
//         }

//     };

//     useEffect(() => {
//         callAPI('', '', '', false);
//     }, [show]);

//     function clearAll() {
//         setClearAllKey(true);
//         setCheckedBox(-1);
//         setCheckedBoxLocation(-1);
//         setResetDate(true);
//         setStartDate('');
//         setEndDate('');
//         setTimeout(() => {
//             setResetDate(false);
//         }, 1000);
//     }
//     function applyFilter() {
//         if (
//             checkedBox == -1 &&
//             checkedBoxLocation == -1 &&
//             startDate == '' &&
//             endDate == '' &&
//             !clearAllKey
//         ) {
//             Alert.alert('Please select atleast one filter');
//             return;
//         }
//         if (checkedBox == -1 && checkedBoxLocation == -1) {
//             var payMode = [];
//             var location = [];
//         } else {
//             if (checkedBoxLocation != -1) {
//                 var location = locationList[checkedBoxLocation].split(',');
//             } else {
//                 // var location = locationList;
//                 var location = [];
//             }
//             if (checkedBox != -1) {
//                 var payMode = payCheckState[checkedBox].split(',');
//             } else {
//                 // var payMode = payCheckState;
//                 var payMode = [];
//             }
//         }
//         if (clearAllKey) {
//             callAPI('', '', '', '', false);
//         } else {
//             callAPI(startDate, endDate, location, payMode, true);
//         }

//         clearAll();
//         setClearAllKey(false);
//         sheetRef1.current.close()
//     }

// const CreditAmt=cardData?.data?.reduce((acc, record) => {
//     return acc + parseFloat(record.credit_amt);
//   }, 0)
// const DebitAmt=cardData?.data?.reduce((acc, record) => {
//     return acc + parseFloat(record.debit_amt);
//   }, 0)
//     function TransactionCard(item, index) {
//         return (
//             <View style={{ alignItems: 'center' }}>
//                 <TouchableOpacity
//                     onPress={() => {
//                         if (show !== 'Credit') {
//                             setRenderData(item);
//                             sheetRef.current.open()
//                         }
//                     }}
//                     activeOpacity={0.5}
//                     style={{
//                         height: show !== 'wallet' ? height / 7 : height / 10,
//                         width: width - 30,
//                         backgroundColor: 'white',
//                         marginVertical: 8,
//                         borderRadius: 10,
//                         justifyContent: 'center',
//                     }}>
//                     <View style={styles.cardView}>
//                         <View
//                             style={{
//                                 justifyContent: 'center',
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                             }}>
//                             <View style={{ justifyContent: 'center' }}>

//                                 {item?.LocationName ? (
//                                     <View
//                                         style={{
//                                             flexDirection: 'row',
//                                             justifyContent: 'space-between',
//                                         }}>
//                                         <View>
//                                             <Text style={styles.locationName}>
//                                                 {item?.LocationName?.length > 10 ? `${item?.LocationName?.substring(0, 15)}...` : item?.LocationName}
//                                             </Text>
//                                         </View>
//                                         <View>
//                                             <Text style={styles.locationName}>
//                                                 {moment(item.BillDate).format('DD-MM-YYYY')}
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 ) : (
//                                     <View
//                                         style={{
//                                             flexDirection: 'row',
//                                             justifyContent: 'space-between',
//                                         }}>
//                                         <View>
//                                             <Text style={styles.locationName}>
//                                                 {item?.particulars}
//                                                 {/* {item?.particulars?.length > 10 ? `${item?.particulars?.substring(0, 15)}...` : item?.particulars} */}
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 )}

//                                 <View
//                                     style={{
//                                         flexDirection: 'row',
//                                         justifyContent: 'space-between',
//                                     }}>
//                                     {item?.voucher_no ? (
//                                         <View style={styles.textContnetStyle}>
//                                             <Text style={{ fontSize: 14, color: 'black', }}>
//                                                 Vch No. : {item.voucher_no}
//                                             </Text>
//                                         </View>
//                                     ) : ""}
//                                     {item?.voucher_date && (
//                                         <View>
//                                             <Text style={styles.textContnetStyle}>
//                                                 {moment(item?.voucher_date).format('DD-MM-YYYY')}
//                                             </Text>
//                                         </View>
//                                     )
//                                     }
//                                 </View>

//                                 {item?.Amount ? (
//                                     <View style={styles.amountText}>
//                                         <View>
//                                             <Text
//                                                 style={{
//                                                     fontSize: 16,
//                                                     color: item?.Amount < 0 ? 'red' : '#79ca14',
//                                                 }}>
//                                                 ₹{Math.abs(item?.Amount)} {item?.Amount < 0 ? 'Dr' : 'Cr'}
//                                             </Text>
//                                         </View>
//                                         <View>
//                                             <Text style={{ fontSize: 18, color: 'black' }}>
//                                                 Balance: {item.Balance}
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 ) : (
//                                     <View style={styles.amountText}>
//                                         <View>
//                                             <Text
//                                                 style={{
//                                                     fontSize: 14,
//                                                     color: '#79ca14',
//                                                     flexDirection: 'row',
//                                                     justifyContent: 'space-between',

//                                                 }}
//                                             >
//                                                 ₹{item?.credit_amt} Cr
//                                             </Text>
//                                         </View>
//                                         <View>
//                                             <Text
//                                                 style={{
//                                                     fontSize: 14,
//                                                     color: 'red',
//                                                 }}>
//                                                 ₹{item?.debit_amt} Dr
//                                             </Text>
//                                         </View>

//                                     </View>
//                                 )}

//                                 {item?.narrations && (
//                                     <View

//                                         style={styles.textContnetStyle}
//                                     >
//                                         <Text style={{ fontSize: 14, color: 'black', }}>
//                                             {item?.narrations}
//                                         </Text>
//                                     </View>
//                                 )}
//                             </View>
//                         </View>
//                         {/* Conditional rendering for arrow image */}
//                         {show !== 'Credit' ? (
//                             <View>
//                                 <Image
//                                     source={require('../../assets/images/next.png')}
//                                     style={{ height: 30, width: 30 }}
//                                 />
//                             </View>
//                         ) : null}
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     function NoDataCard() {
//         return (
//             <View style={{ alignItems: 'center', marginHorizontal: 15, justifyContent: 'center', height: height / 7, width: width - 30, backgroundColor: 'white', borderRadius: 10, }}>
//                 <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>No data found</Text>
//             </View>
//         );
//     }

//     const renderContent = () => (
//         <View
//             style={{
//                 backgroundColor: 'white',
//                 paddingHorizontal: 20,
//                 paddingVertical: 20,
//                 height: '100%',
//                 borderTopEndRadius: 30,
//                 borderTopLeftRadius: 30,
//             }}>
//             <View
//                 style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingVertical: 10,
//                     marginBottom: 20,
//                 }}>
//                 <View>
//                     <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold' }}>
//                         Transaction Details
//                     </Text>
//                 </View>
//                 <TouchableOpacity
//                     onPress={() => sheetRef.current.close()}
//                     activeOpacity={0.5}
//                     style={{
//                         height: 30,
//                         width: 30,
//                         borderRadius: 15,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                     }}>
//                     <CrossIcon />
//                 </TouchableOpacity>
//             </View>
//             <View
//                 style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingBottom: 20,
//                 }}>
//                 <View style={{ width: width / 1.7 }}>
//                     <Text style={styles.headerStyle}>Bill Number</Text>
//                     <Text
//                         style={{
//                             color: 'black',
//                             fontWeight: 'bold',
//                             fontSize: moderateScale(16),
//                         }}>
//                         {renderData?.BillNo}
//                     </Text>
//                 </View>

//                 <View style={{ width: width / 2.5 }}>
//                     <Text style={styles.headerStyle}>Bill Date</Text>
//                     <Text
//                         style={{
//                             color: 'black',
//                             fontWeight: 'bold',
//                             fontSize: moderateScale(16),
//                         }}>
//                         {moment(renderData?.BillDate).format('DD-MM-YYYY')}
//                     </Text>
//                 </View>
//             </View>

//             <View
//                 style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingBottom: 20,
//                 }}>

//                 <View style={{ width: width / 1.7 }}>
//                     <Text style={styles.headerStyle}>Location Name</Text>
//                     <Text
//                         style={{
//                             color: 'black',
//                             fontWeight: 'bold',
//                             fontSize: moderateScale(16),
//                         }}>
//                         {renderData?.LocationName}
//                     </Text>
//                 </View>

//                 {renderData?.Amount ? (
//                     <View style={{ width: width / 2.5 }}>
//                         <Text style={styles.headerStyle}>Amount</Text>
//                         <Text
//                             style={{
//                                 color: renderData.Amount < 0 ? 'red' : '#79CA14',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(16),
//                             }}>
//                             {Math.abs(renderData.Amount)}
//                         </Text>
//                     </View>
//                 ) : (
//                     <View style={{ width: width / 2.5 }}>
//                         <Text style={styles.headerStyle}>Amount</Text>
//                         <Text
//                             style={{
//                                 fontSize: 15,
//                                 color: parseFloat(renderData?.debit_amt) > 0 ? 'red' : '#79CA14',
//                             }}>
//                             {parseFloat(renderData?.debit_amt) > 0 ? 'Dr' : 'Cr'} Rs {parseFloat(renderData?.debit_amt) > 0 ? renderData?.debit_amt : renderData?.credit_amt}
//                         </Text>
//                     </View>
//                 )}
//             </View>

//             {renderData?.particulars ?
//                 (<View
//                     style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         paddingBottom: 20,
//                     }}>
//                     <View style={{ width: width / 1.7 }}>
//                         {/* <Text style={styles.headerStyle}>Balance</Text>
//                     <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateScale(16) }}>{renderData.Balance}</Text> */}
//                         <Text style={styles.headerStyle}>Particulars</Text>
//                         <Text
//                             style={{
//                                 color: 'black',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(14),
//                             }}>
//                             {renderData?.particulars}
//                         </Text>
//                     </View>
//                 </View>
//                 ) : ("")}

//             <View
//                 style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     paddingBottom: 20,
//                 }}>

//                 {renderData.PayMode ? (
//                     <View style={{ width: width / 1.7 }}>
//                         <Text style={styles.headerStyle}>Pay Mode</Text>
//                         <Text
//                             style={{
//                                 color: 'black',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(16),
//                             }}>
//                             {renderData.PayMode}
//                         </Text>
//                     </View>
//                 ) : (
//                     <View style={{ width: width / 1.7 }}>
//                         <Text style={styles.headerStyle}>Narration</Text>
//                         <Text
//                             style={{
//                                 color: 'black',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(14),
//                             }}>
//                             {renderData.narrations}
//                         </Text>
//                     </View>
//                 )}
//                 {renderData?.Balance ? (
//                     <View style={{ width: width / 2.5 }}>
//                         <Text style={styles.headerStyle}>Balance</Text>
//                         <Text
//                             style={{
//                                 color: 'black',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(16),
//                             }}>
//                             {renderData?.Balance}
//                         </Text>
//                     </View>
//                 ) : ("")}
//             </View>
//         </View>
//     );

//     const renderFilterContent = () => {
//         var arr = [
//             {
//                 title: 'Location',
//                 type: 'checkboxes',
//                 updatedContent: 1,
//                 content: locationList,
//             },
//             {
//                 title: 'Date Range',
//                 type: 'Input',
//                 content: [
//                     {
//                         title: 'Start Date',
//                         id: 1,
//                         placeholder: 'Please select start date',
//                     },
//                     {
//                         title: 'End Date',
//                         id: 2,
//                         placeholder: 'Please select end date',
//                     },
//                 ],
//             },
//         ];

//         if (show === "Credit") {
//             arr = arr.filter(item => item.title !== 'Location');
//         }

//         return (
//             <View
//                 style={{
//                     height: height / 1.2,
//                     backgroundColor: 'white',
//                     borderTopRightRadius: 30,
//                     borderTopLeftRadius: 30,
//                     paddingHorizontal: 20,
//                     paddingVertical: 20,
//                 }}>
//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         paddingVertical: 10,
//                         marginBottom: 20,
//                     }}>
//                     <View>
//                         <Text style={{ fontSize: moderateScale(18), fontWeight: 'bold' }}>
//                             Filters
//                         </Text>
//                     </View>
//                     <TouchableOpacity
//                         onPress={() => {
//                             sheetRef1.current.close();

//                         }}
//                         activeOpacity={0.5}
//                         style={{
//                             height: 30,
//                             width: 30,
//                             borderRadius: 15,
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}>
//                         <CrossIcon />
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView style={{ flex: 1 }}>
//                     {arr.map((item, index) =>
//                         // (payCheckState == undefined || payCheckState == null) &&
//                         item.title == 'By Payment Mode'  || !item.content  ? null :
//                             (
//                                 <TouchableOpacity
//                                     onPress={() => {
//                                         toggleFirstBox();
//                                         if (ActiveAnswer === index) {
//                                             setActiveAnswer('');
//                                         } else {
//                                             setActiveAnswer(index);
//                                         }
//                                     }}
//                                     activeOpacity={0.5}
//                                     style={{
//                                         width: width - 45,
//                                         height: ActiveAnswer === index ? 300 : 60,
//                                         backgroundColor: 'white',
//                                         marginVertical: 10,
//                                         elevation: 5,
//                                         borderRadius: 10,
//                                         paddingHorizontal: 10,
//                                         alignSelf: 'center',
//                                     }}>
//                                     <View
//                                         style={{
//                                             flexDirection: 'row',
//                                             justifyContent: 'space-between',
//                                             marginVertical: 20,
//                                         }}>
//                                         <Text
//                                             style={{
//                                                 color: 'black',
//                                                 fontWeight: 'bold',
//                                                 fontSize: moderateScale(16),
//                                             }}>
//                                             {item.title}
//                                         </Text>
//                                         {ActiveAnswer === index ? (
//                                             <View style={{}}>
//                                                 <UpIcon />
//                                             </View>
//                                         ) : (
//                                             <View style={{}}>
//                                                 <DownIcon />
//                                             </View>
//                                         )}
//                                     </View>

//                                     {ActiveAnswer === index && (
//                                         <View
//                                             style={{
//                                                 borderBottomColor: '#dedede',
//                                                 borderBottomWidth: 1,
//                                             }}
//                                         />
//                                     )}
//                                     <View>
//                                         {ActiveAnswer === index && item.type == 'checkboxes' ? (
//                                             item.updatedContent == 1 ? (
//                                                 item.content.map((items, indexes) => {
//                                                     return (
//                                                         <View style={{ paddingVertical: 20 }}>
//                                                             <TouchableOpacity
//                                                                 onPress={() => {
//                                                                     item.title == 'Location'
//                                                                         ? setCheckedBoxLocation(indexes)
//                                                                         : setCheckedBox(indexes);
//                                                                 }}
//                                                                 style={{
//                                                                     height: 40,
//                                                                     width: width - 75,
//                                                                     flexDirection: 'row',
//                                                                     justifyContent: 'space-between',
//                                                                     paddingHorizontal: 5,
//                                                                 }}>
//                                                                 <Text
//                                                                     style={{
//                                                                         color: 'black',
//                                                                         fontSize: moderateScale(16),
//                                                                     }}>
//                                                                     {items}
//                                                                 </Text>
//                                                                 <View>
//                                                                     {item.title == 'Location' ? (
//                                                                         <CheckBoxes
//                                                                             setCheckedBox={setCheckedBoxLocation}
//                                                                             checkedBox={checkedBoxLocation}
//                                                                             index={indexes}
//                                                                         />
//                                                                     ) : (
//                                                                         <CheckBoxes
//                                                                             setCheckedBox={setCheckedBox}
//                                                                             checkedBox={checkedBox}
//                                                                             index={indexes}
//                                                                         />
//                                                                     )}
//                                                                 </View>
//                                                             </TouchableOpacity>
//                                                         </View>
//                                                     );
//                                                 })
//                                             ) : (
//                                                 item.content.map((items, indexes) => {
//                                                     return (
//                                                         <View
//                                                             style={{
//                                                                 paddingVertical: 25,
//                                                                 flexDirection: 'row',
//                                                                 justifyContent: 'space-between',
//                                                                 paddingHorizontal: 5,
//                                                             }}>
//                                                             <View>
//                                                                 <Text
//                                                                     style={{
//                                                                         color: 'black',
//                                                                         fontSize: moderateScale(16),
//                                                                     }}>
//                                                                     {items.title}
//                                                                 </Text>
//                                                             </View>
//                                                             <View>
//                                                                 {item.title == 'Location' ? (
//                                                                     <CheckBoxes
//                                                                         setCheckedBox={setCheckedBoxLocation}
//                                                                         checkedBox={checkedBoxLocation}
//                                                                         index={indexes}
//                                                                     />
//                                                                 ) : (
//                                                                     <CheckBoxes
//                                                                         setCheckedBox={setCheckedBox}
//                                                                         checkedBox={checkedBox}
//                                                                         index={indexes}
//                                                                     />
//                                                                 )}
//                                                             </View>
//                                                         </View>
//                                                     );
//                                                 })
//                                             )
//                                         ) : item.type == 'Input' ? (
//                                             <View>
//                                                 <View style={{}}>
//                                                     <Text
//                                                         style={[styles.headerStyle, { marginVertical: 10 }]}>
//                                                         {item.content[0].title}
//                                                     </Text>
//                                                     <DatePickerComp
//                                                         placeholder={item.content[0].placeholder}
//                                                         setResetDate={resetDate}
//                                                         stateDate={setStartDate}
//                                                     />
//                                                 </View>
//                                                 <View style={{}}>
//                                                     <Text
//                                                         style={[styles.headerStyle, { marginVertical: 10 }]}>
//                                                         {item.content[1].title}
//                                                     </Text>
//                                                     <DatePickerComp
//                                                         placeholder={item.content[1].placeholder}
//                                                         setResetDate={resetDate}
//                                                         stateDate={setEndDate}
//                                                     />
//                                                 </View>
//                                             </View>
//                                         ) : null}
//                                     </View>
//                                 </TouchableOpacity>
//                             ),
//                     )}
//                 </ScrollView>

//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <TouchableOpacity
//                         onPress={clearAll}
//                         activeOpacity={0.5}
//                         style={{
//                             height: 50,
//                             backgroundColor: '#f5ffe9',
//                             width: 145,
//                             borderRadius: 8,
//                             borderColor: '#79ca14',
//                             borderWidth: 1,
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}>
//                         <Text
//                             style={{
//                                 color: 'black',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(14),
//                             }}>
//                             Clear All
//                         </Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         onPress={applyFilter}
//                         activeOpacity={0.5}
//                         style={{
//                             height: 50,
//                             backgroundColor: '#79ca14',
//                             width: 145,
//                             borderRadius: 8,
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}>
//                         <Text
//                             style={{
//                                 color: 'white',
//                                 fontWeight: 'bold',
//                                 fontSize: moderateScale(14),
//                             }}>
//                             Apply
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         );
//     };

//     function toggleFirstBox() {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//         setFirstBoxPosition(FirstBoxPosition === 'left' ? 'right' : 'left');
//     }

//     return (
//         <>
//             <View style={{ flex: 1 }}>
//                 <StatusBar
//                     backgroundColor={'transparent'}
//                     translucent={true}
//                     barStyle="dark-content"
//                 />

//                 <View style={{ flex: 1 }}>
//                     <View style={styles.container}>
//                         <View style={{
//                             flexDirection: 'row',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             width: '100%'
//                         }}>
//                             <Image
//                                 source={require('../../assets/images/AeptaLogo.png')}
//                                 style={{ height: 30, width: 30, borderRadius: 15 }}
//                             />
//                             <Text style={{ color: 'black', fontSize: 20, marginBottom: 5, marginLeft: 5 }}>MB Club</Text>

//                         </View>

//                         <Text style={styles.header}>Transaction History</Text>

//                         <View
//                             style={{
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 marginTop: 15,
//                             }}>
//                             <View
//                                 style={{
//                                     width: width - 30,
//                                     backgroundColor: '#F5FFE9',
//                                     borderRadius: 20,
//                                     justifyContent: 'space-between',
//                                     padding: 25,
//                                     paddingVertical: 20,
//                                 }}>
//                                 <View
//                                     style={{
//                                         flexDirection: 'row',
//                                         alignItems: 'center',
//                                         justifyContent: 'space-between',
//                                     }}>

//                                     <View style={{ width: width / 2.2, marginTop: -25 }}>
//                                         <Text
//                                             style={{
//                                                 fontSize: moderateScale(16),
//                                                 fontFamily: FONT_FAMILY.Cinzel,
//                                                 fontWeight: 'bold',
//                                                 color: 'black'
//                                             }}
//                                             numberOfLines={2}>
//                                             {userData?.data?.data[0]?.DisplayName ? userData?.data?.data[0]?.DisplayName : 'N/A'}
//                                         </Text>
//                                         <Text
//                                             style={{
//                                                 fontSize: moderateScale(15),
//                                                 fontFamily: FONT_FAMILY.Cinzel,
//                                                 color: 'black'
//                                             }}
//                                             numberOfLines={2}>
//                                             Member ID: {userData?.data?.data[0]?.MemberID ? userData?.data?.data[0]?.MemberID : 'N/A'}
//                                         </Text>
//                                     </View>

//                                     {/* TransactionHistory component or icon */}
//                                     <TransactionHistory style={{ marginRight: 5, scale: 0.9 }} />
//                                 </View>

//                                 {/* Conditional rendering based on 'show' variable */}
//                                 {show === "Credit" && (
//                                     <View style={{ marginTop: -25 }}>
//                                         <Text style={styles.prepaidText}>
//                                             A/c Summary{' '}
//                                         </Text>
//                                         <View
//                                             style={{
//                                                 flexDirection: 'row',
//                                                 alignItems: 'center',
//                                             }}>
//                                             <View style={{ flex: 0.5, flexShrink: 0, flexWrap: 'nowrap' }}>
//                                                 <Text style={styles.postpaidBalanceText}>Opening Balance</Text>
//                                                 <Text style={styles.moneyText}>{cardData?.opening_balance}</Text>
//                                             </View>
//                                             <View style={{ ...styles.equalFlex, flexShrink: 0, flexWrap: 'nowrap' }}>
//                                                 <Text style={styles.postpaidBalanceText}>Closing Balance</Text>
//                                                 <Text style={styles.moneyText}>{cardData?.closing_balance}</Text>
//                                             </View>
//                                         </View>
//                                         <View
//                                             style={{
//                                                 flexDirection: 'row',
//                                                 alignItems: 'center',
//                                             }}>
//                                             <View style={{ flex: 0.5 }}>
//                                                 <Text style={styles.postpaidBalanceText}>Total Credit</Text>
//                                                 <Text style={styles.moneyText}>{CreditAmt?CreditAmt:"000"}</Text>
//                                             </View>
//                                             <View style={{ ...styles.equalFlex, flexShrink: 0, flexWrap: 'nowrap' }}>
//                                                 <Text style={styles.postpaidBalanceText}>Total Debit</Text>
//                                                 <Text style={styles.moneyText}>{DebitAmt?DebitAmt:"000"}</Text>
//                                             </View>
//                                         </View>
//                                     </View>
//                                 )}
//                             </View>
//                         </View>

//                         <View style={styles.transactionListHeaderStyle}>
//                             <View>
//                                 <Text style={styles.transactionListHeaderText}>
//                                     Transaction List
//                                 </Text>
//                             </View>
//                             {data?.length > 0 && (show == "member" || show == "Credit") ? (
//                                 <View style={{ flexDirection: 'row' }}>

//                                     <TouchableOpacity
//                                         onPress={() =>
//                                             navigation.navigate('DownloadStatement', { data: show })
//                                         }
//                                         style={{ justifyContent: 'center', marginRight: 20 }}>
//                                         <Image
//                                             style={{ height: 20, width: 20 }}
//                                             source={require('../../assets/images/download.png')}
//                                         />
//                                     </TouchableOpacity>

//                                     <TouchableOpacity
//                                         activeOpacity={0.5}
//                                         onPress={() => {
//                                             sheetRef1.current.open();
//                                         }}>
//                                         <SettingIcon />
//                                     </TouchableOpacity>
//                                 </View>
//                             ) : null}
//                         </View>
//                     </View>

//                     <FlatList

//                         data={data}
//                         renderItem={({ item, index }) => TransactionCard(item, index)}
//                         ListEmptyComponent={<NoDataCard />}
//                         keyExtractor={(item, index) => index.toString()}
//                     />
//                 </View>

//                 <RBSheet
//                     ref={sheetRef}
//                     height={Dimensions.get('window').height * 0.6}

//                     customStyles={{
//                         wrapper: {
//                             backgroundColor: 'transparent',
//                         },
//                         draggableIcon: {
//                             backgroundColor: '#000',
//                         },
//                     }}
//                     customModalProps={{
//                         animationType: 'slide',
//                         statusBarTranslucent: true,
//                     }}
//                     customAvoidingViewProps={{
//                         enabled: false,
//                     }}>
//                     {renderContent()}
//                 </RBSheet>

//                 <RBSheet
//                     ref={sheetRef1}
//                     height={Dimensions.get('window').height * 0.9}

//                     customStyles={{
//                         wrapper: {
//                             backgroundColor: 'transparent',
//                         },
//                         draggableIcon: {
//                             backgroundColor: '#000',
//                         },
//                     }}
//                     customModalProps={{
//                         animationType: 'slide',
//                         statusBarTranslucent: true,
//                     }}
//                     customAvoidingViewProps={{
//                         enabled: false,
//                     }}>
//                     {renderFilterContent()}
//                 </RBSheet>
//             </View>
//             {loading && <View style={{backgroundColor:"rgba(0, 0,0, 0.3)",flex:1,position:"absolute",top:0,bottom:0,left:0,right:0}}>
//                 <View style={{backgroundColor:"transparent",flex:1,alignItems:"center",justifyContent:"center"}}>
//                     <ActivityIndicator size='large' color={SECONDARY_COLOR} animating={loading} />
//                 </View>
//                 </View>}
//         </>
//     )
// }

// const { height, width } = Dimensions.get('window');
// var styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         backgroundColor: 'transparent',
//         alignItems: 'center',
//         paddingTop: Platform.OS==="ios"?getStatusBarHeight()+50: getStatusBarHeight() + 60,
//         paddingHorizontal: 20,
//     },
//     rowStyle: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 8,
//     },
//     elevatedView: {
//         paddingHorizontal: 10,
//         backgroundColor: 'white',
//         flexDirection: 'column',
//         paddingVertical: 10,
//         marginHorizontal: 20,
//         marginBottom: 10,
//         marginTop: 6,
//         borderRadius: 10,
//         height: 220,
//         width: Dimensions.get('window').width - 20,
//         paddingHorizontal: 20,
//     },
//     titleText: {
//         color: PINK_COLOR,
//         fontSize: 16,
//         fontWeight: 'bold',

//     },
//     titleValue: {
//         // color: '#FE8371',
//         fontSize: 16,
//         fontWeight: 'bold',

//     },
//     dataNotFoundText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'black'
//     },
//     header: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 15,
//         color: 'black'
//     },
//     card: {
//         backgroundColor: '#F5FFE9',
//         height: height / 5,
//         width: width - 40,
//         marginTop: 20,
//         borderRadius: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         // alignItems: 'center',
//     },
//     transactionListHeaderStyle: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: width - 40,
//         paddingVertical: 20,
//     },
//     transactionListHeaderText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'black'
//     },
//     cardView: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//     },
//     indexView: {
//         height: 50,
//         width: 50,
//         borderRadius: 10,
//         backgroundColor: '#79CA14',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     indexText: {
//         color: 'white',
//         fontSize: moderateScale(18),
//         fontWeight: 'bold',
//     },
//     locationName: {
//         fontSize: moderateScale(16),
//         fontWeight: 'bold',
//         paddingHorizontal: 10,
//         color: 'black'
//     },
//     textContnetStyle: {
//         paddingHorizontal: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 2,
//         color: 'black'
//         // width: width / 1.2,
//     },
//     amountText: {
//         paddingHorizontal: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: width / 1.2,
//         color: 'black'
//     },
//     headerStyle: {
//         color: '#5D5D5D',
//         fontSize: moderateScale(12),
//         paddingBottom: 5,
//     },
//     rowView: {
//         flexDirection: 'row',
//         marginHorizontal: 10,
//         alignItems: 'center',
//         height: moderateScale(35),
//         borderRadius: 10,
//         backgroundColor: 'lightgray',
//         marginTop: 20,
//     },
//     topView: {
//         flex: 0.5,
//         backgroundColor: 'lightgray',
//         height: moderateScale(35),
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     simpleText: {
//         fontSize: 15,
//         fontWeight: '500',
//         color: 'black'
//     },
//     boldText: {
//         fontSize: 16,
//         fontWeight: '800',
//         color: 'black'
//     },

//     prepaidText: {
//         fontSize: 20,
//         fontWeight: '900',
//         color: 'black',
//         fontFamily: FONT_FAMILY.bold,
//         color: 'black'

//     },

//     moneyText: {
//         fontSize: 15,
//         fontWeight: '800',
//         color: '#79ca14',
//         marginTop: 3,
//         fontFamily: FONT_FAMILY.Muli,
//     },
//     equalFlex: {
//         flex: 0.5,
//         alignItems: 'flex-start',
//         justifyContent: 'center',

//     },

//     postpaidBalanceText: {
//         fontSize: 14,
//         fontWeight: '400',
//         marginTop: 5,
//         fontFamily: FONT_FAMILY.Muli,
//         color: 'black'

//     },
//     dateText: {
//         fontSize: 15,
//         fontWeight: '400',
//         fontFamily: FONT_FAMILY.Muli,
//     },

// });

// export default Transaction;
