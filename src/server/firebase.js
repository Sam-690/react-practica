import app from 'firebase/app';
import 'firebase/firestore';
import'firebase/auth';

const config = {
  apiKey: "AIzaSyDqBIJbVovAlKU6TfFyPSnhJqTnttNjJ8g",
  authDomain: "gestion-11f7a.firebaseapp.com",
  databaseURL: "https://gestion-11f7a.firebaseio.com",
  projectId: "gestion-11f7a",
  storageBucket: "gestion-11f7a.appspot.com",
  messagingSenderId: "207147789441",
  appId: "1:207147789441:web:62e0cead789a30c07af180",
  measurementId: "G-R8P62F8K2S"
};

class firebase {

    constructor(){
        app.initializeApp(config);
        this.db = app.firestore();
        this.auth = app.auth();
    }
    
    estaIniciado() {
      return new Promise(resolve => {
        this.auth.onAuthStateChanged(resolve)
      })
    }

}


export default firebase;
