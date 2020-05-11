import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ImageBackground, ViewPropTypes } from 'react-native';

import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Button, Card, ThemeProvider } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import * as firebase from 'firebase';

const theme = {
  Button: {
    titleStyle: {
      color: 'black'
    },
  },
};

export default class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      emailAddress: '',
      displayName: '',
      orders: [],
      showAlert: false,
      showAlertNotArrived: false
    }
    const { uid } = firebase.auth().currentUser;
    this.userRef = firebase.firestore().collection('orders').doc(uid).collection('userOrders')
  }
  
  componentDidMount() {

    this.userRef.where("status", "==", "On the way").orderBy("date").onSnapshot((querySnapshot) => {
      const list = []
      var counter = querySnapshot.size

      querySnapshot.forEach(doc => {
          //Ajout de chaque produit dans le panier provisoire
          
          list.push({
              id: doc.id,
              orderNumber : counter--,
              date: doc.data().date.toDate().toString(),
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

  changeStatusToDelivered(id){
    //Mise à jour du status de la commande
    this.userRef.doc(id).update({
      status: 'Delivered'
    })
  }
  
  orderArrived(id) {
    //Modification du status de la commande
    this.changeStatusToDelivered(id)
    //Affichage du message
    this.setState({showAlert: true})
  }

  orderNotArrived(){
    //Affichage du message
    this.setState({showAlertNotArrived: true})
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  hideAlertNotArrived = () => {
    this.setState({
      showAlertNotArrived: false
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>ICHIRAKU RAMEN</Text>
          <ImageBackground 
            source='https://firebasestorage.googleapis.com/v0/b/foodislife-92b0e.appspot.com/o/images%2Framen.png?alt=media&token=a6a81c43-c716-4250-a669-24e491239c3a'
            style={styles.image}></ImageBackground>
          <Text style={styles.subtitle}>Welcome back!</Text>

          { this.state.orders.length !== 0 ?
            <View style={{alignSelf: 'stretch'}}>
              <Text style={styles.orderInfo}>You have {this.state.orders.length} order(s) on the way :</Text>
    
              <FlatList
                
                data={ this.state.orders }
                renderItem={ ({item, index}) => {
                return (
                  <Card
                    title='Order is on the way!'>
                    
                    <View>
                      <Text style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>
                        Time of order : 
                      </Text>
                      <Text style={{marginBottom: 10, fontWeight: '600', textAlign: 'center'}}>
                        {item.date}
                      </Text>
                    </View>
                    <View>
                      <Text style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>
                        Total : 
                      </Text>
                      <Text style={{marginBottom: 10, fontWeight: '600', textAlign: 'center'}}>
                        {item.total} CHF
                      </Text> 
                    </View>
                    <View>
                      <Text style={{marginBottom: 10, textAlign: 'center', fontWeight: 'bold'}}>
                        Did your order arrive?
                      </Text>
                    </View>
                    <View style={styles.buttonGroup}>
                      <Button
                        buttonStyle={{
                          borderRadius: 5, 
                          width: 100,
                          backgroundColor: '#2ecc71'}}
                        title='Yes!' 
                        onPress={ () => this.orderArrived(item.id) } />
                      <Text style={{width: 15}}></Text>
                      <ThemeProvider theme={theme}>
                        <Button
                          buttonStyle={{
                            borderRadius: 5, 
                            width: 100,
                            backgroundColor: '#ecf0f1'}}
                          title='Not yet' 
                          onPress={ () => this.orderNotArrived() } />
                      </ThemeProvider>
                      
                    </View>
                  </Card>
                )
              }}
              ></FlatList>
            </View> : null
          }
          <View style={{backgroundColor:'#34495e', padding:32}}>
            <Text style={[styles.subtitle2,{color:'white'}]}>Our story</Text>
            <Text style={{textAlign:'center', color:'white', marginBottom:18}}>
            Ramen Ichiraku was founded by Teuchi thirty-four years ago. Although it is quite small and has an unassuming appearance, Ramen Ichiraku has always been popular with Konoha's villagers because of Teuchi's strong commitment to taste, giving the ramen an almost artistic quality
            </Text>
          </View>
          <View style={{backgroundColor:'#ecf0f1',padding:32}}>
            <Text style={styles.subtitle2}>Visit us</Text>

            <View style={{alignSelf:'center', marginBottom:18}}>
              <Text style={styles.subtitle3}>
                Address
              </Text>
              <Text style={{textAlign:'center', fontWeight: 500}}>
                3 Rue de la médecine
              </Text>
              <Text style={{textAlign:'center', fontWeight: 500}}>
                1204 Genève
              </Text>
            </View>
            <View style={{alignSelf:'center', marginBottom:18}}>
              <Text style={styles.subtitle3}>
                Opening times
              </Text>
              <View style={styles.social}>
                <Text style={{width: 100}}>
                  Mon - Sat :
                </Text>
                <Text style={{marginLeft:16, fontWeight: 500}}>
                  11AM - 10PM
                </Text>
              </View>
              <View style={styles.social}>
                <Text style={{width: 100}}>
                  Sun :
                </Text>
                <Text style={{marginLeft:16, fontWeight: 500}}>
                  11AM - 2PM
                </Text>
              </View>
            </View>

          </View>
          <View style={{backgroundColor:'#e74c3c', padding:32}}>
            <Text style={[styles.subtitle2,{color:'white'}]}>Follow us on</Text>
            <View style={{alignSelf:'center', marginTop:12}}>
              <View style={styles.social}>
                <AntDesign name="facebook-square" size={32} color='white' />
                <Text style={{color:'white', marginLeft:16}}>Facebook</Text>
              </View>
              <View style={styles.social}>
                <AntDesign name="instagram" size={32} color='white' />
                <Text style={{color:'white', marginLeft:16}}>Instagram</Text>
              </View>
              <View style={styles.social}>
                <AntDesign name="twitter" size={32} color='white' />
                <Text style={{color:'white', marginLeft:16}}>Twitter</Text>
              </View>     
            </View>

          </View>
        </ScrollView>

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Great!"
          message="Enjoy your food! Bon appetit!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Thanks!"
          confirmButtonColor="#2ecc71"
          onCancelPressed={() => {
              this.hideAlert();
          }}
          onConfirmPressed={() => {
              this.hideAlert();
          }}
        />
        <AwesomeAlert
          show={this.state.showAlertNotArrived}
          showProgress={false}
          title="Hang in there!"
          message="Your order will arrive shortly!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Got it!"
          confirmButtonColor="#2ecc71"
          onCancelPressed={() => {
              this.hideAlertNotArrived();
          }}
          onConfirmPressed={() => {
              this.hideAlertNotArrived();
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    margin: 24,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    margin: 24,
    textAlign: 'center'
  },
  subtitle2: {
    fontWeight:'600',
    textAlign:'center',
    fontSize: 24,
    marginBottom: 18
  },
  subtitle3: {
    fontWeight:'450',
    fontSize: 18,
    marginBottom: 14,
    textAlign: 'center'
  },
  image: {
    width: 200,
    height: 175,
    margin: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    alignSelf: 'center'
  },
  orderInfo: {
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    textAlign: 'center',
    color: 'white',
    padding: 5,
    backgroundColor: '#f39c12'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  social: {
    flexDirection:'row', 
    alignItems: 'center',
    marginBottom: 12
  }
});
