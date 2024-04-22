import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCartShopping, faMoneyCheckDollar, faUsers, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'


const Reportes = () => {


  const [empleado, setEmpleado] = useState([])
  const [agendamiento, setAgendamiento] = useState([])
  const [compras, setCompras] = useState([])
  const [ventas, setVentas] = useState([])
  const fechaActual = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getEmpleados()
    getAgendamientos()
    getCompras()
    getVentas()
  }, []);
  const getEmpleados = async () => {
    try {
      const token = localStorage.getItem('Empleado');

      const tokenSinComillas = token.slice(1, -1);
      const headers = {
        'x-token': tokenSinComillas
      };


      const respuesta = await axios.get('http://localhost:8081/api/empleados', { headers: headers })
      let empleadosData = respuesta.data.filter(em => em.estado == true);
      setEmpleado(empleadosData)
    } catch (error) {
      console.error('Error al obtener los Empleados:', error.message)
    }

  }
  const getAgendamientos = async () => {
    try {
      
      const respuesta = await axios.get('http://localhost:8081/api/agendamientos', {})
      let agendamientosData = respuesta.data.filter(ag => ag.fecha.startsWith(fechaActual) && ag.estado == true);
      setAgendamiento(agendamientosData)
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message)
    }
  }
  const getCompras = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/compras', {})
      let comprasData = respuesta.data.filter(co => co.fechaCompra.startsWith(fechaActual) && co.estadoCompra == true);
      setCompras(comprasData)
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message)
    }
  }
  const getVentas = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/ventas', {})
      let ventasData = respuesta.data.filter(ve => ve.fecha.startsWith(fechaActual) && ve.estado == true);
      setVentas(ventasData)
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message)
    }
  }

  return (
    <>
      <div style={{ marginRight: 'auto' }}>
        <h3>Dashboard </h3>
      </div>


    
      <div className="col-lg-3 col-6">
        <div className="small-box bg-info">
          <div className="inner">
            <h3 className="titulo" >{compras.length}</h3>
            <div className="icon" >
              <FontAwesomeIcon icon={faCartShopping} className='iconos' />
            </div>
            <p className="subtitulo">Compras</p>
          </div>



          <a id="enlace" onClick={() => { window.location.href = '/compras/compra'; }} href="#" className="small-box-footer">
            Más información <FontAwesomeIcon icon={faArrowRight} />
          </a>

        </div>
      </div>


      <div className="col-lg-3 col-6">
        <div className="small-box bg-success">
          <div className="inner">
            <h3 className="titulo">{ventas.length}</h3>
            <div className="icon" >
              <FontAwesomeIcon icon={faMoneyCheckDollar} className='iconos' />
            </div>
            <p className="subtitulo">Ventas</p>
          </div>


          <a id="enlace" onClick={() => { window.location.href = '/Ventas/venta'; }} href="#" className="small-box-footer">
            Más información <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>


      <div className="col-lg-3 col-6">
        <div className="small-box bg-warning">
          <div className="inner">
            <h3 className="titulo">{empleado.length}</h3>
            <div className="icon" >
              <FontAwesomeIcon icon={faUsers} className='iconos' />
            </div>
            <p className="subtitulo">Empleados</p>
          </div>

          <a id="enlace" onClick={() => { window.location.href = '/Configuracion/empleado'; }} href="#" className="small-box-footer">
            Más información <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>




      <div className="col-lg-3 col-6">
        <div className="small-box bg-danger">
          <div className="inner">
            <h3 className="titulo">{agendamiento.length}</h3>
            <div className="icon" >
              <FontAwesomeIcon icon={faCalendarDays} className='iconos' />
            </div>
            <p className="subtitulo">Citas</p>
          </div>


          <a id="enlace" onClick={() => { window.location.href = '/compras/productos'; }} className="small-box-footer">
            Más información <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>

    </>
  )
}

export default Reportes