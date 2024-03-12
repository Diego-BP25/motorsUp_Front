import React from 'react'

const Login =() =>{


  return(
    <div className='body'>
    <div className="contenedor-formulario contenedor">
        <div className="imagen-formulario">
            
        </div>

        <form className="formulario">
            <div className="texto-formulario">
                <h2>Bienvenido de nuevo..</h2>
                <p>Motors Up</p>
            </div>
            <div className="input">
                <label htmlFor="usuario">Correo</label>
                <input type="text" id="usuario"></input>
            </div>
            <div className="input">
                <label htmlFor="contraseña">Contraseña</label>
                <input type="password" id="contraseña"></input>
            </div>
            <div className="password-olvidada">
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="input">
                <input type="submit" value="Iniciar Sesion"></input>
            </div>
        </form>
    </div>
    </div>
  )
}

export default Login