import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faToggleOff, faIdCardClip, faUser, faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons'
import { ButtonSwitch } from 'src/components/proyect/switch.proyecto'
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
    const [actualizacion, setActualizacion] = useState(false)
    useEffect(() => {
        getPropietarios()
        setActualizacion(false)
    }, [actualizacion?propietario:null])

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
      document.getElementById('idPropietario').focus();
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
          parametros ={idPropietario: idPropietario, nombrePropietario: nombrePropietario,telefonoPropietario: telefonoPropietario, correoPropietario: correoPropietario, estadoPropietario: estadoPropietario}
          metodo = 'PUT';
        }
        enviarSolicitud(metodo, parametros);
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta){
            var tipo = respuesta.data[0];
            if (metodo === 'POST') {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Propietario agregada con exito",
                    showConfirmButton: false,
                    timer: 1500
        });
        document.getElementById('btnCerrar').click();
    }else if (metodo === 'PUT'){
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Propietario editado con exito",
        showConfirmButton: false,
        timer: 1500
      });
          document.getElementById('btnCerrar').click();
    }
    if (metodo === 'DELETE') {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Propietario eliminado con exito",
            showConfirmButton: false,
            timer: 1500
          });
          document.getElementById('btnCerrar').click();
    }
      setActualizacion(true)
    })
    .catch(function (error) {
      show_alerta('Error en la solicitud', 'error');
      console.log(error);
    })
}

const deletePropietario = (idPropietario) =>{

    const MySwal = withReactContent (Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este propietario?',
      icon: 'question', text: 'No podra activar nuevamente este propietario',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdPropietario(idPropietario);
        enviarSolicitud('DELETE', { idPropietario: idPropietario });
      } else {
        show_alerta('El Rol no fue eliminad0', 'info')
      }
    });

  }


  return ( 
    
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
            <button onClick={()=> openModal(1)} className='btn btn-success ms-2' data-bs-toggle='modal' data-bs-target='#modalPropietarios'>
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
           </div>
          </div>
          <div className='row mt-3'>
            <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
              <div className='table-responsive'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Telefono</th>
                      <th>Correo</th>
                      <th>Estado</th>
                      <th>Acciones</th>

                    </tr>
                  </thead>
                  <tbody className='table-group-divider'>
                    {propietario.map((r) => (
                      <tr key={r.idPropietario}>
                        <td>{r.idPropietario}</td>
                        <td>{r.nombrePropietario}</td>
                        <td>{r.telefonoPropietario}</td>
                        <td>{r.correoPropietario}</td>
                        <td>{r.estadoPropietario?'true':'false'}</td>
                        <td>
                            <button onClick={()=> openModal(2, r.idPropietario, r.nombrePropietario, r.telefonoPropietario, r.correoPropietario, r.estadoPropietario)} className='btn btn-warning'
                            data-bs-toggle='modal' data-bs-target='#modalPropietarios'> 
                            <FontAwesomeIcon icon={faEdit} />
                            </button>
                            &nbsp;
                            <button onClick ={()=> deletePropietario(r.idPropietario)}className='btn btn-danger'> 
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>  
              </div>
            </div>
          </div>
        </div>
        <div id='modalPropietarios' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close' id='btnCerrar'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></span>
                <input type='text' id='idPropietario' className='form-control' placeholder='ID' value={idPropietario} onChange={(e)=> setIdPropietario(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faUser} /></span>
                <input type='text' id='nombre' className='form-control' placeholder='Nombre Propietario' value={nombrePropietario} onChange={(e)=> setNombre(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faPhone} /></span>
                <input type='text' id='telefono' className='form-control' placeholder='Telefono Propietario' value={telefonoPropietario} onChange={(e)=> setTelefono(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faEnvelope} /></span>
                <input type='text' id='correo' className='form-control' placeholder='Correo Propietario' value={correoPropietario} onChange={(e)=> setCorreo(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='estado' className='form-control' placeholder='Estado Propietario' value={estadoPropietario} onChange={(e)=> setEstado(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()}  className='btn btn-success'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>        
    </div>
  )
}
export default Propietarios