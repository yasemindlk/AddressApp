import AsyncStorage from '@react-native-community/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  Modal,
  Pressable,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {useAPI} from '../../helper/useApi';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HomeScreen = ({navigation}) => {
  const [people, setPeople] = useState([]);
  const {get, put} = useAPI();
  const [modalData, setModalData] = useState({
    visible: false,
    component: '',
    user: null,
  });
  const [locationData, setLocationData] = useState({
    origin: {latitude: 0, longitude: 0},
    destination: {latitude: 0, longitude: 0, user: null},
  });
  const getUsers = () => {
    AsyncStorage.getItem('user').then(res => {
      const user = JSON.parse(res);
      get({endpoint: 'users', token: user.token}).then(response => {
        if (response?.status) {
          Geolocation.getCurrentPosition(
            info => {
              if (info.coords.latitude && info.coords.longitude) {
                setLocationData({
                  ...locationData,
                  origin: {
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                  },
                });
              }
            },
            err => {
              console.log(err);
            },
            {enableHighAccuracy: true, timeout: 5000},
          );
          setPeople([...response.users]);
        }
      });
    });
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleSaveButton = () => {
    setModalData(!modalData.visible);
    let bodyData = {
      first_name: modalData.user.first_name,
      last_name: modalData.user.last_name,
      title: modalData.user.address.title,
    };
    let userId = modalData?.user._id;
    AsyncStorage.getItem('user').then(res => {
      const user = JSON.parse(res);
      put({
        endpoint: `users/${userId}`,
        body: bodyData,
        token: user.token,
      }).then(response => {
        if (response?.status) {
          getUsers();
        }
      });
    });
  };
  const handleChange = (name, value) => {
    if (name === 'title') {
      setModalData({
        ...modalData,
        user: {
          ...modalData.user,
          address: {...modalData.user.address, [name]: value},
        },
      });
    } else {
      setModalData({...modalData, user: {...modalData.user, [name]: value}});
    }
  };
  useEffect(() => {
    if (
      locationData.destination.latitude &&
      locationData.destination.longitude
    ) {
      setModalData({
        visible: true,
        component: 'map',
        user: locationData.destination.user,
      });
    }
  }, [locationData.destination.latitude, locationData.destination.longitude]);
  return (
    <View style={styles.container}>
      <FlatList
        data={people}
        renderItem={({item}) => (
          <View style={styles.rowView}>
            <Text style={styles.item}>
              {item.first_name + ' ' + item.last_name}
            </Text>

            <View style={styles.action}>
              <TouchableHighlight
                underlayColor="rgba(73,182,77,1,0.9)"
                onPress={() =>
                  setLocationData({
                    ...locationData,
                    destination: {
                      latitude: item.address.lat,
                      longitude: item.address.lng,
                      user: item,
                    },
                  })
                }>
                <FontAwesome style={styles.item} name="location-arrow" />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="rgba(73,182,77,1,0.9)"
                onPress={() =>
                  setModalData({
                    visible: true,
                    component: 'details',
                    user: item,
                  })
                }>
                <AntDesign style={styles.item} name="edit" />
              </TouchableHighlight>
            </View>
          </View>
        )}
      />

      {modalData.visible ? (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalData.visible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setLocationData({
                ...locationData,
                destination: {latitude: 0, longitude: 0, user: null},
              });
              setModalData({visible: false, component: ''});
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {modalData.component === 'details' ? (
                  <View
                    style={{
                      flex: 1,
                      height: 20,
                      width: 300,
                      marginTop:80
                    }}>
                    <Text style={styles.modalText}>Kişi Düzenle</Text>
                    <TextInput
                      value={modalData.user.first_name}
                      onChangeText={text => handleChange('first_name', text)}
                    />
                    <TextInput
                      value={modalData.user.last_name}
                      onChangeText={text => handleChange('last_name', text)}
                    />
                    <TextInput
                      value={modalData.user.address.title}
                      onChangeText={text => handleChange('title', text)}
                    />
                    <Pressable
                      style={[styles.buttonOkay, styles.buttonClose]}
                      onPress={handleSaveButton}>
                      <Text style={styles.textStyle}>Tamam</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      height: Dimensions.get('window').height,
                      width: Dimensions.get('window').width,
                    }}>
                    <MapView
                      style={{height: '100%'}}
                      zoomControlEnabled={true}
                      initialRegion={{
                        latitude: locationData.origin.latitude,
                        longitude: locationData.origin.longitude,
                        latitudeDelta: 0.09991,
                        longitudeDelta: 0.09991,
                      }}>
                      <Marker coordinate={locationData.origin} />
                      <Marker coordinate={locationData.destination} />
                      <Polyline
                        coordinates={[
                          locationData.destination,
                          locationData.origin,
                        ]}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={['#7F0000']}
                        strokeWidth={6}
                      />
                    </MapView>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={handleSaveButton}>
                      <Text style={styles.textStyle}>Kapat</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    paddingHorizontal: 20,
  },
  item: {
    margin: 24,
    padding: 20,
    fontSize: 20,
    marginHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    backgroundColor: '#e9c7ff',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    height: 100,
  },
  modalView: {
    margin: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  }, 
   buttonOkay: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
   marginTop:20,
    justifyContent:"flex-end"
  },
  buttonOpen: {
    backgroundColor: '#e9c7ff',
  },
  buttonClose: {
    backgroundColor: '#e9c7ff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default HomeScreen;
