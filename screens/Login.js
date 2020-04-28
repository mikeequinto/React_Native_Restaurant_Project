import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
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

        <ImageBackground 
            source='https://firebasestorage.googleapis.com/v0/b/foodislife-92b0e.appspot.com/o/images%2Framen.png?alt=media&token=a6a81c43-c716-4250-a669-24e491239c3a'
            style={styles.image}></ImageBackground>

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
          <Text>Sign up</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
    minHeight: '100%'
  },
  image: {
    width: 200,
    height: 175,
    margin: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    alignSelf: 'center'
  },
  centerText: {
    alignItems: 'center',
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    margin: 24,
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  loginButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
  },
  signUpQuestion: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  signUpButton: {
    alignSelf: 'center',
    height: 50,
    width: 75,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  errorMessage: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center'
  }
});
