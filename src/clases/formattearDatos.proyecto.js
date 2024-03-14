export const formatDetalleCotizacionServicio = (idCotizacion, datosJson) => {
    let datos = [];

    for (let i = 0; i < datosJson.length; i++) {
        datos.push({
            cantidad: datosJson[i].cantidad,
            total: datosJson[i].subTotal,
            cotizaciones_idCotizacion: idCotizacion,
            servicios_idServicio: datosJson[i].identificador,
        })
    }
    return datos;
} 


export const formatDetalleCotizacionProducto = (idCotizacion, datosJson) => {
    let datos = [];

    for (let i = 0; i < datosJson.length; i++) {
        datos.push({
            precioVenta: datosJson[i].cantidad,
            total: datosJson[i].subTotal,
            cantidad: datosJson[i].cantidad,
            cotizaciones_idCotizacion: idCotizacion,
            productos_idProducto: datosJson[i].identificador,
        })
    }
    return datos;
} 