import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React from 'react'
import { PRIMARY_BUTTON_BLUE } from '../util/colors';
import { FONT_FAMILY } from '../util/constant';

const Button2 = ({ text, onPress, loading }) => {
  return (
    <TouchableOpacity
      style={{ marginVertical:10 }}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.submitButton}>
        {loading && (
          <ActivityIndicator
            color={PRIMARY_BUTTON_BLUE}
            style={{ marginRight: 10 }}
          />
        )}
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button2

const styles = StyleSheet.create({  submitButton: {
    borderColor: PRIMARY_BUTTON_BLUE,
    borderWidth: 2,
    paddingVertical: 20,
    marginHorizontal:0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection:'row'
  },
  buttonText: {
    color: PRIMARY_BUTTON_BLUE,
    fontSize: 15,
    fontFamily: FONT_FAMILY.bold,
  },
  })