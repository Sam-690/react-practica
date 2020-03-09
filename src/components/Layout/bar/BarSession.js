import React, { Component } from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Drawer
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "react-bootstrap";
import { consumerFirebase } from "../../../server";
import { compose } from "recompose";
import { StateContext } from "../../../sesion/store";
import { salirSesion } from "../../../sesion/actions/sesionAction";
import { MenuDerecha } from "./menuDerecha";
import fotoUsuarioTemp from "../../../logo.svg";
import { withRouter } from "react-router-dom";

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
  }
});

class BarSession extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    right: false
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

  static getDrivedStateFromProps(nextProps, prevState) {
    let nuveosObjetos = {};

    if (nextProps.firebase !== prevState.firebase) {
      nuveosObjetos.firebase = nextProps.firebase;
    }
    return nuveosObjetos;
  }

  render() {
    const { classes } = this.props;
    const [{ sesion }, dispatch] = this.context;
    const { usuario } = sesion;
    let textoUsuario = usuario.nombre + " " + usuario.apellido;

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
              fotoUsuario={fotoUsuarioTemp}
              salirSesion={this.salirSesionApp}
            />
          </div>
        </Drawer>
        <Toolbar>
          <IconButton color="inherit">
            <i className="material-icons">menu</i>
          </IconButton>
          <Typography variants="h6">Century Inmobiliaria</Typography>
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <Button>Login</Button>
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
