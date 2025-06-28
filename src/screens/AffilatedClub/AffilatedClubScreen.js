import {
  Image,
  Linking,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackIcon from '../../assets/svg/BackButton';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {SECONDARY_COLOR} from '../../util/colors';
import DatePickerComp from '../Transaction/DatePicker';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import * as api from '../../util/api';
import {ENDPOINT} from '../../util/constant';
import {useSelector} from 'react-redux';
import { Toast } from 'react-native-toast-notifications';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const AffilatedClubScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState();
  const [startdate, setstartDate] = useState('From Date');
  const [enddate, setendDate] = useState('To Date');
  const [visible, setVisible] = useState(false);
  const [clubs, setClubs] = useState([]);

  const handleVisit = name => {
    setClubs(name);
    setVisible(true), setstartDate('From Date'), setendDate('To Date');
  };
  const fetchClubs = async () => {
    const apiRequestObject = {
      path: ENDPOINT.affilated_clubs,
      body: {},
    };
    const response = await api.javascriptGet(apiRequestObject);
    console.log(response, '---------------response---------------');
    if (response.status) {
      setClubs(response.data);
      setFilteredClubs(response.data);
    }
  };
  useEffect(() => {
    if (clubs?.length === 0) {
      fetchClubs();
    } else {
      const filtered = clubs?.length
        ? clubs.filter(club =>
            club.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [];
      setFilteredClubs(filtered);
    }
  }, [searchQuery, clubs]);

  const Datefrom = (date, type) => {
    type === 'startdate' ? setstartDate(date) : setendDate(date);
  };

  const handleSubmit = () => {
    if (!startdate.includes('-') || !enddate.includes('-')) return;
    if (startdate > enddate || startdate === enddate) {
      Toast.show('Please enter a valid date',{
        type:'warning'
      });
      return;
    }
    setVisible(false);
    Toast.show('Booked',{
      type:'success'
    });
  };

  const openGoogleMaps = url => {
    url
      ? Linking.openURL(url).catch(err =>
          console.error('An error occurred', err),
        )
      : Toast.show('Palease Search On Maps',{
        type:'danger'
      });
  };

  const renderItems = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <View style={styles.initialContainer}>
            <Text style={styles.initialText}>
              {item.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{width: '85%'}}>
            <Text style={styles.clubName}>{item.name}</Text>
            <Text style={styles.clubCity}>{item.city}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={{justifyContent: 'center'}}
          onPress={() => openGoogleMaps(item.url)}>
          <Image
            style={styles.mapIcon}
            source={require('../../assets/images/map.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.phoneContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lightText}>Phone:</Text>
            <Text style={[styles.lightText, {width: '75%'}]}>
              {item.phone_numbers}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lightText}>Website:</Text>
            <Text style={[styles.lightText, {width: '75%'}]}>
              {item.website}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lightText}>Email:</Text>
            <Text style={[styles.lightText, {width: '80%'}]}>{item.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.visitButton}
          onPress={() => handleVisit(item.Name)}>
          <Text style={styles.visitButtonText}>Visit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const emptyList = () => (
    <FlatList
      data={[1, 1, 1, 1, 1, 1]}
      renderItem={() => (
        <View style={styles.card}>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <ShimmerPlaceholder style={styles.roundShimmer} />
            <View style={{flex: 1, alignItems: 'flex-start', margin: 20}}>
              <ShimmerPlaceholder style={{}} />
              <ShimmerPlaceholder style={{width: 50, marginTop: 20}} />
            </View>
          </View>
          <ShimmerPlaceholder style={{margin: 5}} />
          <ShimmerPlaceholder style={{margin: 5}} />
        </View>
      )}
    />
  );
  return (
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}>
            <BackIcon />
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/AeptaLogo.png')}
                style={styles.logo}
              />
              <Text style={styles.clubTitle}>MB Club</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Affiliated Club</Text>
          <View style={styles.emptyView} />
        </View>
        <View style={{margin: 10, marginBottom: 0, flex: 1}}>
          <View
            style={{
              backgroundColor: 'white',
              marginBottom: 10,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0.4,
              borderColor: 'grey',
            }}>
            <Image
              style={{
                height: 22,
                width: 22,
                marginLeft: 10,
                overlayColor: 'black',
              }}
              source={require('../../assets/images/search2.png')}
            />
            <TextInput
              placeholder="Search Clubs"
              cursorColor={SECONDARY_COLOR}
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{
                flex: 1,
                marginVertical: Platform.OS === 'ios' ? 10 : 0,
                marginLeft: 5,
              }}
            />
          </View>
          {filteredClubs?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Clubs found.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredClubs}
              ListEmptyComponent={emptyList}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()} // Use item ID or index as key
              renderItem={renderItems}
            />
          )}
        </View>
      </View>
      {visible && (
        <Modal transparent={true} visible={visible} animationType="slide">
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                margin: 20,
                padding: 10,
                width: '87%',
                borderRadius: 10,
              }}>
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: -20,
                  borderRadius: 30,
                  padding: 5,
                  backgroundColor: 'white',
                }}>
                <Image
                  source={require('../../assets/images/AeptaLogo.png')}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                  }}
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  width: '70%',
                  paddingVertical: 10,
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Affliated Clubs Visit {clubs}
              </Text>

              <View style={styles.dateInputContainer}>
                <DatePickerComp
                  placeholder={startdate}
                  setResetDate={true}
                  stateDate={date => Datefrom(date, 'startdate')}
                />
              </View>
              <View style={styles.dateInputContainer}>
                <DatePickerComp
                  placeholder={enddate}
                  setResetDate={true}
                  stateDate={date => Datefrom(date, 'enddate')}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setVisible(false)}
                  style={styles.modalButton}>
                  <Text style={{color: 'white'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.modalButton}
                  onPress={handleSubmit}>
                  <Text style={{color: 'white'}}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default AffilatedClubScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 60 : getStatusBarHeight() + 60,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 25,
    width: 25,
    borderRadius: 15,
    marginLeft: 5,
  },
  clubTitle: {
    marginLeft: 5,
    color: 'black',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  emptyView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: SECONDARY_COLOR,
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  card: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 10,
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  cardHeader: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  dateInputContainer: {
    margin: 10,
  },
  initialContainer: {
    height: 30,
    width: 30,
    backgroundColor: '#222642',
    marginRight: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  initialText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clubName: {
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 2,
  },
  clubCity: {
    color: 'black',
  },
  mapIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  phoneContainer: {
    flex: 1,
  },
  lightText: {
    color: 'grey',
    marginVertical: 2,
  },

  visitButton: {
    backgroundColor: SECONDARY_COLOR,
    alignContent: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
  visitButtonText: {
    color: 'white',
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  roundShimmer: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
