import React from 'react';
import PropTypes from 'prop-types';

export const ModalProyecto = ({ title, inputs, widthContents, idModal }) => {
    return (
        <div id={idModal} className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content' style={{
                    width: widthContents,
                    minHeightheight: '100px'
                }}>
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

export const ContentDoble = ({ componentes, widthConten = '100%' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: widthConten,
            justifyContent: 'space-between',
            marginBottom: '10px'
        }}>

            {componentes.map((input, index) => (
                input
            ))}
        </div>
    )
}

export const ContentIndividual = ({ componentes, flexDirectionContents = 'column', widthContents = '300px', justifyContents, marginContent }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: flexDirectionContents,
            justifyContent: justifyContents,
            width: widthContents,
            margin: marginContent,
            marginBottom: '10px',
        }}>

            {componentes.map((input, index) => (
                input
            ))}
        </div>
    )
}

ModalProyecto.propTypes = {
    title: PropTypes.string.isRequired,
    inputs: PropTypes.object,
    widthContents: PropTypes.string,
    idModal: PropTypes.string.isRequired,
};

ContentDoble.propTypes = {
    componentes: PropTypes.object,
    widthConten: PropTypes.string
}

ContentIndividual.propTypes = {
    componentes: PropTypes.object,
    flexDirectionContents: PropTypes.string,
    widthContents: PropTypes.string,
    justifyContents: PropTypes.string,
    marginContent: PropTypes.string
}