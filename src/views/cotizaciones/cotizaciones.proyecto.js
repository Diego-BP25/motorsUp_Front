import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { actualizarCamposConsultas, formatDate } from '../funcionesExtras.proyecto'
import { ContentDoble, ContentIndividual, ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonSwitch } from 'src/components/proyect/switch.proyecto'
import { ButtonNormal } from 'src/components/proyect/buttons.proyecto'
import { SeletedOption } from 'src/components/proyect/select.proyecto'
import { getDataRouterId } from 'src/https/peticiones.proyecto'
import { ListView } from 'src/tablas/listView.proyecto'

const Cotizaciones = () => {
  const url = 'http://localhost:8081/api/cotizacion'
  const [cotizacion, setCotizacion] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState()
  const [fecha, setFecha] = useState('')
  const [vehiculos_placa, setPlacaVehiculo] = useState('')

  const [valorManoObra, setValorManoObra] = useState('$ 0')
  const [valorCotizacion, setValorCotizacion] = useState('$ 0')

  // Detalle servicio.
  const [servicio, setServicio] = useState([])
  const [nombreservicio, setNombreServicio] = useState()
  const [cantidad, setCantidadServicio] = useState('')
  const [idservicio, setIdServicio] = useState()
  const [precioservicio, setPrecioServicio] = useState('$ 0')
  const [tablaDetalleCotizacionServicio, setTablaDetalleCotizacionServicio] = useState(new ListView());

  // Detalle productos
  const [producto, setProducto] = useState([])
  const [nombreProducto, setNombreProducto] = useState()
  const [cantidadProducto, setCantidadPrducto] = useState('')
  const [idProducto, setIdProducto] = useState()
  const [precioProducto, setPrecioProducto] = useState('$ 0')
  const [tablaDetalleCotizacionProducto, setTablaDetalleCotizacionProducto] = useState(new ListView());

  const [countServicio, setcountServicio] = useState(0)
  const [countProducto, setcountProducto] = useState(0)
  const [tablaDetalleActul, setTablaDetalleActual] = useState(false)

  useEffect(() => {
    getCotizaciones()
  }, [])

  useEffect(() => {
    if (idservicio !== undefined) getDataRouterId(`servicio/id?idServicio=${idservicio}`, setServicio);
  }, [idservicio])

  useEffect(() => {
    if (idProducto !== undefined) getDataRouterId(`productos/id?idProducto=${idProducto}`, setProducto);
  }, [idProducto])

  useEffect(() => {
    if (idservicio != undefined) actualizarCamposConsultas([setPrecioServicio, setNombreServicio], servicio, ['precioServicio', 'nombreServicio']);
  }, [servicio])

  useEffect(() => {
    if (idProducto != undefined) actualizarCamposConsultas([setPrecioProducto, setNombreProducto], producto, ['precioVenta', 'nombreProducto']);
  }, [producto])

  useEffect(() => {
    mainTablaDetalleCotizacionServicio();
    setTablaDetalleActual(false)
  }, [tablaDetalleActul])

  const getCotizaciones = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setCotizacion(respuesta.data)
    } catch (error) {
      console.error('Error al obtener las compras:', error.message)
    }
  }

  const addTablaDetalle = (tablaDetalle, objeto, estadoActualizar, subTotal) => {
    tablaDetalle.setObjeto(objeto)

    const valor = subTotal;
    estadoActualizar(`$ ${valor}`);
  }

  const deleteDetalleCoServicio = (codigoObjetoBorrar, tablaDetalleCotizacion) => {
    const newTable = tablaDetalleCotizacion.deleteObjeto(codigoObjetoBorrar);
    setTablaDetalleActual(true);
  }

  const mainTablaDetalleCotizacionServicio = (tablaDetalleCotizacion) => {
    if (!tablaDetalleCotizacion) return;
    return tablaDetalleCotizacion.getAObjetos().map((c) => (
      <tr key={c.codigo}>
        <td>{c.codigo}</td>
        <td>{c.nombre}</td>
        <td>{c.precio}</td>
        <td>{c.cantidad}</td>
        <td>{c.subTotal}</td>
        <td>
          <button onClick={() => deleteDetalleCoServicio(c.codigo, tablaDetalleCotizacion)} className='btn btn-danger'>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    ))
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
        idModal='modalCotizaciones'
        inputs={[
          <ContentDoble key="fechaCotizacionYButtonSwitch" componentes={[
            <ContentIndividual key="fechaYHora" componentes={[
              <span key="title">Fecha y hora</span>,
              <input key="componente" className="form-control" type='datetime-local' readOnly='true' id='fechaCotizacion' value={formatDate(new Date())} onChange={(e) => setFecha(e.target.value)}></input>
            ]} />,
            <ContentIndividual key="estado" componentes={[
              <span key="title"> Estado</span>,
              <ButtonSwitch key="componente" idComponente="estadoCotizacion" estado_componente={estado} onChange={(e) => setEstado(e.target.checked)} />
            ]} />
          ]} />,

          <ContentDoble key="valorManoObraYValorInsumos" componentes={[
            <ContentIndividual key="valorManoObra" componentes={[
              <span key="title">Mano de obra</span>,
              <input key="componente" className="form-control" type='text' readOnly='true' id='valorManoObra' value={valorManoObra} onChange={(e) => setValorManoObra(e.target.value)}></input>
            ]} />,
            <ContentIndividual key="valorInsumos" componentes={[
              <span key="title">Valor insumos</span>,
              <input key="componente" className="form-control" type='text' readOnly='true' id='valorInsumos' value={valorCotizacion} onChange={(e) => setValorCotizacion(e.target.value)}></input>
            ]} />
          ]} />,
          <ContentDoble key="vehiculoOpcionesCotizacion" componentes={[
            <ContentIndividual key="vehiculo" componentes={[
              <span key="title">Vehiculo</span>,

              <select key="componente" className="form-control" id='vehiculos' value={vehiculos_placa} onChange={(e) => setPlacaVehiculo(e.target.value)}>
                <option key="default" value="default">Seleccione el vehiculo</option>
                <SeletedOption key='options' tabla='vehiculos' columna='placa' />
              </select>

            ]} />,
            <ContentIndividual key="vehiculo" componentes={[
              <span key="title">opciones</span>,
              <ContentIndividual key="opcionesButton" componentes={[
                <ButtonNormal key="buttonCoServivcio" idComponent="buttonCoServivcio" idModal='#modalCotizacionServicio' title="Cotizar Servicio" />,
                <ButtonNormal key="buttonCoProcucto" idComponent="buttonCoProducto" title="Cotizar Producto" idModal='#modalCotizacionProducto' />
              ]} flexDirectionContents='row' justifyContents='space-between' />
            ]} />,
          ]} />,
          <ContentIndividual key="descripcioContents" componentes={[
            <span key="title">Descripcion</span>,
            <ContentIndividual key="contentsDescripcion" componentes={[
              <textarea key="descripcion" className="form-control"
                style={{
                  flex: '1',
                  padding: '5px',
                }} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} ></textarea>,
            ]} widthContents='600px' />
          ]} />,
          <div key="buttonGuardar" className='d-grid col-6 mx-auto'>
            <button className='btn btn-success'>
              <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
            </button>
          </div>
        ]} widthContents='650px' />

      <ModalProyecto
        title='Agregar servicio a cotizar'
        idModal='modalCotizacionServicio'
        inputs={[
          <ContentDoble key="fechaCotizacionYButtonSwitch" componentes={[
            <ContentIndividual key="vehiculo" componentes={[
              <span key="title">Nombre servicio</span>,
              <select key="componente" className="form-control" id='vehiculos' onChange={(e) => { setIdServicio(e.target.value) }}>
                <option value="defaut">Selecione un servicio</option>
                <SeletedOption key='options' tabla='servicios' columna='idServicio, nombreServicio' />
              </select>
            ]} />, <ContentIndividual key="valorManoObra" componentes={[
              <span key="title">Precio de servicio</span>,
              <input key="componente" className="form-control" type='text' id='inputPrecioServicio' value={precioservicio} onChange={(e) => setPrecioServicio(e.target.value)}></input>
            ]} />,
          ]} />,
          <ContentDoble key="valorManoObraYValorInsumos" componentes={[
            <ContentIndividual key="valorInsumos" componentes={[
              <span key="title">Cantidad</span>,
              <input key="componente" className="form-control" type='number' max={3} id='inputCantidadCotizacion' value={cantidad} onChange={(e) => setCantidadServicio(e.target.value)}></input>
            ]} />,
            <ContentIndividual key="opciones" componentes={[
              <span key="title" style={{ margin: '0 auto' }}>opciones</span>,
              <ContentIndividual key="opcionesButton" componentes={[
                <ButtonNormal key="buttonAddServivcio" idComponent="buttonAddServivcio" funcionButton={
                  () => {
                    addTablaDetalle(tablaDetalleCotizacionServicio,
                      { codigo: countServicio, nombre: nombreservicio, precio: precioservicio, cantidad: cantidad, subTotal: (parseInt(precioservicio.substring(1, precioservicio.length)) * parseInt(cantidad)) },
                      setValorManoObra, (parseInt(valorManoObra.substring(1, valorManoObra.length)) + (parseInt(precioservicio.substring(1, precioservicio.length)) * parseInt(cantidad))).toString())
                    setcountServicio(countServicio + 1)
                    setPrecioServicio("$ 0")
                    setCantidadServicio("0")
                  }}
                  title="agregar Servicio" />,
                <ButtonNormal key="buttonCoProcucto" idComponent="buttonCoProducto" idModal='#modalServiciosCotizados' title="Ver servicios" />
              ]} flexDirectionContents='row' justifyContents='space-evenly' />,
            ]} marginContent='0 auto' />,
          ]} />,
          <div key="buttonGuardar" className='d-grid col-6 mx-auto'>
            <button className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalCotizaciones'>
              Acceptar <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>,

        ]} widthContents='650px' />

      <ModalProyecto
        title='Servicios cotizados'
        idModal='modalServiciosCotizados'
        inputs={[
          <button key="volver" className='btn' data-bs-toggle='modal' data-bs-target='#modalCotizacionServicio'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>,
          <table key="tableDetalles" className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre servicio</th>
                <th>Precio servicio</th>
                <th>Cantidad</th>
                <th>SubTotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* ref={tableRef} */}
            <tbody className='table-group-divider'>
              {
                mainTablaDetalleCotizacionServicio(tablaDetalleCotizacionServicio)
              }
            </tbody>
          </table>
        ]} widthContents='550px' />

      <ModalProyecto
        title='Servicios cotizados'
        idModal='modalServiciosCotizados'
        inputs={[
          <button key="volver" className='btn' data-bs-toggle='modal' data-bs-target='#modalCotizacionServicio'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>,
          <table key="tableDetalles" className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre servicio</th>
                <th>Precio servicio</th>
                <th>Cantidad</th>
                <th>SubTotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* ref={tableRef} */}
            <tbody className='table-group-divider'>
              {
                mainTablaDetalleCotizacionServicio()
              }
            </tbody>
          </table>
        ]} widthContents='550px' />

      <ModalProyecto
        title='Agregar producto a cotizar'
        idModal='modalCotizacionProducto'
        inputs={[
          <ContentDoble key="fechaCotizacionYButtonSwitch" componentes={[
            <ContentIndividual key="nameProducto" componentes={[
              <span key="title">Nombre producto</span>,
              <select key="componente" className="form-control" id='nombreProducto' onChange={(e) => { setIdProducto(e.target.value) }}>
                <option value="defaut">Seleccione un producto</option>
                <SeletedOption key='options' tabla='productos' columna='idProducto, nombreProducto' />
              </select>
            ]} />, <ContentIndividual key="valorManoObra" componentes={[
              <span key="title">Precio de producto</span>,
              <input key="componente" className="form-control" type='text' id='inputPrecioProducto' value={precioProducto} onChange={(e) => setPrecioProducto(e.target.value)}></input>
            ]} />,
          ]} />,
          <ContentDoble key="valorManoObraYValorInsumos" componentes={[
            <ContentIndividual key="valorInsumos" componentes={[
              <span key="title">Cantidad</span>,
              <input key="componente" className="form-control" type='number' max={3} id='inputCantidadCotizacionProducto' value={cantidadProducto} onChange={(e) => setCantidadPrducto(e.target.value)}></input>
            ]} />,
            <ContentIndividual key="opciones" componentes={[
              <span key="title" style={{ margin: '0 auto' }}>opciones</span>,
              <ContentIndividual key="opcionesButton" componentes={[
                <ButtonNormal key="buttonAddProducto" idComponent="buttonAddProducto" funcionButton={() => {
                  addTablaDetalle(tablaDetalleCotizacionProducto,
                    { codigo: countProducto, nombre: nombreProducto, precio: precioProducto, cantidad: cantidadProducto, subTotal: (parseInt(precioProducto.substring(1, precioProducto.length)) * parseInt(cantidadProducto)) },
                    setValorCotizacion, (parseInt(valorCotizacion.substring(1, valorCotizacion.length)) + (parseInt(precioProducto.substring(1, precioProducto.length)) * parseInt(cantidadProducto))).toString())
                  setcountProducto(countProducto + 1)
                  setPrecioProducto("$ 0")
                  setCantidadPrducto("0")
                }} title="Agregar Producto" />,
                <ButtonNormal key="buttonCoProcucto" idComponent="buttonCoProducto" idModal='#modalProductosCotizados' title="Ver productos" />
              ]} flexDirectionContents='row' justifyContents='space-evenly' />,
            ]} marginContent='0 auto' />,
          ]} />,
          <div key="buttonGuardar" className='d-grid col-6 mx-auto'>
            <button className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalCotizaciones'>
              Acceptar <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>,

        ]} widthContents='650px' />


      <ModalProyecto
        title='Productos cotizados'
        idModal='modalProductosCotizados'
        inputs={[
          <button key="volver" className='btn' data-bs-toggle='modal' data-bs-target='#modalCotizacionProducto'>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>,
          <table key="tableDetalles" className='table table-bordered'>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre producto</th>
                <th>Precio producto</th>
                <th>Cantidad</th>
                <th>SubTotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            {/* ref={tableRef} */}
            <tbody className='table-group-divider'>
              {
                mainTablaDetalleCotizacionServicio(tablaDetalleCotizacionProducto)
              }
            </tbody>
          </table>
        ]} widthContents='550px' />

    </div>
  )
}

export default Cotizaciones
