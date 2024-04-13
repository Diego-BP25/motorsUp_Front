import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard.proyecto'))
const Compras = React.lazy(() => import('./views/Compras/compra/compra.proyecto'))
const AgregarCompra = React.lazy(() => import('./views/Compras/compra/agregarCompra.proyecto'))
const Productos = React.lazy(() => import('./views/Compras/productos/productos.proyecto'))
const Empleado = React.lazy(() => import('./views/Configuracion/empleados/empleados.proyecto'))
const Rol = React.lazy(() => import('./views/Configuracion/roles/roles.proyecto'))
const cotizaciones = React.lazy(() => import('./views/cotizaciones/cotizaciones.proyecto'))
const Propietarios = React.lazy(() => import('./views/Servicios/Propietarios/propietario.proyecto'))
const Ventas = React.lazy(() => import('./views/ventas/venta.proyecto'))
const agregarserv = React.lazy(() => import('./views/ventas/agregarVentas.proyecto'))
const Servicios = React.lazy(() => import('./views/Servicios/servicios/servicios.proyecto'))
const Vehiculo = React.lazy(() => import('./views/Servicios/vehiculos/vehiculos.proyecto'))

const Agendamiento = React.lazy(() =>
  import('./views/Servicios/agendamiento/agendamiento.proyecto'),
)
const CategoriaProducto = React.lazy(() =>
  import('./views/Compras/categoriaProductos/categoriaProductos.proyecto'),
)
const Proveedores = React.lazy(() => import('./views/Compras/proveedores/proveedores.proyecto'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Configuracion/rol', name: 'Rol', element: Rol, exact: true },
  { path: '/Configuracion/empleado', name: 'Empleado', element: Empleado, exact: true },
  { path: '/compras', name: 'Compras', element: Compras, exact: true },
  { path: '/cotizacion', name: 'Cotizacion', element: cotizaciones, exact: true },
  { path: '/compras/compra', name: 'Gestion compras', element: Compras },
  { path: '/compras/agregar', name: 'Agregar compra', element: AgregarCompra },
  { path: '/cotizacio/cotizaciones', name: 'Cotizaciones', element: cotizaciones, exact: true },
  { path: '/compras/productos', name: 'Productos', element: Productos, exact: true },
  {
    path: '/compras/categoriaProductos',
    name: 'CategoriaProductos',
    element: CategoriaProducto,
    exact: true,
  },
  { path: '/compras/proveedores', name: 'Proveedores', element: Proveedores, exact: true },
  { path: '/Servicios/propietario', name: 'Propietario', element: Propietarios },
  { path: '/Ventas/venta', name: 'Gestion Ventas', element: Ventas },
  { path: '/Servicios/agendamiento', name: 'Agendamiento', element: Agendamiento },
  { path: '/Ventas/agregarServ', name: 'agregar venta servicio', element: agregarserv },
  { path: '/Servicios/GestionServicio', name: 'Servicios', element: Servicios, exact: true },
  { path: '/Servicios/Vehiculo', name: 'Vehiculos', element: Vehiculo, exact: true },
]

export default routes
