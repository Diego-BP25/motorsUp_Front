import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCloudDownload, faIdCardClip, faToggleOff, faPlusCircle, faEdit, faFloppyDisk, faCheck, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';
import { fecha2 } from 'src/views/funcionesExtras.proyecto'
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CSmartPagination } from '@coreui/react-pro';
import { actualizarCamposConsultas, formatDate } from '../funcionesExtras.proyecto'
import { ContentDoble, ContentIndividual, ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonSwitch } from 'src/components/proyect/switch.proyecto'
import { ButtonNormal } from 'src/components/proyect/buttons.proyecto'
import { SeletedOption } from 'src/components/proyect/select.proyecto'
import { getDataRouterId, peticionPost } from 'src/https/peticiones.proyecto'
import { ListView } from 'src/clases/tables/listView.proyecto'
import { addTablaDetalle, mainTablaDetalleCotizacion } from 'src/clases/tables/fucionesListView.proyecto'
import { Link } from 'react-router-dom';
import { show_alerta } from 'src/fuctions.proyecto'
import Swal from 'sweetalert2'

const Cotizaciones = () => {
  const url = 'http://localhost:8081/api/cotizacion'
  const [cotizacion, setCotizacion] = useState([])
  const [actualizacion, setActualizacion] = useState(false)
  const [title, setTitle] = useState('')
  const [estado, setEstado] = useState('')
  const [operation, setOperation] = useState(1)
  const [idCotizacion, setIdCotizacion] = useState('')

  //estado para el boton info
  const [cotizacionAsociadas, setCotizacionAsociadas] = useState([]);
  //detalle de la compra
  const [detalleCotizacionSeleccionada, setDetalleCotizacionSeleccionada] = useState({
    idCotizacion: '',
    descripcion: '',
    total: '',
    estado: '',
    fecha: '',
    valorCotizacion: '',
    vehiculos_placa: '',
  });
  const [showModal, setShowModal] = useState(false);

  //buscador
  const [busqueda, setBusqueda] = useState("");

  //paginado
  const [currentPage, setCurrentPage] = useState(1)

  const [productosName, setProductosName] = useState({});

  const [serviciosName, setServiciosName] = useState({});

  useEffect(() => {
    getCotizaciones()
    setActualizacion(false)
    getProductosName()
    getServiciosName()
  }, [actualizacion ? cotizacion : null])

  const getCotizaciones = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setCotizacion(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las cotizaciones', error.message)
    }
  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim() === '') {
      getCotizaciones();
    } else {
      filtrar(valor);
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = cotizacion.filter((elemento) => {

      if (elemento.descripcion.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.estado.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.vehiculos_placa.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setCotizacion(resultadosBusqueda);
  }

  const getCotizacionAsociadas = async (idCotizacion, valor) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/cotizacion/${idCotizacion}`);
      const data = response.data;

      // Verificar si la respuesta contiene los detalles de venta y actualizar los estados correspondientes
      if (data && data.detalleCotizacion) {
        setCotizacionAsociadas(data.detalleCotizacion);
      }
      if (data && data.cotizacion) {
        setDetalleCotizacionSeleccionada(data.cotizacion);
      }
      if (valor == 1) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al obtener las cotizaciones asociadas:', error.message);
    }
  };

  const getProductosName = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/productos');
      const datosProductos = respuesta.data.reduce((acc, producto) => {
        acc[producto.idProducto] = producto.nombreProducto;
        return acc;
      }, {});
      setProductosName(datosProductos);
    } catch (error) {
      console.error('Error al obtener el nombre de los productos', error.message);
    }
  };

  const getServiciosName = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/servicio');
      const datosServicios = respuesta.data.reduce((acc, servicio) => {
        acc[servicio.idServicio] = servicio.nombreServicio;
        return acc;
      }, {});
      setServiciosName(datosServicios);
    } catch (error) {
      console.error('Error al obtener el nombre de los servicios', error.message);
    }
  };



  const generarPDF = async (idCotizacion) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/cotizacion/${idCotizacion}`);
      const detalleCotizacion = response.data.cotizacion;
      const productosAsociados = response.data.detalleCotizacion;

      const doc = new jsPDF();

      // Título del PDF
      doc.setFontSize(18);
      doc.text("Detalles de la Cotizacion", 14, 15);

      // Datos de la cotizacion
      doc.setFontSize(12);
      doc.text(`ID cotizacion: ${detalleCotizacion.idCotizacion}`, 14, 30);
      doc.text(`Descripción: ${detalleCotizacion.descripcion}`, 14, 40);
      doc.text(`Estado: ${detalleCotizacion.estado}`, 14, 50);
      doc.text(`Fecha: ${fecha2(detalleCotizacion.fecha)}`, 14, 60);
      doc.text(`Vehiculo: ${cotizacionAsociadas.map((cotizacion) => (cotizacion.vehiculos_placa))}`, 14, 70);
      doc.text(`Total cotizacion: ${detalleCotizacion.total}`, 14, 80);

      // Tabla de productos asociados
      const productosData = productosAsociados.map((cotizacion) => [
        productosName[cotizacion.productos_idProducto] || serviciosName[cotizacion.servicios_idServicio],
        cotizacion.Array === cotizacion.idDetalleCotizacionProducto ? "Servicio" : "Producto",
        cotizacion.valorManoObra || cotizacion.precioVenta,
        cotizacion.cantidad || "1",
        cotizacion.total
      ]);



      doc.autoTable({
        startY: 90,
        head: [['Nombre', 'tipo', 'Valor unitario', 'Cantidad', 'Total']],
        body: productosData,
      });

      // Guardar o descargar el PDF
      doc.save("detalle_compra.pdf");
    } catch (error) {
      console.error('Error al generar el PDF:', error.message);
    }
  };

  // Función para obtener las cotizaciones de la página actual
  const getCurrentPageCotizaciones = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return cotizacion.slice(startIndex, endIndex);
  }

  const openModal = (op, estado, idCotizacion) => {
    setEstado('');
    setIdCotizacion('');
    if (op === 2) {
      setTitle('Editar cotizacion')
      setIdCotizacion(idCotizacion);
      setEstado(estado);
      setOperation('');
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('estado').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;


    if (operation === 2) {
      parametros = { idCotizacion: idCotizacion, estado: estado };
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);

  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cotizacion editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      setActualizacion(true)
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      })
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
            <h3>Cotizaciones</h3>
          </div>
          <div className='input-group' style={{ marginRight: '1%' }}>
            <input className='form-control inputBuscador'
              id='buscador'
              value={busqueda}
              placeholder='Buscar'
              onChange={handleChange}
            />
            <div className="icon-container">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>

          <Link to="/cotizacion/agregar">
            <button className='botones-azules'>
              <FontAwesomeIcon icon={faPlusCircle} /> Añadir
            </button>
          </Link>
        </div>

        <div className='row mt-3'>
          <div className="table-responsive" style={{ maxWidth: '100%', margin: '0 auto' }}>
            <table className='table table-striped' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th>Valor cotizacion</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              {/* ref={tableRef} */}
              <tbody className='table-group-divider'>
                {getCurrentPageCotizaciones().map((c) => (
                  <tr key={c.idCotizacion}>
                    <td>{c.idCotizacion}</td>
                    <td>{c.descripcion}</td>
                    <td>{fecha2(c.fecha)}</td>
                    <td>{c.valorCotizacion}</td>
                    <td>{c.total}</td>
                    <td>{c.estado}</td>
                    <td>
                      <button className='btn btn-info' onClick={() => getCotizacionAsociadas(c.idCotizacion, 1)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      &nbsp;
                      <button className='btn btn-success' onClick={() => generarPDF(c.idCotizacion)}>
                        <FontAwesomeIcon icon={faCloudDownload} />
                      </button>
                      &nbsp;
                      <button onClick={() => openModal(2, c.estado, c.idCotizacion)} className='btn btn-warning'
                        data-bs-toggle='modal' data-bs-target='#modalCotizaciones'>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Paginación */}
        <div className='row mt-3' style={{ marginLeft: '-21.5%' }}>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <CSmartPagination
              activePage={currentPage}
              pages={Math.ceil(cotizacion.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <div id='modalCotizaciones' className='modal fade' aria-hidden='true' data-bs-backdrop='static' data-bs-keyboard='false' >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' id='btnCerrar' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='text' id='estado' className='form-control' value={idCotizacion} onChange={(e) => setIdCotizacion(e.target.value)} disabled />
              </div>

              <div className='input-group mb-3' >
                <label htmlFor='estado' className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></label>
                <select id='estado' className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)}>
                  <option  disabled>Seleccione un estado</option>
                  <option value='Venta'>Venta</option>
                  <option value='Cotizacion'>Cotizacion</option>
                </select>
              </div>

              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='botones-azules'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle cotizacion</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ display: 'flex', margin: '3%', padding: '2%' }}>
            <div style={{ alignContent: 'space-around' }}>
              <div className='mb-3'>
                <label htmlFor='idCotizacion' className='form-label'>ID cotizacion</label>
                <input type='text' className='form-control' id='idCotizacion' value={detalleCotizacionSeleccionada?.idCotizacion} readOnly />
              </div>
              <div className='mb-3'>
                <label htmlFor='descripcion' className='form-label'>Descripcion</label>
                <input type='text' className='form-control' id='descripcion' value={detalleCotizacionSeleccionada?.descripcion} readOnly />
              </div>

              <div className='mb-3'>
                <label htmlFor='estado' className='form-label'>Vehiculo</label>
                <input type='text' className='form-control' id='estado' readOnly />
              </div>

            </div>
            <div style={{ marginLeft: '5%' }}>
              <div className='mb-3'>
                <label htmlFor='fecha' className='form-label'>Fecha cotizacion</label>
                <input type='text' className='form-control' id='fecha' value={fecha2(detalleCotizacionSeleccionada?.fecha)} readOnly />
              </div>

              <div className='mb-3'>
                <label htmlFor='total' className='form-label'>Total cotizacion</label>
                <input type='text' className='form-control' id='total' value={detalleCotizacionSeleccionada?.total} readOnly />
              </div>

              <div className='mb-3'>
                <label htmlFor='valorCotizacion' className='form-label'>Valor cotizacion</label>
                <input type='text' className='form-control' id='valorCotizacion' value={detalleCotizacionSeleccionada?.valorCotizacion} readOnly />
              </div>


            </div>
          </div>
          <div></div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cotizacionAsociadas) && cotizacionAsociadas.map((cotizacion) => (
                <tr key={cotizacion.idDetalleCotizacionProducto || cotizacion.idDetalleCotizacionServicio}>
                  <td>{productosName[cotizacion.productos_idProducto] || serviciosName[cotizacion.servicios_idServicio]}</td>
                  <td>{cotizacion.Array === cotizacion.idDetalleCotizacionProducto ? "Servicio" : "Producto"}</td>
                  <td>{cotizacion.valorManoObra || cotizacion.precioVenta}</td>
                  <td>{cotizacion.cantidad || "1"}</td>
                  <td>{cotizacion.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>

      </Modal>
    </div >
  )
}

export default Cotizaciones
