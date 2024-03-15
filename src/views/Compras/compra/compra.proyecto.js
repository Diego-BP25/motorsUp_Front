import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faTruckField, faCalendar, faToggleOff, faIdCardClip, faComment, faXmark } from '@fortawesome/free-solid-svg-icons'


const Compras = () => {
  //api de compras
  const url = 'http://localhost:8081/api/compras'
  const [compra, setCompra] = useState([])
  const [id, setIdCompra] = useState('')
  const [descripcion, setDescripcionCompra] = useState('')
  const [estado, setEstadoCompra] = useState('')
  const [fechaCompra, setFechaCompra] = useState('')
  const [proveedores_idProveedor, setProveedores_idProveedor] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)
  const [idError, setIdError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');
  const [consecutivo, setConsecutivo] = useState(0);

  //api de productos
  // const urlProducto = 'http://localhost:8081/api/productos'
  // const [productos, setProductos] = useState([])
  // const [idProducto, setIdProducto] = useState('')
  // const [nombreProducto, setNombreProducto] = useState('')
  // const [precioCompra, setPrecioCompra] = useState(new Float32Array)
  // const [estadoProducto, setEstadoProducto] = useState('')
  // const [precioVenta, setPrecioVenta] = useState(new Float32Array)
  // const [saldoExistencias, setSaldoExistencias] = useState(new Int32Array)
  // const [categoriaProducto_idCategoriaProducto, setCategoriaProducto_idCategoriaProducto] = useState('')
  // const [stockMinimo, setStockMinimo] = useState(new Int32Array)
  // const [stockMaximo, setStockMaximo] = useState(new Int32Array)
  // const [titleP, setTitleP] = useState('')
  // const [actualizacion2, setActualizacion2] = useState(false)
  // const [idErrorP, setIdErrorP] = useState('');
  // const [descripcionErrorP, setDescripcionErrorP] = useState('');
  // const [consecutivoP, setConsecutivoP] = useState(0);


  //proveedor
  const [proveedor, setProveedor] = useState([])
  const [proveedores, setProveedores] = useState('')

  useEffect(() => {
    getCompras()
    //getProductos()
    getProveedores()
    setActualizacion(false)
  }, [actualizacion ? compra : null])

  useEffect(() => {
    if (operation === 1) {
      obtenerIdConsecutivo();
    }
  }, [operation]);


  const obtenerIdConsecutivo = async () => {
    try {
      const respuesta = await axios.get(url);
      const compras = respuesta.data;
      if (compras.length > 0) {
        const maxId = Math.max(...compras.map(c => c.idCompra));
        setConsecutivo(maxId + 1);
      } else {
        setConsecutivo(1);
      }
    } catch (error) {
      console.error('Error al obtener el número consecutivo más alto:', error.message);
    }
  };


  useEffect(() => {
    getProveedores()
  }, [])

  // const getProductos = async () => {
  //   try {
  //     const respuesta = await axios.get(urlProducto, {})
  //     setProductos(await respuesta.data)
  //   } catch (error) {
  //     console.error('Error al obtener los productos:', error.message)
  //   }
  // }

  const getProveedores = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/proveedores', {})
      setProveedor(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los proveedores:', error.message)
    }
  }

  const getCompras = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setCompra(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las compras:', error.message)
    }
  }

  const openModal = (op, id, descripcion, estado_, fechaCompra, proveedores) => {
    setIdCompra('');
    setDescripcionCompra()
    setDescripcionCompra('');
    setEstadoCompra('');
    setFechaCompra('');
    setProveedores('');
    setOperation('');
    if (op === 1) {
      setTitle('Registrar compra')
      obtenerIdConsecutivo();
    }
    else if (op === 2) {
      setTitle('Editar compra')
      setIdCompra(id);
      setDescripcionCompra(descripcion);
      setEstadoCompra(estado_);
      setFechaCompra(fechaCompra);
      setProveedores_idProveedor(proveedores_idProveedor);
      setProveedores('')
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('id').focus();
    }, 500);
  }

  // const openModalProducto = (op, idProducto, descripcion, estado_, fechaCompra, proveedores_idProveedor) => {
  //   setIdProducto('');
  //   setNombreProducto()
  //   setPrecioCompra('');
  //   setEstadoProducto('');
  //   setPrecioVenta('');
  //   setSaldoExistencias('');
  //   setCategoriaProducto_idCategoriaProducto('');
  //   setStockMinimo('');
  //   setStockMaximo('');
  //   setOperation('');
  //   if (op === 1) {
  //     setTitle('Registrar compra')
  //     obtenerIdConsecutivo();
  //   }
  //   else if (op === 2) {
  //     setTitle('Editar compra')
  //     setIdCompra(id);
  //     setDescripcionCompra(descripcion);
  //     setEstadoCompra(estado_);
  //     setFechaCompra(fechaCompra);
  //     setProveedores_idProveedor(proveedores_idProveedor);
  //     setProveedores('')
  //   }
  //   setOperation(op)
  //   window.setTimeout(function () {
  //     document.getElementById('id').focus();
  //   }, 500);
  // }


  const validarCamposObligatorios = () => {
    let hayErrores = false;
    if (!descripcion.trim()) {
      setDescripcionError('El campo descripción es obligatorio');
      hayErrores = true;
    } else {
      setDescripcionError('');
    }
    if (!descripcion.trim()) {
      setDescripcionError('El campo descripción es obligatorio');
      hayErrores = true;
    } else {
      setDescripcionError('');
    }
    if (!descripcion.trim()) {
      setDescripcionError('El campo descripción es obligatorio');
      hayErrores = true;
    } else {
      setDescripcionError('');
    }
    return hayErrores;
  };



  const validar = () => {
    var parametros;
    var metodo;

    const camposObligatoriosInvalidos = validarCamposObligatorios();

    if (camposObligatoriosInvalidos) {
      return;
    }

    if (operation === 1) {
      parametros = { idCompra: consecutivo, descripcionCompra: descripcion, estadoCompra: estado, fechaCompra: fechaCompra, proveedores_idProveedor: proveedores };
      console.log(parametros)
      metodo = 'POST';
    } else {
      parametros = { idCompra: id, descripcionCompra: descripcion, estadoCompra: (estado === 0 ? 'false' : 'true'), fechaCompra: fechaCompra, proveedores_idProveedor: proveedores };
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);

  }

  const enviarSolicitud = async (metodo, parametros) => { await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (metodo === 'POST') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra agregada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();

      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra eliminada con exito",
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


    
  const deleteCompra = (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar está compra?',
      icon: 'question', text: 'No podra activar nuevamente la compra',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdCompra(id);
        enviarSolicitud('DELETE', { idCompra: id });
      } else {
        show_alerta('La compra no fue eliminada', 'info')
      }
    });
  }

  return (

    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCompras'>
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
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
                    <th>Fecha</th>
                    <th>Id proveedor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {compra.map((c) => (
                    <tr key={c.idCompra}>
                      <td>{c.idCompra}</td>
                      <td>{c.descripcionCompra}</td>
                      <td>{c.estadoCompra === 0 ? 'Suspendido' : 'Activo'}</td>
                      <td>{c.fechaCompra}</td>
                      <td>{c.proveedores_idProveedor}</td>
                      <td>
                        <button onClick={() => openModal(2, c.idCompra, c.descripcionCompra, c.estadoCompra, c.fechaCompra, c.proveedores_idProveedor)} className='btn btn-warning'
                          data-bs-toggle='modal' data-bs-target='#modalCompras'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button onClick={() => deleteCompra(c.idCompra)} className='btn btn-danger'>
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
      <div id='modalCompras' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button id='btnCerrar' onClick={() => { setDescripcionError(''); setIdError('')}} type='button' data-bs-dismiss='modal'><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='number' id='id' className='form-control' placeholder='id' value={operation === 1 ? consecutivo : id}/>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input
                  type='text'
                  id='descripcion'
                  className={`form-control ${descripcionError ? 'is-invalid' : ''}`}
                  placeholder='Descripcion'
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcionCompra(e.target.value);
                    setDescripcionError('');
                  }}
                />
                {descripcionError && (
                  <div className='invalid-feedback'>
                    {descripcionError}
                  </div>
                )}
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='estadoCompra' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstadoCompra(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='fechaCompra' className='form-control' placeholder='Fecha compra' value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span key='proveedores_idProveedor' className='input-group-text'><FontAwesomeIcon icon={faTruckField} /></span>
                <select id='proveedores_idProveedor' className='form-select' value={proveedores} onChange={(e) => setProveedores(e.target.value)}>
                  <option value='' disabled>Seleccione un proveedor</option>
                  {proveedor.map((p) => (
                    <option key={p.idProveedor} value={p.idProveedor}>{p.nombreProveedor}</option>
                  ))}
                </select>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Compras
