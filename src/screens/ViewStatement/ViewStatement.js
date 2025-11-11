import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
  AppState,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import {
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GREEN,
  SECONDARY_COLOR,
} from "../../util/colors";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import InvoiceStyles from "../../Styles/InvoiceStyle";
import * as api from "../../util/api";
import TransactionBoxImage from "../../assets/svg/TransactionHistory";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import {
  getStatement,
  useStatments,
  useTransactions,
} from "./ViewStatementService";
import DatePickerComponent from "../Transaction/DatePicker";
import NewButton from "../../components/Button";
import { Card } from "react-native-paper";
import { Toast } from "react-native-toast-notifications";
import UniversalModal from "../../components/UniversalModal";
import { CustomCheckbox } from "../../components/CustomCheckBox";
import { SlideFromRightIOS } from "@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const ViewStatement = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [startDate, setStartDate] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [thisMonthTransactions, setThisMonthTransactions] = useState(null);
  const [additionalAmountText, setAdditionalAmountText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedPaymode, setSelectedPaymode] = useState([]);
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState([]);
  const [paymode, setaPaymode] = useState([]);
  const [click, setClick] = useState(0);
  const [showModalAmount, setShowModalAmount] = useState(false);
  const [rechargeBoxError, setRechargeBoxError] = useState(false);
  const [loading, setLoading] = useState(false);

  // const data = null;
  // let isLoading=false
  const { data, isLoading, error, refetch } = useTransactions(
    startDate,
    endDate,
    userData,
    paymode,
    location
  );
  const statmentData = useStatments(userData);
  console.log(
    "\x1b[36m%s\x1b[0m",
    statmentData.data,
    "---------------------- statmentData.data ---------------------"
  );

  const onSelect = (ind, type) => {
    if (selectedLocation?.includes(ind) && !type) {
      setSelectedLocation(selectedLocation.filter((item) => item !== ind));
    } else if (selectedPaymode?.includes(ind) && type == "pay") {
      setSelectedPaymode(selectedPaymode.filter((item) => item !== ind));
    } else if (type == "pay") {
      setSelectedPaymode([...selectedPaymode, ind]);
    } else {
      setSelectedLocation([...selectedLocation, ind]);
    }
  };

  const CreditAmt = parseFloat(
    data?.data
      ?.reduce((acc, record) => {
        return acc + parseFloat(record.credit_amt);
      }, 0)
      .toFixed(2)
  );
  const DebitAmt = parseFloat(
    data?.data
      ?.reduce((acc, record) => {
        return acc + parseFloat(record.debit_amt);
      }, 0)
      .toFixed(2)
  );

  const handleValidateDates = () => {
    Toast.hideAll();
    let temp = userData?.data?.data[0]?.location;
    let pay = userData?.data?.data[0]?.paymode;
    if (tempEndDate && tempStartDate && !selectedLocation.length) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setShowModal(false);
      setLocation(selectedLocation.map((index) => temp[index]));
    } else if (selectedLocation.length) {
      setLocation(selectedLocation.map((index) => temp[index]));
      setaPaymode(selectedPaymode.map((index) => pay[index]));

      setStartDate(null);
      setEndDate(null);
      setShowModal(false);
    } else if (selectedPaymode.length) {
      setLocation(selectedLocation.map((index) => temp[index]));
      setaPaymode(selectedPaymode.map((index) => pay[index]));

      setStartDate(null);
      setEndDate(null);
      setShowModal(false);
    } else {
      Toast.show("Please apply atleast one filter.", {
        type: "warning",
      });
    }
  };
  const showDatepickerModal = () => {
    setTempEndDate(null);
    setTempStartDate(null);
    setShowModal(true);
  };
  const openUPILink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url); // 🚀 Opens in UPI app or browser
      } else {
        Alert.alert(
          "Not Supported",
          "No app found to handle this payment link."
        );
      }
    } catch (err) {
      console.error("Error opening UPI link:", err);
      Alert.alert(
        "Error",
        "Something went wrong while opening the payment link."
      );
    }
  };
  const payNowAction = async () => {
    if (!amount || !/^\d+$/.test(amount)) {
      setRechargeBoxError(true);
      return;
    }

    setLoading(true);
    try {
      const apiRequestObject = {
        path: "member/create_pay_order",
        body: {
          type: "Subscription",
          amount: amount,
        },
        Token: userData?.data?.token,
      };

      const response = await api.javascriptPost(apiRequestObject);
      console.log(
        "\x1b[36m%s\x1b[0m",
        response,
        "---------------------- response ---------------------"
      );
      setLoading(false);
      if (response && response.data && response.data.url) {
        if (response && response.data.url) {
          openUPILink(response.data.url);
        }
      } else if (!response.status) {
        setLoading(false);

        Alert.alert(response.message);
        //   setError(response.message || 'Error in API response');
      }
      setLoading(false);
      setAmount("");
    } catch (error) {
      Alert.alert("Network error");
      setLoading(false);
    } finally {
      setAmount("");
      setLoading(false);
      setShowModalAmount(false);
    }
  };

  const onApply = (ind) => {
    setClick(ind);
    ind
      ? (setTempEndDate(null), setTempStartDate(null))
      : (setSelectedPaymode([]), setSelectedLocation([]));
  };
  const handleOpenAmountModal = () => {
    const firstDateOfThisMonth = moment().startOf("month");
    const thisMonth = data?.data?.filter(
      (item) =>
        moment(item.created_at).isAfter(firstDateOfThisMonth) &&
        item.particulars == "Receipt"
    );
    setThisMonthTransactions(thisMonth);
    setShowModalAmount(true);
    statmentData.data?.bill_amount > 0 &&
      setAmount((statmentData.data?.bill_amount).toString());
  };
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // 🔄 Call API to check txn status here
        statmentData.refetch();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        title={"Subscription"}
        OpenDropDawn={showDatepickerModal}
        isMulti={true}
        isDawnload={true}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch(), setStartDate(null), setEndDate(null);
              statmentData.refetch();
            }}
            tintColor={SECONDARY_COLOR}
            refreshing={isLoading}
            colors={[DARK_BLUE]}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: DARK_BLUE }}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
        stickyHeaderIndices={[1]}
      >
        <View style={InvoiceStyles.container}>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: FONT_FAMILY.bold,
                  color: "white",
                }}
              >
                Current Outstanding:
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: FONT_FAMILY.normal,
                  color: "grey",
                }}
              >
                (As per last bill)
              </Text>
            </View>
            <Text
              style={[
                InvoiceStyles.moneyText,
                {
                  fontSize: 20,
                  color:
                    statmentData?.data?.bill_amount > 0
                      ? "red"
                      : SECONDARY_COLOR,
                },
              ]}
            >
              {statmentData?.data?.bill_amount < 0 ? "- " : ""}₹
              {Math.abs(statmentData?.data?.bill_amount ?? 0).toFixed(2)}
            </Text>
          </View> */}
          <View
            style={{
              backgroundColor: LIGHT_GREEN,
              borderRadius: 20,
              padding: 10,
              paddingHorizontal: 15,
            }}
          >
            <View style={InvoiceStyles.svg}>
              <TransactionBoxImage style={{ scale: 1 }} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Icon
                  name="card-account-details-star"
                  size={20}
                  color={DARK_BLUE}
                />
                <Text style={InvoiceStyles.text}>A/C Summary</Text>
              </View>

              <View>
                <NewButton
                  text={"View Bill"}
                  onPress={() =>
                    statmentData?.data?.pdf
                      ? navigation.navigate("PDFView", {
                          url: statmentData?.data?.pdf,
                          title: "Statement",
                        })
                      : Toast.show("No Bill genrated.")
                  }
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
                // flexDirection: "row",
                // alignItems: "center",
                marginVertical:10
              }}
            >
              <View style={{ flex: 0.3 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Opening Balance" : "Allocated Credit Limit:"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {startDate
                    ? data?.opening_balance
                    : statmentData?.data?.credit_limit || "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.3 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Closing Balance" : "Current Outstanding:"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {startDate
                    ? data?.closing_balance
                    : (statmentData?.data?.outstanding_amt || 0).toFixed(2) ||
                      "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.3 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  Available Credit Limit:
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹{statmentData?.data?.avaiable_limit?.toFixed(2) || "0.00"}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Opening Balance" : "Current Bill"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {data?.opening_balance
                    ? data?.opening_balance
                    : statmentData?.opening_balance || "0.00"}
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Closing Balance" : "Outstanding"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {data?.closing_balance
                    ? data?.closing_balance
                    : statmentData?.closing_balance || "0.00"}
                </Text>
              </View>
              
            </View> */}
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 0.5 }}>
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Total Credit" : "Unbilled Credit"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {CreditAmt && startDate && endDate
                    ? Number(CreditAmt).toFixed(2)
                    : statmentData?.data?.total_credit || "0.00"}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.5,
                }}
              >
                <Text style={InvoiceStyles.postpaidBalanceText}>
                  {startDate ? "Total Debit" : "Unbilled Debit"}
                </Text>
                <Text style={InvoiceStyles.moneyText}>
                  ₹
                  {DebitAmt && startDate && endDate
                    ? Number(DebitAmt).toFixed(2)
                    : statmentData?.data?.total_debit || "0.00"}
                </Text>
              </View>
            </View> */}
            <View
              style={{
                // flex: 1,
                marginTop: 10,
                flexDirection: "row",
                // justifyContent: "space-between",
                // backgroundColor:"red",
                alignItems: "center",
              

              }}
            >
              <View
                style={{
                  flex:1,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: rechargeBoxError ? "red" : "black",
                  borderRadius: 5,
                  backgroundColor: "#f0f0f0",
                  marginRight:10
                 
                }}
              >
                <Text
                  style={{
                    color: "black",
                    marginHorizontal: 20,
                    fontFamily: FONT_FAMILY.bold,
                  }}
                >
                  ₹
                </Text>
                <TextInput
                  placeholder="Please Enter Amount"
                  placeholderTextColor={"grey"}
                  style={{
                    borderLeftWidth: 1,
                    flex:1,
                    fontFamily: FONT_FAMILY.bold,
                    color: "black",
                    borderLeftColor: "black",
                    padding: 10,
                  }}
                  value={amount}
                  keyboardType="decimal-pad"
                  onChangeText={(text) => {
                    setAmount(text);
                    setRechargeBoxError(false);
                  }}
                />
              </View>
              <View >
                <NewButton
                  onPress={payNowAction}
                  loading={loading}
                  text={"Proceed"}
                />
              </View>
            </View>
            {rechargeBoxError && (
              <Text
                style={{
                  fontFamily: FONT_FAMILY.normal,
                  color: "red",
                }}
              >
                Please enter a valid amount.
              </Text>
            )}
          </View>
        </View>

        {/* Transaction list */}
        <View
          style={{
            backgroundColor: "white",
            elevation: 3,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={InvoiceStyles.transactionListHeaderText}>
              Transaction History
            </Text>
            {/* <View>
              <NewButton text={"Pay Now"} onPress={handleOpenAmountModal} />
            </View> */}
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
          >
            {location.map((index) => (
              <Text
                onPress={() => {
                  setLocation(location.filter((ind) => ind !== index));
                  setStartDate(null);
                  setEndDate(null);
                }}
                style={{
                  margin: 10,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "rgb(237, 243, 249)",
                  color: "black",
                }}
              >
                {index.toLocaleString()}
                {"  "}
                <Text style={{ color: "red" }}>X</Text>
              </Text>
            ))}
            {paymode.map((index) => (
              <Text
                onPress={() => {
                  setaPaymode(paymode.filter((ind) => ind !== index));
                  setStartDate(null);
                  setEndDate(null);
                }}
                style={{
                  margin: 10,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: "rgb(237, 243, 249)",
                  color: "black",
                }}
              >
                {index.toLocaleString()}
                {"  "}
                <Text style={{ color: "red" }}>X</Text>
              </Text>
            ))}
          </ScrollView>
        </View>
        {startDate && endDate && data?.data?.length > 0 && (
          <Text style={InvoiceStyles.noRecord}>
            Records between {moment(startDate).format("DD MMM YYYY")} to{" "}
            {moment(endDate).format("DD MMM YYYY")}
          </Text>
        )}

        <FlatList
          scrollEnabled={false}
          ListEmptyComponent={
            isLoading ? (
              emptyList
            ) : startDate && endDate ? (
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={InvoiceStyles.alertImage}
                  source={require("../../assets/images/norecord.png")}
                />
                <Text style={InvoiceStyles.noRecord}>
                  No records found matching the applied filters.
                </Text>
              </View>
            ) : (
              <Text style={InvoiceStyles.noRecord}>No records found.</Text>
            )
          }
          initialNumToRender={10}
          data={data?.data}
          contentContainerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
            flex: 1,
          }}
          renderItem={renderTransactions}
        />
      </ScrollView>

      <UniversalModal
        isFull={true}
        visible={showModal}
        setVisible={setShowModal}
        title={"Filter by:"}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View style={[InvoiceStyles.innerModalCont, { padding: 0 }]}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flexDirection: "column", minWidth: "30%" }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    // flex: 1,
                    backgroundColor:
                      click === 0 ? "rgb(237, 243, 249)" : "white",
                    justifyContent: "space-between",
                    // width: "50%",
                    padding: 10,
                    flexDirection: "row",
                  }}
                  onPress={() => onApply(0)}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.semiBold,
                      fontSize: 14,
                      color: click === 0 ? "black" : "grey",
                    }}
                  >
                    Date
                  </Text>
                  <Text style={{ textAlign: "right" }}>
                    {tempEndDate && tempStartDate ? 1 : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    backgroundColor:
                      click === 1 ? "rgb(237, 243, 249)" : "white",

                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => onApply(1)}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.semiBold,
                      fontSize: 14,
                      color: click === 1 ? "black" : "grey",
                    }}
                  >
                    Location
                  </Text>
                  <Text style={{ textAlign: "right", color: "black" }}>
                    {selectedLocation.length ? selectedLocation.length : ""}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    backgroundColor:
                      click === 2 ? "rgb(237, 243, 249)" : "white",

                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => onApply(2)}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.semiBold,
                      fontSize: 14,
                      color: click === 2 ? "black" : "grey",
                    }}
                  >
                    Pay Mode
                  </Text>
                  <Text style={{ textAlign: "right", color: "black" }}>
                    {selectedPaymode.length ? selectedPaymode.length : ""}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, backgroundColor: "white" }}>
                {click === 0 ? (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <View style={{ margin: 10 }}>
                      <DatePickerComponent
                        placeholder={
                          tempStartDate ? tempStartDate : "Start date"
                        }
                        stateDate={setTempStartDate}
                      />
                    </View>
                    <View style={{ margin: 10 }}>
                      <DatePickerComponent
                        placeholder={tempEndDate ? tempEndDate : "End date"}
                        stateDate={setTempEndDate}
                        minDate={
                          tempStartDate
                            ? moment(tempStartDate).add(1, "day").toDate()
                            : moment().toDate()
                        }
                      />
                    </View>
                  </View>
                ) : (
                  (click === 1 && (
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 20,
                      }}
                    >
                      {userData?.data?.data[0]?.location.map((item, index) => (
                        <View>
                          <TouchableOpacity
                            onPress={() => onSelect(index)}
                            activeOpacity={0.7}
                            style={{
                              flexDirection: "row",
                              margin: 10,
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <CustomCheckbox
                                onToggle={() => onSelect(index)}
                                checked={selectedLocation.includes(index)}
                              />
                            </View>
                            <View
                              style={{
                                marginLeft: 10,
                              }}
                            >
                              <Text
                                style={[
                                  {
                                    fontFamily: FONT_FAMILY.semiBold,
                                    fontSize: 16,
                                    color: selectedLocation.includes(index)
                                      ? "black"
                                      : "grey",
                                  },
                                ]}
                              >
                                {item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )) ||
                  (click === 2 && (
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 20,
                      }}
                    >
                      {userData?.data?.data[0]?.paymode.map((item, index) => (
                        <View>
                          <TouchableOpacity
                            onPress={() => onSelect(index, "pay")}
                            activeOpacity={0.7}
                            style={{
                              flexDirection: "row",
                              margin: 10,
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <CustomCheckbox
                                onToggle={() => onSelect(index, "pay")}
                                checked={selectedPaymode.includes(index)}
                              />
                            </View>
                            <View
                              style={{
                                marginLeft: 10,
                              }}
                            >
                              <Text
                                style={[
                                  {
                                    fontFamily: FONT_FAMILY.semiBold,
                                    fontSize: 16,
                                    color: selectedPaymode.includes(index)
                                      ? "black"
                                      : "grey",
                                  },
                                ]}
                              >
                                {item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        </View>
        <NewButton onPress={handleValidateDates} text={"Apply"} />
      </UniversalModal>
      <Modal
        dismissableBackButton={true}
        animationType="slide"
        transparent={true}
        // presentationStyle='formSheet'
        presentationStyle={
          Platform.OS === "ios" ? "pageSheet" : "overFullScreen"
        }
        onRequestClose={() => setShowModalAmount(false)}
        visible={showModalAmount}
        dismissable={true}
      >
        <View style={InvoiceStyles.modal}>
          <View style={[InvoiceStyles.innerModalCont, { flex: 1 }]}>
            <View style={InvoiceStyles.headingContainer}>
              <Text style={InvoiceStyles.headingText}>Bill Payment</Text>
              <Icon
                onPress={() => setShowModalAmount(false)}
                name="close"
                size={25}
                style={InvoiceStyles.cancelText}
              />
            </View>
            <View
              style={{
                backgroundColor: LIGHT_BLUE,
                margin: 10,
                padding: 10,
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: FONT_FAMILY.normal,
                    color: "black",
                  }}
                >
                  Billing cycle:
                </Text>
                <Text style={[{ color: "black" }]}>
                  {statmentData?.data?.bill_month_year || "N/A"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: FONT_FAMILY.normal,
                    color: "black",
                  }}
                >
                  Invoice No.:
                </Text>
                <Text
                  style={{
                    // flex: 1,
                    fontFamily: FONT_FAMILY.normal,
                    color: "black",
                  }}
                >
                  {statmentData?.data?.bill_no || "N/A"}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: FONT_FAMILY.normal,
                    color: "black",
                  }}
                >
                  Billed amount:
                </Text>
                <Text
                  style={{
                    // flex: 1,
                    fontFamily: FONT_FAMILY.semiBold,
                    color: "red",
                  }}
                >
                  ₹{statmentData?.data?.amount_payable || "0.00"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontFamily: FONT_FAMILY.normal,
                    color: "black",
                    marginBottom: 10,
                  }}
                >
                  Reciepts (Post bill cycle):
                </Text>
                <Text
                  style={{
                    // flex: 1,
                    fontFamily: FONT_FAMILY.semiBold,
                    color: SECONDARY_COLOR,
                  }}
                >
                  ₹{statmentData?.data?.total_credit || "0.00"}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTopWidth: 0.9,
                  borderColor: "lightgrey",
                }}
              >
                <View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: FONT_FAMILY.bold,
                      color: "black",
                    }}
                  >
                    Current Outstanding:
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: FONT_FAMILY.normal,
                      color: "grey",
                    }}
                  >
                    (As per last bill)
                  </Text>
                </View>
                <Text
                  style={[
                    InvoiceStyles.moneyText,
                    {
                      fontSize: 20,
                      color:
                        statmentData?.data?.bill_amount > 0
                          ? "red"
                          : SECONDARY_COLOR,
                    },
                  ]}
                >
                  {statmentData?.data?.bill_amount < 0 ? "- " : ""}₹
                  {Math.abs(statmentData?.data?.bill_amount ?? 0).toFixed(2)}
                </Text>
              </View>
            </View>

            <View
              style={{
                // flex:1,
                margin: 10,
                // padding: 10,
                borderWidth: 1,
                borderColor: rechargeBoxError ? "red" : "grey",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
              }}
            >
              <Text
                style={{
                  color: "black",
                  marginHorizontal: 20,
                  fontFamily: FONT_FAMILY.bold,
                }}
              >
                ₹
              </Text>
              <TextInput
                placeholder="Please Enter Amount"
                placeholderTextColor={"grey"}
                style={{
                  flex: 1,
                  borderLeftWidth: 1,
                  fontFamily: FONT_FAMILY.bold,
                  color: "black",
                  borderLeftColor: "grey",
                  padding: 10,
                }}
                value={amount}
                keyboardType="decimal-pad"
                onChangeText={(text) => {
                  setAmount(text);
                  setRechargeBoxError(false);
                }}
              />
            </View>
            {rechargeBoxError && (
              <Text
                style={{
                  fontFamily: FONT_FAMILY.normal,
                  color: "red",
                  paddingHorizontal: 10,
                }}
              >
                Please enter a valid amount.
              </Text>
            )}
            <View style={{ marginHorizontal: 10 }}>
              <NewButton
                onPress={payNowAction}
                loading={loading}
                text={"Proceed"}
              />
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONT_FAMILY.normal,
                  color: "grey",
                }}
              >
                Ignore if already paid
              </Text>
            </View>
            {statmentData.data?.Reciepts && (
              <View style={{ marginTop: 10, flex: 1 }}>
                <Text
                  style={{
                    color: "black",
                    fontFamily: FONT_FAMILY.bold,
                    paddingBottom: 20,
                  }}
                >
                  Reciepts (Post bill cycle)
                </Text>
                <FlatList
                  contentContainerStyle={{ flexGrow: 1 }}
                  data={statmentData.data?.Reciepts || []}
                  renderItem={({ item }) => (
                    <Card style={InvoiceStyles.listcontainer}>
                      <View style={InvoiceStyles.transactionRow}>
                        <View style={InvoiceStyles.rowContainer}>
                          <Icon
                            name="calendar-month-outline"
                            size={15}
                            color="grey"
                          />
                          <Text style={[InvoiceStyles.dateText]}>
                            {moment(item?.voucher_date).format("DD MMM YYYY")}
                          </Text>
                        </View>
                        <Text style={[InvoiceStyles.voucherText, {}]}>
                          Voucher No:{" "}
                          <Text style={InvoiceStyles.voucherBold}>
                            {item.voucher_no}
                          </Text>
                        </Text>
                      </View>

                      <View style={InvoiceStyles.transactionRow}>
                        <Text
                          numberOfLines={2}
                          style={{
                            flex: 1,
                            color: "black",
                            fontFamily: FONT_FAMILY.semiBold,
                          }}
                          ellipsizeMode="tail"
                        >
                          {item.particulars}
                        </Text>
                      </View>
                      <View style={InvoiceStyles.transactionRow}>
                        <Text
                          numberOfLines={3}
                          style={InvoiceStyles.narrationText}
                        >
                          {item.narrations
                            .toLowerCase()
                            .replace(/(^\s*\w|[\.\?\!]\s*\w)/g, (char) =>
                              char.toUpperCase()
                            )}
                        </Text>
                        <View style={InvoiceStyles.debitContainer}>
                          <Icon
                            name={
                              item.credit_amt > 0
                                ? "arrow-bottom-left"
                                : "arrow-top-right"
                            }
                            size={15}
                            color={
                              item.credit_amt > 0 ? SECONDARY_COLOR : "red"
                            }
                          />
                          {item.credit_amt > 0 ? (
                            <Text style={InvoiceStyles.creditText}>
                              ₹
                              {isNaN(item.credit_amt)
                                ? "0.00"
                                : item.credit_amt}{" "}
                              Cr.
                            </Text>
                          ) : (
                            <Text style={InvoiceStyles.debitText}>
                              ₹{isNaN(item.debit_amt) ? "0.00" : item.debit_amt}{" "}
                              Dr.
                            </Text>
                          )}
                        </View>
                      </View>
                    </Card>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const renderTransactions = ({ item }) => {
  return (
    <Card style={InvoiceStyles.listcontainer}>
      <View style={InvoiceStyles.transactionRow}>
        <View style={InvoiceStyles.rowContainer}>
          <Icon name="calendar-month-outline" size={15} color="grey" />
          <Text style={[InvoiceStyles.dateText]}>
            {moment(item?.voucher_date).format("DD MMM YYYY")}
          </Text>
        </View>
        <Text style={[InvoiceStyles.voucherText, {}]}>
          Voucher No:{" "}
          <Text style={InvoiceStyles.voucherBold}>{item.voucher_no}</Text>
        </Text>
      </View>

      <View style={InvoiceStyles.transactionRow}>
        <Text
          numberOfLines={2}
          style={{ flex: 1, color: "black", fontFamily: FONT_FAMILY.semiBold }}
          ellipsizeMode="tail"
        >
          {item.particulars}
        </Text>
        {/* <View style={InvoiceStyles.creditContainer}>
          <Icon name="arrow-bottom-left" size={15} color={SECONDARY_COLOR} />
        <Text style={InvoiceStyles.creditText}>
              ₹{isNaN(item.credit_amt) ? "0.00" : item.credit_amt} Cr.
            </Text>
        </View> */}
      </View>
      <View style={InvoiceStyles.transactionRow}>
        <Text numberOfLines={3} style={InvoiceStyles.narrationText}>
          {item.narrations
            .toLowerCase()
            .replace(/(^\s*\w|[\.\?\!]\s*\w)/g, (char) => char.toUpperCase())}
        </Text>
        <View style={InvoiceStyles.debitContainer}>
          <Icon
            name={item.credit_amt > 0 ? "arrow-bottom-left" : "arrow-top-right"}
            size={15}
            color={item.credit_amt > 0 ? SECONDARY_COLOR : "red"}
          />
          {item.credit_amt > 0 ? (
            <Text style={InvoiceStyles.creditText}>
              ₹{isNaN(item.credit_amt) ? "0.00" : item.credit_amt} Cr.
            </Text>
          ) : (
            <Text style={InvoiceStyles.debitText}>
              ₹{isNaN(item.debit_amt) ? "0.00" : item.debit_amt} Dr.
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};
export default ViewStatement;

const emptyList = () => (
  <FlatList
    data={[1, 1, 1, 1, 1, 1]}
    renderItem={() => (
      <View style={InvoiceStyles.listcontainer}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
          <ShimmerPlaceholder style={{ borderRadius: 10 }} width={80} />
        </View>
        <ShimmerPlaceholder style={{ borderRadius: 10 }} />
      </View>
    )}
  />
);
