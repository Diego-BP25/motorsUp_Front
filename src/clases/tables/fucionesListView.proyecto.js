import React from 'react'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

// Para agregar el detalle a la tabla de previsuarización, tablaDetalle = new Listview(), objeto = {codigo: 0, nombre: kks}
// estadoActualizar = setValorManoObra, subTotal = cantidad * precio
export const addTablaDetalle = (tablaDetalle, objeto, estadoActualizar, subTotal) => {
    tablaDetalle.setObjeto(objeto)

    estadoActualizar(`$ ${subTotal}`);
}

// que pereza poner comentarios
export const deleteDetalleCotizacion = (codigoObjetoBorrar, tablaDetalleCotizacion, setEstadoUpdate) => {
    tablaDetalleCotizacion.deleteObjeto(codigoObjetoBorrar);
    setEstadoUpdate(true);
}

export const actualizarPrecioCotizacion = (tablaDetalleCotizacion, estadoPrecio, valorDescontar) => {
    tablaDetalleCotizacion(
        `$ ${(parseInt(estadoPrecio.substring(1, estadoPrecio.length)) - valorDescontar).toString()}`
    )
}

export const mainTablaDetalleCotizacion = (tablaDetalleCotizacion, estadoPrecio, setEstadoPrecio, setEstadoUpdate) => {
    if (!tablaDetalleCotizacion) return;

    return tablaDetalleCotizacion.getAObjetos().map((c) => (
        <tr key={c.codigo}>
            <td>{c.codigo}</td>
            <td>{c.nombre}</td>
            <td>{c.precio}</td>
            <td>{c.cantidad}</td>
            <td>{c.subTotal}</td>
            <td>{c.identificador}</td>
            <td>
                <button onClick={() => {
                    deleteDetalleCotizacion(c.codigo, tablaDetalleCotizacion, setEstadoUpdate);
                    actualizarPrecioCotizacion(setEstadoPrecio, estadoPrecio, (parseInt(c.precio.substring(1, c.precio.length)) * parseInt(c.cantidad)))
                }} className='btn btn-danger'>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </td>
        </tr>
    ))
}
