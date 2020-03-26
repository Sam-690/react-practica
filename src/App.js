import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Snackbar } from "@material-ui/core";
import "./App.css";
import ListaInmuebles from "./components/vistas/ListaInmuebles";
import AppNavbar from "./components/Layout/AppNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import RegistrarUsuarios from "./components/security/RegistrarUsuarios";
import Login from "./components/security/Login";
import { FirebaseContext } from "./server";

import { useStateValue } from "./sesion/store";
import RutaAutenticada from "./components/security/RutaAutenticada";
import PerfilUsuario from "./components/security/perfilUsuario";
import NuevoInmueble from "./components/vistas/NuevoInmueble";
import EditarInmuebles from "./components/vistas/EditarInmuebles"
import loginTelefono from "./components/security/loginTelefono";
 
function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackbar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseInicial(val);
    });
  });

  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        contentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: ""
            }
          })
        }
      ></Snackbar>
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />

          <Grid container>
            <Switch>
              <RutaAutenticada
                exact
                path="/"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListaInmuebles}
              />
              <RutaAutenticada
                exact
                path="/auth/perfil"
                autenticadoFirebase={firebase.auth.currentUser}
                component={PerfilUsuario}
              />
              <RutaAutenticada
                exact
                path="/inmueble/nuevo"
                autenticadoFirebase={firebase.auth.currentUser}
                component={NuevoInmueble}
              />
              <RutaAutenticada
                exact
                path="/inmueble/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={EditarInmuebles}
              />
              <Route
                exact
                path="/auth/registrarUsuario" 
                component={RegistrarUsuarios}
              ></Route>
              <Route exact path="/auth/login" component={Login}></Route>
              <Route exact path="/auth/loginTelefono" component={loginTelefono} />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
