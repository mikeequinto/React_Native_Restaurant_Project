import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

import * as firebase from 'firebase';

export default class SignUp extends React.Component {

  state = {
    displayName: '',
    emailAddress: '',
    password: '',
    passwordConfirm: '',
    errorMessage: null
  }
  
  handleSignUp = () => {

    const {displayName, emailAddress, password, passwordConfirm} = this.state

    if(password !== passwordConfirm){
      this.setState({errorMessage: 'The passwords do not match'})
    }else{
      firebase.auth().createUserWithEmailAndPassword(emailAddress, password)
        .then( userCredentials => {

          this.addUserToDatabase(userCredentials.user)

          return userCredentials.user.updateProfile({
            displayName: displayName
          })

        })
        .catch(error => this.setState({errorMessage: error.message}))
    }

  }

  addUserToDatabase = user => {

    firebase.firestore().collection('users').doc(user.uid).set({
      displayName: this.state.displayName,
      email: user.email,
      accountType: 'client'
    })

  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.title}>Sign up for a free account</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={{ color: 'red'}}>{this.state.errorMessage}</Text>}
        </View>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={displayName => this.setState({ displayName })}
          value={this.state.displayName}
          id="displayName"
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          onChangeText={emailAddress => this.setState({ emailAddress })}
          value={this.state.emailAddress}
          id="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          id="password"
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={styles.input}
          onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
          value={this.state.passwordConfirm}
          id="passwordConfirm"
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.RegisterButton} onPress={this.handleSignUp}>
          <Text style={{ color: '#FFF', textAlign: 'center'}}>Register</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    paddingBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 40,
    paddingLeft: 10,
  },
  RegisterButton: {
    marginTop: 20,
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
  },
});
