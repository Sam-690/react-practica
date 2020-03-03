export const initialState = {
  usuario: {
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    id: "",
    fot: "",  
  },
  autenticado: false
}

const sesionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion,
        autenticado: action.autenticado
      };
    case "CAMBIAR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado
      };

    case "SALIR:SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado
      };
    default:
      return state;
  }
};


export default sesionReducer;