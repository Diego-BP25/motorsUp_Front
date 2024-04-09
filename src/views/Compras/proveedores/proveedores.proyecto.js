import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faXmark, faIdCardClip, faPlusCircle, faFloppyDisk, faCalendar, faToggleOff, faEye, faSearch, faCloudDownload } from '@fortawesome/free-solid-svg-icons'
import { ContentDoble, ContentIndividual, ModalProyecto } from 'src/components/proyect/modal.proyecto'
import { ButtonNormal } from 'src/components/proyect/buttons.proyecto'
import { fecha2 } from 'src/views/funcionesExtras.proyecto'
import { Link } from 'react-router-dom';
import { CSmartPagination } from '@coreui/react-pro';
import Modal from 'react-bootstrap/Modal';

const Proveedores = () => {

  //api de compras
  const url = 'http://localhost:8081/api/proveedores'
  const [proveedor, setProveedor] = useState([])
  const [idProveedor, setIdProveedor] = useState('')
  const [nombreProveedor, setNombreProveedor] = useState('')
  const [direccionProveedor, setDireccionProveedor] = useState('')
  const [telefonoProveedor, setTelefonoProveedor] = useState('')
  const [estado, setEstado] = useState('')
  const [correoProveedor, setCorreoProveedor] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)

  //const [idError, setIdError] = useState('');
  const [descripcionError, setDescripcionError] = useState('');

  //buscador
  const [busqueda, setBusqueda] = useState("");

  //paginado
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getProveedor()
    setActualizacion(false)
  }, [actualizacion ? proveedor : null])


  const getProveedor = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setProveedor(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los proveedores:', error.message)
    }
  }

  const openModal = (op, idProveedor, nombreProveedor, direccionProveedor, telefonoProveedor, estado, correoProveedor) => {
    setIdProveedor('');
    setNombreProveedor('');
    setDireccionProveedor('');
    setEstado('');
    setTelefonoProveedor('');
    setCorreoProveedor('');
    setOperation('');
    if (op === 1) {
      setTitle('Registrar proveedor')
    }
    else if (op === 2) {
      setTitle('Editar proveedor')
      setIdProveedor(idProveedor);
      setNombreProveedor(nombreProveedor)
      setDireccionProveedor(direccionProveedor);
      setEstado(estado);
      setTelefonoProveedor(telefonoProveedor);
      setCorreoProveedor(correoProveedor);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('idProveedor').focus();
    }, 500);
  }


  // Función para obtener los roles de la página actual
  const getCurrentPageProveedores = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return proveedor.slice(startIndex, endIndex);
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
        idProveedor : idProveedor,
        nombreProveedor: nombreProveedor,
        direccionProveedor: direccionProveedor,
        telefonoProveedor: telefonoProveedor,
        estado: estado,
        correoProveedor: correoProveedor
      };
      console.log(parametros)
      metodo = 'POST';
    } else {
      parametros = {
        idProveedor : idProveedor,
        nombreProveedor: nombreProveedor,
        direccionProveedor: direccionProveedor,
        telefonoProveedor: telefonoProveedor,
        estado:  (estado === 0 ? 'false' : 'true'),
        correoProveedor: correoProveedor
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
          title: "Proveedor agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();

      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Proveedor editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Proveedor eliminado con exito",
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

  const deleteProveedor = (idProveedor) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este proveedor?',
      icon: 'question', text: 'No podra activar nuevamente al prveedor',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdProveedor(idProveedor);
        enviarSolicitud('DELETE', { idProveedor: idProveedor });
      } else {
        show_alerta('El proveedor no fue eliminado', 'info')
      }
    });
  };

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getProveedor(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = proveedor.filter((elemento) => {

      if (elemento.nombreProveedor.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setProveedor(resultadosBusqueda);
  }

  return (

    <div className='App'>

      <div className='container-fluid'>

        <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
            <h3>Proveedores</h3>
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

          <button className='botones-azules' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalProveedores'>
            <FontAwesomeIcon icon={faPlusCircle} /> Añadir
          </button>
        </div>

        <div className='row mt-3'>
          <div className="table-responsive" style={{ maxWidth: '100%', margin: '0 auto' }}>
            <table className='table table-striped' style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Direccion</th>
                  <th>Telefono</th>
                  <th>Estado</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {getCurrentPageProveedores().map((p) => (
                  <tr key={p.idProveedor }>
                    <td>{p.idProveedor }</td>
                    <td>{p.nombreProveedor}</td>
                    <td>{p.direccionProveedor}</td>
                    <td>{p.telefonoProveedor}</td>
                    <td>{p.estado === 0 ? 'Suspendido' : 'Activo'}</td>
                    <td>{p.correoProveedor}</td>
                    <td>
                      <button onClick={() => openModal(2, p.idProveedor , p.nombreProveedor, p.direccionProveedor, p.telefonoProveedor, p.estado=== 0 ? 'Suspendido' : 'Activo' , p.correoProveedor)} className='btn btn-warning'
                        data-bs-toggle='modal' data-bs-target='#modalProveedores'>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      &nbsp;
                      <button onClick={() => deleteProveedor(p.idProveedor)} className='btn btn-danger'>
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
              pages={Math.ceil(proveedor.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <div id='modalProveedores' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button id='btnCerrar' type='button' data-bs-dismiss='modal'><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='idProveedor' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='number' id='idProveedor' className='form-control' value={idProveedor } onChange={(e) => setIdProveedor(e.target.value)}/>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='nombreProveedor' className='form-control' placeholder='Nombre' value={nombreProveedor} onChange={(e) => setNombreProveedor(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='direccionProveedor' className='form-control' placeholder='Direccion' value={direccionProveedor} onChange={(e) => setDireccionProveedor(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='telefonoProveedor' className='form-control' placeholder='Telefono' value={telefonoProveedor} onChange={(e) => setTelefonoProveedor(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                <input type='text' id='estado' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstado(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='correoProveedor' className='form-control' placeholder='Correp' value={correoProveedor} onChange={(e) => setCorreoProveedor(e.target.value)}></input>
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

export default Proveedores
