import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash,  faFloppyDisk, faCalendar, faToggleOff, faTag, faFileText, faHashtag, faBagShopping, faDollar, faUser } from '@fortawesome/free-solid-svg-icons'
import { ContentDoble } from 'src/components/proyect/modal.proyecto';

const AgregarCompra = () => {
    // API URL
    const url = 'http://localhost:8081/api/ventas';

    // Estados del formulario
    const [fechaVenta, setFechaVenta] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [estado, setEstado] = useState('');
    const [total, setTotal] = useState('');
    const [vehiculo, setVehiculos] = useState([]);
    const [vehiculos_placa, setplaca] = useState('');
    const [servicios, setServicios] = useState([]);
    const [servicios_idServicio, setIdServicio] = useState('');
    const [valorManoObra, setValorManoObra] = useState('');
    const [valorInsumos, setValorInsumos] = useState('');
    const [estadoVenta, setEstadoVenta] = useState([]);
    const [serviciosVenta, setServiciosVenta] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);

    // Obtener datos iniciales
    useEffect(() => {
        getServicios();
        getVehiculos();

    }, []);

    

    const obtenerIdConsecutivo = async () => {
        try {
            const respuesta = await axios.get(url);
            const ventas = respuesta.data;
            if (ventas.length > 0) {
                const maxId = Math.max(...ventas.map(c => c.idVenta));
                setConsecutivo(maxId + 1);
            } else {
                setConsecutivo(1);
            }
        } catch (error) {
            console.error('Error al obtener el número consecutivo más alto:', error.message);
        }
    };


    // Obtener lista de servicios
    const getServicios = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/servicio');
            setServicios(response.data);
        } catch (error) {
            console.error('Error al obtener los servicios:', error.message);
        }
    };

    // Obtener lista de vehiculos
    const getVehiculos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/vehiculo');
            setVehiculos(response.data);
        } catch (error) {
            console.error('Error al obtener los vehiculos:', error.message);
        }
    };

    // Función para eliminar un servicio de la lista de servicios agregados
    const eliminarServicio = (index) => {
        const nuevosServicios = [...serviciosVenta];
        nuevosServicios.splice(index, 1);
        setServiciosVenta(nuevosServicios);
    };

    // Función para agregar un servicio a la venta
    const agregarServicio = () => {
        if (vehiculos_placa && servicios_idServicio && valorManoObra && valorInsumos && estadoVenta) {
            const tipo= 'servicio'
            const total = parseFloat(valorManoObra) + parseFloat(valorInsumos);
            setServiciosVenta([...serviciosVenta, { tipo, vehiculos_placa, servicios_idServicio, valorManoObra, valorInsumos,estadoVenta, total }]);
            setValorManoObra('');
            setValorInsumos('');
            setIdServicio('');
            setEstadoVenta('');
            setplaca('');
            console.log(tipo)
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del servicio son obligatorios',
            });
        }

    };

    // Función para guardar la venta
    const guardarVenta = async () => {
        try {

            const nuevaVenta = {
                
                idVenta: consecutivo,
                fecha: fechaVenta,
                metodoPago: metodoPago,
                estado: estado,
                total:total,
                detalleVenta: serviciosVenta,
            };
            console.log(nuevaVenta)
            await axios.post(url, nuevaVenta);

            Swal.fire({
                icon: 'success',
                text: 'Venta agregada con éxito',
            });

            // Limpiar formulario después de guardar
            setFechaVenta('');
            setMetodoPago('');
            setEstado('');
            setTotal('');
            setServiciosVenta([]);
        } catch (error) {
            console.error('Error al guardar la venta:', error.message);
            console.log(error)
            Swal.fire({
                icon: 'error',
                text: 'Error al guardar la venta',
            });
        }
    };

    return (
        <div className='App' >
            <div className='container mt-5' >
                <div style={{ marginRight: 'auto', marginTop: '-5%', }}>
                    <h3>Agregar venta</h3>
                </div>
                <form onSubmit={guardarVenta} >
                    <div className="container">
                        <div className="row">
                            <div className="col" >
                                <div className='input-group mb-3' style={{ border: '1px solid', maxWidth: '55%', paddingBottom: '1%', paddingLeft: '2%', paddingTop: '2%', paddingRight: '2%', marginLeft: '-2%' }}>

                                    <div className='input-group mb-3' onChange={obtenerIdConsecutivo()}>
                                        <label htmlFor='idVenta' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                        <input type='number' id='idVenta' placeholder='Id' className="form-control" value={consecutivo} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='fechaVenta' className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></label>
                                        <input type='datetime-local' id='fechaVenta' placeholder='Fecha' className="form-control" value={fechaVenta} onChange={(e) => setFechaVenta(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='metodoPago' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                        <input type='text' id='metodoPago' placeholder='Metodo Pago' className="form-control" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='estado' className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></label>
                                        <input type='text' id='estado' placeholder='Estado' className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='total' className='input-group-text'><FontAwesomeIcon icon={faFileText} /></label>
                                        <input type='number' id='total' placeholder='Total' className="form-control" value={total} onChange={(e) => setTotal(e.target.value)} />
                                    </div>

                     
                                    <h4 style={{ marginRight: 'auto', }}>Servicios</h4>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='vehiculos_placa' className='input-group-text'><FontAwesomeIcon icon={faUser} /></label>
                                        <select id='vehiculos_placa' className="form-control" value={vehiculos_placa} onChange={(e) => setplaca(e.target.value)}>
                                            <option value=''> vehiculo</option>
                                            {vehiculo.map((pro) => (
                                                <option key={pro.placa} value={pro.placa}>{pro.placa}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='servicios_idServicio' className='input-group-text'><FontAwesomeIcon icon={faBagShopping} /></label>
                                        <select id='servicios_idServicio' className="form-control" value={servicios_idServicio} onChange={(e) => setIdServicio(e.target.value)}>
                                            <option value=''>Seleccione un servicio</option>
                                            {servicios.map((pro) => (
                                                <option key={pro.idServicio} value={pro.idServicio}>{pro.nombreServicio}</option>
                                            ))}
                                        </select>
                                    </div>
                                
                                    <div className='input-group mb-3' >
                                        <label htmlFor='valorManoObra' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                        <input type='number' className="form-control" id='valorManoObra' placeholder='Valor mano obra' value={valorManoObra} onChange={(e) => setValorManoObra(e.target.value)} />
                                    </div>
                                    <div className='input-group mb-3' >
                                        <label htmlFor='valorInsumos' className='input-group-text'><FontAwesomeIcon icon={faTag} /></label>
                                        <input type='number' className="form-control" id='valorInsumos' placeholder='Valor insumos' value={valorInsumos} onChange={(e) => setValorInsumos(e.target.value)} />
                                    </div>
                                    
                                    <div className='input-group mb-3' >
                                        <label htmlFor='estadoVenta' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                        <input type='text' className="form-control" id='estadoVenta' placeholder='Estado' value={estadoVenta} onChange={(e) => setEstadoVenta(e.target.value)} />
                                    </div>

                                    <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%', marginTop: '3%' }} >
                                        <button type='button' onClick={() => agregarServicio()} className='botones-azules' >
                                            <FontAwesomeIcon icon={faFloppyDisk} /> Agregar servicio
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <div className="col">

                                <div style={{ border: '1px solid', maxWidth: '140%', maxHeight: '50%', marginLeft: '-5%', padding: '3%', overflow: 'scroll'}}>
                                    <h4>servicios agregados</h4>
                                    <table className='table'>
                                        <thead  style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} >
                                            <tr >
                                                <th>ID servicio</th>
                                                <th>valor mano obra</th>
                                                <th>Valor insumos</th>
                                                <th>Subtotal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {serviciosVenta.map((servicio, index) => (
                                                <tr key={index} >
                                                    <td>{servicio.servicios_idServicio}</td>
                                                    <td>{servicio.valorManoObra}</td>
                                                    <td>{servicio.valorInsumos}</td>
                                                    <td>{servicio.total}</td>
                                                    <td>
                                                        <button type='button' onClick={() => eliminarServicio(index)} className='btn btn-danger'>
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

                    {/* <div className='input-group mb-3' style={{ marginTop: '-9.5%', marginLeft: '32%' }}>
                        <label htmlFor='precio' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                        <input type='number' className="form-control" id='precio' value={precio} onChange={(e) => (e.target.value)} />
                    </div> */}

                    <div key={"buttonGuardar"} className='col-md-4 offset-md-5' style={{ marginTop: '-5.5%', marginLeft: '76.7%' }}>
                        <button type='submit' className='botones-azules' style={{ width: '60%', marginTop: '3%' }}>
                            <FontAwesomeIcon icon={faFloppyDisk} /> Guardar venta
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default AgregarCompra;
