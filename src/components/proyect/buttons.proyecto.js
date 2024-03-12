import React from 'react';
import PropTypes from 'prop-types';

export const ButtonNormal = ({ title, idComponent, idModal, funcionButton }) => {
    if (idModal) {
        return (
            <button id={idComponent} data-bs-toggle='modal' data-bs-target={idModal} style={{
                backgroundColor: '#697588',
                border: 'none',
                padding: '5px',
                borderRadius: '10px',
                color: 'white',
                fontSize: '18px'

            }}>{title}</button>
        )
    }
    return (
        <button id={idComponent} style={{
            backgroundColor: '#697588',
            border: 'none',
            padding: '5px',
            borderRadius: '10px',
            color: 'white',
            fontSize: '18px'
        }} onClick={() => {funcionButton() }}>{title}</button>
    )
}

ButtonNormal.propTypes = {
    title: PropTypes.string.isRequired,
    idComponent: PropTypes.string.isRequired,
    idModal: PropTypes.string,
    funcionButton: PropTypes.func
};