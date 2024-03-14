import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from 'src/fuctions.proyecto';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setContrasena] = useState('');

    const validarDatos = async (e) => {
        e.preventDefault();

        if (!correo || !password) {
            show_alerta('No se permiten campos vacios', 'info')
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                correoEmpleado: correo,
                contrasena: password
            });

            console.log(response.data); 
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response.data.msg);
            if (error.response.data.msg === 'Correo/Password no son correctos') {
                show_alerta('Correo o Contraseña no válidos');
            }
            if(error.response.data.msg== 'Usuario no encontrado en la base de datos'){
                show_alerta('Usuario no encontrado en la base de datos')

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
