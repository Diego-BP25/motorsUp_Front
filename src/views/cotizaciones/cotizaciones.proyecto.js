import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faTruckField, faCalendar, faToggleOff, faCircleInfo, faComment } from '@fortawesome/free-solid-svg-icons'

import { formatDate } from '../funcionesExtras.proyecto'
import { ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonSwitch } from 'src/components/proyect/switch.proyecto'

const Cotizaciones = () => {
  const url = 'http://localhost:8081/api/cotizacion'
  const [cotizacion, setCotizacion] = useState([])
  const [idCotizacion, setIdCotizacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('')
  const [fecha, setFecha] = useState('')
  const [vehiculos_placa, setPlacaVehiculo] = useState('')
  const [valorManoObra, setValorManoObra] = useState('')
  const [valorCotizacion, setValorCotizacion] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')

  const [fechaCotizacion, setFechaCotizacion] = useState('')




  useEffect(() => {
    getCotizaciones()
  }, [])

  const getCotizaciones = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setCotizacion(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las compras:', error.message)
    }
  }

  return (

    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCotizaciones'>
                <FontAwesomeIcon icon={faPlusCircle} /> Nueva cotización
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Descripcion</th>
                    <th>Estado</th>
                    <th>Mano de obra</th>
                    <th>Valor insumos</th>
                    <th>Fecha</th>
                    <th>Vehiculo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                {/* ref={tableRef} */}
                <tbody className='table-group-divider'>
                  {cotizacion.map((c) => (
                    <tr key={c.idCotizacion}>
                      <td>{c.idCotizacion}</td>
                      <td>{c.descripcion}</td>
                      <td>{c.estado ? "activo" : "desactivado"}</td>
                      <td>{c.valorManoObra}</td>
                      <td>{c.valorCotizacion}</td>
                      <td>{c.fecha}</td>
                      <td>{c.vehiculos_placa}</td>
                      <td>
                        <button className='btn btn-warning'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button className='btn btn-danger'>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ModalProyecto
        title='Nueva cotización'
        inputs={[
          <div key="fechaCotizacionYButtonSwitch" style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span>Fecha y hora</span>
              <input type='datetime-local' readOnly='true' id='fechaCotizacion' value={formatDate(new Date())} onChange={(e) => setFecha(e.target.value)}></input>
            </div>,
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Estado</span>
              <ButtonSwitch idComponente="estadoCotizacion" />
            </div>
          </div>
        ]}
      />

    </div>
  )
}

export default Cotizaciones
