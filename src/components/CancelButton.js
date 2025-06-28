import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SECONDARY_COLOR, DARK_BLUE, LIGHT_RED} from '../util/colors';
import {FONT_FAMILY} from '../util/constant';

const CancelButton = ({text, onPress, loading}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // alignSelf: "flex-end",
        backgroundColor: LIGHT_RED,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
      }}
      disabled={loading}
      onPress={onPress}>
      {loading && (
        <ActivityIndicator color={'red'} style={{marginRight: 10}} />
      )}
      <Text
        style={{
          color: 'red',
          fontSize: 16,
          fontFamily: FONT_FAMILY.semiBold,
          textAlign: 'center',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 10,
  },
});
export default CancelButton;
