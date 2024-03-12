import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setContrasena] = useState('');

    const validarDatos = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', {
                correoEmpleado: correo,
                contrasena: password
            });

            console.log(response.data); 
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response.data.msg);
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
