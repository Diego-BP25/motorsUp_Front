import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faXmark, faIdCardClip, faPlusCircle, faFloppyDisk,faEdit, faCalendar, faToggleOff, faEye, faSearch, faCloudDownload } from '@fortawesome/free-solid-svg-icons'
import { ContentDoble, ContentIndividual, ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonNormal } from 'src/components/proyect/buttons.proyecto'
import { fecha2 } from 'src/views/funcionesExtras.proyecto'
import { Link } from 'react-router-dom';
import { CSmartPagination } from '@coreui/react-pro';
import Modal from 'react-bootstrap/Modal';


const CategoriaProductos = () => {
  //api de compras
  const url = 'http://localhost:8081/api/categoriaProductos'
  const [categoriaP, setCategoriaP] = useState([])
  const [idCategoriaProducto, setIdCategoriaProducto] = useState('')
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [referenciaMoto, setReferenciaMoto] = useState('')
  const [marca, setMarca] = useState('')
  const [cilindraje, setCilindraje] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)

  //const [idError, setIdError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');
  const [consecutivo, setConsecutivo] = useState(0);

  //estado para el boton info
  const [productosAsociados, setProductosAsociados] = useState([]);
  //detalle de la compra
  const [detalleCompraSeleccionada, setDetalleCompraSeleccionada] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //buscador
  const [busqueda, setBusqueda] = useState("");

  //paginado
  const [currentPage, setCurrentPage] = useState(1)



  //proveedor
  const [proveedor, setProveedor] = useState([])
  const [proveedores, setProveedores] = useState({});

  //productos
  const [producto, setProducto] = useState([])
  const [productos, setProductos] = useState('')

  useEffect(() => {
    getCategoriaP()
    setActualizacion(false)
  }, [actualizacion ? categoriaP : null])

  useEffect(() => {
    if (operation === 1) {
      obtenerIdConsecutivo();
    }
  }, [operation]);


  const obtenerIdConsecutivo = async () => {
    try {
      const respuesta = await axios.get(url);
      const categorias = respuesta.data;
      if (categorias.length > 0) {
        const maxId = Math.max(...categorias.map(c => c.idCategoriaProducto));
        setConsecutivo(maxId + 1);
      } else {
        setConsecutivo(1);
      }
    } catch (error) {
      console.error('Error al obtener el número consecutivo más alto:', error.message);
    }
  };

  const getCategoriaP = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setCategoriaP(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener las compras:', error.message)
    }
  }

  const openModal = (op, idCategoriaProducto, nombreCategoria) => {
    setIdCategoriaProducto('');
    setNombreCategoria();
    setOperation('');
    if (op === 1) {
      setTitle('Registrar categoria producto')
      obtenerIdConsecutivo();
    }
    else if (op === 2) {
      setTitle('Editar categoria producto')
      setIdCategoriaProducto(idCategoriaProducto);
      setNombreCategoria(nombreCategoria);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('idCategoriaProducto').focus();
    }, 500);
  }

  // Función para obtener los roles de la página actual
  const getCurrentPageCategoriaP = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return categoriaP.slice(startIndex, endIndex);
  }


  const validar = () => {
    var parametros;
    var metodo;

    // const camposObligatoriosInvalidos = validarCamposObligatorios();

    // if (camposObligatoriosInvalidos) {
    //   return;
    // }

    if (operation === 1) {
      parametros = {
        idCategoriaProducto: consecutivo,
        nombreCategoria: nombreCategoria
      };
      console.log(parametros)
      metodo = 'POST';
    } else {
      parametros = {
        idCategoriaProducto: idCategoriaProducto,
        nombreCategoria: nombreCategoria
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
          title: "Categoria de producto agregada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();

      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Categoria de producto editada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Categoria de producto eliminada con exito",
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



  const deleteCategoriaP = (idCategoriaProducto) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar está categoria de produco?',
      icon: 'question', text: 'No podra activar nuevamente la categoria de producto',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdCategoriaProducto(idCategoriaProducto);
        enviarSolicitud('DELETE', { idCategoriaProducto: idCategoriaProducto });
      } else {
        show_alerta('La categoria de producto no fue eliminada', 'info')
      }
    });
  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getCategoriaP(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = categoriaP.filter((elemento) => {

      if (elemento.nombreCategoria.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setCategoriaP(resultadosBusqueda);
  }

  return (

    <div className='App'>

      <div className='container-fluid'>

        <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
            <h3>Categoria productos</h3>
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

          <button className='botones-azules' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalCategoriaProductos'>
            <FontAwesomeIcon icon={faPlusCircle} /> Añadir
          </button>
        </div>

        <div className='row mt-3'>
          <div className="table-responsive" style={{ maxWidth: '100%', margin: '0 auto' }}>
            <table className='table table-striped' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {getCurrentPageCategoriaP().map((c) => (
                  <tr key={c.idCategoriaProducto}>
                    <td>{c.idCategoriaProducto}</td>
                    <td>{c.nombreCategoria}</td>
                    <td>
                      <button onClick={() => openModal(2, c.idCategoriaProducto, c.nombreCategoria)} className='btn btn-warning'
                        data-bs-toggle='modal' data-bs-target='#modalCategoriaProductos'>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      &nbsp;
                      <button onClick={() => deleteCategoriaP(c.idCategoriaProducto)} className='btn btn-danger'>
                        <FontAwesomeIcon icon={faTrash} />
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
              pages={Math.ceil(categoriaP.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <div id='modalCategoriaProductos' className='modal fade' aria-hidden='true' style={{ marginLeft: '8%' }}>
        <div className='modal-dialog modal-dialog-centered' style={{ display: 'flex', alignContent: 'center' }}>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type="button" id="btnCerrar" className="btn-close" data-bs-dismiss='modal'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='idCategoriaProducto' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='number' id='idCategoriaProducto' className='form-control' value={operation === 1 ? consecutivo : idCategoriaProducto} />
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='nombreCategoria' className='form-control' placeholder='Nombre' value={nombreCategoria} onChange={(e) => setNombreCategoria(e.target.value)}></input>
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
    </div>
  )
}

export default CategoriaProductos
