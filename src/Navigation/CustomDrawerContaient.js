import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Drawer } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import Icons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { javascriptPost } from "../util/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerLogout } from "../store/actions/authActions";
import DeviceInfo from "react-native-device-info";
const Version = DeviceInfo.getVersion()
export const CustomDrawerContent = (props) => {
  const data = useSelector((state) => state?.auth?.userData?.data?.data);
  const dispatch=useDispatch()
    const [url, seturl] = useState(null);
     const fetchUrl = async () => {
  
        try {
          const apiRequestObject = {
            path: "",
            body: {
              ws_type: ENDPOINT.documents,
            },
          };      
          const response = await javascriptPost(apiRequestObject);

          seturl(response.data)
        } catch (err) {
            console.log(err,"eklnsdfsdklfsdfklds")
          return alert('Somthing went wroung.')
        }
      };
      useEffect(() => {
        fetchUrl();
      }, []);
      const _promptForLogout = () => {
        Alert.alert(
          "Logout",
          "Are you sure, you want to logout?",
          [
            {
              text: "Yes",
              onPress: async () => {
                await AsyncStorage.clear();

                dispatch(triggerLogout());
                props.navigation.reset({
                  routes: [{ name: "LoginScreen" }],
                });
              },
            },
            { text: "No" },
          ],
          { cancelable: false }
        );
      };
  return (
    <>
      <DrawerContentScrollView {...props}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => props.navigation.navigate("Profile")}
          style={{ marginTop: 10, alignItems: "center" }}>
          <Avatar.Image
            size={60}
            source={{ uri: Array.isArray(data) && data[0].profile_image ? `https://teebooking.aepta.in/api/profile_pictures/${data[0].profile_image}`:"https://randomuser.me/api/portraits/men/1.jpg" }}
            style={{ backgroundColor: "white" }}
          />
          <Icons
            name="account-edit"
            color={"white"}
            size={25}
            style={{
              position: "absolute",
              alignItems: "center",
              right: "35%",
              bottom: "0%",
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            fontSize: 20,
            fontFamily: FONT_FAMILY.bold,
            color: "white",
            textAlign: "center",
          }}>
          Hi, {data ? data[0].DisplayName : "User"}
        </Text>
        <Drawer.Section>
          <DrawerItem
            icon={({ color, size }) => (
              <Icons name="eye-refresh" color={"white"} size={size} />
            )}
            label="Change password"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() => props.navigation.navigate("ChangePassword")}
          />
          {/* <DrawerItem
            icon={({ color, size }) => (
              <Icons name="clipboard-list" color={"white"} size={size} />
            )}
            label="My Bookings"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Bookings", {
                index: -1,
                name: "Bookings",
              })
            }
          /> */}
          <DrawerItem
            icon={({ color, size }) => (
              <Icons name="account-lock" color={"white"} size={size} />
            )}
            label="Privacy Policy"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Info", {
                index: 0,
                name: "Privacy Policy",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icons
                name="clipboard-list-outline"
                color={"white"}
                size={size}
              />
            )}
            label="Terms & Conditions"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Info", {
                index: 1,
                name: "Terms & Conditions",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="warning" color={"white"} size={size} />
            )}
            label="Disclaimer"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Info", {
                index:2,
                name: "Disclaimer",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icons name="shield-refresh" color={"white"} size={size} />
            )}
            label="Cancellation & Refund Policy"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Info", {
                index: 3,
                name: "Cancellation & Refund Policy",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="information-circle-outline"
                color={"white"}
                size={size}
              />
            )}
            label="About Us"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Info", {
                index:4,
                name: "About Us",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icons name="contacts-outline" color={"white"} size={size} />
            )}
            label="Contact Us"
            labelStyle={{ color: "white", fontFamily: FONT_FAMILY.normal }}
            onPress={() =>
              props.navigation.navigate("Contact", {
                url: url?.contact_us,
                name: "Contact Us",
              })
            }
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="exit-outline" color={"red"} size={size} />
            )}
            label="Logout"
            labelStyle={{ color: "red", fontFamily: FONT_FAMILY.normal }}
            onPress={_promptForLogout}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <View style={{ alignItems: "center", paddingBottom: 20 }}>
        <Text
          style={{
            color: "grey",
            fontSize: 14,
            fontFamily: FONT_FAMILY.normal,
          }}>
          Version {Version}
        </Text>
      </View>
    </>
  );
}