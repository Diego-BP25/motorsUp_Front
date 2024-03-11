import React from 'react';
import PropTypes from 'prop-types';

import { ButtonSwitch } from './switch.proyecto'

export const ModalProyecto = ({ title, inputs }) => {
    return (
        <div id='modalCotizaciones' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                    </div>
                    <div className='modal-body'>
                        {inputs.map((input, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                margin: '0 auto',
                                width: '98%',
                                flexDirection: 'row'
                            }}>
                                {input}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ContentDoble = ({ title, componente }) => {
    return (
        <div key="fechaCotizacionYButtonSwitch" style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between'
        }}>

            {inputs.map((input, index) => (
               
                    {input}
            ))}

        </div>
    )
}

ModalProyecto.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.object
};

ContentDoble.propTypes = {
    title: protoTypes.string,
    componente: prototypes.object
}