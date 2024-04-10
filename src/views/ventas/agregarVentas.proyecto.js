import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faFloppyDisk, faCalendar, faToggleOff, faTag, faFileText, faHashtag, faBagShopping, faDollar, faUser } from '@fortawesome/free-solid-svg-icons'

const AgregarVenta = () => {
    // API URL
    const url = 'http://localhost:8081/api/ventas';

    // Estados del formulario servicios
    const [venta, setVenta] = useState(0);
    const [fechaVenta, setFechaVenta] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [estado, setEstado] = useState('');
    const [total, setTotal] = useState('');
    const [vehiculo, setVehiculos] = useState([]);
    const [vehiculos_placa, setplaca] = useState('');
    const [servicios, setServicios] = useState([]);
    const [servicios_idServicio, setIdServicio] = useState('');
    const [valorManoObra, setValorManoObra] = useState('');
    const [estadoVenta, setEstadoVenta] = useState([]);
    const [serviciosVenta, setServiciosVenta] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);
    const [mostrarServicios, setMostrarServicios] = useState(true);
    const [mostrarProductos, setMostrarProductos] = useState(false);
    const [serviciosActivo, setServiciosActivo] = useState(true);
    const [productosActivo, setProductosActivo] = useState(false);

    //estados formularios productos
    const [empleados, setEmpleado] = useState([]);
    const [empleados_idEmpleado, setIdEmpleado] = useState('');
    const [productos, setProductos] = useState([]);
    const [productos_idProducto, setIdProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioVenta, setPrecio] = useState('');
    const [productosVenta, setProductosVenta] = useState([]);

    const toggleMostrarServicios = () => {
        setMostrarServicios(true);
        setMostrarProductos(false);
        setServiciosActivo(true);
        setProductosActivo(false);
    };

    const toggleMostrarProductos = () => {
        setMostrarServicios(false);
        setMostrarProductos(true);
        setServiciosActivo(false);
        setProductosActivo(true);
    };

    useEffect(() => {
        calcularTotal([...serviciosVenta, ...productosVenta]);
    }, [...serviciosVenta, ...productosVenta]);



    // Obtener datos iniciales servicios
    useEffect(() => {
        getServicios();
        getVehiculos();

    }, []);

    // Obtener datos iniciales productos
    useEffect(() => {
        getProductos();
        getEmpleados();

    }, []);


    //obtener consecutivo de la venta
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

    // Obtener lista de productos
    const getProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
        }
    };

    // Obtener lista de empleados
    const getEmpleados = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/empleados');
            setEmpleado(response.data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error.message);
        }
    };

    // Función para eliminar un servicio o producto de la lista de ventas
