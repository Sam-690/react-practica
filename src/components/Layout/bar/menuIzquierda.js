import React from 'react';
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import {Link} from 'react-router-dom'

export const MenuIzquierda = ({ classes, permisoParaObtenerNotification }) => (
         <div className={classes.list}>
           <List>
             <ListItem component={Link} button to="/auth/perfil">
               <i className="material-icons">account_box</i>
               <ListItemText
                 classes={{ primary: classes.ListItemText }}
                 primary="perfil"
               />
             </ListItem>
           </List>
           <Divider />
           <List>
             <ListItem component={Link} button to="/inmueble/nuevo">
               <i className="material-icons">add_box</i>
               <ListItemText
                 classes={{ primary: classes.ListItemText }}
                 primary="Nuevo Inmueble"
               />
             </ListItem>
             <ListItem component={Link} button to="">
               <i className="material-icons">business</i>
               <ListItemText
                 classes={{ primary: classes.ListItemText }}
                 primary="Inmuebles"
               />
             </ListItem>
             <ListItem component={Link} button to="/listaUsuarios">
               <i className="material-icons">group</i>
               <ListItemText
                 classes={{ primary: classes.ListItemText }}
                 primary="Usuarios"
               />
             </ListItem>
             <ListItem button onClick={permisoParaObtenerNotification}>
               <i className="material-icons">notifications_none</i>
               <ListItemText class={{primary: classes.ListItemText}} primary="Recibir Notificaciones"  />
             </ListItem>
           </List>
         </div>
       );
