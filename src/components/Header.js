import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {DARK_BLUE} from '../util/colors';
import {FONT_FAMILY} from '../util/constant';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Entypo';
import DownloadModal from './DownloadModal';
const Header = ({title, OpenDropDawn, isMulti, isDawnload = false,children}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.headercontainer}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={20} color={'white'} />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isMulti && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {isDawnload && (
            <Icon
              name="file-download-outline"
              size={25}
              color={'white'}
              style={{marginHorizontal: 10}}
              onPress={() => setVisible(true)}
            />
          )}
          <DownloadModal
            visible={visible}
            setVisible={setVisible}
            data={title == 'Invoice' ? 'Credit' : 'member'}
          />
          <Icons
            name="sound-mix"
            size={20}
            color={'white'}
            onPress={OpenDropDawn}
          />
        </View>
      )}
      {children}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headercontainer: {
    backgroundColor: DARK_BLUE,
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  title: {
    color: 'white',
    fontFamily: FONT_FAMILY.normal,

    fontSize: 17,
  },
});
