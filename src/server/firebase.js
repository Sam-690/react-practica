import app from 'firebase/app';
import 'firebase/firestore';
import'firebase/auth';
import 'firebase/storage';

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
        this.storage = app.storage ();
        this.authorization = app.auth;

        this.storage.ref().constructor.prototype.guardarDocumentos = function(documentos){
          var ref=this;
          return Promise.all(documentos.map(function(file){
            return ref.child(file.alias).put(file).then(snapshot => {
              return ref.child(file.alias).getDownloadURL();
            })
          }))
        }
    }
    
    estaIniciado() {
      return new Promise(resolve => {
        this.auth.onAuthStateChanged(resolve)
      })
    }

    guardarDocumento = (nombreDocumento, documento) => this.storage.ref().child(nombreDocumento).put(documento);

    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();

    guardarDocumentos = (documentos) => this.storage.ref().guardarDocumentos(documentos);

    eliminarDocumento = documento => this.storage.ref().child(documento).delete();

}


export default firebase;


