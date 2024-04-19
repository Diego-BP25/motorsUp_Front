import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCartShopping, faMoneyCheckDollar, faUsers, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'


const Reportes = () => {

  const [empleado, setEmpleado] = useState([])
  const [productos, setProducto] = useState([])
  const [compras, setCompras] = useState([])
  const [ventas, setVentas] = useState([])
  useEffect(() => {
    getEmpleados()
    getProductos()
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

      setEmpleado(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los Empleados:', error.message)
    }

  }
  const getProductos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/productos', {})
      setProducto(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message)
    }
  }
  const getCompras = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/compras', {})
      setCompras(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message)
    }
  }
  const getVentas = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/ventas', {})
      setVentas(await respuesta.data)
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
            <h3 className="titulo">{productos.length}</h3>
            <div className="icon" >
              <FontAwesomeIcon icon={faScrewdriverWrench} className='iconos' />
            </div>
            <p className="subtitulo">Productos</p>
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