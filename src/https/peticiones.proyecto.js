import axios from 'axios';
import { formatDetalleCotizacionProducto, formatDetalleCotizacionServicio } from 'src/clases/formattearDatos.proyecto';

const url = 'http://localhost:8081/api/';

export const peticionGet = async (continuacionUrl, datosJson) => {
    let data = [];
    try {
        const response = await axios.post(`${url}${continuacionUrl}`, datosJson)
        data = response.data
    } catch (error) {
        console.error('Error al obtener los datos:', error.message)
    }

    return data
}

const peticionGetId = async (continuacionUrl) => {
    let data = [];

    try {
        const response = await axios.get(`${url}${continuacionUrl}`)
        data = response.data
    } catch (error) {
        console.error('Error al obtener los datos:', error.message)
    }
    return data
}

export const getDataRouterId = async (url, setEstado) => {
    try {
        const respuesta = await peticionGetId(url)
        setEstado(respuesta)
    } catch (error) {
        console.error('Error al obtener las compras:', error.message)
    }
}

export const peticionPost = async (urls, datosJson, datosTableInsercion = ["", ""]) => {
    try {
        const response = await axios.post(`${url}${urls[0]}`, datosJson[0]);
        let data = response.data;

        if (urls.length > 2) {
            const idCotizacion = await peticionPost(['global/seachId'], [{ "nombreTabla": datosTableInsercion[1], "nombreColumna": datosTableInsercion[0] }])
            
            await postTableDetail(urls[1], formatDetalleCotizacionServicio(idCotizacion[0][datosTableInsercion[0]], datosJson[1]));
            await postTableDetail(urls[2], formatDetalleCotizacionProducto(idCotizacion[0][datosTableInsercion[0]], datosJson[2]));
        }

        return data;
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
    }
};

export const postTableDetail = async (continuacionUrl, datos) => {
    let data = [];
    try {
        const response = await axios.post(`${url}${continuacionUrl}`, datos)
        data = response.data
    } catch (error) {
        return { message: `Error al crear los detalles ${error}` }
    }
    if (data.message === "OK") return { message: `OK` };

    return { message: `¡Error!` };
}