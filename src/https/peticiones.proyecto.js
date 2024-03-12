import axios from 'axios';

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

export const peticionPost = async (continuacionUrl, datosJson) => {
    let data = [];

    try {
        const response = await axios.post(`${url}${continuacionUrl}`, datosJson)
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