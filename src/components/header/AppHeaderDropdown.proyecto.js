import React, { useState, useEffect } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle, CContainer
} from '@coreui/react'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { jwtDecode } from 'jwt-decode';
import { show_alerta } from 'src/fuctions.proyecto'
import Swal from 'sweetalert2'

import { faRightToBracket, faUser, faAddressCard, faFloppyDisk, faLocationDot, faPhone, faEnvelope, faLock, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import avatar8 from './../../assets/images/avatars/mecanico2.jpg'

const AppHeaderDropdown = () => {
  const url = 'http://localhost:8081/api/empleados'
  const [idEmpleado, setIdEmpleado] = useState('')
  const [nombreEmpleado, setNombreEmpleado] = useState('')
  const [direccionEmpleado, setDireccionEmpleado] = useState('')
  const [telefonoEmpleado, setTelefonoEmpleado] = useState('')
  const [estado, setEstado] = useState('')
  const [correoEmpleado, setCorreoEmpleado] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [roles_idRol, setRoles_idRol] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState(1)


  const [empleadoNombre, setEmpleadoNombre] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('Empleado');
    if (token) {
      const decodedToken = jwtDecode(token);
      const nombre = decodedToken.empleado.nombreEmpleado
      setEmpleadoNombre(nombre);
    }
  }, []);


  const handleLogout = () => {

    localStorage.removeItem('Empleado');

    window.location.href = '/#/login';
  };

  const perfilEmpleado = () => {
    setShowModal(true);
    const token = localStorage.getItem('Empleado');
    if (token) {
      const decodedToken = jwtDecode(token);
      const nombre = decodedToken.empleado.nombreEmpleado
      const id = decodedToken.empleado.idEmpleado
      const direccionEmpleado = decodedToken.empleado.direccionEmpleado
      const telefono = decodedToken.empleado.telefonoEmpleado
      const correo = decodedToken.empleado.correoEmpleado
      const rol = decodedToken.empleado.roles_idRol
      const estado = decodedToken.empleado.estado
      setIdEmpleado(id)
      setDireccionEmpleado(direccionEmpleado)
      setNombreEmpleado(nombre);
      setTelefonoEmpleado(telefono);
      setCorreoEmpleado(correo);
      setRoles_idRol(rol);
      setEstado(estado)

    }

  }
  const validar = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de editar este perfil?',
      icon: 'question', text: 'Se cerrara la sesion luego de editar',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        var parametros;
        var metodo;


        parametros = { idEmpleado: idEmpleado, nombreEmpleado: nombreEmpleado, direccionEmpleado: direccionEmpleado, telefonoEmpleado: telefonoEmpleado, estado: estado, correoEmpleado: correoEmpleado };
        metodo = 'PUT';

        console.log(parametros)

        enviarSolicitud(metodo, parametros);
      } else {

      }
    });

  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      var tipo = respuesta.data[0];


      if (metodo === 'PUT') {
        setShowModal(false);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Perfil editado con exito"
        });
        setTimeout(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "warning",
            title: "Cerrando sesion..."
          });


        }, 1500);
        setTimeout(() => {
          localStorage.removeItem('Empleado');
          window.location.href = '/login';
        }, 4000)
        //document.getElementById('btn-close').click();
      }

      if (tipo === 'success') {
        //document.getElementById('btnCerrar').click();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }


  return (


    <>


      <div className="d-flex align-items-center">
        <div className="me-2">
          <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
        </div>
        <strong><p className="mb-0">{empleadoNombre}</p></strong>
      </div>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={avatar8} size="md" />

          <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: '8px' }} />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem onClick={perfilEmpleado}>

            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
            Perfil
          </CDropdownItem>
          <CDropdownItem onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '10px' }} />
            Cerrar Sesión
          </CDropdownItem>

        </CDropdownMenu>
      </CDropdown>


      {
        showModal && (
          <div
            className="modal"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <div className='modal-dialog modal-dialog-centered'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <label className='h5'>Editar Perfil</label>
                  <button type="button" className="btn-close" onClick={() => {
                    setShowModal(false);

                  }} data-bs-dismiss='modal'></button>
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
                    <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
                    <input type='text' id='correoEmpleado' className='form-control' placeholder='Correo' value={correoEmpleado} onChange={(e) => setCorreoEmpleado(e.target.value)} style={{ marginRight: '10px' }}></input>
                  </div>






                  <div className='input-group mb-3'>
                    {/* <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                <select id='roles_idRol' className='form-select' value={roles_idRol} onChange={(e) => setRoles_idRol(e.target.value)} style={{ marginRight: '12px' }}>
                  <option value='' disabled>Rol</option>
                  {roles.map((rol) => (
                    <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                  ))}
                </select> */}
                  </div>


                  <div className='d-grid col-6 mx-auto'>
                    <button className='botones-azules' onClick={() => validar()}>
                      <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

        )
      }
    </>
  )





}


export default AppHeaderDropdown