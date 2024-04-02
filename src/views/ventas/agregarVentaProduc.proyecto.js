import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash,  faFloppyDisk, faCalendar, faToggleOff, faTag, faFileText, faHashtag, faBagShopping, faDollar, faUser } from '@fortawesome/free-solid-svg-icons'

const AgregarCompra = () => {
    // API URL
    const url = 'http://localhost:8081/api/ventas';

    // Estados del formulario
    const [idVenta, setIdVenta] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [estado, setEstado] = useState('');
    const [total, setTotal] = useState('');
    const [empleados, setEmpleado] = useState([]);
    const [empleados_idEmpleado, setIdEmpleado] = useState('');
    const [productos, setProductos] = useState([]);
    const [productos_idProducto, setIdProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precioVenta, setPrecio] = useState('');
    const [productosVenta, setProductosVenta] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);

    // Obtener datos iniciales
    useEffect(() => {
        getProductos();
        getEmpleados();

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

    // Función para eliminar un producto de la lista de productos agregados
    const eliminarProducto = (index) => {
        const nuevosProductos = [...productosVenta];
        nuevosProductos.splice(index, 1);
        setProductosVenta(nuevosProductos);
    };

    // Función para agregar un producto a la venta
    const agregarProducto = () => {
        if (empleados_idEmpleado && productos_idProducto && cantidad && precioVenta) {
            const total = parseFloat(cantidad) * parseFloat(precioVenta);
            setProductosVenta([...productosVenta, { empleados_idEmpleado, productos_idProducto, cantidad, precioVenta, total }]);
            setCantidad('');
            setPrecio('');
            setIdProducto('');
            setIdEmpleado('');
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del producto son obligatorios',
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
                detalleProductos: productosVenta,
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
                                        <input type='text' id='metodoPago' placeholder='metodo Pago' className="form-control" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='estado' className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></label>
                                        <input type='text' id='estado' placeholder='estado' className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='total' className='input-group-text'><FontAwesomeIcon icon={faFileText} /></label>
                                        <input type='number' id='total' placeholder='total' className="form-control" value={total} onChange={(e) => setTotal(e.target.value)} />
                                    </div>

                     
                                    <h4 style={{ marginRight: 'auto', }}>Productos</h4>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='empleados_idEmpleado' className='input-group-text'><FontAwesomeIcon icon={faUser} /></label>
                                        <select id='empleados_idEmpleado' className="form-control" value={empleados_idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)}>
                                            <option value=''>Empleado relazionado</option>
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



                                    <div key={"buttonGuardar"} className='d-grid col-6 mx-auto' style={{ width: '70%', marginTop: '3%' }} >
                                        <button type='button' onClick={() => agregarProducto()} className='botones-azules' >
                                            <FontAwesomeIcon icon={faFloppyDisk} /> Agregar producto
                                        </button>
                                    </div>

                                </div>
                            </div>

                            <div className="col">

                                <div style={{ border: '1px solid', maxWidth: '135%', maxHeight: '50%', marginLeft: '-40%', padding: '3%', overflow: 'scroll'}}>
                                    <h4>Productos agregados</h4>
                                    <table className='table'>
                                        <thead  style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} >
                                            <tr >
                                                <th>ID Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th>Subtotal</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {productosVenta.map((producto, index) => (
                                                <tr key={index} >
                                                    <td>{producto.productos_idProducto}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.precioVenta}</td>
                                                    <td>{producto.total}</td>
                                                    <td>
                                                        <button type='button' onClick={() => eliminarProducto(index)} className='btn btn-danger'>
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
