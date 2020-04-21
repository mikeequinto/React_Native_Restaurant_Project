import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';

import * as firebase from 'firebase';

export default class Profile extends React.Component {

  state = {
    emailAddress: '',
    displayName: '',
    deliveryAddress: '',
    newDisplayName: '',
    newDeliveryAddress: '',
    showAlert: false
  }

  

  componentDidMount() {
    const {email, displayName, uid } = firebase.auth().currentUser;

    this.setState({emailAddress: email, displayName: displayName})

    //Récupération de l'adresse de livraison dans la bdd
    var docRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    docRef.get().then( doc => {
      if(doc.exists){
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
    var update = false

    //On met à jour le nom si le champ n'est pas vide
    if(this.state.newDisplayName !== ''){

      user.updateProfile({
        displayName: this.state.newDisplayName
      }).then( () => {
        docRef.update({
          displayName: this.state.newDisplayName
        })
      })
      update = true
    }
    //On met à jour l'adresse de livraison si le champ n'est pas vide
    if(this.state.newDeliveryAddress !== ''){

      docRef.update({
        deliveryAddress: this.state.newDeliveryAddress
      })
      update = true
    }

    //Si une mise à jour a été effectué
    if(update){
      this.setState({
        showAlert: true,
        newDisplayName: '',
        newDeliveryAddress: ''
      })
    }
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };
 
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={{alignSelf: 'stretch'}}>

          <View>
            <Text>Name</Text>
            <TextInput 
              style={styles.input}
              onChangeText={ (value) => this.setState({newDisplayName: value})}
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
              onChangeText={ (value) => this.setState({newDeliveryAddress: value})}
              placeholder={this.state.deliveryAddress || "Please enter your delivery address"} />
          </View>

          <TouchableOpacity style={[styles.button, {backgroundColor: '#2fd437'}]} onPress={this.handleUpdate}>
            <Text style={{color: 'white', textAlign: 'center'}}>Apply changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, {backgroundColor: "#f73131"}]} onPress={this.signOutUser}>
            <Text style={{color: 'white', textAlign: 'center'}}>Log out</Text>
          </TouchableOpacity>

          <AwesomeAlert
            show={this.state.showAlert}
            showProgress={false}
            title="Congratulations!"
            message="Profile successfully updated!"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Okay, got it!"
            confirmButtonColor="#2ecc71"
            onCancelPressed={() => {
                this.hideAlert();
            }}
            onConfirmPressed={() => {
                this.hideAlert();
            }}
          />
          
        </View>

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
