import {
  Alert,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import { DARK_BLUE, LIGHT_BLUE, SECONDARY_COLOR } from "../util/colors";
import { Card, Checkbox } from "react-native-paper";
import UniversalModal from "../components/UniversalModal";
import _ from "lodash";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Entypo";
import NewButton from "../components/Button";
import { CustomCheckbox } from "../components/CustomCheckBox";

const PickPlayers = ({
  facility,
  searchPlayer = false,
  setSearchPlayer,
  gameType,
  guestQuery,
  selectedSlot,
  setSelectedSlot,
  setSlot,
  slots,
  search,
  setSearch,
  toastRef
}) => {
  const userData = useSelector((state) => state.auth.userData);

  const [selectedGameType, setGameType] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [newPlayer, setNewPlayer] = useState(false);
  const [addNewPlayer, setAddNewPlayer] = useState({
    name: "",
    email: "",
    mobile: "",
  });
console.log('\x1b[36m%s\x1b[0m', newPlayer, '---------------------- newPlayer ---------------------');

  const handlePlayerSelect = (item) => {
  
    if (!selectedGameType) {
      Alert.alert("Please select a game type first.");
      return;
    }
    if (selectedGameType?.no_of_players == selectedPlayers?.length) {
      Alert.alert(
        `You can only select up to ${selectedGameType.no_of_players} players.`
      );
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!selectedPlayers) {
      setSelectedPlayers([
        {
          DisplayName: item.DisplayName,
          MemberID: item.MemberID,
          charge: item.charge || 0,
          occupant_id: item.occupant_id ||'1',
          mobile: item.mobile,
          email: item.email,
        },
      ]);
    } else {
      setSelectedPlayers((prev) => [
        {
          DisplayName: item.DisplayName,
          MemberID: item.MemberID,
       
          charge: item.charge || 0,
          occupant_id: item.occupant_id ||'1',
          mobile: item.mobile,
          email: item.email,
        },
        ...prev,
      ]);
    }
  };
  const handleGameTypeChange = (game) => {
    if (selectedPlayers?.length > 0) {
      Alert.alert(
        "Are you sure?",
        "Changing the game type will remove all selected players.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              setSelectedPlayers([]);
              setGameType(game);
            },
          },
        ]
      );
      return;
    }
    setGameType(game);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const handleDeletePlayer = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedPlayers(selectedPlayers.filter((_, i) => i !== index));
  };
  const renderMembers = ({ item }) => {
  
  if(selectedPlayers?.some((player) => player.DisplayName === item.DisplayName && player.MemberID === item.MemberID)) {
    return null; // Skip rendering if the player is already selected
  }
   
  
    return (
      <TouchableOpacity
        onPress={() => {
          handlePlayerSelect(item);
        }}
        style={{
          margin: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.price}>{item.DisplayName}  <Text style={styles.price2}> ({item.occupant_id == 2 ?'Non Memebr':item.MemberID })  </Text></Text>
        <Text style={styles.price}>₹{item.charge ||0}</Text>
      </TouchableOpacity>
    );
  };
  const handlePlayerChange = (value, label) => {
    setAddNewPlayer((prev) => ({ ...prev, [label]: value }));
  };
  const handleAddNewGuest = async () => {
    if (!addNewPlayer.name.trim()) {
      Alert.alert("Name is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addNewPlayer.email)) {
      //  ToastAndroid.TOP("Enter a valid email address");
      Alert.alert("Enter a valid email address");

      return;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(addNewPlayer.mobile)) {
      Alert.alert("Enter a valid 10-digit mobile number");
      return;
    }

    if (selectedGameType?.no_of_players == selectedPlayers?.length) {
      Alert.alert(
        `You can only select up to ${selectedGameType.no_of_players} players.`
      );
      return;
    }
    const apiobject = {
      path: ENDPOINT.create_activity_guest,
      body: {
        name: addNewPlayer.name,
        email: addNewPlayer.email,
        mobile: addNewPlayer.mobile,
        game_type: selectedGameType?.id,
        member_id: userData.data.data[0].MemberID,
        occupant_id: 2,
      },
    };

    if (response.success) {
      setAddNewPlayer({ name: "", email: "", mobile: "" });
      setNewPlayer(false);
      Alert.alert(response.message);
    }
    if (!response.success) {
      // Loop through the message object and show an alert for each error
      for (let field in response.message) {
        response.message[field].forEach((error) => {
          Alert.alert(` ${error}`);
        });
      }
    }
  };
 
  const handleProceedPlayers = () => {
    setSlot(
      slots.map((item) => {
        if (
          item.day.id === selectedSlot.day.id &&
          item.time.id === selectedSlot.time.id
        ) {
          const guestTotal = selectedPlayers.reduce(
            (acc, player) => acc + Number(player?.charge || 0),
            0
          );
          const subtotal = Number(facility.charge) + guestTotal;
          const gstAmount = Number(facility?.GSTper)
            ? (subtotal * Number(facility.GSTper)) / 100
            : 0;
          const totalWithGst = subtotal + gstAmount;
          return {
            ...item,
            players: selectedPlayers,
            game_type_id: selectedGameType?.id,
            charge: facility.charge,
            guest_total_amount: guestTotal,
            facility_gst_per: facility?.GSTper,
            facility_gst_amt: gstAmount,
            facility_total: totalWithGst,
          };
        }
        return item;
      })
    );
    setSelectedSlot(null);
    setSearchPlayer(false);
  };

  return (
    <UniversalModal
      visible={searchPlayer}
      title={"Pick Player(s)"}
      isFull={true}
      setVisible={() => setSearchPlayer(false)}
    >
        <Text style={[styles.price3,{marginVertical:10}]}>Game Type:</Text>
        <Card style={{backgroundColor:LIGHT_BLUE,borderRadius:8,padding:10}}>

      <View style={[styles.rowCenter, { justifyContent: "space-between",}]}>

        {gameType?.gameTypes.map((i) => (
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleGameTypeChange(i)}
          style={{
            //   marginLeft: "3%",
            alignItems: "center",
            backgroundColor:LIGHT_BLUE ,padding:8,borderRadius:8
          }}
          >
            <CustomCheckbox
             onToggle={() => handleGameTypeChange(i)}
             checked={selectedGameType?.id === i?.id }
             
             />
            <Text
              style={[
                styles.price,
                {
                  fontFamily: FONT_FAMILY.bold,
                  color: gameType?.id == i?.id ? "black" : "black",
                },
              ]}
              >
              {i.name}
            </Text>
            <Text style={[styles.price]}>
              {i.no_of_players} {i.no_of_players > 1 ? "Players" : "Player"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        </Card>
      {selectedPlayers?.map((item, index) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
            padding: 10,
            elevation: 2,
            borderRadius: 10,
            backgroundColor: "white",
          }}
        >
        <Text style={styles.price}>{item.DisplayName}  <Text style={styles.price2}> ({item.occupant_id == 2 ?'Non Memebr':item.MemberID })  </Text></Text>
          <Text style={styles.price}>₹{item?.charge || "0"}</Text>
          <Icon
            name={"trash"}
            size={17}
            color={"red"}
            onPress={() => handleDeletePlayer(index)}
          />
        </View>
      ))}
      <View
        style={[
          styles.rowCenter,
          { justifyContent: "space-between", marginHorizontal: 10 },
        ]}
      >
        <Text
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setNewPlayer((prev) => !prev);
          }}
          style={[
            styles.price,
            { fontFamily: FONT_FAMILY.bold, color: SECONDARY_COLOR,marginTop:20 },
          ]}
        >
          {newPlayer ? "Search Member" : "+ Add Player"}
        </Text>
        {selectedGameType?.no_of_players == selectedPlayers?.length &&
          selectedGameType && (
            <NewButton onPress={handleProceedPlayers} text={"Proceed"} />
          )}
      </View>
      {newPlayer ? (
        <View>
          <TextInput
            value={addNewPlayer.name}
            placeholderTextColor="grey"
            style={styles.dropdown}
            onChangeText={(text) => handlePlayerChange(text, "name")}
            placeholder="Enter player name"
            cursorColor={SECONDARY_COLOR}
            maxLength={50}
          />
          <TextInput
            value={addNewPlayer.mobile}
            placeholderTextColor="grey"
            style={styles.dropdown}
            onChangeText={(text) => handlePlayerChange(text, "mobile")}
            placeholder="Enter player mobile"
            keyboardType="decimal-pad"
            cursorColor={SECONDARY_COLOR}
            maxLength={10}
          />
          <TextInput
            value={addNewPlayer.email}
            cursorColor={SECONDARY_COLOR}
            placeholderTextColor="grey"
            style={styles.dropdown}
            onChangeText={(text) => handlePlayerChange(text, "email")}
            placeholder="Enter player email"
            keyboardType="email-address"
            maxLength={100}
          />
          <NewButton onPress={handleAddNewGuest} text={"+ Add"} />
        </View>
      ) : (
        <TextInput
          value={search}
          placeholderTextColor="grey"
          style={[styles.dropdown,]}
          onChangeText={(text) => setSearch(text)}
          cursorColor={SECONDARY_COLOR}
          placeholder="Enter member name / id"
        />
      )}
      <FlatList
        //   scrollEnabled={false}
        data={guestQuery?.data}
        renderItem={renderMembers}
      />
    </UniversalModal>
  );
};

export default PickPlayers;

const styles = StyleSheet.create({
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
  price3: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.bold,
    color: "black",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
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
});
