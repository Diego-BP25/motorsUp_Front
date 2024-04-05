import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faComment, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CSmartPagination } from '@coreui/react-pro'
import { show_alerta } from 'src/fuctions.proyecto'

const Roles = () => {

  const url = 'http://localhost:8081/api/roles'
  const [rol, setRol] = useState([])
  const [idRol, setIdRol] = useState('')
  const [nombre, setNombre] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [busqueda, setBusqueda] = useState("");

  const [nombreError, setNombreError] = useState('');

  const [consecutivo, setConsecutivo] = useState(0);

  useEffect(() => {
    getRoles()
    setActualizacion(false)
  }, [actualizacion ? rol : null])

  useEffect(() => {
    if (operation === 1) {
      obtenerIdConsecutivo();
    }
  }, [operation]);


  const obtenerIdConsecutivo = async () => {
    try {
      const respuesta = await axios.get(url);
      const rol = respuesta.data;
      if (rol.length > 0) {
        const maxId = Math.max(...rol.map(c => c.idRol));
        setConsecutivo(maxId + 1);
      } else {
        setConsecutivo(1);
      }
    } catch (error) {
      console.error('Error al obtener el número consecutivo más alto:', error.message);
    }
  };





  const getRoles = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setRol(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los roles:', error.message)
    }
  }

  const openModal = (op, idRol, nombre) => {
    setIdRol('');
    setNombre('');

    if (op === 1) {
      setTitle('Registrar Rol')
      obtenerIdConsecutivo();
    }
    else if (op === 2) {
      setTitle('Editar Rol')
      setIdRol(idRol);
      setNombre(nombre);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('idRol').focus();
    }, 500);
  }

  const validarCamposObligatorios = () => {
    let hayErrores = false;
    if (!nombre.trim()) {
      setNombreError('El campo nombre obligatorio');
      hayErrores = true;
    } else {
      setNombreError('');
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
      console.log(idRol)
      parametros = { idRol: idRol, nombre: nombre };
      metodo = 'POST';
    } else {
      console.log(idRol)
      parametros = { idRol: idRol, nombre: nombre };
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
          title: "Rol agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Rol editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
       document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Rol eliminado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }

      setActualizacion(true)

      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getRoles();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteRol = (idRol) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este Rol?',
      icon: 'question', text: 'No podra activar nuevamente el Rol',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdRol(idRol);
        enviarSolicitud('DELETE', { idRol: idRol });
      } else {
        show_alerta('El Rol no fue eliminad0', 'info')
      }
    });

  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getRoles(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = rol.filter((elemento) => {

      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setRol(resultadosBusqueda);
  }



  // Función para obtener los roles de la página actual
  const getCurrentPageRoles = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return rol.slice(startIndex, endIndex);
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div >
          <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
              <h3>Roles</h3>
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


            <div style={{ marginRight: '-0.1%' }}>
              <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalRoles' onClick={() => openModal(1)} >
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div >
            <div className='table-responsive' style={{ maxWidth: '100%', margin: '0 auto' }}>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {getCurrentPageRoles().map((r) => (
                    <tr key={r.idRol}>
                      <td>{r.idRol}</td>
                      <td>{r.nombre}</td>
                      <td>
                        <button onClick={() => openModal(2, r.idRol, r.nombre)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalRoles'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button onClick={() => deleteRol(r.idRol)} className='btn btn-danger'>
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
        {/* Paginación */}
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2' >
            <CSmartPagination
              style={{ marginLeft: '-208px' }}
              activePage={currentPage}
              pages={Math.ceil(rol.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <div id='modalRoles' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' id='btnCerrar' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='idRol' className='form-control' placeholder='ID' value={operation === 1 ? consecutivo : idRol} onChange={(e) => setIdRol(e.target.value)}  disabled></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='nombre' className={`form-control ${nombreError ? 'is-invalid' : ''}`} placeholder='Nombre Rol' value={nombre} onChange={(e) => {
                  setNombreError('')
                  setNombre(e.target.value)}}></input>
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

export default Roles
