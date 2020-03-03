export const iniciarSesion = (dispatch, firebase, email, password) => {
  return new Promise((resolve, eject) => {
    firebase.auth.signInWithEmailAndPassword(email, password)
    .then(auth => {
      //auth.user.uid
      firebase.db
        .collection("Users")
        .doc(auth.user.uid)
        .get()
        .then(doc => {
          const usuarioDB = doc.data();
          dispatch({
            type: "INICIAR_SESION",
            sesion: usuarioDB,
            autenticado: true
          });
          resolve({status: true}); 
        });
    })
    .catch(error => {
        console.log("error", error);
    })
  });
};


export const crearUsuario = (dispatch, firebase, usuario) => {
    return new Promise((resolve, eject) => {
        firebase.auth
        .createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then(auth => {
            firebase.db
            .collection("Users")
            .doc(auth.user.uid)
            .set({
                id: auth.user.uid,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
            }, {marge: true}
            )
            .then(doc => {
                usuario.id = auth.user.uid;
                dispatch ({
                    type: "INICIAR_SESION",
                    sesion: usuario,
                    autenticado: true
                });
                resolve({status: true});
            })
        })
        .catch(error => {
            console.log("error", error);
        })
    })
}


export const salirSesion = (dispatch, firebase) => {
    return new Promise((resolve, eject) => {
        firebase.auth.signOut() .then(salir => {
            dispatch({
                type: "SALIR:SESION",
                nuevoUsuario: {
                    nombre: "",
                    apellidos: "",
                    email: "",
                    foto: "",
                    id: "",
                    telefono: "",
                },
                autenticado: false
            });
            resolve();
        })
    })
}