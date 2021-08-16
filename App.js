import React from 'react';
import LoginScreen from './app/Screens/LoginScreen/LoginScreen';
import HomeScreen from './app/Screens/HomeScreen/HomeScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './app/Screens/SplashScreen/SplashScreen';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            headerShown: false,
            tabBarStyle: {display: 'none'},
            tabBarIcon: ({color, size, focused}) => (
              <FontAwesome
                name="sign-in"
                color={color}
                size={size}
                active={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Giriş"
          component={LoginScreen}
          options={{
            headerShown: false,
            tabBarStyle: {display: 'none'},
            tabBarIcon: ({color, size, focused}) => (
              <FontAwesome
                name="sign-in"
                color={color}
                size={size}
                active={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Kişiler"
          component={HomeScreen}
          options={{
            tabBarStyle: {display: 'none'},
            tabBarIcon: ({color, size}) => (
              <AntDesign name="home" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
