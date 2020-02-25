import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class listaInmuebles extends Component {
    render() {
        return (
            <div>
                <Button variant= "contained" color="primary">Color Primario</Button>
                <Button varian="contained" color="secondary">Color Secundario</Button>
            </div>
        );
    }
}

export default listaInmuebles;