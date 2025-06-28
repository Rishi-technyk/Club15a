import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import * as api from "../util/api";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import SvgUri from "react-native-svg-uri";

const AllFacilities = ({ navigation }) => {
    const [options, setOptions] = useState([]);
    
  const fetchFacilities = async () => {
    try {
      const summeryObject = { path: ENDPOINT.get_facility,body:{} };
        const response = await api.javascriptGet(summeryObject);
        console.log(
          response,
          "------------------------------------Facilities-------------------------"
        );
        if (response.status) {
          setOptions(response.data);
        }
    } catch (error) {
        console.log(error);
    }
  };
  useEffect(() => {
    fetchFacilities();
  }, []);
  const renderFacilities = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Facility", { facility: item })}
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 20,
          },
        ]}>
        <SvgUri
          height={40}
          width={40}
          source={{
            uri: `https://booking.panchshilaclub.org${item?.first_image}`,
          }}
        />
        {/* <View style={{}}> */}
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.normal,
              color: "grey",
              fontSize: 15,
              textAlign: "center",
            }}>
            {item.name}
          </Text>
        </View>

        {/* </View> */}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title={"All Facilities"} />
      <View style={styles.listView}>
     
        <FlatList
          scrollEnabled={true}
          data={options}
          numColumns={2}
          contentContainerStyle={{}}
          keyExtractor={(item, index) => index}
          renderItem={renderFacilities}
        />
      </View>
    </View>
  );
};

export default AllFacilities;

const styles = StyleSheet.create({});
