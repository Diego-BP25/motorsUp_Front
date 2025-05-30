import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom'
import { show_alerta } from 'src/fuctions.proyecto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEnvelope, faPaperPlane, faLock } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setContrasena] = useState('');
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [correoRecuperacion, setCorreoRecuperacion] = useState('')
  const [contrasenaNueva, setContrasenaNueva] = useState('')
  const [mensaje, setMensaje] = useState('');
  const [codigo, setCodigo] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const inputs = useRef([]); 

  useEffect(() => {

    if (localStorage.getItem('Empleado')) {
      setIsLoggedIn(true); // Establecer isLoggedIn en true si hay datos de usuario
    }
  }, []);


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
        localStorage.setItem('Empleado', JSON.stringify(response.data.token))
        const token = localStorage.getItem('Empleado');
        if (token) {
          const decodedToken = jwtDecode(token);
          const idRol = decodedToken.empleado.roles_idRol
          if (idRol === 1) {
             window.location.href = '/#/dashboard';
          } else if (idRol === 2) {
            window.location.href = '/#/Servicios/agendamiento';
          }
        }
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

  if (isLoggedIn) {
    return <Navigate to={"/#/dashboard"} />
  }

  const openModal = (op) => {
    setCorreoRecuperacion('');
    setContrasenaNueva('');

    if (op === 1) {
      setTitle('Recuperar Contraseña')

    }
    else if (op === 2) {
      setTitle('Codigo de Verificacion')
      setMensaje('Se ha enviado un código de verificación a tu correo electrónico.');
    }
    else if (op === 3) {
      setTitle('Nueva Contraseña')
      setMensaje('Introduzca su nueva contraseña..');
    }
    setOperation(op);


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
      console.log(codigo)

    } else if (operation === 3) {
      parametros = { token: codigo, nuevaContrasena: contrasenaNueva };
      metodo = 'POST';
      url = 'http://localhost:8081/api/recuperar/restablecerContra';
    }
    enviarSolicitud(metodo, parametros, url);
  }


  const enviarSolicitud = async (metodo, parametros, url) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      if (operation === 1) {
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

  const inputCodigo = (index, value) => {
    const newCodigo = codigo.split('');
    newCodigo[index] = value;
    setCodigo(newCodigo.join(''));

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  return (
    <>
      <div className="divPrincipalLogin">
        <div className='divSecundarioLogin flex'>
          <div>
            <img className="imageBackground"
              src="https://i.pinimg.com/564x/35/60/43/356043497043eb4a11a9b94ccdb63651.jpg"
              alt=""
            />
          </div>
          <div className="card-inner">
            <div className="containerRegister">
              <form onSubmit={validarDatos}>
                <h1 className="text-center">Motors Up</h1>

                <div className="inputs">
                  <label>Correo</label>
                  <br />
                  <input
                    type="email"
                    className="input"
                    placeholder="Correo"
                    id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>

                <div className="inputs">
                  <label>Contraseña</label>
                  <br />
                  <input
                    type="password"
                    className="input"
                    placeholder="Contraseña"
                    id="contrasena" value={password} onChange={(e) => setContrasena(e.target.value)}
                  />
                </div>

                <button id="btn1" className="button" type="submit">
                  Ingresar
                </button>

                <p>
                  <p className="textLoginAndRegister" onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalCorreo'>Olvidé mi contraseña</p>
                </p>
              </form>
            </div>
          </div>
        </div>


        <div className='bodyLogin'>
          {/* MODAL CORREO */}
          <div id='modalCorreo' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered'>
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
                    <button onClick={() => { validar(); openModal(2, correoRecuperacion); }} data-bs-toggle='modal' data-bs-target='#modalCodigo' className='botones-azules'>
                      <FontAwesomeIcon icon={faPaperPlane} /> Enviar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='modalCodigo' className='modal fade' aria-hidden='true'>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <label className='h4'>{title}</label>

                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
              </div>
              <div className='modal-body'>
                <p>{mensaje}</p>
                <div className='input-group mb-3 justify-content-center align-items-center'>
                  <div className='otp_inputs'>
                    {[0, 1, 2, 3, 4, 5].map(index => (
                      <input
                        key={index}
                        ref={el => (inputs.current[index] = el)} // Asignar la referencia al input
                        type="text"
                        placeholder=''
                        maxLength='1'
                        className='otp_input'
                        value={codigo[index] || ''}
                        onChange={(e) => inputCodigo(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className='d-grid col-6 mx-auto'>
                  <button onClick={() => {
                    validar();
                    openModal(3);
                  }} data-bs-toggle='modal' data-bs-target='#modalContrasena' className='botones-azules'>
                    <FontAwesomeIcon icon={faCheck} /> Verificar
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>

        <div id='modalContrasena' className='modal fade' aria-hidden='true'>
          <div className='modal-dialog modal-dialog-centered'>
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
                  <button onClick={() => validar()} className='botones-azules'>
                    <FontAwesomeIcon icon={faPaperPlane} /> Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>





      </div>
    </>

  );
};

export default Login;