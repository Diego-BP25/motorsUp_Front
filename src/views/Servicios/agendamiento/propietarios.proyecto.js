import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faTruckField, faCalendar, faToggleOff, faCircleInfo, faComment } from '@fortawesome/free-solid-svg-icons'

const Propietarios = () => {

    const url = 'http://localhost:8081/api/propietarios'
    const [propietario, setPropietario] = useState([])
    const [idPropietario, setIdPropietario] = useState('')
    const [nombrePropietario, setNombre] = useState('')
    const [telefonoPropietario, setTelefono] = useState('')
    const [correoPropietario, setCorreo] = useState('')
    const [estadoPropietario, setEstado] = useState('')
    const [operation, setOperation] = useState(1)
    const [title, setTitle] = useState('')


    useEffect(() => {
        getPropietarios()
    }, [])

    const getPropietarios = async () => {
        try {
            const respuesta = await axios.get(url, {})
            setPropietario(await respuesta.data)
        } catch (error) {
            console.error('Error al obtener los Empleados:', error.message)
        }
    }

    const openModal = (op, idPropietario, nombrePropietario, telefonoPropietario, correoPropietario, estadoPropietario) => {
        setIdPropietario('');
        setNombre('');
        setTelefono('');
        setCorreo('');
        setEstado('');

        if (op === 1) {
            setTitle('Registrar propietario')
        }
        else if (op === 2) {
            setTitle('Editar Propietario')
            setIdPropietario(idPropietario);
            setNombre(nombrePropietario);
            setTelefono(telefonoPropietario);
            setCorreo(correoPropietario);
            setEstado(estadoPropietario);
        }

        setOperation(op)
        window.setTimeout(function () {
            document.getElementById('nombrePropietario').focus();
        }, 500);
    }

    const validar = () =>{
    var parametros;
    var metodo;

    if(operation ===1){
        console.log(idPropietario)
        parametros ={idPropietario: idPropietario, nombrePropietario: nombrePropietario,telefonoPropietario: telefonoPropietario, correoPropietario: correoPropietario, estadoPropietario: estadoPropietario};
        metodo = 'POST';
        }else {
            console.log(idPropietario)
            parametros ={idPropietario: idPropietario, nombrePropietario: nombrePropietario,telefonoPropietario: telefonoPropietario, correoPropietario: correoPropietario, estadoPropietario: estadoPropietario}
        }
    }
}
export default Propietarios