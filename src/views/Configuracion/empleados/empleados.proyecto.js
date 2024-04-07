import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faTruckField, faSearch, faAddressCard, faUser, faLocationDot, faPhone, faEnvelope, faLock, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { CSmartPagination } from '@coreui/react-pro'
import { show_alerta } from 'src/fuctions.proyecto'
import { ButtonSwitch } from 'src/components/proyect/switch.proyecto'

const Empleados = () => {

  const url = 'http://localhost:8081/api/empleados'
  const [empleado, setEmpleado] = useState([])
  const [idEmpleado, setIdEmpleado] = useState('')
  const [nombreEmpleado, setNombreEmpleado] = useState('')
  const [direccionEmpleado, setDireccionEmpleado] = useState('')
  const [telefonoEmpleado, setTelefonoEmpleado] = useState('')
  const [estado, setEstado] = useState('')
  const [correoEmpleado, setCorreoEmpleado] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [roles_idRol, setRoles_idRol] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')

  const [actualizacion, setActualizacion] = useState(false)
  //Paginacion
  const [currentPage, setCurrentPage] = useState(1)
  //Buscador
  const [busqueda, setBusqueda] = useState("");

  const [roles, setRoles] = useState([])
  // const [selectedRoleId, setSelectedRoleId] = useState('')

  useEffect(() => {
    getEmpleados()
    getRoles()
    setActualizacion(false)
  }, [actualizacion ? empleado : null])



  const getEmpleados = async () => {
    console.log('fuera')
    try {
      const respuesta = await axios.get(url, {})
      setEmpleado(await respuesta.data)
      console.log('hh')
    } catch (error) {
      console.error('Error al obtener los Empleados:', error.message)
    }
  }

  const getRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/roles')
      setRoles(response.data)
    } catch (error) {
      console.error('Error al obtener los roles:', error.message)
    }
  }
  const nombreIdRol = (roleId) => {
    const role = roles.find(role => role.idRol === roleId);
    return role ? role.nombre : '';
  };

  const openModal = (op, idEmpleado, nombreEmpleado, direccionEmpleado, telefonoEmpleado, estado, correoEmpleado, contrasena, roles_idRol) => {
    setIdEmpleado('');
    setNombreEmpleado()
    setDireccionEmpleado('');
    setTelefonoEmpleado('');
    setEstado('');
    setCorreoEmpleado('');
    setContrasena('');
    setRoles_idRol('');
    if (op === 1) {
      setTitle('Registrar Empleado')
    }
    else if (op === 2) {
      setTitle('Editar Empleado')
      setIdEmpleado(idEmpleado);
      setNombreEmpleado(nombreEmpleado)
      setDireccionEmpleado(direccionEmpleado);
      setTelefonoEmpleado(telefonoEmpleado);
      setEstado(estado);
      setCorreoEmpleado(correoEmpleado);
      setContrasena(contrasena);
      setRoles_idRol(roles_idRol);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('nombreEmpleado').focus();
    }, 500);
  }




  const validar = () => {
    var parametros;
    var metodo;


    if (operation === 1) {
      parametros = { idEmpleado: idEmpleado, nombreEmpleado: nombreEmpleado, direccionEmpleado: direccionEmpleado, telefonoEmpleado: telefonoEmpleado, estado: true, correoEmpleado: correoEmpleado, contrasena: contrasena, roles_idRol: roles_idRol };

      console.log(parametros)
      metodo = 'POST';
    } else if (operation === 2) {
      parametros = { idEmpleado: idEmpleado, nombreEmpleado: nombreEmpleado, direccionEmpleado: direccionEmpleado, telefonoEmpleado: telefonoEmpleado, estado: estado, correoEmpleado: correoEmpleado, contrasena: contrasena, roles_idRol: roles_idRol };
      metodo = 'PUT';

      console.log(parametros)
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
          title: "Empleado agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Empleado editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Empleado eliminado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }

      setActualizacion(true)

      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        // getRoles();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteEmpleado = (idEmpleado) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este Empleado?',
      icon: 'question', text: 'No podra activar nuevamente el Empleado',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdEmpleado(idEmpleado);
        enviarSolicitud('DELETE', { idEmpleado: idEmpleado });
      } else {
        show_alerta('El Empleado no fue eliminad0', 'info')
      }
    });

  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getEmpleados(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = empleado.filter((elemento) => {

      if (elemento.nombreEmpleado.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
      if (elemento.idEmpleado.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setEmpleado(resultadosBusqueda);
  }

  //Paginacion
  const getCurrentPageEmpleados = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return empleado.slice(startIndex, endIndex);
  }


  return (

    <div className='App'>
      <div className='container-fluid'>
        <div >
          <div style={{ display: 'flex', }} id="Container">

            <div style={{ marginRight: 'auto' }}>
              <h3>Emanuel </h3>
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
              <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalEmpleados' onClick={() => [openModal(1)]} >
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div >
            <div className="table-responsive" style={{ maxWidth: '100%', margin: '0 auto' }}>
              <table className='table table-striped' style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>CC</th>
                    <th>Nombre</th>
                    <th>Direccion</th>
                    <th>Telefono</th>
                    <th>Estado</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>

                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {getCurrentPageEmpleados().map((e) => (
                    <tr key={e.idEmpleado}>
                      <td>{e.idEmpleado}</td>
                      <td>{e.nombreEmpleado}</td>
                      <td>{e.direccionEmpleado}</td>
                      <td>{e.telefonoEmpleado}</td>
                      <td>
                        <span className={!e.estado ? 'estado-inactivo' : 'estado-activo'}>{!e.estado ? 'Inactivo' : 'Activo'}</span></td>
                      <td>{e.correoEmpleado}</td>
                      <td>{nombreIdRol(e.roles_idRol)}</td>
                      <td>
                        <button onClick={() => openModal(2, e.idEmpleado, e.nombreEmpleado, e.direccionEmpleado, e.telefonoEmpleado, e.estado, e.correoEmpleado, e.contrasena, e.roles_idRol)} className='btn btn-warning'
                          data-bs-toggle='modal' data-bs-target='#modalEmpleadoEditar'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button onClick={() => deleteEmpleado(e.idEmpleado)} className='btn btn-danger'>
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

        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <CSmartPagination
              style={{ marginLeft: '-208px' }}
              activePage={currentPage}
              pages={Math.ceil(empleado.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <div id='modalEmpleados' className='modal fade' aria-hidden='true' >
        {/* Inicio Modal */}
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' id="btnCerrar" className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>

            <div className='modal-body' >


              <input type='hidden' id='id' ></input>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faAddressCard} /></span>
                <input type='text' id='idEmpleado' className='form-control' placeholder='CC' value={idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)} style={{ marginRight: '10px' }}></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faUser} /></span>
                <input type='text' id='nombreEmpleado' className='form-control' placeholder='Nombre' value={nombreEmpleado} onChange={(e) =>
                  setNombreEmpleado(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faLocationDot} /></span>
                <input type='text' id='direccionEmpleado' className='form-control' placeholder='Dirección' value={direccionEmpleado} onChange={(e) =>
                  setDireccionEmpleado(e.target.value)} style={{ marginRight: '10px' }} ></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faPhone} /></span>
                <input type='text' id='telefonoEmpleado' className='form-control' placeholder='Teléfono' value={telefonoEmpleado} onChange={(e) => setTelefonoEmpleado(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                {/* <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='estado' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstado(e.target.value)}></input> */}
                <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
                <input type='text' id='correoEmpleado' className='form-control' placeholder='Correo' value={correoEmpleado} onChange={(e) => setCorreoEmpleado(e.target.value)} style={{ marginRight: '10px' }}></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faLock} /></span>
                <input type='text' id='contrasena' className='form-control' placeholder='Contraseña' value={contrasena} onChange={(e) => setContrasena(e.target.value)}></input>
              </div>






              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                <select id='roles_idRol' className='form-select' value={roles_idRol} onChange={(e) => setRoles_idRol(e.target.value)} style={{ marginRight: '12px' }}>
                  <option value='' disabled>Rol</option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                  ))}
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


      {/* EDITAR EMPLEADO */}

      <div id='modalEmpleadoEditar' className='modal fade' aria-hidden='true' >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' id="btnCerrar" className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>

            <div className='modal-body' >


              <input type='hidden' id='id' ></input>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faAddressCard} /></span>
                <input type='text' id='idEmpleado' className='form-control' placeholder='CC' value={idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)} style={{ marginRight: '10px' }} disabled></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faUser} /></span>
                <input type='text' id='nombreEmpleado' className='form-control' placeholder='Nombre' value={nombreEmpleado} onChange={(e) =>
                  setNombreEmpleado(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faLocationDot} /></span>
                <input type='text' id='direccionEmpleado' className='form-control' placeholder='Dirección' value={direccionEmpleado} onChange={(e) =>
                  setDireccionEmpleado(e.target.value)} style={{ marginRight: '10px' }} ></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faPhone} /></span>
                <input type='text' id='telefonoEmpleado' className='form-control' placeholder='Teléfono' value={telefonoEmpleado} onChange={(e) => setTelefonoEmpleado(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                {/* <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='estado' className='form-control' placeholder='Estado' value={estado} onChange={(e) => setEstado(e.target.value)}></input> */}
                <ButtonSwitch idComponente="estado" value={estado} onChange={(e) => setEstado(e.target.checked)} />
                <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
                <input type='text' id='correoEmpleado' className='form-control' placeholder='Correo' value={correoEmpleado} onChange={(e) => setCorreoEmpleado(e.target.value)} style={{ marginRight: '10px' }}></input>
              </div>

              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='botones-azules'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Editar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Empleados