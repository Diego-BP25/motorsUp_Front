import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CNavGroupItems, CRow } from '@coreui/react'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faToggleOff, faIdCardClip, faUser, faPhone, faEnvelope, faHashtag, faCalendarDays, faDollar, faCreditCard, faEye} from '@fortawesome/free-solid-svg-icons'
import { formatDate } from '../../funcionesExtras.proyecto'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const Ventas = () => {
    const url = 'http://localhost:8081/api/ventas'
    const [venta, setVenta] = useState([])
    const [idVenta, setIdVenta] = useState('')
    const [fecha, setFecha] = useState('')
    const [metodoPago, setMetodoPago] = useState('')
    const [estado, setEstado] = useState('')
    const [total, setTotal] = useState('')
    const [operation, setOperation] = useState(1)
    const [title, setTitle] = useState('')
    const [actualizacion, setActualizacion] = useState(false)
    useEffect(() => {
        getVentas()
        setActualizacion(false)
    }, [actualizacion?venta:null])

    const getVentas = async () => {
        try {
            const respuesta = await axios.get(url, {})
            setVenta(await respuesta.data)
        } catch (error) {
            console.error('Error al obtener los Empleados:', error.message)
        }
    }

    const openModal = (op, idVenta, fecha, metodoPago, estado, total) => {
        setIdVenta('');
        setFecha('');
        setMetodoPago('');
        setEstado('');
        setTotal('');

        if (op === 1) {
            setTitle('Registrar venta')
        }
        else if (op === 2) {
            setTitle('Editar venta  ')
            setIdVenta(idVenta);
            setFecha(fecha);
            setMetodoPago(metodoPago);
            setEstado(estado);
            setTotal(total);
        }

        setOperation(op)
    window.setTimeout(function () {
      document.getElementById('Id').focus();
    }, 500);
    }

    const validar = () =>{
        var parametros;
        var metodo;
    
        if(operation ===1){
            console.log(idVenta)
            parametros ={idVenta: idVenta, fecha: fecha,metodoPago: metodoPago, estado: total};
            metodo = 'POST';
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
                    title: "Venta agregada con exito",
                    showConfirmButton: false,
                    timer: 1500
        });
        document.getElementById('btnCerrar').click();
    }if (metodo === 'DELETE') {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Venta eliminada con exito",
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

const deleteVenta = (idVenta) =>{

    const MySwal = withReactContent (Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar esta venta?',
      icon: 'question', text: 'No podra activar nuevamente esta venta',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdVenta(idVenta);
        enviarSolicitud('DELETE', { idVenta: idVenta });
      } else {
        show_alerta('La venta no fue eliminado', 'info')
      }
    });

  }


  return ( 
    
    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
            <button onClick={()=> {openModal(1); setFecha(formatDate(new Date()))}} className='btn btn-success ms-2' data-bs-toggle='modal' data-bs-target='#modalVentas' > 
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
                      <th>Fecha</th>
                      <th>Metodo pago</th>
                      <th>Estado</th>
                      <th>Total</th>
                      <th>Acciones</th>
                      <th>Detalle_servicio</th>
                      <th>Detalle_producto</th>

                    </tr>
                  </thead>
                  <tbody className='table-group-divider'>
                    {venta.map((r) => (
                      <tr key={r.idVenta} >
                        
                        <td onClick={()=>{alert(r.idVenta)}}>{r.idVenta}</td> 
                        <td onClick={()=>{alert(r.idVenta)}}>{r.fecha}</td>
                        <td onClick={()=>{alert(r.idVenta)}}>{r.metodoPago}</td>
                        <td onClick={()=>{alert(r.idVenta)}}>{r.estado?'true':'false'}</td>
                        <td onClick={()=>{alert(r.idVenta)}}>{r.total}</td>
                        
                        <td>
                            &nbsp;
                            <button onClick ={()=> deleteVenta(r.idVenta)}className='btn btn-danger'> 
                            <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                        <td>
                            &nbsp;
                            <button className='btn btn-primary' > 
                            <FontAwesomeIcon icon={faEye} />
                            </button>
                        </td>
                        <td>
                            &nbsp;
                            <button className='btn btn-primary'> 
                            <FontAwesomeIcon icon={faEye} />
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
        <div id='modalVentas' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close' id='btnCerrar'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='Id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></span>
                <input type='text' id='id' className='form-control' placeholder='ID' value={idVenta} onChange={(e)=> setIdVenta(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCalendarDays} /></span>
                <input type='datetime-local' id='Fecha' className='form-control' placeholder='Fecha' value={fecha} onChange={(e)=> setFecha(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faCreditCard} /></span>
                <input type='text' id='Metodo pago' className='form-control' placeholder='Metodo pago' value={metodoPago} onChange={(e)=> setMetodoPago(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></span>
                <input type='text' id='Estado' className='form-control' placeholder='Estado' value={estado} onChange={(e)=> setEstado(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faDollar} /></span>
                <input type='text' id='Total' className='form-control' placeholder='Total' value={total} onChange={(e)=> setTotal(e.target.value)}></input>
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
export default Ventas