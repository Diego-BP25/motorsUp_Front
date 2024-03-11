import React from 'react';
import PropTypes from 'prop-types';

export function ButtonSwitch({ idComponente }) {
    return (
      <div>
        <input type="checkbox" id={idComponente} className="checkInput" style={{display:'none'}}/>
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
};