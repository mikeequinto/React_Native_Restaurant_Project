import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

import * as firebase from 'firebase';

export default class Login extends React.Component {

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

        <Text style={styles.paragraph}>
          Hi { this.state.displayName }
        </Text>

        <TouchableOpacity style={styles.signOutButton} onPress={this.signOutUser}>
          <Text>Log out</Text>
        </TouchableOpacity>
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
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signOutButton: {
    marginTop: 32
  }
});
