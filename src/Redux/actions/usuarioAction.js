import axios from 'axios';

export const obtenerUsuariosApp = (dispatch) => {
    return new Promise ( async (resolve, eject) => {

        const dataRest = await axios.get(
          `https://us-central1-gestion-11f7a.cloudfunctions.net/usuariosLista/lista`
        );

        dispatch({
            type: "LISTA_USUARIOS",
            payload: dataRest.data.usuarios
        })

        resolve();

    })
}

export const actualizarRoles = (dispatch, usuario, role) => {
    return new Promise ( async (resolve, eject) =>{
        const params = {
            id: usuario.id,
            role: role,
            roles: usuario.roles
        }

        const dataRest = await axios.post(`https://us-central1-gestion-11f7a.cloudfunctions.net/usuariosMantenimiento`, params);

        dispatch({
          type: "ACTUALIZAR_ROLES",
          payload: dataRest.data
        });

        resolve();
    })
}