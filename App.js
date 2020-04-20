import React from 'react';

import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Import createStackNavigator to switch between screens
import { createAppContainer, createSwitchNavigator} from 'react-navigation'; 
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import LoadingScreen from './screens/Loading';

import HomeScreen from './screens/Home';
import MenuScreen from './screens/Menu';
import ProfileScreen from './screens/Profile';

//Shopping cart
import CartScreen from './screens/Cart';

// Firebase
import * as firebase from 'firebase';

//Resolve atob error
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

var firebaseConfig = {
  apiKey: "AIzaSyCWS4v2Dkqvs0OsdlQKuOnqizIKIfcP7W8",
  authDomain: "foodislife-92b0e.firebaseapp.com",
  databaseURL: "https://foodislife-92b0e.firebaseio.com",
  projectId: "foodislife-92b0e",
  storageBucket: "foodislife-92b0e.appspot.com",
  messagingSenderId: "1057738699267",
  appId: "1:1057738699267:web:54b47d27b227f3bf9b1436",
  measurementId: "G-PTH4RLS0RQ"
};

if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
}

const AppTabNavigator = createBottomTabNavigator (
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => <Ionicons name="ios-home" size={24} color={tintColor} />,
      }
    },
    Menu: {
      screen: MenuScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => <Ionicons name="ios-book" size={24} color={tintColor} />
      }
    },
    Cart: {
      screen: CartScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => <Ionicons name="ios-cart" size={24} color={tintColor} />
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => <Ionicons name="ios-person" size={24} color={tintColor} />
      }
    }
  }
)

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen
})

export default createAppContainer (

  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppTabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);

 
