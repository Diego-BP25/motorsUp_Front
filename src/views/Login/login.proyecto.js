import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { show_alerta } from 'src/fuctions.proyecto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEnvelope, faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons'


const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setContrasena] = useState('');
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [correoRecuperacion, setCorreoRecuperacion] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [mensaje, setMensaje] = useState('');
  const [codigo, setCodigo] = useState('')


  const validarDatos = async (e) => {
    e.preventDefault();

    if (!correo || !password) {
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
        icon: "info",
        title: "No se permiten campos vacios"
      });;
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        correoEmpleado: correo,
        contrasena: password
      });

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
        title: "Bienvenido.."
      });;
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response.data.msg);
      if (error.response.data.msg === 'Correo/Password no son correctos') {
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
          icon: "error",
          title: "Correo / Contraseña no validos.."
        });;
      }
      if (error.response.data.msg == 'Usuario no encontrado en la base de datos') {
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
          icon: "error",
          title: "Correo / Contraseña no validos.."
        });;
      }
      if (error.response.data.msg == 'El usuario esta inactivo') {
        show_alerta('Usuario inactivo - Comunicarse con el administrador')
      }
    }
  };

  const openModal = (op, correoRecuperacion, contrasenaNueva) => {
    setCorreoRecuperacion('');
    setContrasenaNueva('');

    if (op === 1) {
      setTitle('Recuperar Contraseña')

    }
    else if (op == 2) {
      setTitle('Codigo de Verificacion')
      setMensaje('Se ha enviado un código de verificación a tu correo electrónico.');
    }
    else if (op === 3) {
      setTitle('Nueva Contraseña')
      setMensaje('Introduzca su nueva contraseña..');
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('correo').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;
    var url

    if (operation === 1) {
      parametros = { correoEmpleado: correoRecuperacion };
      metodo = 'POST';
      url = 'http://localhost:8081/api/recuperar';
    } else if (operation === 2) {
      parametros = { token: codigo };
      metodo = 'POST';
      url = 'http://localhost:8081/api/recuperar/validarCodigo'
    } else if (operation === 3) {
      parametros = { token: codigo, nuevaContrasena: contrasenaNueva };
      metodo = 'POST';
      url = 'http://localhost:8081/api/recuperar/restablecerContra';
    }
    enviarSolicitud(metodo, parametros, url);
  }


  const enviarSolicitud = async (metodo, parametros, url) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (operation == 1) {
        console.log('Correo ENVIADO')

      } else if (operation == 2) {
        console.log('Codigo Validado')
      } else {
        console.log('Contraseña restablecida')
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }


  return (
    <div className='bodyLogin'>
      <div className="contenedor-formulario contenedor">
        <div className="imagen-formulario">

        </div>

        <form className="formulario" onSubmit={validarDatos}>
          <div className="texto-formulario">
            <h2>Bienvenido de nuevo..</h2>
            <p>Motors Up</p>
          </div>
          <div className="input">
            <label htmlFor="correo">Correo</label>
            <input type="text" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)}></input>
          </div>
          <div className="input">
            <label htmlFor="contrasena">Contraseña</label>
            <input type="password" id="contrasena" value={password} onChange={(e) => setContrasena(e.target.value)}></input>
          </div>
          <div className="password-olvidada">
            <p className="olvideC" onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalCorreo'>¿Olvidaste tu contraseña?</p>
          </div>
          <div className="input">
            <input type="submit" value="Iniciar Sesión"></input>
          </div>
        </form>
      </div>




      {/* MODAL CORREO */}
      <div id='modalCorreo' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h4'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
                <input type='text' id='correoRecuperacion' className='form-control' placeholder='Correo' value={correoRecuperacion} onChange={(e) => setCorreoRecuperacion(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => { validar(); openModal(2); }} data-bs-toggle='modal' data-bs-target='#modalCodigo' className='btn btn-primary'>
                  <FontAwesomeIcon icon={faPaperPlane} /> Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div id='modalCodigo' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h4'>{title}</label>

              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <p>{mensaje}</p>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3 justify-content-center align-items-center'>
                {/* <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='codigo' className='form-control' placeholder='Codigo' value={codigo} onChange={(e) => setCodigo(e.target.value)}></input> */}
                <div className='otp_inputs'>

                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                <input type="text" placeholder='' maxLength='1' className='otp_input'></input>
                </div>

              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => { validar(); openModal(3); }} data-bs-toggle='modal' data-bs-target='#modalContrasena' className='btn btn-primary'>
                  <FontAwesomeIcon icon={faCheck} /> Verificar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id='modalContrasena' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>

              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <p>{mensaje}</p>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faLock} /></span>
                <input type='password' id='contrasenaNueva' className='form-control' placeholder='Contraseña' value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-primary'>
                  <FontAwesomeIcon icon={faPaperPlane} /> Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>





    </div>
  );
};

export default Login;
