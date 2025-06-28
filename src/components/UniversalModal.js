import React, { useEffect, useRef } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ModalStyles } from "../Styles/ModalStyles";
import RNModal from "react-native-modal";
import { Toast, useToast } from "react-native-toast-notifications";

const UniversalModal = ({ visible, setVisible, children, title, isFull = false }) => {

 
  
  return (
    <RNModal
      isVisible={visible}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection="down"
      onBackdropPress={() => setVisible(false)}
      useNativeDriver={true}
      onBackButtonPress={() => setVisible(false)}
      style={{ justifyContent: "flex-end", margin: 0, flex: 1 }}
      presentationStyle={Platform.OS=="ios"?'pageSheet':"overFullScreen"}
      // transparent={true}
      avoidKeyboard={true}
      statusBarTranslucent={isFull ? false : true}>
      <View style={[ModalStyles.innerModalCont, { flex: isFull ? 1 : 0.5 }]}>
    
        <View style={ModalStyles.headingContainer}>
       
          <Text style={ModalStyles.headingText}>{title}</Text>
          <Icon
            onPress={() => setVisible(false)}
            name="close"
            size={25}
            style={ModalStyles.cancelText}
          />
        </View>
       
        {/* <ScrollView
          contentContainerStyle={{ paddingBottom: 20, flex: 1}}
          showsVerticalScrollIndicator={false}> */}
        {children}
        {/* </ScrollView> */}
      </View>
    </RNModal>
  );
};

export default UniversalModal;