const eliminarVenta = (index) => {
    const nuevasVentas = [...serviciosVenta.concat(productosVenta)];
    nuevasVentas.splice(index, 1);
    const nuevosServicios = nuevasVentas.filter((venta) => venta.tipo === 'servicio');
    const nuevosProductos = nuevasVentas.filter((venta) => venta.tipo === 'producto');
    setServiciosVenta(nuevosServicios);
    setProductosVenta(nuevosProductos);
};

    // Función para agregar un servicio a la venta
    const agregarServicio = () => {
        if (vehiculos_placa && servicios_idServicio && valorManoObra ) {
            const estadoVenta = "true"
            const tipo = 'servicio'
            const total = parseFloat(valorManoObra);
            const nuevoServicio = { tipo, vehiculos_placa, servicios_idServicio, valorManoObra, estadoVenta, total };

            setServiciosVenta([...serviciosVenta, nuevoServicio]);
            setValorManoObra('');
            setIdServicio('');
            setEstadoVenta('');
            setplaca('');
            calcularTotal([...serviciosVenta, nuevoServicio]);

        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del servicio son obligatorios',
            });
        }

    };

    // Función para agregar un producto a la venta
    const agregarProducto = () => {
        if (empleados_idEmpleado && productos_idProducto && cantidad && precioVenta) {
            const total = parseFloat(cantidad) * parseFloat(precioVenta);
            const tipo = "producto"
            const nuevoProducto = { tipo, empleados_idEmpleado, productos_idProducto, cantidad, precioVenta, total };

            setProductosVenta([...productosVenta, nuevoProducto]);
            setCantidad('');
            setPrecio('');
            setIdProducto('');
            setIdEmpleado('');
            calcularTotal([...productosVenta, nuevoProducto]);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del producto son obligatorios',
            });
        }

    };
    // Función para calcular el total de la venta
    const calcularTotal = (ventas) => {
        const totalVenta = ventas.reduce((acc, venta) => acc + venta.total, 0);
        setVenta(totalVenta); // Actualiza el estado del total de la venta
    };
    useEffect(() => {
        const totalServicios = serviciosVenta.reduce((acc, servicio) => acc + servicio.total, 0);
        const totalProductos = productosVenta.reduce((acc, producto) => acc + producto.total, 0);
        const totalVenta = totalServicios + totalProductos;
        setVenta(totalVenta);
    }, [serviciosVenta, productosVenta]);


    // Función para guardar la venta
    const guardarVenta = async () => {
        try {
            const nuevaVenta = {
                
                idVenta: consecutivo,
                fecha: fechaVenta,
                metodoPago: metodoPago,
                estado: "true",
                total: venta,
                detalleVenta: [...serviciosVenta, ...productosVenta],
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
            setProductosVenta([]);

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
                <div style={{ marginRight: 'auto', marginTop: '-6%', }}>
                    <h3>Agregar venta</h3>
                </div>
                <form onSubmit={guardarVenta} >
                    <div className="container">
                        <div className="row">
                            <div className='col-md-6' >
                                <div className='input-group mb-3' id='container1' style={{ border: '1px solid', maxWidth: '55%', paddingBottom: '1%', paddingLeft: '2%', paddingTop: '2%', paddingRight: '2%', marginLeft: '-2%' }}>

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

                                    <h4
                                        style={{ borderRadius: '5%', marginTop: '8%', paddingRight: '5%', paddingLeft: '2%', backgroundColor: serviciosActivo ? '#0073B9  ' : '#CFD8E0', color: serviciosActivo ? '#fff' : '#313335' }}
                                        onClick={toggleMostrarServicios}
                                    >Servicios</h4>
                                    <h4
                                        style={{ borderRadius: '5%', marginTop: '8%', paddingRight: '5%', paddingLeft: '2%', backgroundColor: productosActivo ? '#0073B9  ' : '#CFD8E0', color: productosActivo ? '#fff' : '#313335' }}
                                        onClick={toggleMostrarProductos}
                                    >Productos</h4>


                                    {mostrarServicios && (
                                        <div className="row" style={{ marginLeft: '-4%' }}>
                                            <div className='input-group mb-3' >
                                                <label htmlFor='vehiculos_placa' className='input-group-text'><FontAwesomeIcon icon={faUser} /></label>
                                                <select id='vehiculos_placa' className="form-control" value={vehiculos_placa} onChange={(e) => setplaca(e.target.value)}>
                                                    <option value=''> vehiculo</option>
                                                    {vehiculo.map((pro) => (
                                                        <option key={pro.placa} value={pro.placa}>{pro.placa}</option>
                                                    ))}
                                                </select>
                                            </div >

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
                                                <label htmlFor='valorManoObra' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                                <input type='number' className="form-control" id='valorManoObra' placeholder='Valor mano obra' value={valorManoObra} onChange={(e) => setValorManoObra(e.target.value)} />
                                            </div>

                                            <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%' }} >
                                                <button type='button' onClick={() => agregarServicio()} className='botones-azules' >
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Agregar servicio
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {mostrarProductos && (
                                        <div className="row" style={{ marginLeft: '-4%' }}>
                                            <div className='input-group mb-3' >
                                                <label htmlFor='empleados_idEmpleado' className='input-group-text'><FontAwesomeIcon icon={faUser} /></label>
                                                <select id='empleados_idEmpleado' className="form-control" value={empleados_idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)}>
                                                    <option value=''>Empleado relacionado</option>
                                                    {empleados.map((pro) => (
                                                        <option key={pro.idEmpleado} value={pro.idEmpleado}>{pro.nombreEmpleado}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='productos_idProducto' className='input-group-text'><FontAwesomeIcon icon={faBagShopping} /></label>
                                                <select id='productos_idProducto' className="form-control" value={productos_idProducto} onChange={(e) => setIdProducto(e.target.value)}>
                                                    <option value=''>Seleccione un producto</option>
                                                    {productos.map((pro) => (
                                                        <option key={pro.idProducto} value={pro.idProducto}>{pro.nombreProducto}</option>
                                                    ))}
                                                </select>

                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='cantidad' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                                <input type='number' className="form-control" id='cantidad' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='precioVenta' className='input-group-text'><FontAwesomeIcon icon={faTag} /></label>
                                                <input type='number' className="form-control" id='precioVenta' placeholder='precioVenta' value={precioVenta} onChange={(e) => setPrecio(e.target.value)} />
                                            </div>



                                            <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%' }} >
                                                <button type='button' onClick={() => agregarProducto()} className='botones-azules' >
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Agregar producto
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div className='input-group mb-3' style={{ marginTop: '-8.5%', marginLeft: '65.8%', maxHeight: '35px', marginBottom: '35px' }}>
                                    <label htmlFor='total' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                    <input type='number' className="form-control" id='total' value={venta} />
                                </div>
                            </div>

                            <div className="col">

                                <div id='container1' style={{ maxWidth: '135%', maxHeight: '70%', marginLeft: '-40%', padding: '3%', overflow: 'scroll' }}>
                                    <h4>Venta</h4>
                                    <table className='table'>
                                        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                                            <tr >
                                                <th>Id</th>
                                                <th>Tipo</th>
                                                <th>Precio</th>
                                                <th>cantidad</th>
                                                <th>Total</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {serviciosVenta.concat(productosVenta).map((venta, index) => (

                                                <tr key={index} >
                                                    <td>{venta.tipo === 'servicio' ? venta.servicios_idServicio : venta.productos_idProducto}</td>
                                                    <td>{venta.tipo}</td>
                                                    <td>{venta.tipo === 'servicio' ? venta.valorManoObra : venta.precioVenta}</td>
                                                    <td>{venta.tipo === 'servicio' ? "1" : venta.cantidad}</td>
                                                    <td>{venta.total}</td>

                                                    <td>
                                                        <button
                                                        type='button'
                                                        onClick={() => eliminarVenta(index, venta.tipo)}
                                                        className='btn btn-danger'>
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

export default AgregarVenta;
