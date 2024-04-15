import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faComment, faSearch } from '@fortawesome/free-solid-svg-icons'
import { CSmartPagination } from '@coreui/react-pro'
import { show_alerta } from 'src/fuctions.proyecto'

const Servicios = () => {

    const url = 'http://localhost:8081/api/servicio'
    const [servicio, setServicio] = useState([])
    const [idServicio, setIdServicio] = useState('')
    const [nombreServicio, setNombreServicio] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estado, setEstado] = useState('')
    const [actualizacion, setActualizacion] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [busqueda, setBusqueda] = useState("");
    const [operation, setOperation] = useState(1)
    const [title, setTitle] = useState('')

    useEffect(() => {
        getServicios()
        setActualizacion(false)
    }, [actualizacion ? servicio : null])







    const getServicios = async () => {
        try {
            const respuesta = await axios.get(url, {})
            setServicio(await respuesta.data)
        } catch (error) {
            console.error('Error al obtener los servicios:', error.message)
        }
    }

    const openModal = (op, idServicio, nombreServicio, descripcion, estado,) => {
        setIdServicio('')
        setNombreServicio('')
        setDescripcion('')
        setEstado('')
        if (op === 1) {
            setTitle('Registrar Servcio')
            // obtenerIdConsecutivo();
        }
        else if (op === 2) {
            setTitle('Editar Servcio')
            setIdServicio(idServicio)
            setNombreServicio(nombreServicio)
            setDescripcion(descripcion)
            setEstado(estado)
        }
        setOperation(op)
        window.setTimeout(function () {
            document.getElementById('nombreServicio').focus();
        }, 500);
    }

    // const validarCamposObligatorios = () => {
    //     let hayErrores = false;
    //     if (!nombre.trim()) {
    //         setNombreError('El campo nombre obligatorio');
    //         hayErrores = true;
    //     } else {
    //         setNombreError('');
    //     }
    //     return hayErrores;
    // };

    const validar = () => {
        var parametros;
        var metodo;


        // const camposObligatoriosInvalidos = validarCamposObligatorios();

        // if (camposObligatoriosInvalidos) {
        //     return;
        // }

        if (operation === 1) {
            parametros = { nombreServicio: nombreServicio, descripcion: descripcion, estado: true };
            metodo = 'POST';
        } else {
            parametros = { idServicio: idServicio, nombreServicio: nombreServicio, descripcion: descripcion, estado: estado };
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
                    title: "Servicio agregado con exito"
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
                    title: "Servicio editado con exito"
                });
                document.getElementById('btn-close').click();
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
                    title: "Servicio eliminado con exito"
                });
                document.getElementById('btnCerrar').click();
            }

            setActualizacion(true)

            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getServicios();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteServicio = (idServicio) => {

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar este Servicio?',
            icon: 'question', text: 'No podra activar nuevamente el Servicio',
            showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setIdServicio(idServicio);
                enviarSolicitud('DELETE', { idServicio: idServicio });
            }
        });

    }

    const handleChange = (e) => {
        const valor = e.target.value;
        setBusqueda(valor); // Actualizar el estado de búsqueda

        if (valor.trim() === '') {
            getServicios(); // Si el valor está vacío, obtener todos los propietarios nuevamente
        } else {
            filtrar(valor); // Si hay un valor, aplicar el filtro de búsqueda
        }
    };

    const filtrar = (terminoBusqueda) => {
        var resultadosBusqueda = servicio.filter((elemento) => {

            if (elemento.nombreServicio.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
            ) {
                return elemento;
            }
        });
        setServicio(resultadosBusqueda);
    }




    const getCurrentPageServicios = () => {
        const startIndex = (currentPage - 1) * 5;
        const endIndex = startIndex + 5;
        return servicio.slice(startIndex, endIndex);
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div >
                    <div style={{ display: 'flex', }} id="Container">

                        <div style={{ marginRight: 'auto' }}>
                            <h3>Servicios</h3>
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
                            <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalServicios' onClick={() => openModal(1)} >
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
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Descripcion</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {getCurrentPageServicios().map((s) => (
                                        <tr key={s.idServicio}>
                                            <td>{s.idServicio}</td>
                                            <td>{s.nombreServicio}</td>
                                            <td>{s.descripcion}</td>
                                            <td>
                                                <span className={!s.estado ? 'estado-inactivo' : 'estado-activo'}>{!s.estado ? 'Inactivo' : 'Activo'}</span></td>
                                            <td>
                                                <button onClick={() => openModal(2, s.idServicio, s.idServicio, s.descripcion, s.estado)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalServicioEditar'>
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteServicio(s.idServicio)} className='btn btn-danger'>
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
                            pages={Math.ceil(servicio.length / 5)}
                            onActivePageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>


            <div id='modalServicios' className='modal fade' aria-hidden='true' data-bs-backdrop='static' data-bs-keyboard='false' >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' id='btnCerrar' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                                <input type='text' id='nombreServicio' className='form-control' placeholder='Nombre Servicio' value={nombreServicio} onChange={(e) => { setNombreServicio(e.target.value) }}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}

                                    style={{ resize: 'none' }}
                                ></textarea>
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

            {/* Modal Editar Servicio */}
            <div id='modalServicioEditar' className='modal fade' aria-hidden='true' data-bs-backdrop='static' data-bs-keyboard='false'>
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' id='btn-close' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>

                            <div className='input-group mb-3'>
                                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                                <input type='text' id='nombreServicio' className='form-control' placeholder='Nombre Servicio' value={nombreServicio} onChange={(e) => { setNombreServicio(e.target.value) }}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    style={{ resize: 'none' }}
                                    placeholder="Descripcion"
                                ></textarea>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                                <select id='estado' className='form-select' value={estado} onChange={(e) => setEstado(e.target.value)} >
                                    <option value={true}>Activo</option>
                                    <option value={false}>Inactivo</option>
                                </select>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='botones-azules'>
                                    <FontAwesomeIcon icon={faFloppyDisk} /> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Servicios