import React from 'react';
import { List, Avatar, Link, ListItemText, ListItem } from "@material-ui/core";



export const MenuDerecha = ({clases, usuario, textoUsuario, fotoUsuario, salirSesion}) => (
    <div className={classes.list}>
        <List>
            <ListItem button component={Link} to="/auth/registrarUsuario">
                <Avatar
                 classes={{primary: classes.avatarSize}}
                 src={fotoUsuario}
                />
                <ListItemText classes={{primary: classes.listItemText}} primary={textoUsuario} />
            </ListItem>
            <ListItem button onClick={salirSesion}>
                <ListItemText classes={{primary: classes.listItemText}} primary="Salir"></ListItemText>
            </ListItem>
        </List>
    </div>
);