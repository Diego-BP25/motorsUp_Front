import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faCalendar, faToggleOff, faIdCardClip, faTag, faFileText, faTruckField, faHashtag, faBagShopping, faDollar } from '@fortawesome/free-solid-svg-icons'

const AgregarCompra = () => {
    // API URL
    const url = 'http://localhost:8081/api/compras';

    // Estados del formulario
    const [idCompra, setIdCompra] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [productos, setProductos] = useState([]);
    const [idProducto, setIdProducto] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [productosCompra, setProductosCompra] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);

    // Obtener datos iniciales
    useEffect(() => {
        getProveedores();
        getProductos();
    }, []);

    // Obtener lista de proveedores
    const getProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/proveedores');
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener los proveedores:', error.message);
        }
    };

    const obtenerIdConsecutivo = async () => {
        try {
            const respuesta = await axios.get(url);
            const compras = respuesta.data;
            if (compras.length > 0) {
                const maxId = Math.max(...compras.map(c => c.idCompra));
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

    // Función para eliminar un producto de la lista de productos agregados
    const eliminarProducto = (index) => {
        const nuevosProductos = [...productosCompra];
        nuevosProductos.splice(index, 1);
        setProductosCompra(nuevosProductos);
    };

    // Función para agregar un producto a la compra
    const agregarProducto = () => {
        if (idProducto && cantidad && precio) {
            const subtotal = parseFloat(cantidad) * parseFloat(precio);
            setProductosCompra([...productosCompra, { idProducto, cantidad, precio, subtotal }]);
            setCantidad('');
            setPrecio('');
            setIdProducto('');
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del producto son obligatorios',
            });
        }
    };



    // Función para guardar la compra
    const guardarCompra = async () => {
        try {

            const nuevaCompra = {
                idCompra: consecutivo,
                descripcionCompra: descripcion,
                estadoCompra: estado,
                fechaCompra: fechaCompra,
                proveedores_idProveedor: proveedorSeleccionado,
                detalleProductos: productosCompra,
            };
            console.log(nuevaCompra)
            await axios.post(url, nuevaCompra);

            Swal.fire({
                icon: 'success',
                text: 'Compra agregada con éxito',
            });

            // Limpiar formulario después de guardar
            setDescripcion('');
            setEstado('');
            setFechaCompra('');
            setProveedorSeleccionado('');
            setProductosCompra([]);
        } catch (error) {
            console.error('Error al guardar la compra:', error.message);
            Swal.fire({
                icon: 'error',
                text: 'Error al guardar la compra',
            });
        }
    };

    return (
        <div className='App' >
            <div className='container mt-5' >
                <div style={{ marginRight: 'auto', marginTop: '-5%', }}>
                    <h3>Agregar compra</h3>
                </div>
                <form onSubmit={guardarCompra} >
                    <div className="container">
                        <div className="row">
                            <div className="col" >
                                <div className='input-group mb-3' style={{ border: '1px solid', maxWidth: '55%', paddingBottom: '1%', paddingLeft: '2%', paddingTop: '2%', paddingRight: '2%', marginLeft: '-2%' }}>

                                    <div className='input-group mb-3' onChange={obtenerIdConsecutivo()}>
                                        <label htmlFor='idCompra' className='input-group-text'><FontAwesomeIcon icon={faIdCardClip} /></label>
                                        <input type='number' id='idCompra' className="form-control" value={consecutivo} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='descripcion' className='input-group-text'><FontAwesomeIcon icon={faFileText} /></label>
                                        <input type='text' id='descripcion' placeholder='Descripcion' className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='estado' className='input-group-text'><FontAwesomeIcon icon={faToggleOff} /></label>
                                        <input type='text' id='estado' className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='fechaCompra' className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></label>
                                        <input id='fechaCompra' className="form-control" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='proveedor' className='input-group-text'><FontAwesomeIcon icon={faTruckField} /></label>
                                        <select id='proveedor' className="form-control" value={proveedorSeleccionado} onChange={(e) => setProveedorSeleccionado(e.target.value)}>
                                            <option value=''>Seleccione un proveedor</option>
                                            {proveedores.map((prov) => (
                                                <option key={prov.idProveedor} value={prov.idProveedor}>{prov.nombreProveedor}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <h4 style={{ marginRight: 'auto', }}>Productos</h4>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='idProducto' className='input-group-text'><FontAwesomeIcon icon={faBagShopping} /></label>
                                        <select id='idProducto' className="form-control" value={idProducto} onChange={(e) => setIdProducto(e.target.value)}>
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
                                        <label htmlFor='precio' className='input-group-text'><FontAwesomeIcon icon={faTag} /></label>
                                        <input type='number' className="form-control" id='precio' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} />
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
                                            {productosCompra.map((producto, index) => (
                                                <tr key={index} >
                                                    <td>{producto.idProducto}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.precio}</td>
                                                    <td>{producto.subtotal}</td>
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

                    <div className='input-group mb-3' style={{ marginTop: '-9.5%', marginLeft: '32%' }}>
                        <label htmlFor='precio' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                        <input type='number' className="form-control" id='precio' value={precio} onChange={(e) => setPrecio(e.target.value)} />
                    </div>

                    <div key={"buttonGuardar"} className='col-md-4 offset-md-5' style={{ marginTop: '-5.5%', marginLeft: '76.7%' }}>
                        <button type='submit' className='botones-azules' style={{ width: '60%', marginTop: '3%' }}>
                            <FontAwesomeIcon icon={faFloppyDisk} /> Guardar compra
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default AgregarCompra;
