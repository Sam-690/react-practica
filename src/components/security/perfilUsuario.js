import React, { useState, useEffect } from "react";
import { useStateValue } from "../../sesion/store";
import {
  Container,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button
} from "@material-ui/core";
import reactFoto from "../../logo.svg";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import*as uuid from 'uuid';

const style = {
  paper: {
    marginTop: 8,
    display: "flex",  
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: 20
  },
  submit: {
    marginTop: 15,
    marginBottom: 20
  }
};

const PerfilUsuario = props => {
  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;

  let [estado, cambiarEstado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    id: "",
    foto: ""
  });

  const cambiarDato = e => {
    const { name, value } = e.target;
    cambiarEstado(Prev => ({
      ...Prev,
      [name]: value
    }));
  };

  const guardarCambios = e => {
    e.preventDefault();

    firebase.db
      .collection("Users")
      .doc(firebase.auth.currentUser.uid)
      .set(estado, { merge: true })
      .then(success => {
        dispatch({
          type: "INICIAR_SESION",
          sesion: estado,
          autenticado: true
        });

        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "se guardaron los cambios"
        });
      })
      .catch(error => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "Error al guardar en la base de datos:" + error
        });
      });
  };

  const validarEstadoFormulario = sesion =>{
    if (sesion) {
      cambiarEstado(sesion.usuario);
    }
  }


  useEffect(() => {
    if (estado.id === "") {
      validarEstadoFormulario(sesion);
    }
  });

  const subirFoto = fotos => {
    // Capturar la imagen
    const foto = fotos[0];
    // Renombrar la imagen
    const claveUnicaFoto = uuid.v4();
    //Obtener el nombre de la foto
    const nombreFoto = foto.name;
    // obtener extension de la imagen
    const extensionFoto = nombreFoto.split(".").pop();
    // crear el nuevo nombre de la foto -alias
    const alias = (
      nombreFoto.split(".")[0] +
      "_" +
      claveUnicaFoto +
      "." +
      extensionFoto
    )
      .replace(/\s/g, "_")
      .toLocaleLowerCase();

      firebase.guardarDocumento(alias, foto).then(metadata => {
          firebase.devolverDocumento(alias).then(urlFoto=>{
              estado.foto = urlFoto; 

              firebase.db
              .collection("Users")
              .doc(firebase.auth.currentUser.uid)
              .set(
                  {
                      foto: urlFoto
                  },
                  {merge: true}
              )
              .then(userDB => {
                  dispatch({
                      type: "INICIAR_SESION",
                      sesion: estado,
                      autenticado: true
                  })
              })
          })
      })
  };

  let fotoKey = uuid.v4();

  return sesion ? (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Avatar style={style.avatar} src={estado.foto || reactFoto} />
        <Typography component="h1" variant="h5">
          Perfil de Cuenta
        </Typography>
        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="nombre"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={estado.nombre}
                onChange={cambiarDato}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="apellido"
                variant="outlined"
                fullWidth
                label="Apellidos"
                value={estado.apellido}
                onChange={cambiarDato}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                label="E-mail"
                value={estado.email}
                onChange={cambiarDato}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="telefono"
                variant="outlined"
                fullWidth
                label="Telefono"
                value={estado.telefono}
                onChange={cambiarDato}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <ImageUploader
              withIcon={false}
              key={1000}
              singleImage={true}
              buttonText="Seleccione una imagen de perfil"
              onChange={subirFoto}
              imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
              maxFileSize={5242880}
            ></ImageUploader>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
                onClick={guardarCambios}
              >
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  ) : null;
};

export default consumerFirebase(PerfilUsuario);
