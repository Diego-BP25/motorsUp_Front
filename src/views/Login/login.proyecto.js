import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { show_alerta } from 'src/fuctions.proyecto';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setContrasena] = useState('');

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
            if(error.response.data.msg== 'Usuario no encontrado en la base de datos'){
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
            if(error.response.data.msg=='El usuario esta inactivo'){
                show_alerta('Usuario inactivo - Comunicarse con el administrador')
            }
        }
    };

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
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className="input">
                        <input type="submit" value="Iniciar Sesión"></input>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
