import React from 'react';
import {  Text, View, StyleSheet, TouchableOpacity, TextInput, Picker } from 'react-native';
import Modal from 'react-native-modal';

 import { Button } from 'react-native-elements';

import * as firebase from 'firebase';

import Cart from './Cart';

export default class Checkout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        total: '',
        currentMonth: new Date().getMonth()+1,
        currentYear: new Date().getFullYear(),
        cardNumber: 12345678910123,
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: [],
        expiryDateMonth: 1,
        expiryDateYear: 2019,
        cvc: 123,
        cardName: '',
        error: false
    }
    const { uid } = firebase.auth().currentUser;
    this.ref = firebase.firestore().collection('pendingOrders').doc(uid).collection('items');

    //Récupération du total à payer
    this.ref.onSnapshot((querySnapshot) => {
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

  confirmPayment = () => {

    if( this.state.cardNumber !== '' && this.state.cvc !== '' && this.state.cardName !== ''){
      this.setState({ error: false})
      alert("Your order is on the way!")
      
      //Ajout de la commande dans firestore
      //Réinitialisation du panier
      this.props.reset()
      this.props.back()
    }else{
      this.setState({ error: true })
    }
  }

  goToCart = () => {
    this.props.back()
  }

  render() {
    return (

      <View style={{alignSelf: 'stretch'}}>

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

        <TouchableOpacity style={styles.checkoutButton} onPress={this.confirmPayment}>
          <Text style={{ color: '#FFF', textAlign: 'center'}}>Confirm order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={this.goToCart}>
          <Text style={{ textAlign: 'center'}}>Back to cart</Text>
        </TouchableOpacity> 

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    margin: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#E9446A',
    borderRadius: 4,
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    width: 100,
    backgroundColor: '#f5f5f5',
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
    color: '#f73131',
    textAlign: 'center',
    marginTop: 20
  }
});
