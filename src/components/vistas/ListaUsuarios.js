import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  DialogActions
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { obtenerUsuariosApp, actualizarRoles } from "../../Redux/actions/usuarioAction";
import { enviarCorreoElectronico } from "../../Redux/actions/emailAction";


import {useStateValue} from "../../sesion/store"
import {openMensajePantalla} from "../../sesion/actions/snackbarAction"
import { refrescarSesion } from "../../sesion/actions/sesionAction";
import { consumerFirebase } from "../../server";
import {enviarNotification} from "../../sesion/actions/notificationsAction"

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    background: "#f5f5f5"
  },

  container: {
    paddingTop: "8px"
  }
};

const ListaUsuarios = props => {

  const [{sesion}, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [estadoDialog, abreDialog] = useState(false);
  const [usuarioDialog, llenarUsuarioDialog] = useState({
    email: "",
    telefono: "",
    roles: []
  })

  const [selectRole, cambiarSelectRole] = useState("0");

  const listaArreglos = useSelector(state => state.usuarioRedux.usuarios);
  const dispatchRedux = useDispatch();

  useEffect(() => {
    async function obtenerData() {
      await obtenerUsuariosApp(dispatchRedux);
    }

    if (!isLoading) {
      setIsLoading(true);
      obtenerData();
    }
  });


  const enviarEmail = (email) => {

    const obj = {
        email: email,
        titulo: "Mensaje desde app React",
        mensaje: "gracias por participar en el testeo"
    }

      enviarCorreoElectronico(obj).then(dataServer=>{
          console.log(dataServer)
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se envio el correo electronico al destinatario" + email
          })
      })
  }

  const abrirDialogConUsuario = row => {
    llenarUsuarioDialog(row);
    abreDialog(true);
  }

  const eventoEnCombobox = event => {
    cambiarSelectRole(event.target.value);
  }

  const agregarRol = async() => {

    if(selectRole === "0"){
      openMensajePantalla(dispatch, {
        open: true,
        mensaje:"Seleccione un rol valido"
      })
      return;
    }
    if(!usuarioDialog.roles){
      usuarioDialog.roles = [];
    }

    let existeRole = usuarioDialog.roles.filter(
      rol => rol.nombre === selectRole
    );

    if(!existeRole.length===0){
      // autenticacion firebase // custom claims // {nombreRol: estadoRol, otroRol : true, extraRol: true}

      /**CREACION DEL CUSTOM CLAIM*/
      const customClaims = {};
      usuarioDialog.roles.map(_role=>{
        Object.defineProperty(customClaims, _role.nombre, {
          value: _role.estado,
          writable: true,
          enumerable: true,
          configurable: true        
        })
      })

      Object.defineProperty(customClaims, selectRole, {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      })
      /**FIN DE LA CREACION DEL CUSTOM CLAIM*/

      usuarioDialog.roles.push({nombre:selectRole, estado:true})

      const respuesta =  await actualizarRoles(dispatchRedux, usuarioDialog, customClaims);
      console.log(respuesta);
      obtenerUsuariosApp(dispatchRedux)

      refrescarSesion(props.firebase);
      
      openMensajePantalla(dispatch,{
        open: true,
        mensaje: "Se guardo exitosamente el rol del usuario"
      })


    //customclaims = {ADMIN: TRUE, OPERADOR: TRUE, USUARIO: TRUE}


      //firestore // collection("users") // arreglo:
      // {"nombre": "admin","estado:true"}
      // {"nombre": "otroRol","estado:true"}
      // {"nombre": "extraRol","estado:true"}
    }
  }

  const removerRol = async rol => {

    const nuevoArregloRoles = usuarioDialog.roles.filter(currentRol => currentRol.nombre !== rol);

    usuarioDialog.roles = nuevoArregloRoles;

    const customClaims = {}
    nuevoArregloRoles.map( _rol => {
      Object.defineProperty(customClaims, _rol.nombre, {
        value: _rol.estado,
        writable: true,
        enumerable: true,
        configurable: true
      })
    })

    Object.defineProperty(customClaims, rol, {
      value: false,
      writable: true,
      enumerable: true,
      configurable: true
    })

    const respuesta = actualizarRoles(dispatchRedux, usuarioDialog, customClaims)
    console.log(respuesta);

    obtenerUsuariosApp(dispatchRedux);
    refrescarSesion(props.firebase);


    openMensajePantalla(dispatch, {
      open: true,
      mensaje: "Se elimino rol seleccionado"
    })


  }

      const enviarPushNotification = usuarioFila => {
        if (props.firebase.messagingValidation.isSupported()) {
          const listaToken = usuarioFila.tokenArreglo;
          const obj = {
            token: listaToken || []
          };

          enviarNotification(obj).then(respuestaServidor => {
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: respuestaServidor.data.mensaje
            });
          });
        } else {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Esta version de browser no soporta push notifications"
          });
        }
      };

  return (
    <Container style={style.container}>
      <Dialog
        open={estadoDialog}
        onClose={() => {
          abreDialog(false);
        }}
      >
        <DialogTitle>
          Roles del usuario {usuarioDialog.email || usuarioDialog.telefono}
        </DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <Grid item xs={6} sm={6}>
              <Select value={selectRole} onChange={eventoEnCombobox}>
                <MenuItem value={"0"}>Selecion de rol</MenuItem>
                <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                <MenuItem value={"OPERADOR"}>Operador</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => agregarRol()}
              >
                Agregar
              </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Table>
                <TableBody>
                  {usuarioDialog.roles
                    ? usuarioDialog.roles.map((role, i) => (
                        <TableRow key={i}>
                          <TableCell align="left">{role.nombre}</TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => removerRol(role.nombre)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              abreDialog(false);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Paper style={style.paper}>
        <Grid container justify="center">
          <Grid item xs={12} sm={12}>
            <Table>
              <TableBody>
                {listaArreglos
                  ? listaArreglos.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell align="left">
                          {row.email || row.telefono}{" "}
                        </TableCell>
                        <TableCell align="left">
                          {row.nombre
                            ? row.nombre +
                              " " +
                              (row.apellido ? row.apellido : row.apellidos)
                            : "No tiene nombre"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => abrirDialogConUsuario(row)}
                          >
                            Roles
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => enviarPushNotification(row)}
                          >
                            Notificacion
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => enviarEmail(row.email)}
                          >
                            Enviar Mensaje
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : ""}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListaUsuarios);
