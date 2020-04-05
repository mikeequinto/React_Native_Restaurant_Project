import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';

import SignUp from './SignUp';

import * as firebase from 'firebase';

export default class Login extends React.Component {
  state = {
    
    emailAddress: '',
    password: '',
    errorMessage: null
  };

  handleLogin = () => {
    const { emailAddress, password } = this.state 

    firebase.auth()
      .signInWithEmailAndPassword(emailAddress, password)
      .catch(error => this.setState({ errorMessage: error.message }))
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ICHIRAKU RAMEN</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && <Text style={{ color: 'red'}}>{this.state.errorMessage}</Text>}
        </View>

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          onChangeText={emailAddress => this.setState({ emailAddress })}
          value={this.state.emailAddress}
          id="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={ styles.input }
          onChangeText={ password => this.setState({ password }) }
          value={ this.state.password }
          id="password"
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={this.handleLogin}>
          <Text style={{ color: '#FFF', textAlign: 'center'}}>Log in</Text>
        </TouchableOpacity>

        <Text style={styles.signUpQuestion}>Don't have an account?</Text>

        <TouchableOpacity style={styles.signUpButton} onPress={ () => this.props.navigation.navigate("SignUp")}>
          <Text style={{ color: '#E9446A' }}>Sign up</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center'
  },
  centerText: {
    alignItems: 'center',
    textAlign: 'center'
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
  loginButton: {
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 40,
    fontSize: 15,
    justifyContent: 'center',
  },
  signUpQuestion: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  signUpButton: {
    alignSelf: 'center'
  },
  errorMessage: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center'
  }
});
