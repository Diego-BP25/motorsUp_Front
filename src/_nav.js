import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCart, cilSettings, cilTag, cilCreditCard, cilGarage, cilHome } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName='nav-icon' />,
    badge: {
      color: 'info',
      text: '1',
    },
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
    component: CNavGroup,
    name: 'Cotizacion',
    to: '/cotizacion',
    icon: <CIcon icon={cilTag} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Cotizaciones',
        to: '/cotizacio/cotizaciones',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Servicios',
    to: '/buttons',
    icon: <CIcon icon={cilGarage} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion Servicio',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Agendamiento',
        to: '/Servicios/agendamiento',
      },
      {
        component: CNavItem,
        name: 'Vehiculo',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Propietario',
        to: '/Servicios/propietario',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ventas',
    to: '/buttons',
    icon: <CIcon icon={cilCreditCard} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion Ventas',
        to: '/Ventas/venta',
      },
    ],
  },
]

export default _nav
