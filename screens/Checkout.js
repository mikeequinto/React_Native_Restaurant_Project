import React from 'react';
import {  Text, View, StyleSheet, TouchableOpacity, TextInput, Picker } from 'react-native';
import Modal from 'react-native-modal';

 import { Button } from 'react-native-elements';
 import AwesomeAlert from 'react-native-awesome-alerts';


import * as firebase from 'firebase';

import Cart from './Cart';
import Profile from './Profile';

export default class Checkout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        total: '',
        currentMonth: new Date().getMonth()+1,
        currentYear: new Date().getFullYear(),
        cardNumber: '',
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: [],
        expiryDateMonth: 1,
        expiryDateYear: 2019,
        cvc: '',
        cardName: '',
        error: false,
        showAlert: false
    }
    const { uid } = firebase.auth().currentUser;
    this.userRef = firebase.firestore().collection('users').doc(uid);
    this.pendingOrderRef = firebase.firestore().collection('pendingOrders').doc(uid);
    this.orderRef = firebase.firestore().collection('orders').doc(uid);
    //Récupération du total à payer
    this.pendingOrderRef.collection('items').onSnapshot((querySnapshot) => {
      this.setState( {total: 0} )
      querySnapshot.forEach(doc => {
          //Calcul du total à payer
          var value = this.state.total + (doc.data().price * doc.data().quantity);
          value = parseFloat(value.valueOf().toFixed(2));          
          this.setState({total: value})
      })
    });

  }

  componentDidMount(){

    const years = []

    for(let i = this.state.currentYear; i < this.state.currentYear + 10; i++){
      years.push(i)
    }

    this.setState({years: years})
  }

  checkDeliveryAddress = () => {

    //Vérification si l'utilisateur a indiqué son adresse de livraison
    //Récupération de l'adresse de livraison
    this.userRef.get().then(doc => {
      if(doc.exists){

        if(doc.data().deliveryAddress != "" && doc.get("deliveryAddress") != null){
          this.confirmPayment()
        }else{
          this.setState({ showAddressError: true })
        }
      }
    })
  }

  confirmPayment = () => {

    if( this.state.cardNumber !== '' && this.state.cvc !== '' && this.state.cardName !== ''){
      this.setState({ 
        error: false,
        showAlert: true
      })
      //Ajout de la commande dans firestore
      this.orderRef.collection('userOrders').add({
        date: new Date(),
        total: this.state.total,
        status:'On the way'
      })
      //Réinitialisation du panier
      this.pendingOrderRef.collection('items').get().then( querySnapshot => {
        querySnapshot.forEach( doc => {
          
          this.pendingOrderRef.collection('items').doc(doc.id).delete()
        })
      })

    }else{
      this.setState({ error: true })
    }
  }

  goToCart = () => {
    this.props.back()
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  hideAddressAlert = () => {
    this.setState({
      showAddressError: false
    });
  };

  render() {
    return (

      <View style={{alignSelf: 'stretch'},{minHeight: '100%'}}>

        <Text style={styles.title}>Checkout</Text>

        <Text style={styles.totalText}>{this.state.total} CHF</Text>

        <Text style={styles.label} >Card number</Text>
        <TextInput
          style={styles.input}
          id="cardNumber"
          placeholder="0000 0000 0000 0000"
          onChangeText={(value) => this.setState({cardNumber: value})}
        />

        <View style={{flexDirection:'row'}}>
          <View>

            <Text style={styles.label}>Expiry date</Text>
            <View style={{flexDirection: 'row'}}>
              <Picker
                selectedValue={this.state.currentMonth}
                onValueChange={ (itemValue) => this.setState({expiryDateMonth: itemValue})}
                style={[styles.input, { width: 90 }]}
              >
                {
                  this.state.months.map((l, i) => {
                    return  <Picker.Item label={l.toString()} value={l} key={i}/>
                  })
                }
              </Picker>
              <Picker
                selectedValue={this.state.currentYear}
                onValueChange={ (itemValue) => this.setState({expiryDateYear: itemValue})}
                style={[styles.input, { width: 90 }]}
              >
                {
                  this.state.years.map((l, i) => {
                    return  <Picker.Item label={l.toString()} value={l} key={i}/>
                  })
                }
              </Picker>
            </View>

          </View>

          <View style={{marginLeft: 50}}>
            <Text style={styles.label}>CVC</Text>
            <TextInput
              style={[styles.input, {width:70}]}
              id="cvc"
              placeholder="000"
              onChangeText={(value) => this.setState({cvc: value})}
            />
          </View>
          
        </View>

        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          id="cardName"
          placeholder="John Doe"
          onChangeText={(value) => this.setState({cardName: value})}
        />

        { this.state.error? 
            <Text style={styles.errorMessage}>Something went wrong, please verify your card details</Text>
          : null
        }

        <TouchableOpacity style={styles.checkoutButton} onPress={this.checkDeliveryAddress}>
          <Text style={{ color: '#FFF', textAlign: 'center'}}>Confirm order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={this.goToCart}>
          <Text style={{ textAlign: 'center'}}>Back to cart</Text>
        </TouchableOpacity> 

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Congratulations!"
          message="Your order is on the way!"
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
              this.goToCart()
          }}
        />

        <AwesomeAlert
          show={this.state.showAddressError}
          showProgress={false}
          title="No delivery address!"
          message="Please update your delivery address in your profile"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Okay, got it!"
          confirmButtonColor="#2ecc71"
          onCancelPressed={() => {
              this.hideAddressAlert();
          }}
          onConfirmPressed={() => {
              this.hideAddressAlert();
          }}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    margin: 24,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 32
  },
  cartItem: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  cartButton: {
    width: 45,
    margin: 10
  },
  itemOptionsButton: {
    textAlign: 'center',
    backgroundColor: '#e8e8e8',
    padding: 10,
    width: 32,
    marginRight: 15,
    borderRadius: 5,
  },
  removeButton: {
    textAlign: "center",
    backgroundColor: '#f73131',
    padding: 10,
    borderRadius : 5, 
    color: 'white'
  },
  checkoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    width: 100,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    height: 40,
    alignSelf: 'center',
    borderColor: 'lightgray'
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 50,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  totalText: {
    textAlign: 'center',
    fontSize: 48,
    marginTop: 25,
    marginBottom: 50
  },
  errorMessage: {
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20
  }
});
