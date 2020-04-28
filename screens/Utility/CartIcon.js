import React from 'react';
import {  StyleSheet, View, Text } from 'react-native';

import * as firebase from 'firebase';

import { Ionicons } from '@expo/vector-icons';

export default class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        cart: 0,
        tintColor: this.props.color 
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
      this.setState({cart: 0})
      querySnapshot.forEach(doc => {
          //Ajout de chaque produit dans le panier
          this.setState({cart : this.state.cart + doc.data().quantity})
      })
    });
  }

  render() {
    return (
       <View>
          <Text style={styles.cart}>{this.state.cart}</Text>
          <Ionicons name="ios-cart" size={24} color={this.state.tintColor} />
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
  cart: {
     backgroundColor: '#e74c3c',
     color: 'white',
     textAlign: 'center',
     borderRadius: 10,
     width: 20,
     marginBottom: -10,
     position: 'absolute',
     right: -15,
     zIndex: 10
  }
});
