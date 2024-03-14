import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { peticionPost } from 'src/https/peticiones.proyecto';

export const SeletedOption = ({ tabla, columna }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await peticionPost(['global/seachId'], [{ "nombreTabla": tabla, "nombreColumna": columna }])
        setDatos(response)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    })()
  }, [tabla, columna]);

  return (
    <>
      {datos.map((dt) => (
        <option
          key={
            columna.split(',').length === 1 ? dt[columna] : dt[columna.split(',')[0].trim()]
          }
          value={
            columna.split(',').length === 1 ? dt[columna] : dt[columna.split(',')[0].trim()]
          }
        >
          {
            dt[columna.split(',').length > 1 ? columna.split(',')[1].trim() : columna.split(',')[0]]
          }
        </option>
      ))}
    </>
  )

}

SeletedOption.propTypes = {
  tabla: PropTypes.string.isRequired,
  columna: PropTypes.string.isRequired,
}