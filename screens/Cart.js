import React from 'react';
import {  Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';

 import { Button } from 'react-native-elements';

import * as firebase from 'firebase';

import cartUtility from './Utility/CartUtility';
import Checkout from './Checkout';

export default class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        cart: [],
        total: 0,
        checkout: false 
    }
    const { uid } = firebase.auth().currentUser;
    this.ref = firebase.firestore().collection('pendingOrders').doc(uid).collection('items');
  }

  componentWillMount(){
    //Toujours afficher le panier avant le checkout
    this.setState({checkout: false})
  }

  componentDidMount() {

    this.ref.onSnapshot((querySnapshot) => {
      this.setState( {total: 0} )
      const list = []
      querySnapshot.forEach(doc => {
          //Ajout de chaque produit dans le panier provisoire
          list.push({
              id: doc.id,
              name: doc.data().name,
              price: doc.data().price,
              quantity: doc.data().quantity
          })
          //Calcul du total à payer
          var value = this.state.total + (doc.data().price * doc.data().quantity);
          value = parseFloat(value.valueOf().toFixed(2));          
          this.setState({total: value})
          
      })
      //Le panier provisoire devient le panier d'affichage
      this.setState({
          cart: list
      })
    });
  }

  addProduct(item){
    cartUtility.addProduct(item)
  }

  subtractProduct(item){
    cartUtility.subtractProduct(item)
  }

  removeProduct(item){
    cartUtility.removeProduct(item)
  }

  goToCheckout = () => {
    this.setState({ checkout: true })
  }

  goToCart = () => {
    this.setState({ checkout: false })
  }

  resetCart = () => {
    this.setState({ cart: [] })
  }

  render() {
    return (
      <View style={styles.container}>

        { !this.state.checkout?

          <View style={{alignSelf: 'stretch'}}>

            <Text style={styles.title}>Your shopping cart</Text>
 
            <View>
              {
                this.state.cart.length == 0?
                <Text style={{textAlign: 'center'}}>Your cart is empty</Text> : null
              }

              {
                this.state.cart.map((l, i) => (

                  <View key={i} style={{borderBottomWidth: 2, paddingBottom: 15, borderBottomColor: "#c7c6c5"}}>
                    <View style={styles.cartItem}>
                      <Text style={{fontWeight: 'bold'}}>{ l.name }</Text>
                      <Text>{ l.price } CHF x { l.quantity }</Text>
                    </View>

                    <View style={{flexDirection: 'row'}}> 
                      <TouchableOpacity onPress={ () => this.addProduct(l) }>
                        <Text style={styles.itemOptionsButton}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.subtractProduct(l)}>
                        <Text style={styles.itemOptionsButton}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={ () => this.removeProduct(l)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              }
            </View>

            <Text style={{
              marginTop:32,
              fontWeight: 'bold',
              textAlign: 'center'}}
              >Total CHF : {this.state.total}</Text>

            { this.state.cart.length > 0?

              <TouchableOpacity style={styles.checkoutButton} onPress={this.goToCheckout}>
                <Text style={{ color: '#FFF', textAlign: 'center'}}>Checkout</Text>
              </TouchableOpacity> : null
            
            }

          </View>
          
          : <Checkout total={this.state.total} back={this.goToCart} reset={this.resetCart}></Checkout>
      
        }

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
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    height: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  totalText: {
    textAlign: 'center',
    fontSize: 48,
    marginTop: 25,
    marginBottom: 50
  }
});
