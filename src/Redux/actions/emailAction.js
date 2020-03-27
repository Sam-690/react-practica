import axios from 'axios';

export const enviarCorreoElectronico = (email) => {
    return new Promise ( async (resolve,eject) => {

        const dataResponse = await axios.post(
          `https://us-central1-gestion-11f7a.cloudfunctions.net/correoEnviar`,
          email
        );
        
        resolve(dataResponse);

    })
}