import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CNavGroupItems, CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faFloppyDisk, faSearch, faCloudDownload, faToggleOff, faHashtag, faCalendarDays, faDollar, faCreditCard, faEye, faBan } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { CSmartPagination } from '@coreui/react-pro'
import { fecha2 } from 'src/views/funcionesExtras.proyecto'
import Modal from 'react-bootstrap/Modal';



const Ventas = () => {
  const url = 'http://localhost:8081/api/ventas'
  const [venta, setVenta] = useState([])
  const [idVenta, setIdVenta] = useState('')
  const [fecha, setFecha] = useState('')
  const [metodoPago, setMetodoPago] = useState('')
  const [estado, setEstado] = useState('')
  const [total, setTotal] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)
  const [estadoModal, setEstadoModal] = useState(true)
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1)

  //estado para el boton info
  const [ventasAsociadas, setVentasAsociadas] = useState([]);
  //detalle de la compra
  const [detalleVentaSeleccionada, setDetalleVentaSeleccionada] = useState({
    idVenta: '',
    fecha: '',
    metodoPago: '',
    estado: '',
    total: '',
  });
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    getVentas()
    setActualizacion(false)
  }, [actualizacion ? venta : null])

  const getVentas = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setVenta(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los Empleados:', error.message)
    }
  }


  const validar = () => {
    var parametros;
    var metodo;

    if (operation === 1) {
      console.log(idVenta)
      parametros = { idVenta: idVenta, fecha: fecha, metodoPago: metodoPago, estado: total };
      metodo = 'POST';
    } else {
      parametros = { idVenta: idVenta, estado: estado }
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);
  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      var tipo = respuesta.data[0];
      if (metodo === 'POST') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Venta agregada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Venta editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Venta eliminada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      };
    })
  }

  const deleteVenta = (idVenta) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar esta venta?',
      icon: 'question', text: 'No podra activar nuevamente esta venta',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdVenta(idVenta);
        enviarSolicitud('DELETE', { idVenta: idVenta });
      } else {
        show_alerta('La venta no fue eliminado', 'info')
      }
    });

  }
  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getVentas(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = venta.filter((elemento) => {

      if (elemento.idVenta.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.fecha.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.metodoPago.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.estado.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setVenta(resultadosBusqueda);
  };

  // Función para obtener las ventas de la página actual
  const getCurrentPageVentas = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return venta.slice(startIndex, endIndex);
  };

  const getVentasAsociadas = async (idVenta, valor) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/ventas/${idVenta}`);
      const data = response.data;

      // Verificar si la respuesta contiene los detalles de venta y actualizar los estados correspondientes
      if (data && data.detalleVenta) {
        setVentasAsociadas(data.detalleVenta);
      }
      if (data && data.venta) {
        setDetalleVentaSeleccionada(data.venta);
      }
      if (valor == 1) {
        setShowModal(true); // Mostrar la modal de ventas asociadas
      }
    } catch (error) {
      console.error('Error al obtener las ventas asociadas:', error.message);
    }
  };


  return (

    <div className='App'>
      <div className='container-fluid'>

        <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
            <h3>Ventas</h3>
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

          <Link to="/Ventas/agregarServ">
            <button className='botones-azules'>
              <FontAwesomeIcon icon={faPlusCircle} /> Añadir
            </button>
          </Link>
        </div>


        <div className='row mt-3'>

          <div className='table-responsive' style={{ maxWidth: '100%', margin: '0 auto' }}>
            <table className='table table-striped' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Fecha</th>
                  <th>Metodo pago</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>

                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {getCurrentPageVentas().map((r) => (
                  <tr key={r.idVenta} >

                    <td>{r.idVenta}</td>
                    <td>{fecha2(r.fecha)}</td>
                    <td>{r.metodoPago}</td>
                    <td>{r.estado ? 'true' : 'false'}</td>
                    <td>{r.total}</td>


                    <td>
                      <button className='btn btn-info' onClick={() => getVentasAsociadas(r.idVenta, 1)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      &nbsp;
                      <button className='btn btn-success'
                        data-bs-toggle='modal' data-bs-target='#modalCompras'>
                        <FontAwesomeIcon icon={faCloudDownload} />
                      </button>
                      &nbsp;
                      <button onClick={() => deleteVenta(r.idVenta)} className='btn btn-danger'>
                        <FontAwesomeIcon icon={faBan} />
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
        {/* Paginación */}
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2' >
            <CSmartPagination
              style={{ marginLeft: '-208px' }}
              activePage={currentPage}
              pages={Math.ceil(venta.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <div id='modalVentas' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close' id='btnCerrar'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='Id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></span>
                <input type='text' id='id' className='form-control' placeholder='ID' value={idVenta} onChange={(e) => setIdVenta(e.target.value)}></input>
              </div>
              {estadoModal ?
                <div className='input-group mb-3'>
                  <span className='input-group-text'><FontAwesomeIcon icon={faCalendarDays} /></span>
                  <input type='datetime-local' id='Fecha' className='form-control' placeholder='Fecha' value={fecha} onChange={(e) => setFecha(e.target.value)}></input>
                </div> : false}
              {estadoModal ? <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCreditCard} /></span>
                <input type='text' id='Metodo pago' className='form-control' placeholder='Metodo pago' value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}></input>
              </div> : false}
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='Estado' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstado(e.target.value)}></input>
              </div>
              {estadoModal ? <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faDollar} /></span>
                <input type='text' id='Total' className='form-control' placeholder='Total' value={total} onChange={(e) => setTotal(e.target.value)}></input>
              </div> : false}
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle venta</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ display: 'flex', margin: '3%', padding: '2%' }}>
            <div style={{ alignContent: 'space-around' }}>
              <div className='mb-3'>
                <label htmlFor='idVenta' className='form-label'>ID venta</label>
                <input type='text' className='form-control' id='idVenta' value={detalleVentaSeleccionada?.idVenta} readOnly />
              </div>
              <div className='mb-3'>
                <label htmlFor='metodoPago' className='form-label'>Metodo de pago</label>
                <input type='text' className='form-control' id='metodoPago' value={detalleVentaSeleccionada?.metodoPago} readOnly />
              </div>

            </div>
            <div style={{ marginLeft: '5%' }}>
              <div className='mb-3'>
                <label htmlFor='fecha' className='form-label'>Fecha Venta</label>
                <input type='text' className='form-control' id='fecha' value={fecha2(detalleVentaSeleccionada?.fecha)} readOnly />
              </div>
              <div className='mb-3'>
                <label htmlFor='total' className='form-label'>Total</label>
                <input type='text' className='form-control' id='total' value={detalleVentaSeleccionada?.total} readOnly />
              </div>
            </div>
          </div>
          <div></div>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>

              </tr>
            </thead>
            <tbody>
              {Array.isArray(ventasAsociadas) && ventasAsociadas.map((ventas) => (
                <tr key={ventas.idDetalleVentaProducto || ventas.idDetalleVentaServicio}>
                  <td>{ventas.idDetalleVentaProducto || ventas.idDetalleVentaServicio}</td>
                  <td>{ventas.Array === ventas.idDetalleVentaProducto ? "Servicio" : "Producto"}</td>
                  <td>{ventas.valorManoObra || ventas.precioVenta}</td>
                  <td>{ventas.cantidad || "1"}</td>
                  <td>{ventas.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>

      </Modal>
    </div>
  )

}
export default Ventas