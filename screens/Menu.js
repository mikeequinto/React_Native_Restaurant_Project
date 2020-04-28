import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import * as firebase from 'firebase';
import 'firebase/firestore';

import { FlatList } from 'react-native-gesture-handler';

//Star rating
import { Rating } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';

import cartUtility from './Utility/CartUtility';
 
export default class Menu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ramens: [],
            hide: true,
            showAlert: false
        }
        this.ref = firebase.firestore().collection('ramens');
    }

    componentDidMount() {
        //Récupération des ramens
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
        //Ajout d'un produit dans le panier
        cartUtility.addProduct(item)
        //Affichage du message
        this.setState({showAlert: true})
    }

    hideAlert = () => {
        this.setState({
          showAlert: false
        });
      };

    render() {
        return (
            
            
            <SafeAreaView style={ styles.container } >

                <Text style={styles.title}>Menu</Text>

                <FlatList
                    data={ this.state.ramens }
                    renderItem={ ({item, index}) => {
                        return (
                            <Card
                                title={item.name}
                                image={ item.imageUrl }>
                                <Text style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>
                                    Price : {item.price} CHF
                                </Text>
                                <Rating
                                    imageSize={20}
                                    readonly
                                    startingValue={item.rating}
                                    style={{paddingBottom: 15}}
                                />
                                <Button
                                    icon={<Icon name='ios-cart' size={30} color='#ffffff' />}
                                    buttonStyle={{
                                        borderRadius: 5, 
                                        marginLeft: 0, 
                                        marginRight: 0, 
                                        marginBottom: 0,
                                        backgroundColor: '#e74c3c'
                                    }}
                                    title=' Add to cart' 
                                    onPress={ () => this.addToCart(item) } />
                            </Card>
                        )
                    }}
                ></FlatList>

                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    title="Good job!"
                    message="Ramen successfully been added to cart!"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmText="Continue shopping"
                    confirmButtonColor="#2ecc71"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />

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
  title: {
    margin: 24,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 32
  },
  signOutButton: {
    marginTop: 32
  }
});
