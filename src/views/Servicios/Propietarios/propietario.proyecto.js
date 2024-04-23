import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faToggleOff, faCaretDown, faIdCardClip, faUser, faPhone, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CSmartPagination } from '@coreui/react-pro'

const Propietarios = () => {
  const url = 'http://localhost:8081/api/propietarios'
  const [propietario, setPropietario] = useState([])
  const [idPropietario, setIdPropietario] = useState('')
  const [nombrePropietario, setNombre] = useState('')
  const [telefonoPropietario, setTelefono] = useState('')
  const [correoPropietario, setCorreo] = useState('')
  const [estadoPropietario, setEstadoPropietario] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [filtradoPorEstado, setFiltradoPorEstado] = useState(false);
  const [estadoFiltrado, setEstadoFiltrado] = useState(true);
  //tipo de modal
  const [modalType, setModalType] = useState('add');

  //detalle servicio

  useEffect(() => {
    getPropietarios()
    setActualizacion(false)
  }, [actualizacion ? propietario : null]);

  useEffect(() =>{
    getPropietarios()
  }, [filtradoPorEstado, estadoFiltrado])

  const getPropietarios = async () => {
    try {
      const respuesta = await axios.get(url, {})
      let propietariosData = respuesta.data.filter(pro => pro.estadoPropietario === true); // Filtrar propietarios con estado true
      if (filtradoPorEstado && !estadoFiltrado) {
        propietariosData = respuesta.data.filter(pro => pro.estadoPropietario === false); // Filtrar propietarios con estado false si está activado el filtro por estado inactivo
      }
      setPropietario(propietariosData)
    } catch (error) {
      console.error('Error al obtener los Empleados:', error.message)
    }
  }

  const filtroEstado = () => {
    setFiltradoPorEstado(!filtradoPorEstado);
    // Si ya está filtrado por estado, alternar entre true y false
    if (filtradoPorEstado) {
      setEstadoFiltrado(!estadoFiltrado);
    }
  };

  const openModal = (op, idPropietario, nombrePropietario, telefonoPropietario, correoPropietario, estadoPropietario) => {
    setIdPropietario('');
    setNombre('');
    setTelefono('');
    setCorreo('');
    setEstadoPropietario('');
    setOperation('');
    setModalType(op === 1 ? 'add' : 'edit'); // Establecer el tipo de modal
    if (op === 1) {
      setTitle('Registrar propietario')
    }
    else if (op === 2) {
      setTitle('Editar Propietario')
      setIdPropietario(idPropietario);
      setNombre(nombrePropietario);
      setTelefono(telefonoPropietario);
      setCorreo(correoPropietario);
      setEstadoPropietario(estadoPropietario);
      setOperation('');
    }

    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('id').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;

    if (operation === 1) {
      parametros = { idPropietario: idPropietario, nombrePropietario: nombrePropietario, telefonoPropietario: telefonoPropietario, correoPropietario: correoPropietario, estadoPropietario: "true" };
      metodo = 'POST';
      console.log(parametros)
    } else {
      parametros = { idPropietario: idPropietario, nombrePropietario: nombrePropietario, telefonoPropietario: telefonoPropietario, correoPropietario: correoPropietario, estadoPropietario: estadoPropietario }
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
          title: "Propietario agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Propietario editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Propietario eliminado con exito",
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

  const deletePropietario = (idPropietario) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este propietario?',
      icon: 'question', text: 'No podra activar nuevamente este propietario',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdPropietario(idPropietario);
        enviarSolicitud('DELETE', { idPropietario: idPropietario });
      } else {
        show_alerta('El propietario no fue eliminad0', 'info')
      }
    });

  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getPropietarios(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = propietario.filter((elemento) => {

      if (elemento.nombrePropietario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.telefonoPropietario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.correoPropietario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        elemento.estadoPropietario.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setPropietario(resultadosBusqueda);
  };
  // Función para obtener los propietarios de la página actual
  const getCurrentPagePropietarios = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return propietario.slice(startIndex, endIndex);
  }

  const inputsAgregar = (
    <div className='modal-body'>
      <input type='hidden' id='id' ></input>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
        <input type='text' id='Cedula' className='form-control' placeholder='Cedula' value={idPropietario} onChange={(e) => setIdPropietario(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faUser} /></span>
        <input type='text' id='nombre' className='form-control' placeholder='Nombre Propietario' value={nombrePropietario} onChange={(e) => setNombre(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faPhone} /></span>
        <input type='text' id='telefono' className='form-control' placeholder='Telefono Propietario' value={telefonoPropietario} onChange={(e) => setTelefono(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
        <input type='text' id='correo' className='form-control' placeholder='Correo Propietario' value={correoPropietario} onChange={(e) => setCorreo(e.target.value)}></input>
      </div>

      <div className='d-grid col-6 mx-auto'>
        <button onClick={() => validar()} className='botones-azules'>
          <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
        </button>
      </div>
    </div>

  )

  const inputsEditar = (
    <div className='modal-body'>
      <input type='hidden' id='id' ></input>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
        <input type='text' id='Cedula' className='form-control' placeholder='Cedula' value={idPropietario} onChange={(e) => setIdPropietario(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faUser} /></span>
        <input type='text' id='nombre' className='form-control' placeholder='Nombre Propietario' value={nombrePropietario} onChange={(e) => setNombre(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faPhone} /></span>
        <input type='text' id='telefono' className='form-control' placeholder='Telefono Propietario' value={telefonoPropietario} onChange={(e) => setTelefono(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
        <input type='text' id='correo' className='form-control' placeholder='Correo Propietario' value={correoPropietario} onChange={(e) => setCorreo(e.target.value)}></input>
      </div>
      <div className='input-group mb-3'>
        <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
        <input type='text' id='estado' className='form-control' placeholder='Estado Propietario' value={estadoPropietario} onChange={(e) => setEstadoPropietario(e.target.value)}></input>
      </div>
      <div className='d-grid col-6 mx-auto'>
        <button onClick={() => validar()} className='botones-azules'>
          <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
        </button>
      </div>
    </div>

  )

  return (

    <div className='App'>
      <div className='container-fluid'>
        <div style={{ display: 'flex', }} id="Container">

          <div style={{ marginRight: 'auto' }}>
            <h3>Propietarios</h3>
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

          <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalPropietarios' onClick={() => openModal(1)} >
            <FontAwesomeIcon icon={faPlusCircle} /> Añadir
          </button>
        </div>
        <div className='row mt-3'>

          <div className='table-responsive' style={{ maxWidth: '100%', margin: '0 auto' }}>



            <table className='table table-striped' style={{ width: '100%' }}>

              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Correo</th>
                  <th onClick={filtroEstado} title="Haz clic para filtrar por estado" style={{ cursor: 'pointer' }}>
                    Estado
                    <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: '8px' }} />
                  </th>
                  <th>Acciones</th>

                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {getCurrentPagePropietarios().map((r) => (
                  <tr key={r.idPropietario}>
                    <td>{r.idPropietario}</td>
                    <td>{r.nombrePropietario}</td>
                    <td>{r.telefonoPropietario}</td>
                    <td>{r.correoPropietario}</td>
                    <td>
                      <span className={!r.estadoPropietario ? 'estado-inactivo' : 'estado-activo'}>{!r.estadoPropietario ? 'Inactivo' : 'Activo'}</span>
                    </td>
                    <td>
                      <button onClick={() => openModal(2, r.idPropietario, r.nombrePropietario, r.telefonoPropietario, r.correoPropietario, r.estadoPropietario)} className='btn btn-warning'
                        data-bs-toggle='modal' data-bs-target='#modalPropietarios'>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      &nbsp;
                      <button onClick={() => deletePropietario(r.idPropietario)} className='btn btn-danger'>
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
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2' >
            <CSmartPagination
              style={{ marginLeft: '-208px' }}
              activePage={currentPage}
              pages={Math.ceil(propietario.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>

        <div id='modalPropietarios' className='modal fade' aria-hidden='true' data-bs-backdrop='static' data-bs-keyboard='false'>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <label className='h5'>{title}</label>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close' id='btnCerrar'></button>
              </div>
              <div className='modal-body' >
                {modalType === 'add' ? inputsAgregar : inputsEditar}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
export default Propietarios