import React from 'react';
import {  Text, View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Modal from 'react-native-modal';


import * as firebase from 'firebase';

export default class Orders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        orders: [],
    }
    const { uid } = firebase.auth().currentUser;
    this.userRef = firebase.firestore().collection('orders').doc(uid).collection('userOrders')
   }

  componentDidMount() {

    this.userRef.onSnapshot((querySnapshot) => {
      const list = []
      querySnapshot.forEach(doc => {
          //Ajout de chaque produit dans le panier provisoire
          console.log(doc.data().date.valueOf())
          
          list.push({
              id: doc.id,
              date: doc.data().date.toDate().valueOf(),
              status: doc.data().status,
              total: doc.data().total
          })         
      })
      //Le panier provisoire devient le panier d'affichage
      this.setState({
          orders: list
      })
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container} >

         <Text style={styles.title}>Orders</Text>

         <FlatList
            style={{alignSelf: 'stretch'}}
            data={ this.state.orders }
            renderItem={ ({item, index}) => {
               return (
                  <View key={index}>
                     <Text>{item.date}</Text>
                     <Text>{item.status}</Text>
                     <Text>{item.total} CHF</Text>
                  </View>
               )
            }}
         ></FlatList>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24
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
