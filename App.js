import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Import createStackNavigator to switch between screens
import { createAppContainer, createSwitchNavigator} from 'react-navigation'; 
import { createStackNavigator } from 'react-navigation-stack';

// Import screens
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/Home';
import LoadingScreen from './screens/Loading';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

// Firebase
import * as firebase from 'firebase';

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

const AppStack = createStackNavigator({
  Home: HomeScreen
})

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen
})

export default createAppContainer (

  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);

 
