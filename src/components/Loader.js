import React from 'react';
import Modal from 'react-native-modal';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default ({isActive = false, bgColor = 'white'}) => (
  <Modal
    isVisible={isActive}
    backdropColor={'black'}
    animationIn="fadeIn"
    animationOut="fadeOut"
    style={style.activityIndicatorView}>
    <View style={{...style.activityIndicatorBox, backgroundColor: bgColor}}>
      <ActivityIndicator size="large" animating={isActive} />
    </View>
  </Modal>
);

const style = StyleSheet.create({
  activityIndicatorBox: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 5,
  },
  activityIndicatorView: {
    position: 'absolute',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
  },
});
