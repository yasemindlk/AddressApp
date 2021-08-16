import AsyncStorage from '@react-native-community/async-storage';
import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text, Button, Alert} from 'react-native';
import {useAPI} from '../../helper/useApi';

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 20,
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    borderColor: 'red',
    borderRightWidth: 30,
    borderLeftWidth: 30,
  },
  button: {
    color: '#e9c7ff',
  },
});

export default function LoginScreen({navigation}) {
  const {post} = useAPI();
  const [loginData, setLoginData] = useState({
    email: 'jasmine@fish.com',
    password: 'jasminefish',
  });
  const handleLoginButton = () => {
    post('auth/login', loginData).then(response => {
      if (response.status) {
        AsyncStorage.setItem('user', JSON.stringify(response.user)).then(() => {
          navigation.navigate('Kişiler');
        });
      } else {
        Alert.alert(
          'Uyarı',
          'Email ya da şifre hatalı',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('Giriş'),
            },
          ],
          {cancelable: false},
        );
      }
    });
  };
  const handleChange = (name, value) => {
    setLoginData({...loginData, [name]: value});
  };
  return (
    <View style={styles.view}>
      <Text>Kullanıcı Adı</Text>
      <TextInput
        placeholder="Kayıtlı kullanıcı adınızı giriniz"
        styles={styles.textInput}
        value={loginData.email}
        onChangeText={text => handleChange('email', text)}
      />
      <Text>Şifre</Text>
      <TextInput
        placeholder="Şifrenizi giriniz"
        value={loginData.password}
        secureTextEntry={true}
        onChangeText={text => handleChange('password', text)}
      />
      <Button title="Giriş" onPress={handleLoginButton} style={styles.button} />
    </View>
  );
}
