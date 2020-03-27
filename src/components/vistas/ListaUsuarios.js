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
import { obtenerUsuariosApp } from "../../Redux/actions/usuarioAction";
import { enviarCorreoElectronico } from "../../Redux/actions/emailAction";


import {useStateValue} from "../../sesion/store"
import {openMensajePantalla} from "../../sesion/actions/snackbarAction"

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
              <Button color="secondary" variant="contained">Agregar</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => {abreDialog(false)}}>Cerrar</Button>
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
                            ? row.nombre + " " + row.apellido
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

export default ListaUsuarios;
