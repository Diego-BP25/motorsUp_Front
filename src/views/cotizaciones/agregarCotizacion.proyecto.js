import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { formatDate } from 'src/views/funcionesExtras.proyecto'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faFloppyDisk, faCalendar, faToggleOff, faTag, faFileText, faHashtag, faBagShopping, faDollar, faUser, faTools } from '@fortawesome/free-solid-svg-icons'

const AgregarCotizacion = () => {
    // API URL
    const url = 'http://localhost:8081/api/cotizacion';

    // Estados del formulario servicios

    const [total, setTotal] = useState('');
    const [vehiculo, setVehiculos] = useState([]);
    const [vehiculos_placa, setplaca] = useState('');
    const [servicios, setServicios] = useState([]);
    const [servicios_idServicio, setIdServicio] = useState('');

    const [estadoVenta, setEstadoVenta] = useState([]);
    const [cotizacionVenta, setCotizacionVenta] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);
    const [mostrarServicios, setMostrarServicios] = useState(true);
    const [mostrarProductos, setMostrarProductos] = useState(false);
    const [serviciosActivo, setServiciosActivo] = useState(true);
    const [productosActivo, setProductosActivo] = useState(false);
    const [empleados, setEmpleado] = useState([]);
    const [empleados_idEmpleado, setIdEmpleado] = useState('');

    //estados formularios productos

    const [productos, setProductos] = useState([]);
    const [categoriaProductos, setCategoriaProductos] = useState([]);
    const [idCategoriaProducto, setIdCategoriaProducto] = useState('');
    const [productos_idProducto, setIdProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioVenta, setPrecio] = useState('');
    const [productosCotizacion, setProductosCotizacion] = useState([]);

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
        calcularTotal([...cotizacionVenta, ...productosCotizacion]);
    }, [...cotizacionVenta, ...productosCotizacion]);


    //formulario de cotizacion
    const [cotizacion, setCotizacion] = useState([]);
    const [idCotizacion, setIdCotizacion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [valorManoObra, setValorManoObra] = useState('');
    const [valorCotizacion, setValorCotizacion] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [fechaCotizacion, setFechaCotizacion] = useState('');

    // Obtener datos iniciales servicios
    useEffect(() => {
        getServicios();
        getVehiculos();
        getEmpleados();
        obtenerIdConsecutivo();
    }, []);

    // Obtener datos iniciales productos
    useEffect(() => {
        getCategoriaProductos();
        getProductos();
    }, []);


    //obtener consecutivo de la venta
    const obtenerIdConsecutivo = async () => {
        try {
            const respuesta = await axios.get(url);
            const cotizacion = respuesta.data;
            if (cotizacion.length > 0) {
                const maxId = Math.max(...cotizacion.map(c => c.idCotizacion));
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
            setFechaCotizacion(formatDate(new Date()))
        } catch (error) {
            console.error('Error al obtener los vehiculos:', error.message);
        }
    };

    // Obtener lista de categoria de productos
    const getCategoriaProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/categoriaproductos');
            setCategoriaProductos(response.data);
        } catch (error) {
            console.error('Error al obtener la categoria de productos:', error.message);
        }
    };

    // Obtener lista de los productos
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
        const nuevasVentas = [...cotizacionVenta.concat(productosCotizacion)];
        nuevasVentas.splice(index, 1);
        const nuevosServicios = nuevasVentas.filter((venta) => venta.tipo === 'servicio');
        const nuevosProductos = nuevasVentas.filter((venta) => venta.tipo === 'producto');
        setCotizacionVenta(nuevosServicios);
        setProductosCotizacion(nuevosProductos);
    };

    // Función para agregar un servicio a la venta
    const agregarServicio = () => {
        if (empleados_idEmpleado && vehiculos_placa && servicios_idServicio && valorManoObra) {
            const tipo = 'servicio'
            const total = parseFloat(valorManoObra);
            const nuevoServicio = { tipo, empleados_idEmpleado, vehiculos_placa, servicios_idServicio, valorManoObra, estadoVenta, total };

            setCotizacionVenta([...cotizacionVenta, nuevoServicio]);
            setValorManoObra('');
            setIdServicio('');
            setEstadoVenta('');
            setIdEmpleado('');
            setplaca('');
            calcularTotal([...cotizacionVenta, nuevoServicio]);

        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del servicio son obligatorios',
            });
        }

    };

    // Función para agregar un producto a la venta
    const agregarProducto = () => {
        if (productos_idProducto && cantidad && precioVenta) {
            const total = parseFloat(cantidad) * parseFloat(precioVenta);
            const tipo = "producto"
            const nuevoProducto = { tipo, productos_idProducto, cantidad, precioVenta, total };

            setProductosCotizacion([...productosCotizacion, nuevoProducto]);
            setCantidad('');
            setPrecio('');
            setIdProducto('');

            calcularTotal([...productosCotizacion, nuevoProducto]);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del producto son obligatorios',
            });
        }

    };
    // Función para calcular el total de la venta
    const calcularTotal = (coti) => {
        const totalCotizacion = coti.reduce((acc, coti) => acc + coti.total, 0);
        setTotal(totalCotizacion);
    };
    useEffect(() => {
        const totalServicios = cotizacionVenta.reduce((acc, servicio) => acc + servicio.total, 0);
        const totalProductos = productosCotizacion.reduce((acc, producto) => acc + producto.total, 0);
        const totalCotizacion = totalServicios + totalProductos;
        setCotizacion(totalCotizacion);
    }, [cotizacionVenta, productosCotizacion]);


    // Función para guardar la venta
    const guardarCotizacion = async () => {
        try {
            const subtotalProductos = productosCotizacion.reduce((acc, producto) => acc + producto.subtotal, 0);
            const nuevaCotizacion = {

                idCotizacion: consecutivo,
                fecha: fechaCotizacion,
                descripcion: descripcion,
                estado: "cotizacion",
                total: cotizacion,
                valorCotizacion: valorCotizacion,
                detalleCotizacion: [...cotizacionVenta, ...productosCotizacion],
            };
            console.log(nuevaCotizacion)
            await axios.post(url, nuevaCotizacion);

            Swal.fire({
                icon: 'success',
                text: 'Cotizacion agregada con éxito',
            });

            // Limpiar formulario después de guardar
            setMetodoPago('');
            setEstado('');
            setTotal('');
            setCotizacionVenta([]);
            setProductosCotizacion([]);

        } catch (error) {
            console.error('Error al guardar la cotizacion:', error.message);
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
                <div className='row' >
                    <div style={{ marginRight: 'auto', marginTop: '-6%', }}>
                        <h3>Agregar cotizacion</h3>
                    </div>
                    <div className='col-md-6' >
                        <form onSubmit={guardarCotizacion} className="flex-grow-1 mr-3" >
                            <div className="container" >
                                <div className='input-group mb-3' id='container1' style={{ border: '1px solid', maxWidth: '55%', paddingBottom: '1%', paddingLeft: '2%', paddingTop: '2%', paddingRight: '2%', marginLeft: '-2%' }}>
                                    <div className='input-group mb-3' >
                                        <label htmlFor='fechaCotizacion' className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></label>
                                        <input type='datetime-local' id='fechaCotizacion' placeholder='Fecha' className="form-control" value={fechaCotizacion} readOnly={true} onChange={(e) => setFechaCotizacion(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='descripcion' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                        <input type='text' id='descripcion' placeholder='Descripcion' className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='valorCotizacion' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                        <input type='text' min={0} id='valorCotizacion' placeholder='valor cotizacion' className="form-control" value={valorCotizacion} onChange={(e) => setValorCotizacion(e.target.value)} />
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
                                        <>
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
                                                <input type='number' min={0} className="form-control" id='valorManoObra' placeholder='Valor mano obra' value={valorManoObra} onChange={(e) => setValorManoObra(e.target.value)} />
                                            </div>

                                            <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%' }} >
                                                <button type='button' onClick={() => agregarServicio()} className='botones-azules' >
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Agregar servicio
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {mostrarProductos && (
                                        <>


                                            <div className='input-group mb-3' >
                                                <label htmlFor='idCategoriaProducto' className='input-group-text'><FontAwesomeIcon icon={faBagShopping} /></label>
                                                <select id='idCategoriaProducto' className="form-control" value={idCategoriaProducto} onChange={(e) => setIdCategoriaProducto(e.target.value)}>
                                                    <option value=''>Seleccione una categoria</option>
                                                    {categoriaProductos.map((pro) => (
                                                        <option key={pro.idCategoriaProducto} value={pro.idCategoriaProducto}>{pro.nombreCategoria}</option>
                                                    ))}
                                                </select>

                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='productos_idProducto' className='input-group-text'><FontAwesomeIcon icon={faTools} /></label>
                                                <select id='productos_idProducto' className="form-control" value={productos_idProducto} onChange={(e) => setIdProducto(e.target.value)}>
                                                    <option value=''>Seleccione un producto</option>
                                                    {productos.map((pro) => (
                                                        <option key={pro.idProducto} value={pro.idProducto}>{pro.nombreProducto}</option>
                                                    ))}
                                                </select>

                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='cantidad' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                                <input type='number' min={0} className="form-control" id='cantidad' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                            </div>

                                            <div className='input-group mb-3' >
                                                <label htmlFor='precioVenta' className='input-group-text'><FontAwesomeIcon icon={faTag} /></label>
                                                <input type='number' min={0} className="form-control" id='precioVenta' placeholder='precioVenta' value={precioVenta} onChange={(e) => setPrecio(e.target.value)} />
                                            </div>



                                            <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%' }} >
                                                <button type='button' onClick={() => agregarProducto()} className='botones-azules' >
                                                    <FontAwesomeIcon icon={faFloppyDisk} /> Agregar producto
                                                </button>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                            <div key={"buttonGuardar"} className='input-group mb-3' style={{ marginTop: '-9%', marginLeft: '163.7%' }}>
                                <button type='submit' className='botones-azules' style={{ width: '60%' }}>
                                    <FontAwesomeIcon icon={faFloppyDisk} /> Guardar venta
                                </button>
                            </div>

                            <div className='input-group mb-3' style={{ marginTop: '-9.5%', marginLeft: '65.8%', maxHeight: '35px', marginBottom: '35px' }}>
                                <label htmlFor='total' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                <input type='number' min={0} className="form-control" id='total' value={total} />
                            </div>
                        </form>
                    </div>

                    <div className='col-md-6' >

                        <div id='container1' style={{ maxWidth: '135%', maxHeight: '430px', marginLeft: '-40%', padding: '3%', overflowY: 'auto' }}>
                            <h4>Detalle cotizacion</h4>
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
                                    {cotizacionVenta.concat(productosCotizacion).map((venta, index) => (

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
        </div>
    );
};

export default AgregarCotizacion;
