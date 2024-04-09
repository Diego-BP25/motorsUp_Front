import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import ProtectedRoute from './views/Login/ProtectedRoute.proyecto.js'



const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout.proyecto'))
const Login = React.lazy(() => import('./views/Login/login.proyecto'))
const Register = React.lazy(() => import('./views/pages/register/Register.proyecto'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404.proyecto'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500.proyecto'))
const Cotizacion = React.lazy(() => import('./views/cotizaciones/cotizaciones.proyecto'))
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route element={<ProtectedRoute canActivate={false} />}>
            <Route exact path="/register" name="Register Page" element={<Register />} />
          </Route>
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App
