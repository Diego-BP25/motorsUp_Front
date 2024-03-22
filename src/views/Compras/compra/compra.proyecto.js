import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faCalendar, faToggleOff, faEye, faSearch } from '@fortawesome/free-solid-svg-icons'
import { ContentDoble, ContentIndividual, ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonNormal } from 'src/components/proyect/buttons.proyecto'
import { formatDate } from 'src/views/funcionesExtras.proyecto'
import { Link } from 'react-router-dom';

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

  //const [idError, setIdError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');
  const [consecutivo, setConsecutivo] = useState(0);

  //estado para el boton info
  const [showProductosModal, setShowProductosModal] = useState(false); // Estado para mostrar/ocultar la modal de productos
  const [productosAsociados, setProductosAsociados] = useState([]); // Estado para almacenar los productos asociados a la compra seleccionada

  //buscador
  const [busqueda, setBusqueda] = useState("");




  //proveedor
  const [proveedor, setProveedor] = useState([])
  const [proveedores, setProveedores] = useState('')

  //productos
  const [producto, setProducto] = useState([])
  const [productos, setProductos] = useState('')

  useEffect(() => {
    getCompras()
    getProductos()
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

  useEffect(() => {
    getProductos()
  }, [])


  const getProveedores = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/proveedores', {})
      setProveedor(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los proveedores:', error.message)
    }
  }

  const getProductos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/productos', {})
      setProducto(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los productos:', error.message)
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

  //detalle productos
  const [productosCompra, setProductosCompra] = useState([])
  const [precio, setPrecio] = useState()
  const [cantidad, setCantidad] = useState('')
  //const [idProducto, setIdProducto] = useState('')

  const agregarProducto = () => {
    // Verifica que los campos de producto estén llenos antes de agregarlo
    if (productos && cantidad && precio) {
      setProductosCompra([...productosCompra, { producto, cantidad, precio, subtotal: precio * cantidad }]);
      console.log(setProductosCompra)
      // Limpia los campos después de agregar un producto
      setProductos('');
      setCantidad('');
      setPrecio('');
    } else {
      show_alerta('Todos los campos del producto son obligatorios', 'error');
    }
  };

  const getProductosAsociados = async (idCompra) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/compras/id/${idCompra}`);
      setProductosAsociados(response.data);
      setShowProductosModal(true); // Mostrar la modal de productos
    } catch (error) {
      console.error('Error al obtener los productos asociados:', error.message);
    }
  };

  // const eliminarProducto = (index) => {
  //   const nuevaListaProductos = [...productosCompra];
  //   nuevaListaProductos.splice(index, 1);
  //   setProductosCompra(nuevaListaProductos);
  // };

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
      parametros = {
        idCompra: consecutivo,
        descripcionCompra: descripcion,
        estadoCompra: estado,
        fechaCompra: fechaCompra,
        proveedores_idProveedor: proveedores,
        detalleProductos: productosCompra

      };
      console.log(parametros)
      metodo = 'POST';
    } else {
      parametros = {
        idCompra: id,
        descripcionCompra: descripcion,
        estadoCompra: (estado === 0 ? 'false' : 'true'),
        fechaCompra: fechaCompra,
        proveedores_idProveedor: proveedores
      };
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);

  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (metodo === 'POST') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra agregada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        //document.getElementById('btnCerrar').click();

      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        //document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra eliminada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        //document.getElementById('btnCerrar').click();

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
  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getCompras(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = compra.filter((elemento) => {

      if (elemento.descripcionCompra.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setCompra(resultadosBusqueda);
  }

  return (

    <div className='App'>
      <div className='container-fluid'>
        <div >
          <div style={{ display: 'flex',  }} id="Container">

            <div style={{ marginRight: 'auto' }}>
              <h3>Compras</h3>
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

            <Link to="/compras/agregar">
              <button className='botones-azules'>
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </Link>

            <div style={{ marginRight: '-0.1%' }}>
              <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalCompras' onClick={() => [openModal(1), setFechaCompra(formatDate(new Date()))]} >
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div>
           
            <div className="table-responsive" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <table className='table table-striped' style={{ width: '100%' }}>
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
                        <button className='btn btn-info' onClick={() => getProductosAsociados(c.idCompra)}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        &nbsp;
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

      <ModalProyecto
        title={title}
        idModal='modalCompras'
        inputs={[

          <ContentDoble key={""} componentes={[
            <ContentIndividual key={"id"} componentes={[
              //<FontAwesomeIcon icon={faIdCardClip} />
              <span key={"title"} ></span>,
              <input key={"componente"} type='number' id='id' className='form-control' placeholder='id' value={operation === 1 ? consecutivo : id} />
            ]} />,
            <ContentIndividual key={"fechaCompra"} componentes={[
              //<FontAwesomeIcon key={"icono"} icon={faCalendar} />,
              <span key={"title"} ></span>,
              <input key={"componente"} className="form-control" type='datetime-local' readOnly={true} id='fechaCompra' value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)}></input>
            ]} />
          ]}
          />,

          <ContentDoble key={""} componentes={[
            <ContentIndividual key={"descripcion"} componentes={[
              //<FontAwesomeIcon icon={faComment} />
              <span key={"title"}></span>,
              <input key={"componente"}
                type='text'
                id='descripcion'
                className={`form-control ${descripcionError ? 'is-invalid' : ''}`}
                placeholder='Descripcion'
                value={descripcion}
                onChange={(e) => {
                  setDescripcionCompra(e.target.value);
                  setDescripcionError('');
                }}
              />,
              descripcionError && (
                <div className='invalid-feedback'>,
                  {descripcionError}
                </div>
              ),
            ]} />,
            <ContentIndividual key={"estadoCompra"} componentes={[
              //<FontAwesomeIcon icon={faToggleOff} />
              <span key={"title"}></span>,
              <input key={"componente"} type='text' id='estadoCompra' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstadoCompra(e.target.value)}></input>
            ]} />
          ]} />,

          <ContentDoble key={""} componentes={[
            <ContentIndividual key={""} componentes={[
              //<FontAwesomeIcon icon={faTruckField} />
              <span key='title' ></span>,
              <select key={"proveedores_idProveedor"} id='proveedores_idProveedor' className='form-select' value={proveedores} onChange={(e) => setProveedores(e.target.value)}>
                <option value='' disabled>Seleccione un proveedor</option>
                {proveedor.map((p) => (
                  <option key={p.idProveedor} value={p.idProveedor}>{p.nombreProveedor}</option>
                ))}
              </select>
            ]} />,
            <ContentIndividual key={"opciones"} componentes={[
              <ContentIndividual key="opcionesButton" componentes={[
                <ButtonNormal key="buttonAddProducto" idComponent="buttonAddProducto" title="Agregar producto" idModal='#modalProductos' />,
                <ButtonNormal key="buttonCoProcucto" idComponent="buttonCoProducto" idModal='#modalProductos' title="Ver productos" />
              ]} flexDirectionContents='row' justifyContents='space-evenly' />,
            ]} />
          ]} />,

          <div key={"buttonGuardar"} className='col-md-4 offset-md-5' >
            <button onClick={() => validar()} className='botones-azules' style={{ width: '60%' }}>
              <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
            </button>
          </div>,
        ]} widthContents='630px' />


      <div id='modalProductos' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>{title}</h5>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>

              <select key={"idProducto"} id='idProducto' className='form-select' value={productos} onChange={(e) => setProductos(e.target.value)}>
                <option value='' disabled>Seleccione un producto</option>
                {producto.map((p) => (
                  <option key={p.idProducto} value={p.idProducto}>{p.idProducto}</option>
                ))}
              </select>




              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='cantidad' className='form-control' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='precio' className='form-control' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)}></input>
              </div>

              <div key="buttonGuardar" className='d-grid col-6 mx-auto'>
                <button onClick={() => agregarProducto()} className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalCompras'>
                  <FontAwesomeIcon icon={faPlusCircle} /> Agregar Producto
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showProductosModal && (
        <div id='modalProductosAsociados' className='modal fade' aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Productos Asociados</h5>
                <button type='button' className='btn-close' onClick={() => setShowProductosModal(false)} aria-label='Close'></button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        {/* Agregar más columnas si es necesario */}
                      </tr>
                    </thead>
                    <tbody>
                      {productosAsociados.map((producto) => (
                        <tr key={producto.id}>
                          <td>{producto.id}</td>
                          <td>{producto.nombre}</td>
                          <td>{producto.precio}</td>
                          {/* Agregar más celdas si es necesario */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Compras
