import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

import * as firebase from 'firebase';

export default class Home extends React.Component {

  state = {
    emailAddress: '',
    displayName: ''
  }

  componentDidMount() {
    const {emailAddress, displayName } = firebase.auth().currentUser;

    this.setState({emailAddress: emailAddress, displayName: displayName})
  }
  
  signOutUser = () => {
    firebase.auth().signOut();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    margin: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32
  },
  signOutButton: {
    marginTop: 32
  }
});
