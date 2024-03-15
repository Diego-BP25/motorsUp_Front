import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faTruckField, faCalendar, faToggleOff, faIdCardClip, faComment, faXmark } from '@fortawesome/free-solid-svg-icons'


const Productos = () => {
  //api de productos
  const url = 'http://localhost:8081/api/productos'
  const [productos, setProductos] = useState([])
  const [idProducto, setIdProducto] = useState('')
  const [nombreProducto, setNombreProducto] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [estadoProducto, setEstadoProducto] = useState('')
  const [precioVenta, setPrecioVenta] = useState('')
  const [saldoExistencias, setSaldoExistencias] = useState('')
  const [categoriaProducto_idCategoriaProducto, setCategoriaProducto_idCategoriaProducto] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  const [stockMaximo, setStockMaximo] = useState('')
  const [title, setTitle] = useState('')
  const [operation, setOperation] = useState(1)
  const [actualizacion, setActualizacion] = useState(false)
  const [consecutivo, setConsecutivo] = useState(0);


  useEffect(() => {
    getProductos()
    setActualizacion(false)
  }, [actualizacion ? productos : null])

  useEffect(() => {
    if (operation === 1) {
      obtenerIdConsecutivo();
    }
  }, [operation]);


  const obtenerIdConsecutivo = async () => {
    try {
      const respuesta = await axios.get(url);
      const producto = respuesta.data;
      if (producto.length > 0) {
        const maxId = Math.max(...producto.map(p => p.idProducto));
        setConsecutivo(maxId + 1);
      } else {
        setConsecutivo(1);
      }
    } catch (error) {
      console.error('Error al obtener el número consecutivo más alto:', error.message);
    }
  };

  const getProductos = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setProductos(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los productos:', error.message)
    }
  }

  const openModal = (op, idProducto, estadoProducto, nombreProducto, precioCompra, precioVenta, saldoExistencias, stockMaximo, stockMinimo, categoriaProducto_idCategoriaProducto) => {
    setIdProducto('');
    setNombreProducto('');
    setPrecioCompra('');
    setEstadoProducto('');
    setPrecioVenta('');
    setSaldoExistencias('');
    setCategoriaProducto_idCategoriaProducto('');
    setStockMinimo('');
    setStockMaximo('');
    setOperation('');
    if (op === 1) {
        setTitle('Registrar producto')
        obtenerIdConsecutivo();
    }
    else if (op === 2) {
        setTitle('Editar producto')
        setIdProducto(idProducto);
        setNombreProducto(nombreProducto);
        setPrecioCompra(precioCompra);
        setEstadoProducto(estadoProducto);
        setPrecioVenta(precioVenta);
        setSaldoExistencias(saldoExistencias);
        setCategoriaProducto_idCategoriaProducto(categoriaProducto_idCategoriaProducto);
        setStockMinimo(stockMinimo);
        setStockMaximo(stockMaximo);
        setOperation('');
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('idProductos').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;

    //const camposObligatoriosInvalidos = validarCamposObligatorios();

    // if (camposObligatoriosInvalidos) {
    //   return;
    // }

    if (operation === 1) {
      parametros = { idProducto: consecutivo, estadoProducto: estadoProducto, nombreProducto: nombreProducto, precioCompra: precioCompra, precioVenta: precioVenta, saldoExistencias: saldoExistencias , stockMaximo: stockMaximo, stockMinimo: stockMinimo, categoriaProducto_idCategoriaProducto: categoriaProducto_idCategoriaProducto};
      metodo = 'POST';
    } else {
      parametros = { idProducto: idProducto, estadoProducto: (estadoProducto === 0 ? 'false' : 'true') , nombreProducto: nombreProducto, precioCompra: precioCompra, precioVenta: precioVenta, saldoExistencias: saldoExistencias , stockMaximo: stockMaximo, stockMinimo: stockMinimo, categoriaProducto_idCategoriaProducto: categoriaProducto_idCategoriaProducto};
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);

  }

  const enviarSolicitud = async (metodo, parametros) => { await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (metodo === 'POST') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();

      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto eliminado con exito",
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


    
  const deleteProducto = (idProducto) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este producto?',
      icon: 'question', text: 'No podra activar nuevamente el producto',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdProducto(idProducto);
        enviarSolicitud('DELETE', { idProducto: idProducto });
      } else {
        show_alerta('El producto no fue eliminado', 'info')
      }
    });
  }

  return (

    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProductos'>
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
                    <th>Estado</th>
                    <th>Nombre</th>
                    <th>Precio compra</th>
                    <th>Precio venta</th>
                    <th>Saldo existencia</th>
                    <th>Stock maximo</th>
                    <th>Stock minimo</th>
                    <th>Categoria</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {productos.map((p) => (
                    console.log(p.precioVenta),
                    <tr key={p.idProducto}>
                      <td>{p.idProducto}</td>
                      <td>{p.estadoProducto === 0 ? 'Suspendido' : 'Activo'}</td>
                      <td>{p.nombreProducto}</td>
                      <td>{p.precioCompra }</td>
                      <td>{p.precioVenta}</td>
                      <td>{p.saldoExistencias}</td>
                      <td>{p.stockMaximo}</td>
                      <td>{p.stockMinimo}</td>
                      <td>{p.categoriaProducto_idCategoriaProducto}</td>
                      <td>
                        <button onClick={() => openModal(2, p.idProducto, p.estadoProducto, p.nombreProducto, p.precioCompra, p.precioVenta, p.saldoExistencias, p.stockMaximo, p.stockMinimo, p.categoriaProducto_idCategoriaProducto)} className='btn btn-warning'
                          data-bs-toggle='modal' data-bs-target='#modalProductos'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button onClick={() => deleteProducto(p.idProducto)} className='btn btn-danger'>
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
      <div id='modalProductos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button id='btnCerrar' type='button' data-bs-dismiss='modal'><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='number' id='idProductos' className='form-control' placeholder='id' value={operation === 1 ? consecutivo : idProducto}/>
              </div>
              
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='estadoProducto' className='form-control' placeholder='Estado' value={estadoProducto} onChange={(e) => setEstadoProducto(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='nombreProducto' className='form-control' placeholder='Nombre' value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='precioCompra' className='form-control' placeholder='Precio compra' value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='precioVenta' className='form-control' placeholder='Precio venta' value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='saldoExistencias' className='form-control' placeholder='Existencias' value={saldoExistencias} onChange={(e) => setSaldoExistencias(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='stockMaximo' className='form-control' placeholder='Stock maximo' value={stockMaximo} onChange={(e) => setStockMaximo(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='stockMinimo' className='form-control' placeholder='Stock minimo' value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='categoriaProducto_idCategoriaProducto' className='form-control' placeholder='Categoria' value={categoriaProducto_idCategoriaProducto} onChange={(e) => setCategoriaProducto_idCategoriaProducto(e.target.value)}></input>
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

export default Productos
