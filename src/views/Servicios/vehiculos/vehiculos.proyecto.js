import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faComment, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CSmartPagination } from '@coreui/react-pro'
import { show_alerta } from 'src/fuctions.proyecto'

const Vehiculos = () => {

  const url = 'http://localhost:8081/api/vehiculo'
  const [vehiculo, setVehiculo] = useState([])
  const [placa, setPlaca] = useState('')
  const [referencia, setReferencia] = useState('')
  const [modelo, setModelo] = useState('')
  const [color, setColor] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [busqueda, setBusqueda] = useState("");

  const [propietarios, setPropietarios] = useState([])
  const [propietarios_idPropietario, setPropietarios_idPropietario] = useState('')


  useEffect(() => {
    getVehiculos()
    getPropietarios()
    setActualizacion(false)
  }, [actualizacion ? vehiculo : null])

  const getVehiculos = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setVehiculo(await respuesta.data)
    } catch (error) {
      console.error('Error al obtener los vehiculos:', error.message)
    }
  }

  const getPropietarios = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/propietarios', {})
      setPropietarios(await respuesta.data)
      console.log(respuesta)
    } catch (error) {
      console.error('Error al obtener los propietarios:', error.message)
    }
  }

  const openModal = (op, placa, referencia, modelo, color) => {
    setPlaca('');
    setReferencia('');
    setModelo('');
    setColor('');

    if (op === 1) {
      setTitle('Registrar Vehiculo')
    }
    else if (op === 2) {
      setTitle('Editar Vehiculo')
      setPlaca(placa);
      setReferencia(referencia);
      setModelo(modelo);
      setColor(color);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('placa').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;

    if (operation === 1) {
      parametros = { placa: placa, referencia: referencia, modelo: modelo, color: color, propietarios_idPropietario: propietarios_idPropietario };
      metodo = 'POST';
    } else {
      parametros = { placa: placa, referencia: referencia, modelo: modelo, color: color, propietarios_idPropietario: propietarios_idPropietario };
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);
  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      var tipo = respuesta.data[0];
      if (metodo === 'POST') {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Vehiculo agregado con exito"
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Vehiculo editado con exito"
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Vehiculo eliminado con exito"
        });
        document.getElementById('btnCerrar').click();
      }

      setActualizacion(true)

      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getVehiculos();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteVehiculo = (placa) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este Vehiculo?',
      icon: 'question', text: 'No podra activar nuevamente el Vehiculo',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setPlaca(placa);
        enviarSolicitud('DELETE', { placa: placa });
      }
    });

  }

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor); // Actualizar el estado de búsqueda

    if (valor.trim() === '') {
      getVehiculos(); // Si el valor está vacío, obtener todos los propietarios nuevamente
    } else {
      filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
    }
  };

  const filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = vehiculo.filter((elemento) => {

      if (elemento.placa.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ) {
        return elemento;
      }
    });
    setVehiculo(resultadosBusqueda);
  }



  const getCurrentPageVehiculos = () => {
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return vehiculo.slice(startIndex, endIndex);
  }

  return (
    <div className='App'>
      <div className='container-fluid'>
        <div >
          <div style={{ display: 'flex', }} id="Container">

            <div style={{ marginRight: 'auto' }}>
              <h3>Vehiculos</h3>
            </div>
            <div className='input-group' style={{ marginRight: '1%' }}>
              <input className='form-control inputBuscador'
                id='buscador'
                value={busqueda}
                placeholder='Buscar'
                onChange={handleChange}
              />
              <div className="icon-container">
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </div>


            <div style={{ marginRight: '-0.1%' }}>
              <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalVehiculo' onClick={() => openModal(1)} >
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div >
            <div className='table-responsive' style={{ maxWidth: '100%', margin: '0 auto' }}>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Referencia</th>
                    <th>Modelo</th>
                    <th>Color</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className='table-group-divider'>
                  {getCurrentPageVehiculos().map((v) => (
                    <tr key={v.placa}>
                      <td>{v.placa}</td>
                      <td>{v.referencia}</td>
                      <td>{v.modelo}</td>
                      <td>{v.color}</td>
                      <td>
                        <button onClick={() => openModal(2, v.placa, v.nombre, v.referencia, v.modelo, v.color)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalVehiculo'>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        &nbsp;
                        <button onClick={() => deleteVehiculo(v.placa)} className='btn btn-danger'>
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
        {/* Paginación */}
        <div className='row mt-3'>
          <div className='col-12 col-lg-8 offset-0 offset-lg-2' >
            <CSmartPagination
              style={{ marginLeft: '-208px' }}
              activePage={currentPage}
              pages={Math.ceil(vehiculo.length / 5)}
              onActivePageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <div id='modalVehiculo' className='modal fade' aria-hidden='true' data-bs-backdrop='static' data-bs-keyboard='false' >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' id='btnCerrar' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='placa' className='form-control' placeholder='Placa' value={placa} onChange={(e) => setPlaca(e.target.value)} ></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='referencia' className='form-control' placeholder='Referencia' value={referencia} onChange={(e) => setReferencia(e.target.value)} ></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='modelo' className='form-control' placeholder='Modelo' value={modelo} onChange={(e) => setModelo(e.target.value)}></input>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='color' className='form-control' placeholder='Color' value={color} onChange={(e) => setColor(e.target.value)}></input>
              </div>

              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <select id='propietarios_idPropietario' className='form-select' value={propietarios_idPropietario} onChange={(e) => setPropietarios_idPropietario(e.target.value)} style={{ marginRight: '12px' }}>
                  <option value='' disabled>Propietario</option>
                  {propietarios.map((p) => (
                    <option key={p.idPropietario} value={p.idPropietario}>{p.nombrePropietario}</option>
                  ))}
                </select>
              </div>

              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='botones-azules'>
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

export default Vehiculos