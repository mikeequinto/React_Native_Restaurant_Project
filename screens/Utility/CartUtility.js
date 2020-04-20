import * as firebase from 'firebase';

class CartUtility {

   //Ajout d'un produit dans le panier
   addProduct(item){
      this.checkPendingOrder(item)
    }
  
   //Vérification si panier existant
   checkPendingOrder(item){

      const { uid } = firebase.auth().currentUser;
      const db = firebase.firestore().collection('pendingOrders')

      //Vérification dans firestore si l'utilisateur a un panier
      db.doc(uid).collection('items').doc(item.id).get().
            then(doc => {
               console.log(uid);
               
               //Si non, on crée le panier avec le produit selectionné
               if(!doc.exists) {
                  console.log('ghie');

                     db.doc(uid).collection('items').doc(item.id).set({
                        name : item.name,
                        price: item.price,
                        quantity: 1
                  })
                  
               //Si oui, on ajoute le produit dans le panier existant
               }else{
                  //On vérifie si le produit a déjà été ajouté dans le panier
                  this.addItemToExistingCart(item)
                  console.log('heee');
                  
               }
            })
   }
  
   //Ajout du produit dans le panier existant
   addItemToExistingCart(item){

      const { uid } = firebase.auth().currentUser;
      const db = firebase.firestore().collection('pendingOrders').doc(uid).collection('items')
      
      //Vérification du produit dans le panier
      db.doc(item.id).get()
         .then(sub => {
               
               //Si le produit existe déjà, on incrémente la quantité
               if(sub.exists){
                  db.doc(item.id).update({
                     quantity : firebase.firestore.FieldValue.increment(1)
                  })
               //Sinon, on ajoute le nouveau produit dans le panier
               }else{
                  db.doc(item.id).set({
                     name : item.name,
                     price: item.price,
                     quantity: 1
                  })
               }

         })
   }

   //Soustraction de la quantité du produit selectionné
   subtractProduct(item){

      const { uid } = firebase.auth().currentUser;
      const db = firebase.firestore().collection('pendingOrders').doc(uid).collection('items')

      //Vérification du produit dans le panier
      db.doc(item.id).get()
         .then(sub => {
               //Si le produit existe
               if(sub.exists){
                  //Si la quantité est supérieure à 1, on soustrait de 1
                  if(sub.data().quantity > 1){
                     db.doc(item.id).update({
                        quantity : firebase.firestore.FieldValue.increment(-1)
                     })
                  }
                  //Sinon on enlève le produit du panier
                  else{
                     db.doc(item.id).delete()
                  } 
               //Sinon, on affiche un message d'erreur
               }else{
                  alert("This product is no longer in your cart")
               }
         })
      
   }

   //Soustraction de la quantité du produit selectionné
   removeProduct(item){

      const { uid } = firebase.auth().currentUser;
      const db = firebase.firestore().collection('pendingOrders').doc(uid).collection('items')

      //Vérification du produit dans le panier
      db.doc(item.id).get()
         .then(sub => {
               //Si le produit existe
               if(sub.exists){
                  db.doc(item.id).delete()
               //Sinon, afficher un message d'erreur
               }else{
                  alert("This product is no longer in your cart")
               }
         })
      
   }

}

const cartUtility = new CartUtility()
export default cartUtility