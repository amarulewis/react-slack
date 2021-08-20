import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
    apiKey: "AIzaSyBNvn98ehxs2bem58TFKpE0orLNC1WJe88",
    authDomain: "react-slack-clone-e55a8.firebaseapp.com",
    projectId: "react-slack-clone-e55a8",
    storageBucket: "react-slack-clone-e55a8.appspot.com",
    messagingSenderId: "1081625094383",
    appId: "1:1081625094383:web:61ea1e6a467cfee57a931a",
    measurementId: "G-JP64QD5GB8",
    databaseURL: "https://react-slack-clone-e55a8-default-rtdb.firebaseio.com/",
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;