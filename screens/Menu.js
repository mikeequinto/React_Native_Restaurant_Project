import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import * as firebase from 'firebase';
import { FlatList } from 'react-native-gesture-handler';
 
export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ramens: [],
            hide: true
        }
        this.ref = firebase.firestore().collection('ramens');
    }

    
    
    componentDidMount() {

        this.ref.onSnapshot((querySnapshot) => {
            const list = []
            querySnapshot.forEach(doc => {
                list.push({
                    id: doc.id,
                    name: doc.data().name,
                    price: doc.data().price,
                    rating: doc.data().rating,
                    imageUrl: doc.data().imageUrl
                })
            })
            this.setState({
                ramens: list
            })
        });

    }

    addToCart(item) {
        console.log('hey ' + item.name);

        this.checkPendingOrder(item)
        
    }

    checkPendingOrder(item){

        const { uid } = firebase.auth().currentUser;
        const db = firebase.firestore().collection('pendingOrders')

        db.doc(uid).get().
            then(doc => {
                if(!doc.exists) {
                    console.log('first order');
                    db.doc(uid).collection('items').doc(item.id).set({
                        name : item.name,
                        price: item.price,
                        quantity: 1
                    })
                    
                }else{
                    console.log('document exists');
                    this.checkItem(item)
                }
            })
    }

    checkItem(item){

        const { uid } = firebase.auth().currentUser;
        const db = firebase.firestore().collection('pendingOrders').doc(uid).collection('items')
        

        db.doc(item.id).get()
            .then(sub => {
                if(sub.exists){
                    db.doc(item.id).update({
                        quantity : firebase.firestore.FieldValue.increment(1)
                    })
                }else{
                    db.doc(item.id).set({
                        name : item.name,
                        price: item.price,
                        quantity: 1
                    })
                }
            })
    }

    render() {
        return (

            <SafeAreaView style={ styles.container } >
                
                

                <Text style={styles.paragraph}>
                    <Text>Menu</Text>
                </Text>

                <FlatList
                    data={ this.state.ramens }
                    renderItem={ ({item, index}) => {
                        return (
                            <Card
                                title={item.name}
                                image={item.imageUrl}>
                                <Text style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>
                                    Price : {item.price} CHF
                                </Text>
                                <Button
                                    icon={<Icon name='ios-cart' size={30} color='#ffffff' />}
                                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                                    title=' Add to cart' 
                                    onPress={ () => this.addToCart(item) } />
                            </Card>
                        )
                    }}
                ></FlatList>

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
