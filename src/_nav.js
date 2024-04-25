import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilSettings, cilTag, cilCreditCard, cilGarage, cilHome } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import { jwtDecode } from 'jwt-decode'
const token = localStorage.getItem('Empleado')
let roles_idRol = 0
if (token) {
  const decodedToken = jwtDecode(token)
  roles_idRol = decodedToken.empleado.roles_idRol
}
let _nav = []
if (roles_idRol == 1) {
  _nav = [
    {
      component: CNavItem,
      name: 'Inicio',
      to: '/dashboard',
      icon: <CIcon icon={cilHome} customClassName='nav-icon' />,
    },
    {
      component: CNavGroup,
      name: 'Configuracion',
      to: '/configuracion',
      icon: <CIcon icon={cilSettings} customClassName='nav-icon' />,
      items: [
        {
          component: CNavItem,
          name: 'Roles',
          to: '/Configuracion/rol',
        },
        {
          component: CNavItem,
          name: 'Empleados',
          to: '/Configuracion/empleado',
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Compras',
      to: '/compras',
      icon: <CIcon icon={cilCart} customClassName='nav-icon' />,
      items: [
        {
          component: CNavItem,
          name: 'Getion compra',
          to: '/compras/compra',
        },
        {
          component: CNavItem,
          name: 'Productos',
          to: '/compras/productos',
        },
        {
          component: CNavItem,
          name: 'Categoria productos',
          to: '/compras/categoriaProductos',
        },
        {
          component: CNavItem,
          name: 'Proveedores',
          to: '/compras/proveedores',
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Cotizacion',
      to: '/cotizacio/cotizaciones',
      icon: <CIcon icon={cilTag} customClassName='nav-icon' />,
    },
    {
      component: CNavGroup,
      name: 'Servicios',
      to: '/buttons',
      icon: <CIcon icon={cilGarage} customClassName='nav-icon' />,
      items: [
        {
          component: CNavItem,
          name: 'Servicios',
          to: '/Servicios/GestionServicio',
        },
        {
          component: CNavItem,
          name: 'Agendamiento',
          to: '/Servicios/agendamiento',
        },
        {
          component: CNavItem,
          name: 'Vehiculos',
          to: '/Servicios/Vehiculo',
        },
        {
          component: CNavItem,
          name: 'Propietario',
          to: '/Servicios/propietario',
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Ventas',
      to: '/Ventas/venta',
      icon: <CIcon icon={cilCreditCard} customClassName='nav-icon' />,
    },
    {
      component: CNavItem,
      name: 'Inicio',
      to: '/Inicio',
      icon: <CIcon icon={cilHome} customClassName='nav-icon' />,
    },
  ]
} else if (roles_idRol == 2) {
  _nav = [
    {
      component: CNavItem,
      name: 'Inicio',
      to: '/dashboard',
      icon: <CIcon icon={cilHome} customClassName='nav-icon' />,
    },
    {
      component: CNavGroup,
      name: 'Servicios',
      to: '/buttons',
      icon: <CIcon icon={cilGarage} customClassName='nav-icon' />,
      items: [
        {
          component: CNavItem,
          name: 'Servicios',
          to: '/Servicios/GestionServicio',
        },
        {
          component: CNavItem,
          name: 'Agendamiento',
          to: '/Servicios/agendamiento',
        },
        {
          component: CNavItem,
          name: 'Vehiculos',
          to: '/Servicios/Vehiculo',
        },
        {
          component: CNavItem,
          name: 'Propietario',
          to: '/Servicios/propietario',
        },
      ],
    },
    {
      component: CNavItem,
      name: 'Ventas',
      to: '/Ventas/venta',
      icon: <CIcon icon={cilCreditCard} customClassName='nav-icon' />,
    },
  ]
}

export default _nav
