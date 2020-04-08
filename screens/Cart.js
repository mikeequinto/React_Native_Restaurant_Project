import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button } from 'react-native';

 import { ListItem, ThemeConsumer } from 'react-native-elements';

import * as firebase from 'firebase';

export default class Cart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        cart: [],
        total: 0
    }
    const { uid } = firebase.auth().currentUser;
    this.ref = firebase.firestore().collection('pendingOrders').doc(uid).collection('items');
  }

  componentDidMount() {

    this.ref.onSnapshot((querySnapshot) => {
      const list = []
      querySnapshot.forEach(doc => {
          list.push({
              id: doc.id,
              name: doc.data().name,
              price: doc.data().price * doc.data().quantity,
              quantity: doc.data().quantity
          })
      })
      this.setState({
          cart: list
      })
    });

  }


  addProduct(){

  }

  removeProduct(){

  }


  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.paragraph}>
            <Text>Your shopping cart</Text>
        </Text>

        <View>
          {
            this.state.cart.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                subtitle={ "Qty : " + l.quantity }
                bottomDivider
                badge={{ value: l.price, textStyle: { color: 'white' } }}
              />
            ))
          }
        </View>

        <Text style={{marginTop:32}}>Total CHF : {this.state.total}</Text>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
