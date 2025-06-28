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
  LayoutAnimation,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GREEN,
  PRIMARY_BUTTON_BLUE,
  SECONDARY_COLOR,
} from "../../util/colors";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import InvoiceStyles from "../../Styles/InvoiceStyle";
import Svg, { Path, Rect } from "react-native-svg";
import * as api from "../../util/api";
import TransactionBoxImage from "../../assets/svg/TransactionHistory";
import { useSelector } from "react-redux";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import {
  getStatement,
  useStatments,
  useTransactions,
} from "./ViewStatementService";
import DatePickerComponent from "../Transaction/DatePicker";
import NewButton from "../../components/Button";
import {
  getRechargeNewData,
  getStatmentData,
} from "../CardRecharge/CardRechargeService";
import { Card } from "react-native-paper";
import { Toast } from "react-native-toast-notifications";
import { setModal } from "../../store/actions/authActions";
import UniversalModal from "../../components/UniversalModal";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const ViewStatement = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");
  const [startDate, setStartDate] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const [rechargeBoxError, setRechargeBoxError] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [amountheading, setAmountheading] = useState("");
  const [amount, setAmount] = useState("");
  const [click, setClick] = useState("");
  const [showModalAmount, setShowModalAmount] = useState(false);
  const [loading, setLoading] = useState(false);

  const billType = [
    { type: "Bill to Bill", text: 0, placeholder: "" },
    {
      type: "Less than Bill",
      text: "Minimum Bill Amount",
      placeholder: "Enter Minimum Bill Amount",
    },
    {
      type: "More than Bill",
      text: "Additional Amount",
      placeholder: "Enter Additional Amount",
    },
  ];
  // const data = null;
  // let isLoading=false
  const { data, isLoading, error, refetch } = useTransactions(
    startDate,
    endDate,
    userData
  );
  const statmentData = useStatments(userData);
  const applyFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setShowModal(false);
    refetch();
  };
  const onSelect = (ind) => {
    setRechargeBoxError("");
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    if (ind !== "") {
      setClick(ind);
      setAmountheading({
        text: billType[ind]?.text,
        placeholder: billType[ind]?.placeholder,
      });
      setAmount("");
    }
  };
  console.log(
    "\x1b[36m%s\x1b[0m",
    statmentData?.data?.pdf,
    "---------------------- statmentData?.data?.pdf ---------------------"
  );
  const CreditAmt = parseFloat(
    data?.data
      ?.reduce((acc, record) => {
        return acc + parseFloat(record.credit_amt);
      }, 0)
      .toFixed(2)
  );

  const DebitAmt = parseFloat(
    data?.data
      .reduce((acc, record) => {
        return acc + parseFloat(record.debit_amt);
      }, 0)
      .toFixed(2)
  );
  const handleValidateDates = () => {
    if (tempEndDate && tempStartDate) {
      if (moment(tempStartDate).isAfter(tempEndDate)) {
        Toast.show("Invalid Date Range", {
          type: "warning",
        });
        setShowModal(false);
        setTempEndDate("");
        setTempStartDate("");
        return;
      } else {
        applyFilter();
      }
    } else {
      Toast.show("Please select Date range.", {
        type: "warning",
      });
    }
  };
  const showDatepickerModal = () => {
    setTempEndDate(null);
    setTempStartDate(null);
    setShowModal(true);
  };

  const payNowAction = async (paymentType) => {
    setAmountheading("");
    setLoading(true);

    try {
      const payload = {
        path: ENDPOINT.create_invoice_pay_order,
        Token: userData?.data?.token,
        body: { amount: 0, payment_type: "Bill to Bill", less_than_amount: 0 },
      };

      paymentType === 1
        ? (payload.body.less_than_amount = amount)
        : (payload.body.amount = statmentData?.data?.amount_payable);
      paymentType === 0
        ? (payload.body.amount = statmentData?.data?.amount_payable)
        : 0;

      const response = await api.javascriptPost(payload, userData?.data?.token);
      setShowModalAmount(false);
      setAmount("");
      if (response?.data?.razorpayKey) {
        navigation.navigate("PaymentWebView", {
          member_id: payload.member_id,
          amount: payload.amount,
          data: response?.data,
          type: "Bill",
        });
        // setClosemodal(false);
        // setAmountheading('');
        setLoading(false);
      } else if (!response.status) {
        setLoading(false);

        Alert.alert(response.message);
      }
      setLoading(false);
    } catch (error) {
      Alert.alert("Feature Coming Soon...");
      setLoading(false);
      console.log(
        "\x1b[36m%s\x1b[0m",
        error,
        "---------------------- error ---------------------"
      );
    }
  };

  const onSubmitButtonPress = () => {
    if (click !== null) {
      if (click === 0) {
        payNowAction(click);
      } else if (
        Number(statmentData?.data?.amount_payable ?? 0) > Number(amount) &&
        Number(amount) > 0 &&
        click === 1
      ) {
        payNowAction(click);
      } else if (Number(amount) > 0 && click === 2) {
        payNowAction(click);
      } else {
        if (
          click === 1 &&
          Number(statmentData?.data?.amount_payable ?? 0) < Number(amount)
        ) {
          setRechargeBoxError("The amount should be less than the bill amount");
        } else {
          setRechargeBoxError("Please fill a valid amount.");
        }
      }
    } else {
      console.log("Call is coming here in else!");

      Toast.show("Please Select Bill amount", {
        type: "warning",
      });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: DARK_BLUE }}>
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refetch(), setStartDate(null), setEndDate(null);
            }}
            tintColor={SECONDARY_COLOR}
            refreshing={isLoading}
            colors={[DARK_BLUE]}
            style={{alignItems:'center',justifyContent:'center',}}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: DARK_BLUE }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: DARK_BLUE,
          // justifyContent: "center",
        }}
        stickyHeaderIndices={[1]}
      > */}
      {/* <Header
        title={"Subscription"}
        OpenDropDawn={showDatepickerModal}
        // isMulti={true}
        // isDawnload={true}
      /> */}
      <View
        style={{ margin: 20, alignItems: "center", justifyContent: "center" }}
      >
        <TransactionBoxImage style={{ scale: 1 }} />
      </View>

      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", flex: 1 }}
      >
        <Path
          d={`M 0 ${height * 0.45}
                      C ${width * 0.5} ${height * 0.5}, 
                        ${width * 0.2} ${height * 0.25}, 
                        ${width} ${height * 0.2} 
                      L ${width} ${height} 
                      L 0 ${height} Z`}
          fill={PRIMARY_BUTTON_BLUE}
        />
      </Svg>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          // justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: LIGHT_GREEN,
            borderRadius: 20,
            padding: 10,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
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
              style={[InvoiceStyles.moneyText, { fontSize: 20, color: "red" }]}
            >
              ₹
              {statmentData?.data?.bill_amount
                ? Number(statmentData.data?.bill_amount).toFixed(2)
                : "0.00"}
            </Text>
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
          </View>
          <View
            style={{
              // flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.5 }}>
              <Text style={InvoiceStyles.postpaidBalanceText}>
                Opening Balance
              </Text>
              <Text style={InvoiceStyles.moneyText}>
                ₹{data?.opening_balance ? data?.opening_balance : "0.00"}
              </Text>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text style={InvoiceStyles.postpaidBalanceText}>
                Closing Balance
              </Text>
              <Text style={InvoiceStyles.moneyText}>
                ₹{data?.closing_balance ? data?.closing_balance : "0.00"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.5 }}>
              <Text style={InvoiceStyles.postpaidBalanceText}>
                Total Credit
              </Text>
              <Text style={InvoiceStyles.moneyText}>
                ₹
                {CreditAmt && startDate && endDate
                  ? Number(CreditAmt).toFixed(2)
                  : data?.credit_amt || "0.00"}
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
              }}
            >
              <Text style={InvoiceStyles.postpaidBalanceText}>Total Debit</Text>
              <Text style={InvoiceStyles.moneyText}>
                ₹
                {DebitAmt && startDate && endDate
                  ? Number(DebitAmt).toFixed(2)
                  : data?.debit_amt || "0.00"}
              </Text>
            </View>
            
          </View>
           <View style={{ margin:0 ,marginTop:20}}>

             <NewButton
                text={"View Bill"}
                onPress={() =>
                  navigation.navigate("PDFView", {
                    url: statmentData?.data?.pdf,
                    title: "Statement",
                  })
                }
              />
            </View>
        </View>
       
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("PDFView", {
              url: statmentData?.data?.pdf,
              title: "Statement",
            })
          }
          style={{ marginVertical: 40, marginHorizontal: 10 }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: FONT_FAMILY.bold,
              textAlign: "center",
              padding: 10,
              backgroundColor: `rgba(69, 194, 38, 0.46)`,
              borderRadius: 10,
            }}
          >
            View Bill
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Transaction list */}
      {/* <View
          style={{
            backgroundColor: "white",
            elevation: 3,
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: "row",

              padding: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text style={InvoiceStyles.transactionListHeaderText}>
              Transaction History
            </Text>
            <View>
             <NewButton
                text={"Pay Now"}
                loading={loading}
                onPress={() => {
                    payNowAction()
                  // setShowModalAmount(true), setClick("");
                }}
              />
            </View>
          </View>
        </View> */}
      {/* {startDate && endDate && data?.data?.length > 0 && (
          <Text style={InvoiceStyles.noRecord}>
            Records between {moment(startDate).format("DD MMM YYYY")} to{" "}
            {moment(endDate).format("DD MMM YYYY")}
          </Text>
        )} */}

      {/* <FlatList
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
                }}>
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
        /> */}
      {/* </ScrollView> */}
      <Modal
        transparent={true}
        dismissableBackButton={true}
        statusBarTranslucent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
        presentationStyle={
          Platform.OS === "ios" ? "pageSheet" : "overFullScreen"
        }
        style={{ alignItems: "flex-end", flex: 1, justifyContent: "flex-end" }}
        dismissable={true}
      >
        <View style={InvoiceStyles.modal}>
          <View style={InvoiceStyles.innerModalCont}>
            <View style={InvoiceStyles.headingContainer}>
              <Text style={InvoiceStyles.headingText}>Filter by:</Text>
              <Icon
                onPress={() => setShowModal(false)}
                name="close"
                size={25}
                style={InvoiceStyles.cancelText}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                flex: 1,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flex: 0.5,
                  // justifyContent: "space-evenly",
                  // alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    // flex: 1,
                    backgroundColor:
                      click === 1 ? "white" : "rgb(237, 243, 249)",
                    justifyContent: "space-between",
                    // width: "100%",
                    padding: 10,
                    flexDirection: "row",
                  }}
                  onPress={() => onApply(0)}
                >
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY.semiBold,
                      fontSize: 14,
                      color: click === 1 ? "grey" : "black",
                    }}
                  >
                    Date
                  </Text>
                  <Text style={{ textAlign: "right" }}>
                    {tempEndDate && tempStartDate ? 1 : ""}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 20,
                }}
              >
                <DatePickerComponent
                  placeholder={"Select Start date"}
                  stateDate={setTempStartDate}
                />
                <DatePickerComponent
                  placeholder={"Select End date"}
                  stateDate={setTempEndDate}
                  minDate={
                    tempStartDate
                      ? moment(tempStartDate).add(1, "day").toDate()
                      : moment().toDate()
                  }
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "white", padding: 10 }}>
          <TouchableOpacity
            onPress={handleValidateDates}
            activeOpacity={0.9}
            style={InvoiceStyles.submitContainer}
          >
            <Text style={InvoiceStyles.confirmText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <UniversalModal
        isFull={"true"}
        title={"Pay Now"}
        setVisible={() => setShowModalAmount(false)}
        visible={showModalAmount}
      >
        <View style={InvoiceStyles.modal}>
          {/* <View style={InvoiceStyles.innerModalCont}> */}

          <View>
            <FlatList
              data={billType}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      disabled={
                        Number(statmentData?.data?.amount_payable || 0) < 0 &&
                        index !== 2
                      }
                      onPress={() => onSelect(index)}
                      activeOpacity={0.7}
                      style={{ flexDirection: "row", margin: 10 }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          opacity:
                            Number(statmentData?.data?.amount_payable) < 0 &&
                            index !== 2
                              ? 0.3
                              : 2,
                        }}
                      >
                        <Image
                          source={
                            click === index
                              ? require("../../assets/images/circleFilled.png")
                              : require("../../assets/images/circle.png")
                          }
                          style={{
                            height: 20,
                            width: 20,
                            tintColor: click === index ? "black" : "grey",
                            resizeMode: "contain",
                          }}
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
                              color: click === index ? "black" : "grey",
                            },
                          ]}
                        >
                          {item.type}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            {click !== "" && (
              <Text
                style={{
                  color: "black",
                  fontFamily: FONT_FAMILY.normal,
                  backgroundColor: LIGHT_BLUE,
                  padding: 20,
                }}
              >
                Payble Amount:{" "}
                <Text
                  style={{
                    color: SECONDARY_COLOR,
                    fontFamily: FONT_FAMILY.bold,
                    fontSize: 16,
                  }}
                >
                  ₹
                  {Number(statmentData?.data?.amount_payable || 0).toFixed(2) ||
                    0}
                </Text>
              </Text>
            )}
            {amountheading.text !== 0 && click !== "" && (
              <TextInput
                value={amount}
                placeholder={amountheading.placeholder}
                placeholderTextColor={"grey"}
                style={InvoiceStyles.amountInput}
                onChangeText={(text) => setAmount(text)}
                maxLength={6}
                keyboardType="decimal-pad"
              />
            )}
            {rechargeBoxError && (
              <Text style={{ marginHorizontal: 2, color: "red", fontSize: 14 }}>
                {rechargeBoxError}
              </Text>
            )}
            <View style={{ marginTop: 10 }}>
              <NewButton
                text={"Pay"}
                onPress={onSubmitButtonPress}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </UniversalModal>
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
        <View style={InvoiceStyles.creditContainer}>
          <Icon name="arrow-bottom-left" size={15} color={SECONDARY_COLOR} />
          <Text style={InvoiceStyles.creditText}>
            ₹{isNaN(item.credit_amt) ? "0.00" : item.credit_amt} Cr.
          </Text>
        </View>
      </View>
      <View style={InvoiceStyles.transactionRow}>
        <Text numberOfLines={3} style={InvoiceStyles.narrationText}>
          {item.narrations
            .toLowerCase()
            .replace(/(^\s*\w|[\.\?\!]\s*\w)/g, (char) => char.toUpperCase())}
        </Text>
        <View style={InvoiceStyles.debitContainer}>
          <Icon name="arrow-top-right" size={15} color="red" />
          <Text style={InvoiceStyles.debitText}>
            ₹{isNaN(item.debit_amt) ? "0.00" : item.debit_amt} Dr.
          </Text>
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
