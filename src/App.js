import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import "./App.css";
import ListaInmuebles from "./components/vistas/ListaInmuebles";
import AppNavbar from "./components/Layout/AppNavbar";
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./theme/theme";
import RegistrarUsuarios from "./components/security/RegistrarUsuarios";


class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />

          <Grid container>
            <Switch>
              <Route path="/" exact components={ListaInmuebles}></Route>
              <Route path="/auth/registrarUsuario" exact components={RegistrarUsuarios}></Route>
            </Switch>
          </Grid>
          <ListaInmuebles />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
