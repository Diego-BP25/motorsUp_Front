import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function ButtonSwitch({ idComponente, estado_componente }) {
  const [estado, setEstado] = useState(estado_componente);
    return (
      <div>
        <input type="checkbox" id={idComponente} checked={estado} onChange={() => setEstado(!estado)} className="checkInput" style={{display:'none'}}/>
        <label htmlFor={idComponente} className="lbl" style={{
          display: 'inline-block',
          width: 40,
          height: 20,
          borderRadius: 100,
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: 'gray'
        }} />
      </div>
    );
  }

ButtonSwitch.propTypes = {
  idComponente: PropTypes.string.isRequired,
  estado_componente: PropTypes.bool.isRequired
};