import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import Header from "../../components/Header";
import { FONT_FAMILY } from "../../util/constant";
import { DARK_BLUE } from "../../util/colors";

const NotificationDetailScreen = ({ route, navigation }) => {
  const { data } = route?.params;
  const [isModalVisible, setModalVisible] = useState(false);

  const handleImagePress = () => {
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <Header title={"Details"} />
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Image
              style={styles.closeButtonText}
              source={require("../../assets/images/x-button.png")}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: data?.image }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
      <View style={styles.boxcontainer}>
        <Image
          source={{
            uri: data?.image,
          }}
          style={styles.imgStyle}
        />
        <TouchableOpacity
          onPress={handleImagePress}
          activeOpacity={0.5}
          style={styles.expandButton}>
          <Image
            style={styles.expandIcon}
            source={require("../../assets/images/expand.png")}
          />
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false} style={{ top: -25 }}>
          <View style={styles.timeView}>
            <Text style={styles.mainText}>{data?.title}</Text>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <Icon name="calendar-month" color={DARK_BLUE} size={17} />
                <Text style={styles.dateText}>
                  {moment(data?.date).format("DD MMM YYYY")}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Icon name="access-time-filled" color={DARK_BLUE} size={17} />

                <Text style={styles.dateText}>
                  {moment(data?.time, "HH:mm:ss").format("h:mm A")}
                </Text>
              </View>
            </View>
            <View style={{ ...styles.rowView, marginTop: 15 }}>
              <Icon name="location-pin" color={DARK_BLUE} size={17} />
              <View style={{ width: "80%" }}>
                <Text style={styles.dateText}>{data?.address}</Text>
              </View>
            </View>
          </View>
          <View style={styles.mainView}>
            <Text style={styles.short_descText}>Short Description</Text>
            <Text
              style={{ marginBottom: 15, fontFamily: FONT_FAMILY.semiBold,color:'black' }}>
              {data?.short_descriptions}
            </Text>
            <Text style={styles.descText}>Description</Text>
            <RenderHTML
              source={{ html: data?.description }}
              contentWidth={width - 60}
              baseStyle={{ fontFamily: FONT_FAMILY.normal,color:'black' }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxcontainer: {
    flex: 1,
  },

  imgStyle: {
    height: 295,
    resizeMode: "cover",
  },
  timeView: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 0,

    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 8,
  },
  mainText: {
    fontSize: 20,
    fontWeight: "500",
    // fontFamily: 'Lato-Bold',
    color: "#464646",
    marginBottom: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.normal,
    color: "#464646",
    marginLeft: 8,
    textAlign: "left",
  },
  expandButton: {
    backgroundColor: "white",
    top: 0,
    right: 6,
    position: "absolute",
    padding: 10,
    borderRadius: 10,
  },
  mainView: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 0,

    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 8,
    padding: 20,
  },
  short_descText: {
    // marginTop: 5,
    fontSize: 16,
    fontFamily: FONT_FAMILY.semiBold,
    color: "#89919e",
    marginBottom: 10,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  descText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONT_FAMILY.semiBold,
    color: "#89919e",
  },
  closeButton: {
    position: "absolute",
    padding: 15,
    top: 50,
    right: 6,
    zIndex: 1,
  },
  closeButtonText: {
    height: 15,
    width: 15,
  },
  expandIcon: {
    height: 20,
    width: 20,
  },
  description: {
    fontSize: 13,
    fontWeight: "300",
    // fontFamily: 'Lato-Regular',
    color: "#464646",
  },
});

export default NotificationDetailScreen;
