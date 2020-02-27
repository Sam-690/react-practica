import React, { Component } from 'react';
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core';
import LockOutLineIcon from '@material-ui/icons/LockOutlined';
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import { auth } from "firebase";

const style = {
  paper: {
    marginTop: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
      margin: 5,
      backgroundColor: "red"
  },
  form: {
      width: "100%",
      marginTop: 8
  }
};


class Login extends Component {
    state = {
        usuario:{
            firebase: null,
            email: '',
            password: ''
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.firebase === prevState.firebase) {
            return null;
        }

        return{
            firebase: nextProps.firebase
        }
    }

    onChange = e =>{
        let usuario = Object.assign({}, this.state.usuario);
        usuario[e.target.name] = e.target.value;
        this.setState({
            usuario:usuario
        })
    }

    login = e =>{
        e.preventDefault();

        const {firebase, usuario} = this.state;
        firebase.auth ()
        .singInWithEmailAndPassword(usuario.email, usuario.password)
        .then(auth => {
            this.props.history.push('/');
        })
        .catch(error => {
            console.log(error);
        })

    }

    

    render() {
        return(
            <div>
                <Container maxWidth="xs">
                    <div style={style.paper}>
                        <Avatar style={style.avatar}>
                            <LockOutLineIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">Sing In</Typography>
                        <form style={style.form}>
                            <TextField 
                              variant="outlined"
                              label="E-Mail"
                              name="email"
                              fullWidth
                              margin="normal"
                              onChange = {this.onChange}
                              value= {this.state.usuario.email}
                            />
                            <TextField 
                              variant="outlined"
                              label="Password"
                              type="password"
                              name="password"
                              fullWidth
                              margin="normal"
                              onChange = {this.onChange}
                              value= {this.state.usuario.password}
                             />
                             <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={this.login}
                             >
                                 Enviar
                             </Button>
                        </form>
                    </div>
                </Container>
            </div>
        )
    }
}

export default compose(consumerFirebase)(Login);