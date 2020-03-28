import React, { Component } from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Avatar,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { consumerFirebase } from "../../../server";
import { compose } from "recompose";
import { StateContext } from "../../../sesion/store";
import { salirSesion } from "../../../sesion/actions/sesionAction";
import { MenuDerecha } from "./menuDerecha";
import { MenuIzquierda } from "./menuIzquierda";
import { Link } from "react-router-dom";
import fotoUsuarioTemp from "../../../logo.svg";
import { withRouter } from "react-router-dom";
import { obtenerPermisoNotification } from "../../../sesion/actions/notificationsAction";

const styles = theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  grow: {
    flexGrow: 1
  },
  avatarsize: {
    width: 40,
    height: 40
  },
  listItemText: {
    fontsize: "14px",
    fontWeight: 600,
    paddingLeft: "15px",
    color: "#212121"
  },
  list: {
    width: 250
  }
});

class BarSession extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    right: false,
    left: false
  };

  salirSesionApp = () => {
    const { firebase } = this.state;
    const [{ sesion }, dispatch] = this.context;

    salirSesion(dispatch, firebase).then(success => {
      this.props.history.push("/auth/login");
    });
  };

  togglerDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let nuveosObjetos = {};

    if (nextProps.firebase !== prevState.firebase) {
      nuveosObjetos.firebase = nextProps.firebase;
    }
    return nuveosObjetos;
  }

  recibirNotificaciones = async () => {
    const { firebase } = this.state;
    const [{ sesion }, dispatch] = this.context;
    const { usuario } = sesion;

    if (firebase.messagingValidation.isSupported()) {
      await obtenerPermisoNotification(firebase, usuario, dispatch);
    }
  };

  render() {
    const { classes } = this.props;
    const [{ sesion }, dispatch] = this.context;
    const { usuario } = sesion;

    let textoUsuario =
      usuario.nombre +
      " " +
      (usuario.apellido ? usuario.apellido : usuario.apellidos);
    if (!usuario.nombre) {
      textoUsuario = usuario.telefono;
    }

    return (
      <div>
        <Drawer
          open={this.state.right}
          onClose={this.togglerDrawer("right", false)}
          anchor="right"
        >
          <div
            role="button"
            onClick={this.togglerDrawer("right", false)}
            onKeyDown={this.togglerDrawer("right", false)}
          >
            <MenuDerecha
              classes={classes}
              usuario={usuario}
              textoUsuario={textoUsuario}
              fotoUsuario={usuario.foto || fotoUsuarioTemp}
              salirSesion={this.salirSesionApp}
            />
          </div>
        </Drawer>

        <Drawer
          open={this.state.left}
          onClose={this.togglerDrawer("left", false)}
          anchor="left"
        >
          <div
            role="button"
            onClick={this.togglerDrawer("left", false)}
            onKeyDown={this.togglerDrawer("left", false)}
          >
            <MenuIzquierda
              classes={classes}
              obtenerPermisoNotification={this.recibirNotificaciones}
            />
          </div>
        </Drawer>

        <Toolbar>
          <IconButton
            color="inherit"
            onClick={this.togglerDrawer("left", true)}
          >
            <i className="material-icons">menu</i>
          </IconButton>

          <Typography variants="h6">Century Inmobiliaria</Typography>
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" component={Link} to="">
              <i className="material-icons">mail_outline</i>
            </IconButton>
            <Button color="inherit" onClick={this.salirSesionApp}>
              Salir
            </Button>
            <Button color="inherit">{textoUsuario}</Button>
            <Avatar src={usuario.foto || fotoUsuarioTemp}></Avatar>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              color="inherit"
              onClick={this.togglerDrawer("right", true)}
            >
              <i className="material-icons">more_vert</i>
            </IconButton>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default compose(
  withRouter,
  consumerFirebase,
  withStyles(styles)
)(BarSession);
