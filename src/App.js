import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import "./App.css";
import ListaInmuebles from "./components/vistas/ListaInmuebles";
import AppNavbar from "./components/Layout/AppNavbar";
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import RegistrarUsuarios from "./components/security/RegistrarUsuarios";
import Login from "./components/security/Login"


class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />

          <Grid container>
            <Switch>
              <Route exact path="/" component={ListaInmuebles}></Route>
              <Route exact path="/auth/registrarUsuario" component={RegistrarUsuarios}></Route>
              <Route exact path="/auth/login" exact component={Login}></Route>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    );
  }}

export default App;
