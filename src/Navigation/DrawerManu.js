import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Drawer } from "react-native-paper";

const DrawerMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Settings Icon */}
      <TouchableOpacity
        onPress={() => setIsDrawerOpen(true)}
        style={{ margin: 15 }}>
        <Image
          source={require("../../assets/images/settings.png")}
          style={{ height: 22, width: 22, tintColor: "black" }}
        />
      </TouchableOpacity>

      {/* Custom Drawer */}
      {isDrawerOpen && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 250,
            height: "100%",
            backgroundColor: "white",
          }}>
          <Drawer.Section>
            <Drawer.Item
              label="Home"
              icon="home"
              onPress={() => console.log("Home Pressed")}
            />
            <Drawer.Item
              label="Profile"
              icon="account"
              onPress={() => console.log("Profile Pressed")}
            />
            <Drawer.Item
              label="Settings"
              icon="cog"
              onPress={() => console.log("Settings Pressed")}
            />
          </Drawer.Section>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setIsDrawerOpen(false)}
            style={{ margin: 10 }}>
            <Image
              source={require("../../assets/images/close.png")}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DrawerMenu;
