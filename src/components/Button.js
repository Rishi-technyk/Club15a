import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SECONDARY_COLOR, DARK_BLUE} from '../util/colors';
import {FONT_FAMILY} from '../util/constant';

const NewButton = ({text, onPress, loading}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // alignSelf: "flex-end",
        backgroundColor: SECONDARY_COLOR,
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
      }}
      disabled={loading}
      onPress={onPress}>
      {loading && (
        <ActivityIndicator color={'white'} style={{marginRight: 10}} />
      )}
      <Text
        style={{
          color: 'white',
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
export default NewButton;
