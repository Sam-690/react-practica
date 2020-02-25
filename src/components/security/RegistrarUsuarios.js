import React, { Component } from "react";
import { Container, Avatar, Typography, Grid, TextField } from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    backgraoundColor: "#e53935"
  },
  form: {
      width: "100%",
      marginTop: 10
  }
};

class RegistrarUsuarios extends Component {
  render() {
    return (
      <Container maxWidth="md">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Registrate
          </Typography>
          <form styles={style.form}>
              <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                      <TextField name="nombre" fullWidth label="Ingrese su nombre" />
                  </Grid>
              </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default RegistrarUsuarios;