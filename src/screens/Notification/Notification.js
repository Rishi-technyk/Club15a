import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import {notificationList} from './NotificationService';
import moment from 'moment';
import {DARK_BLUE, SECONDARY_COLOR} from '../../util/colors';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import Header from '../../components/Header';
import { FONT_FAMILY } from '../../util/constant';
import { Card } from 'react-native-paper';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const NotificationListScreen = ({ navigation, route }) => {
  const [notificationdata, setData] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
 
  const fetchNotifications = async () => {
    try {
      const fetchData = await notificationList(userData.data.token);
console.log('\x1b[36m%s\x1b[0m', fetchData, '---------------------- notificationdata[0] ---------------------');

      fetchData ? setData(fetchData) : setData(null);
    } catch (error) {}
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

     useEffect(() => {
    if (route.params?.id) {
      const notificationId = route.params.id;
      const selectedNotification = notificationdata?.find(
        (item) => item.id === notificationId
      );
      if (selectedNotification) {
        navigation.navigate("NotificationDetailScreen", { data: selectedNotification });
      }
    }
  }, [notificationdata]);
  const renderItem = ({ item }) => (
    <Card
      onPress={() =>
        navigation.navigate("NotificationDetailScreen", { data: item })
      }
      style={styles.mainView}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
          source={{
            uri: item?.image,
          }}
          resizeMode='cover'
          style={styles.imgStyle}
        />

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.mainText} numberOfLines={2}>
              {item?.title}
            </Text>
            <View>
              <Icon name="keyboard-arrow-right" color={"black"} size={25} />
            </View>
          </View>
          <Text style={styles.seeText} numberOfLines={2}>
            {item.short_descriptions}
          </Text>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Icon name="calendar-month" color={DARK_BLUE} size={17} />
              <Text style={styles.dateText}>
                {moment(item?.date).format("DD MMM YYYY")}
              </Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Icon name="access-time-filled" color={DARK_BLUE} size={17} />

              <Text style={styles.dateText}>
                {moment(item?.time, "HH:mm:ss").format("h:mm A")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title={"Circulars"} />

      <FlatList
        data={notificationdata}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={{ marginHorizontal: 10, }}
        ListEmptyComponent={
          notificationdata === null ? (
            <View style={styles.noNotificationContainer}>
              <Text style={styles.noNotificationText}>No record found.</Text>
            </View>
          ) : (
            emptyList
          )
        }
      />
    </View>
  );
};
  const emptyList = () => (
    <FlatList
      data={[1, 1, 1, 1, 1, 1]}
      renderItem={() => (
        <View
          style={[styles.mainView, { marginHorizontal: 10, borderRadius: 20 }]}>
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
                }}>
                <ShimmerPlaceholder width={70} style={{ margin: 5 }} />
                <ShimmerPlaceholder width={70} style={{ margin: 5 }} />
              </View>
            </View>
          </View>
        </View>
      )}
    />
  );
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noNotificationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noNotificationText: {
    fontFamily: FONT_FAMILY.semiBold,
    color: "grey",
    fontSize: 16,
  },
  notificationItem: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  body: {
    margin: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 16,
  },
  mainView: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
  },
  imgStyle: {
    height: "auto",
    width: "40%",
    resizeMode: "cover",
    minHeight: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  mainText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONT_FAMILY.semiBold,
    color: "black",
    marginBottom: 8,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY.semiBold,
    color: DARK_BLUE,
    marginLeft: 5,
  },
  seeText: {
    fontFamily: FONT_FAMILY.normal,
    fontSize: 15,
    color:'grey'
  },
  
});

export default NotificationListScreen;
