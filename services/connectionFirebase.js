// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import 'firebase/compat/database';

    
// outras importações do Firebase
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA76tpVOl_plfAII-jXHWiRg_MyTnasVYY",
  authDomain: "boer-mobile.firebaseapp.com",
  projectId: "boer-mobile",
  storageBucket: "boer-mobile.appspot.com",
  messagingSenderId: "608957700238",
  appId: "1:608957700238:web:982b9eca1ba4dec94991df",
  measurementId: "G-3M3WYXTP8Z",
  databaseURL: "https://boer-mobile-default-rtdb.firebaseio.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export authentication functions
export function signInWithEmailAndPassword(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function createUserWithEmailAndPassword(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export default firebase;