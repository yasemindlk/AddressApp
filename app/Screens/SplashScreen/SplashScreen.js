import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {decode as atob} from 'base-64';

import {ActivityIndicator, View} from 'react-native';

export default function SplashScreen({navigation}) {
  function getPayload(jwt) {
    return atob(jwt.split('.')[1]);
  }
  const checkToken = () => {
    AsyncStorage.getItem('user').then(res => {
      const user = JSON.parse(res);

      const payload = getPayload(user.token);

      const expiration = new Date(payload.exp);
      const now = new Date();

      if (expiration.getTime() - now.getTime()) {
        navigation.navigate('Giriş');
      } else {
        navigation.navigate('Kişiler');
      }
    });
  };

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <ActivityIndicator color="black" size="large" />
    </View>
  );
}
