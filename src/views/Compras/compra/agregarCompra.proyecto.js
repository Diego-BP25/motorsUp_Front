import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faPlusCircle, faFloppyDisk, faCalendar, faToggleOff, faIdCardClip, faTag, faFileText, faTruckField, faHashtag, faBagShopping, faDollar } from '@fortawesome/free-solid-svg-icons'
import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'

import WidgetsDropdown from 'src/views/widgets/WidgetsDropdown.proyecto'

const AgregarCompra = () => {
    // API URL
    const url = 'http://localhost:8081/api/compras';

    // Estados del formulario
    const [total, setTotal] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [productos, setProductos] = useState([]);
    const [idProducto, setIdProducto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [productosCompra, setProductosCompra] = useState([]);
    const [consecutivo, setConsecutivo] = useState(0);

    // Obtener datos iniciales
    useEffect(() => {
        getProveedores();
        getProductos();
    }, []);

    useEffect(() => {
        calcularTotal(productosCompra);
    }, [productosCompra]);

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
            calcularTotal([...productosCompra, { idProducto, cantidad, precio, subtotal }]);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos del producto son obligatorios',
            });
        }
    };
    const calcularTotal = (productos) => {
        const totalCompra = productos.reduce((acc, producto) => acc + producto.subtotal, 0);
        setTotal(totalCompra);
    };



    // Función para guardar la compra
    const guardarCompra = async () => {
        try {
            const subtotalProductos = productosCompra.reduce((acc, producto) => acc + producto.subtotal, 0);
            const nuevaCompra = {
                idCompra: consecutivo,
                descripcionCompra: descripcion,
                estadoCompra: estado,
                fechaCompra: fechaCompra,
                proveedores_idProveedor: proveedorSeleccionado,
                total: subtotalProductos,
                detalleProductos: productosCompra
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
            setTotal(subtotalProductos.toString());
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
                <div className='row'>
                    <div style={{ marginRight: 'auto', marginTop: '-5%', }}>
                        <h3>Agregar compra</h3>
                    </div>
                    <div className='col-md-6' >
                        <form onSubmit={guardarCompra} className="flex-grow-1 mr-3" >
                            <div className="container">
                                <div className='input-group mb-3' id='container1' style={{ maxWidth: '55%', padding: '3.5%', marginTop: '-1%', marginLeft: '-2%' }}>

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
                                        <input type='datetime-local' id='fechaCompra' className="form-control" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)} />
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
                            <div key={"buttonGuardar"} className='input-group mb-3' style={{ marginTop: '-13%', marginLeft: '166.7%' }}>
                                <button type='submit' className='botones-azules' style={{ width: '60%' }}>
                                    <FontAwesomeIcon icon={faFloppyDisk} /> Guardar compra
                                </button>
                            </div>

                            <div className='input-group mb-3' style={{ marginTop: '-8.5%', marginLeft: '65.8%', maxHeight: '35px', marginBottom: '35px' }}>
                                <label htmlFor='total' className='input-group-text'><FontAwesomeIcon icon={faDollar} /></label>
                                <input type='number' className="form-control" id='total' value={total}/>
                            </div>
                        </form>

                    </div>

                    <div className='col-md-6' >

                        <div id='container1' style={{ maxWidth: '135%', maxHeight: '70%', marginLeft: '-40%', padding: '3%', overflow: 'scroll' }}>
                            <h4>Productos agregados</h4>
                            <table className='table'>
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} >
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

        </div >
    );
};

export default AgregarCompra;
