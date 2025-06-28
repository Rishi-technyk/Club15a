import {
  Alert,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useBooking } from "./BookingService";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { FlatList } from "react-native-gesture-handler";
import { Card } from "react-native-paper";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GREEN,
  LIGHT_GREY,
  LIGHT_RED,
  SECONDARY,
  SECONDARY_COLOR,
} from "../../util/colors";
import { ENDPOINT, FONT_FAMILY } from "../../util/constant";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import UniversalModal from "../../components/UniversalModal";
import SvgUri from "react-native-svg-uri";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import CancelButton from "../../components/CancelButton";
import { javascriptGet } from "../../util/api";
import { stat } from "react-native-fs";
import { Dropdown } from "react-native-element-dropdown";
const tabs = [{title:"All",status:''}, {title:"Upcoming",status:'Active'}, {title:"Past",status:'Completed'}, {title:"Cancelled",status:'Cancelled'}];
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const MyBookings = ({ navigation,route }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = useState('');
  const [type, setType] = useState(route.params?.type||'');
  const [page, setPage] = useState(1);
  const [bookingData, setBookingData] = useState([]);

  const { bookingQuery,facilityQuery } = useBooking(page, search, status, type, userData);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const calculateBooingSubTotal = (item, isGst) => {
    const guestCharge = item?.guests.reduce((acc, guest) => {
      if (guest?.occupant_id == 2) {
        return acc + Number(guest?.occupant_charge);
      }
      return acc;
    }, 0);
    const facilityCharge = Number(item?.facility_amount);
    const gst = (facilityCharge + guestCharge) * (item?.facility_gst_per / 100);
    const total = facilityCharge + guestCharge + gst;
    return isGst ? total : facilityCharge + guestCharge;
  };



useEffect(() => {
  const incomingData = bookingQuery?.data?.data?.data;
  if (!incomingData) return;

  setBookingData((prev) => {
    if (page === 1) return incomingData;

    const newItems = incomingData.filter(
      (item) => !prev.some((old) => old.booking_id === item.booking_id)
    );

    return [...prev, ...newItems];
  });
}, [bookingQuery?.data?.data, page]);


  const handleCancelBooking = async () => {
    const bookingId = selectedBooking?.booking_id;
    const requestObject = {
      path: ENDPOINT.get_cancellation_amount + bookingId,
      body: {},
    };
    const response = await javascriptGet(requestObject);
    console.log("Cancel Booking Response", response);
    if (response?.status) {
      setIsModalVisible(false);
      navigation.navigate("BookingCancelled", {
        amounts: response.cancelationAmount,
        activity: selectedBooking,
      });
    } else {
      Alert.alert("Failed", response?.message);
    }
  };

  const emptyList = () => (
    <FlatList
    data={[...Array(6).keys()]}
      renderItem={() => (
        <View
          style={[styles.mainView, { marginHorizontal: 10, borderRadius: 20 }]}
        >
          <View style={{ flex: 1, alignItems: "center", flexDirection: "row" }}>
            <ShimmerPlaceholder style={styles.imgStyle} />
            <View style={{ flex: 1, alignItems: "flex-start", marginLeft: 10 }}>
              <ShimmerPlaceholder style={{ margin: 5 }} />
              <ShimmerPlaceholder style={{ margin: 5 }} />
              <ShimmerPlaceholder style={{ margin: 5 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <ShimmerPlaceholder width={70} style={{ margin: 5 }} />
                <ShimmerPlaceholder width={70} style={{ margin: 5 }} />
              </View>
            </View>
          </View>
        </View>
      )}
    />
  );

  const BookingImage = ({ uri }) => (
    <SvgUri
      height={100}
      width={100}
      source={{ uri }}
      style={{ alignItems: "center", marginRight: 20 }}
    />
  );
  
  const renderBookings = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setSelectedBooking(item);
          setIsModalVisible(true);
        }}
        style={[styles.card, { backgroundColor: "white", borderTopWidth: 0.2 }]}
        key={index}
      >
        <View
          style={[
            // styles.rowBetween,
            {
              backgroundColor:
                // index % 2 === 0 ? "white" :
                "rgb(243, 251, 255)",
              padding: 5,
              flexDirection: "row",
            },
          ]}
        >
        <BookingImage uri={`https://booking.panchshilaclub.org${item?.facility_image}`} />
          <View style={{ flex: 1 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{item?.facility_name}</Text>
              <Icon
                name="chevron-right"
                size={20}
                color={"black"}
                style={{ marginLeft: "auto" }}
              />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.cardContent}>Booking Number: </Text>
              <Text style={styles.cardContent}>{item?.booking_number}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Icon
                name="calendar-month"
                size={20}
                // color={SECONDARY_COLOR}
                color={"black"}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.cardContent}>
                Booked {moment(item?.booking_date).format("Do MMM [on] h:mm A")}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="people"
                size={20}
                // color={"rgb(83, 112, 255)"}
                color={SECONDARY_COLOR}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.title, { color: SECONDARY_COLOR }]}>
                {item.guests.length} Player(s)
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.rowBetween, { marginTop: 5 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="access-time"
              size={20}
              // color={"rgb(83, 112, 255)"}
              color={"black"}
              style={{ marginRight: 5 }}
            />
            <Text>
              Slot Date: {moment(item?.slot_date).format("Do MMM YY")} at{" "}
              {item?.slot_label}
            </Text>
          </View>
          <Text
            style={[
              styles.cardContent,
              {
                backgroundColor:
                  item?.status === "Cancelled" ? LIGHT_RED : LIGHT_GREEN,
                color: item?.status === "Cancelled" ? "red" : SECONDARY_COLOR,
                padding: 5,
                borderRadius: 5,
                fontFamily: FONT_FAMILY.bold,
              },
            ]}
          >
            {item?.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header title={"My Bookings"} />
      <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={{
                  backgroundColor: LIGHT_BLUE,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                itemTextStyle={styles.itemContainerStyle}
                iconStyle={styles.iconStyle}
                data={[
                  { id: '', name: "All Activity" }, // default item at the top
                  ...(facilityQuery?.data?.data || []),
                ]}
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={"Select Activity"}
                value={type ?? 0}
                onChange={(item) => {
                  setType(item.id);
                }}
              />
      <View style={styles.tabContainer}>
        {tabs.map((tab,index) => (
          <TouchableOpacity
            key={tab.status}
            style={[styles.tab, status === tab.status && styles.activeTab]}
            onPress={() => { setBookingData([]),setStatus(tab.status), 
              setPage(1)}}
          >
            <Text
              style={
                status === tab.status ? styles.activeText : styles.inactiveText
              }
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookingData}
        keyExtractor={(item, index) => item?.booking_id?.toString() ?? `booking-${index}`}
        renderItem={renderBookings}
        ListEmptyComponent={
          bookingQuery.isLoading ? emptyList() : (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ fontSize: 16, color: "grey" }}>No Bookings found.</Text>
            </View>
          )
        }
        onEndReached={() => {
          const lastPage = bookingQuery?.data?.data?.last_page;
          if (lastPage && page < lastPage) {
            setPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        // onRefresh={onRefresh}
        refreshing={bookingQuery?.isRefetching}
        contentContainerStyle={{ paddingBottom: 20 }}
    
        ListFooterComponent={
          bookingQuery?.isFetchingNextPage ? <Text>Loading more...</Text> : null
        }
      />

{isModalVisible &&      <UniversalModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        isFull={true}
        title={"Booking Details"}
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <SvgUri
            height={100}
            width={100}
            source={{
              uri: `https://booking.panchshilaclub.org${selectedBooking?.facility_image}`,
            }}
            style={{ marginRight: 5, alignItems: "center", marginVertical: 10 }}
          />
          <View
            style={{
              backgroundColor: LIGHT_BLUE,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={styles.cardTitle}>
              {selectedBooking?.facility_name}
            </Text>
            <View style={[styles.rowBetween, { backgroundColor: LIGHT_BLUE }]}>
              <Text style={styles.cardContent}>Booking Number: </Text>
              <Text style={styles.cardContent}>
                {selectedBooking?.booking_number}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                backgroundColor: LIGHT_BLUE,
              }}
            >
              <Text style={styles.cardContent}>
                Booked{" "}
                {moment(selectedBooking?.booking_date).format(
                  "Do MMM [on] h:mm A"
                )}
              </Text>
            </View>
            <View style={[styles.rowBetween, { marginTop: 5 }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>
                  Slot Date:{" "}
                  {moment(selectedBooking?.slot_date).format("Do MMM YY")} at{" "}
                  {selectedBooking?.slot_label}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.title}>
                  {selectedBooking?.guests.length} Player(s)
                </Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              Guest Details:
            </Text>
            {selectedBooking?.guests.map((guest, index) => (
              <View
                key={index}
                style={{
                  marginTop: 5,
                  backgroundColor: "white",
                  padding: 10,
                  marginBottom: 10,
                  borderBottomWidth: 0.2,
                }}
              >
                <View style={styles.rowBetween}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name={
                        guest.occupant_id == 2 ? "person" : "card-membership"
                      }
                      size={20}
                      color={
                        "black"
                        // guest.occupant_id == 2
                        //   ? SECONDARY_COLOR
                        //   : "rgb(83, 112, 255)"
                      }
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.cardContent}>{guest.player_name}</Text>
                    <Text style={[styles.cardContent, { color: "grey" }]}>
                      {"  "}({guest.occupant_id == 2 ? "Guest" : "Member"})
                    </Text>
                  </View>
                  <Text style={styles.cardContent}>
                    ₹
                    {guest.occupant_id == 2
                      ? Number(guest.occupant_charge).toFixed(2)
                      : 0.0}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Text
            style={[
              styles.cardContent,
              { fontFamily: FONT_FAMILY.semiBold, marginTop: 10 },
            ]}
          >
            Payment Details
          </Text>
          <View style={[styles.rowBetween, { marginTop: 5 }]}>
            <Text style={[styles.cardContent, { color: "grey" }]}>
              Guest Charge:
            </Text>
            <Text style={styles.cardContent}>
              ₹
              {selectedBooking?.guests
                .reduce((acc, guest) => {
                  if (guest.occupant_id == 2) {
                    return acc + Number(guest.occupant_charge);
                  }
                  return acc;
                }, 0)
                .toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 5 }]}>
            <Text style={[styles.cardContent, { color: "grey" }]}>
              Activity Charge:
            </Text>
            <Text style={styles.cardContent}>
              ₹{Number(selectedBooking?.facility_amount).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 5 }]}>
            <Text style={[styles.cardContent, { color: "grey" }]}>
              Sub Total:
            </Text>
            <Text style={styles.cardContent}>
              ₹
              {selectedBooking &&
                calculateBooingSubTotal(selectedBooking)?.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 5 }]}>
            <Text style={[styles.cardContent]}>
              GST({selectedBooking?.facility_gst_per}%) :
            </Text>
            <Text style={styles.cardContent}>
              ₹
              {selectedBooking &&
                (
                  (calculateBooingSubTotal(selectedBooking) / 100) *
                  selectedBooking?.facility_gst_per
                ).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 20 }]}>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              Total Amount :
            </Text>
            <Text
              style={[styles.cardContent, { fontFamily: FONT_FAMILY.semiBold }]}
            >
              ₹
              {selectedBooking &&
                calculateBooingSubTotal(selectedBooking, true)?.toFixed(2)}
            </Text>
          </View>
          {selectedBooking?.status == "Active"  &&
            moment(selectedBooking?.slot_date, "YYYY-MM-DD")
              .subtract(24, "hours")
              .isAfter(moment()) && (
              <CancelButton
                text={"Cancel Booking"}
                onPress={handleCancelBooking}
                loading={false}
              />
          )}
        </ScrollView>
      </UniversalModal>}
    </View>
  );
};

export default MyBookings;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
  },
  card: {
    // padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedTextStyle: { color: "black", fontFamily: FONT_FAMILY.normal },
  dropdown:{margin:10,backgroundColor:LIGHT_BLUE,padding:10,borderRadius:10},
  itemContainerStyle: { color: "grey", fontFamily: FONT_FAMILY.normal },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.bold,
    color: DARK_BLUE,
    marginBottom: 5,
  },
  placeholderStyle: {
    color: "grey",
    fontFamily: FONT_FAMILY.normal,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.normal,
    color: "black",
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
  },
  cardTime: {
    fontSize: 12,
    color: "#888",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeTab: {
    backgroundColor: DARK_BLUE,
  },
  activeText: {
    color: "#fff",
    fontFamily: FONT_FAMILY.bold,
  },
  inactiveText: {
    color: "#000",
    fontFamily: FONT_FAMILY.light,
  },
  mainView: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  imgStyle: {
    height: "auto",
    width: "40%",
    resizeMode: "cover",
    minHeight: 120,
    borderRadius: 10,
    marginRight: 10,
  },
});
