import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

import * as firebase from 'firebase';

export default class Profile extends React.Component {

  state = {
    emailAddress: '',
    displayName: '',
    deliveryAddress: ''
  }

  

  componentDidMount() {
    const {email, displayName, uid } = firebase.auth().currentUser;

    this.setState({emailAddress: email, displayName: displayName})

    //Récupération de l'adresse de livraison dans la bdd
    var docRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    docRef.get().then( doc => {
      if(doc.exists){
        console.log('hey ' + doc.data().deliveryAddress)
        
        this.setState({deliveryAddress: doc.data().deliveryAddress})
      }
    })
  }
  
  signOutUser = () => {
    firebase.auth().signOut();
  }

  handleUpdate = () => {

    var user = firebase.auth().currentUser
    var docRef = firebase.firestore().collection('users').doc(user.uid)

    if(this.state.displayName !== ''){

      user.updateProfile({
        displayName: this.state.displayName
      }).then( () => {
        docRef.update({
          displayName: this.state.displayName
        })
      }) 
    }

    if(this.state.deliveryAddress !== ''){

      docRef.update({
        deliveryAddress: this.state.deliveryAddress
      })
    }
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={{alignSelf: 'stretch'}}>

          <View>
            <Text>Name</Text>
            <TextInput 
              style={styles.input}
              onChangeText={ (value) => this.setState({displayName: value})}
              placeholder={this.state.displayName} />
          </View>

          <View>
            <Text>E-mail</Text>
            <TextInput 
              style={styles.input} editable={false}
              placeholder={this.state.emailAddress} />
          </View>

          <View>
            <Text>Delivery Address</Text>
            <TextInput 
              style={styles.input}
              onChangeText={ (value) => this.setState({deliveryAddress: value})}
              placeholder={this.state.deliveryAddress || "Please enter your delivery address"} />
          </View>
          
        </View>

        <TouchableOpacity style={[styles.button, {backgroundColor: '#2fd437'}]} onPress={this.handleUpdate}>
          <Text style={{color: 'white', textAlign: 'center'}}>Apply changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: "#f73131"}]} onPress={this.signOutUser}>
          <Text style={{color: 'white', textAlign: 'center'}}>Log out</Text>
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
    margin: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 32
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 32,
    height: 50,
    width: 100,
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'center'
  },
  input: {
    padding: 10,
    backgroundColor: 'lightyellow',
    marginBottom: 20
  }
});
