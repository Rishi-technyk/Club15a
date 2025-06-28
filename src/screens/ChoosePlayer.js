import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "../components/Header";
import { usePlayers } from "./FacilityService";
import { useSelector } from "react-redux";
import {
  DARK_BLUE,
  LIGHT_BLUE,
  LIGHT_GREEN,
  SECONDARY_COLOR,
} from "../util/colors";
import { Card, Checkbox } from "react-native-paper";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import moment from "moment";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import UniversalModal from "../components/UniversalModal";
import NewButton from "../components/Button";
import _ from "lodash";
import PickPlayers from "./PickPlayers";
import * as api from "../util/api";
import { Toast } from "react-native-toast-notifications";
import { CustomCheckbox } from "../components/CustomCheckBox";
import CancelButton from "../components/CancelButton";
const ChoosePlayer = ({ route, navigation }) => {
  const userData = useSelector((state) => state.auth.userData);
  const params = route.params;
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchPlayer, setSearchPlayer] = useState(null);
  const [slots, setSlots] = useState(params.slots);
  const facility = params.facility;
  const [agree, setAgree] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [loading, setLoading] = useState(false);
  const { guestQuery, gameQuery } = usePlayers(
    1,
    debouncedSearch,
    facility?.id,
    userData
  );
  const subTotal = useMemo(() => {
    // Base amount: facility charge * number of slots
    const baseAmount = Number(facility.charge || 0) * slots.length;

    // Sum of all player charges
    const extraCharges = slots?.reduce((total, item) => {
      const playerTotal =
        item.players?.reduce((acc, player) => {
          return acc + Number(player?.charge || 0);
        }, 0) || 0;

      return total + playerTotal;
    }, 0);

    const totalAmount = baseAmount + extraCharges;
    return Number(totalAmount).toFixed(2);
  }, [facility.charge, slots]);

  const handleBookFacility = async () => {
    Toast.hideAll();
    if (!agree) {
      Toast.show("Please accept the terms and conditions.", {
        type: "warning",
      });
      return;
    }
    if (slots.length === 0) {
      Toast.show("Please select at least one slot.", {
        type: "warning",
      });
      return;
    }
    if (slots.some((slot) => !slot.players)) {
      Toast.show("Please select at least one player for each slot", {
        type: "warning",
      });

      return;
    }
    const apiobject = {
      path: ENDPOINT.book_facilities,
      body: {
        memberId: userData.data.data[0].MemberID,
        slots,
      },
    };
    try {
      setLoading(true);
      const response = await api.javascriptPost(apiobject);
      setLoading(false);
      if (response?.status) {
        Toast.show(response?.message, {
          type: "success",
        });
        setSlots([]);
        setSearch("");
        setAgree(false);
        setSelectedFacility(null);
        setSelectedSlot(null);
        setShowPolicies(false);
        setSearchPlayer(false);
        setDebouncedSearch("");
        navigation.addListener("focus", () => {
          navigation.navigate("Home");
        });
        navigation.navigate("Home");
      } else {
        Toast.show(response?.message, {
          type: "danger",
        });
      }
    } catch (error) {
      Toast.show("Error occurred while booking facility", {
        type: "danger",
      });
    }
  };
  const toastRef = useRef(null);
  console.log(selectedFacility, "selectedSlot");
  useEffect(() => {
    const handler = _.debounce(() => {
      setDebouncedSearch(search);
    }, 500);

    handler();

    return () => handler.cancel();
  }, [search]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title={"Booking Summary"} />
      <ScrollView contentContainerStyle={{ margin: 10 }}>
        <Text
          style={[
            styles.price,
            { fontSize: 18, fontFamily: FONT_FAMILY.semiBold },
          ]}
        >
          {slots.length + ` ${slots.length > 1 ? "Slots" : "Slot"} Selected`}
        </Text>

        <FlatList
          contentContainerStyle={{
            flex: 1,
            borderRadius: 10,
            marginVertical: 12,
          }}
          key={({ item }) => item.id}
          scrollEnabled={false}
          data={slots}
          renderItem={({ item, index }) => (
            <View
              style={{
                paddingBottom: 10,
                backgroundColor: index % 2 !== 0 ? "white" : LIGHT_BLUE,
                padding: 10,
              }}
            >
              <View
                key={index}
                style={[
                  styles.rowCenter,
                  {
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View>
                  <Text
                    style={[styles.price, { fontFamily: FONT_FAMILY.semiBold }]}
                  >
                    {facility?.name}
                  </Text>
                  <Text style={[styles.price]}>
                    {`${moment(item?.time?.name, "HHmm").format(
                      "hh:mm A"
                    )} to ${moment(item?.time?.name.slice(5, 8), "HHmm").format(
                      "hh:mm A"
                    )}`}{" "}
                  </Text>
                  <Text
                    style={[styles.price, { fontFamily: FONT_FAMILY.semiBold }]}
                  >
                    {moment(item?.day?.session_date).format("DD-MMMM-YYYY")}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[styles.price, { fontFamily: FONT_FAMILY.bold }]}
                  >
                    1 Slot
                  </Text>
                  <Text
                    style={[styles.price, { fontFamily: FONT_FAMILY.normal }]}
                  >
                    ₹{facility.charge}
                  </Text>
                </View>
              </View>
              {Array.isArray(item.players) &&
                item.players.map((player, index) => (
                  <View
                    style={[
                      styles.rowCenter,
                      {
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      },
                    ]}
                    key={index}
                  >
                    {/* <Text style={styles.price}>Player {index+1}</Text> */}

                    <Text style={[styles.price2, { textAlign: "left" }]}>
                      <Text>
                        {index + 1}. {player.DisplayName}
                      </Text>{" "}
                      (
                      {player.occupant_id == 2 ? "Non Memebr" : player.MemberID}
                      )
                    </Text>
                    <Text
                      style={[styles.price, { fontFamily: FONT_FAMILY.normal }]}
                    >
                      ₹{player.charge}
                    </Text>
                  </View>
                ))}
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <CancelButton
                  text={"Remove Slot"}
                  onPress={() => {
                    LayoutAnimation.configureNext({
                      duration: 300,
                      create: {
                        type: LayoutAnimation.Types.linear,
                        property: LayoutAnimation.Properties.opacity,
                      },
                      delete: {
                        type: LayoutAnimation.Types.linear,
                        property: LayoutAnimation.Properties.opacity,
                      },
                      update: {
                        type: LayoutAnimation.Types.linear,
                        property: LayoutAnimation.Properties.opacity,
                      },
                    });
                    console.log(
                      "\x1b[36m%s\x1b[0m",
                      slots.length,
                      "----------------------  slots.length ---------------------"
                    );
                    slots.length !== 1
                      ? setSlots(slots.filter((_, i) => i !== index))
                      : navigation.goBack();
                  }}
                />
                {item.players?.length > 0 ? (
                  <CancelButton
                    onPress={() => {
                      LayoutAnimation.configureNext({
                        duration: 300,
                        create: {
                          type: LayoutAnimation.Types.linear,
                          property: LayoutAnimation.Properties.opacity,
                        },
                        update: {
                          type: LayoutAnimation.Types.linear,
                          property: LayoutAnimation.Properties.opacity,
                        },
                        delete: {
                          type: LayoutAnimation.Types.linear,
                          property: LayoutAnimation.Properties.opacity,
                        },
                      });
                      setSlots((prev) => {
                        const updatedSlots = [...prev];
                        updatedSlots[index] = {
                          ...updatedSlots[index],
                          players: null,
                        };
                        return updatedSlots;
                      });
                    }}
                    style={[
                      styles.price,
                      {
                        color: "red",
                        fontFamily: FONT_FAMILY.semiBold,
                      },
                    ]}
                    text={"Clear All Players"}
                  />
                ) : (
                  <NewButton
                    onPress={() => {
                      setSearchPlayer(true);
                      setSelectedFacility(facility);
                      setSelectedSlot(item);
                    }}
                    text={"Select Player(s)"}
                  />
                )}
              </View>
            </View>
          )}
        />

        <Card style={{ backgroundColor: "white", padding: 10 }}>
          <Text
            style={[
              styles.price,
              { fontSize: 18, fontFamily: FONT_FAMILY.bold },
            ]}
          >
            Payment Summary
          </Text>
          <View style={[styles.rowCenter, { justifyContent: "space-between" }]}>
            <Text style={styles.price2}>Sub Total:</Text>
            <Text style={styles.price2}>₹{subTotal || 0.0}</Text>
          </View>
          <View
            style={[
              styles.rowCenter,
              {
                justifyContent: "space-between",
                borderBottomWidth: 0.5,
                paddingBottom: 5,
                borderBottomColor: "grey",
              },
            ]}
          >
            <Text style={styles.price2}>GST ({facility.GSTper || 0}%) :</Text>
            <Text style={styles.price2}>
              ₹{Number((subTotal / 100) * facility.GSTper).toFixed(2) || 0.0}
            </Text>
          </View>
          <View
            style={[
              styles.rowCenter,
              { justifyContent: "space-between", marginTop: 10 },
            ]}
          >
            <Text style={styles.price}>Grand Total:</Text>
            <Text style={[styles.price, { fontFamily: FONT_FAMILY.bold }]}>
              ₹
              {Number(
                (subTotal / 100) * facility.GSTper + Number(subTotal)
              ).toFixed(2)}
            </Text>
          </View>
        </Card>
        <TouchableOpacity
          onPress={() => setShowPolicies(true)}
          activeOpacity={0.9}
          style={[styles.rowCenter, { marginTop: 10 }]}
        >
          <CustomCheckbox
            onToggle={() => setShowPolicies(true)}
            checked={agree}
            color={SECONDARY_COLOR}
          />
          <Text style={styles.price2}>
            I agree
            <Text style={[styles.price, { textDecorationLine: "underline" }]}>
              {" "}
              Terms & Conditions
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          paddingTop: 10,
          backgroundColor: "#fff", // Required for shadow to appear
          elevation: 3, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: {
            width: 0,
            height: -3, // Negative height to show shadow from the top
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          // onPress={() => setShowPolicies(true)}
        >
          <Text
            style={[
              styles.price,
              { fontFamily: FONT_FAMILY.bold, fontSize: 16 },
            ]}
          >
            ₹
            {Number(
              (subTotal / 100) * facility.GSTper + Number(subTotal)
            ).toFixed(2)}{" "}
          </Text>
          <View style={styles.rowCenter}>
            <Text
              style={[
                styles.price,
                { textDecorationLine: "underline", color: "grey" },
              ]}
            >
              of {slots.length + ` ${slots.length > 1 ? "Slots" : "Slot"}`}
            </Text>
          </View>
        </TouchableOpacity>
        <NewButton
          text={"Check out"}
          loading={loading}
          onPress={handleBookFacility}
        />
      </View>
      <UniversalModal
        visible={showPolicies}
        setVisible={setShowPolicies}
        title={"Terms & Conditions"}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.price,
              { fontSize: 16, fontFamily: FONT_FAMILY.semiBold, color: "red" },
            ]}
          >
            Cancellation policy
          </Text>
          <Text style={styles.price}>
            <Text style={[styles.price, { fontFamily: FONT_FAMILY.semiBold }]}>
              {` \n\n We understand that plans can change. However, to ensure fairness to all participants and to maintain operational efficiency, the following cancellation policy applies:`}
            </Text>
            {`\n\nCancellations made within ${
              gameQuery.data?.data?.cancellation_policy[0]?.from_days || 0
            } to ${
              gameQuery.data?.data?.cancellation_policy[0]?.to_days || 10
            } days of the scheduled game will incur: ${
              gameQuery.data?.data?.cancellation_policy[0]?.deduction || 10
            }% cancellation fee of the total booking amount. ${
              gameQuery.data?.data?.cancellation_policy[0]?.GST || 10
            }% GST applicable on the cancellation fee. Theremaining amount (after deductions) will be refunded to the original payment method within 5–7 business days. For any queries or assistance, please contact our support team.`}
          </Text>
        </View>
        <View style={{ alignSelf: "flex-end", justifyContent: "flex-end" }}>
          <NewButton
            text={"Accept"}
            onPress={() => {
              setAgree(true), setShowPolicies(false), setLoading(false);
            }}
          />
        </View>
      </UniversalModal>

      {searchPlayer && (
        <PickPlayers
          facility={selectedFacility}
          searchPlayer={searchPlayer}
          setSearchPlayer={setSearchPlayer}
          guestQuery={guestQuery?.data?.data}
          setSlot={setSlots}
          slots={slots}
          search={search}
          setSearch={setSearch}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          gameType={gameQuery?.data?.data}
          toastRef={toastRef}
        />
      )}
    </View>
  );
};

export default ChoosePlayer;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 16,
    backgroundColor: "#fff",
    color: "black",
    fontFamily: FONT_FAMILY.normal,
  },
  price: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.normal,
    color: DARK_BLUE,
  },
  price2: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.normal,
    color: "grey",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  itemContainerStyle: {
    fontSize: 16,
    color: "#000",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
