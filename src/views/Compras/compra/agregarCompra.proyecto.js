import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faFloppyDisk, faCalendar, faList, faCartArrowDown, faTag, faFileText, faTruckField, faHashtag, faBagShopping, faDollar } from '@fortawesome/free-solid-svg-icons'


import { formatDate } from 'src/views/funcionesExtras.proyecto'

const AgregarCompra = () => {
    // API URL
    const apiUrl = process.env.REACT_APP_API_URL;
    console.log(apiUrl);
    const url = `${apiUrl}/api/compras`;

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
    const [preciocompra, setPreciocompra] = useState('');
    const [precioventa, setPrecioventa] = useState('');
    const [productosCompra, setProductosCompra] = useState([]);
    const [productosCompraName, setProductosCompraName] = useState([]);

    //categorias
    const [categoriaProductos, setCategoriaProductos] = useState([]);
    const [idCategoriaProducto, setIdCategoriaProducto] = useState('');
    const [categoriaName, setCategoriaName] = useState({});

    const [consecutivo, setConsecutivo] = useState(0);

    // Agregar un nuevo estado para los productos asociados a la categoría seleccionada
    const [productosPorCategoria, setProductosPorCategoria] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');

    // Obtener datos iniciales
    useEffect(() => {
        getProveedores();
        getProductos();
        getNameProductos();
        getCategorias();
        getCategoriasName();
    }, []);

    useEffect(() => {
        calcularTotal(productosCompra);
    }, [productosCompra]);

    const [errores, setErrores] = useState({
        idCategoriaProducto: { error: false, mensaje: '' },
        productoSeleccionado: { error: false, mensaje: '' },
        cantidad: { error: false, mensaje: '' },
        preciocompra: { error: false, mensaje: '' },
        precioventa: { error: false, mensaje: '' },
    });

    const [erroresC, setErroresC] = useState({
        descripcion: { error: false, mensaje: '' },
        proveedorSeleccionado: { error: false, mensaje: '' },
    });



    // Obtener lista de proveedores
    const getProveedores = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/proveedores`);
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
            const response = await axios.get(`${apiUrl}/api/productos`);
            setProductos(response.data);
            setFechaCompra(formatDate(new Date()))
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
        console.log(idProducto && cantidad && preciocompra && precioventa && idCategoriaProducto)
        if (!idProducto || !cantidad || !preciocompra || !precioventa || !idCategoriaProducto || errores.idProducto != '' || errores.cantidad != '' || errores.preciocompra != '' || errores.precioventa != '' || errores.idCategoriaProducto != '') {

            var nuevosErrores = {}
            const productoExistenteIndex = productosCompra.findIndex(producto => producto.idProducto === idProducto);

            nuevosErrores = {
                idCategoriaProducto: {
                    error: !idCategoriaProducto,
                    mensaje: !idCategoriaProducto ? 'La categoría del producto es obligatoria' : ''
                },
                productoSeleccionado: {
                    error: !productoSeleccionado,
                    mensaje: !productoSeleccionado ? 'El producto es obligatorio' : ''
                },
                cantidad: {
                    error: !cantidad || parseFloat(cantidad) < 0,
                    mensaje: !cantidad ? 'La cantidad es obligatoria' : parseFloat(cantidad) < 0 ? 'La cantidad no puede ser negativa' : ''
                },
                preciocompra: {
                    error: !preciocompra || parseFloat(preciocompra) < 0  || parseFloat(preciocompra) > parseFloat(precioventa) ,
                    mensaje: !preciocompra ? 'El precio de compra es obligatorio' : parseFloat(preciocompra) < 0 ? 'El precio de compra no puede ser negativo' : parseFloat(preciocompra) > parseFloat(precioventa) ? 'El valor unitario no puede ser mayor al precio de venta' : ''
                },
                precioventa: {
                    error: !precioventa || parseFloat(precioventa) < 0 || parseFloat(precioventa) < parseFloat(preciocompra) ,
                    mensaje: !precioventa ? 'El precio de venta es obligatorio' : parseFloat(precioventa) < 0 ? 'El precio de venta no puede ser negativo' : parseFloat(precioventa) < parseFloat(preciocompra) ? 'El precio de venta no puede ser menor que el precio de compra' : ''
                },
            };

            if (nuevosErrores.idCategoriaProducto.error == '' && nuevosErrores.productoSeleccionado.error == '' && nuevosErrores.cantidad.error == '' && nuevosErrores.preciocompra.error == '' && nuevosErrores.precioventa.error == '') {
                if (productoExistenteIndex !== -1) {
                    // Si el producto ya existe en la lista, actualiza la cantidad y el subtotal
                    const nuevosProductos = [...productosCompra];
                    console.log(productosCompra);
                    nuevosProductos[productoExistenteIndex].cantidad = parseFloat(nuevosProductos[productoExistenteIndex].cantidad) + parseFloat(cantidad);
                    nuevosProductos[productoExistenteIndex].subtotal = parseFloat(nuevosProductos[productoExistenteIndex].cantidad) * parseFloat(nuevosProductos[productoExistenteIndex].preciocompra);
                    setProductosCompra(nuevosProductos);
                } else {
                    // Si el producto no existe en la lista, agrégalo
                    const subtotal = parseFloat(cantidad) * parseFloat(preciocompra);
                    setProductosCompra([...productosCompra, { idProducto, cantidad, preciocompra, precioventa, subtotal, idCategoriaProducto }]);
                }
                setCantidad('');
                setPreciocompra('');
                setPrecioventa('');
                setIdProducto('');
                setProductoSeleccionado('');
                setIdCategoriaProducto('');
                calcularTotal([...productosCompra, { idProducto, cantidad, preciocompra, precioventa, total, idCategoriaProducto }]);
            }
            setErrores(nuevosErrores);
            return;

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

        var nuevosErrores = {};

        if (!descripcion || !proveedorSeleccionado || erroresC.descripcion != '' || erroresC.proveedorSeleccionado != '') {
            nuevosErrores = {
                descripcion: {
                    error: !descripcion || descripcion.trim() !== descripcion || !/^[a-zA-Z0-9\s]+$/.test(descripcion),
                    mensaje: !descripcion ? 'La descripcion de compra es obligatoria' : descripcion.trim() !== descripcion ? 'La descripcion de compra no puede contener espacios al inicio o al final' : !/^[a-zA-Z0-9\s]+$/.test(descripcion) ? 'La descripcion de compra no puede contener caracteres especiales' : ''
                },
                proveedorSeleccionado: {
                    error: !proveedorSeleccionado,
                    mensaje: !proveedorSeleccionado ? 'El proveedor es obligatorio' : ''
                },
            };

            if (nuevosErrores.descripcion.error == '' && nuevosErrores.proveedorSeleccionado.error == '' ) {
                const subtotalProductos = productosCompra.reduce((acc, producto) => acc + producto.subtotal, 0);
                if(productosCompra == ''){
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3500,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
    
                    Toast.fire({
                        icon: "info",
                        title: "No puede agregar una compra sin productos"
                    });
                    return;
                }

                const nuevaCompra = {
                    idCompra: consecutivo,
                    descripcionCompra: descripcion,
                    estadoCompra: true,
                    fechaCompra: fechaCompra,
                    proveedores_idProveedor: proveedorSeleccionado,
                    total: subtotalProductos,
                    detalleProductos: productosCompra
                };
                await axios.post(url, nuevaCompra);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });

                Toast.fire({
                    icon: "success",
                    title: "Compra agregada con éxito"
                });;

                setTimeout(() => {
                    window.location.href = '/#/Compras/compra';
                }, 1500);

                // Limpiar formulario después de guardar
                setDescripcion('');
                setEstado('');
                setFechaCompra('');
                setProveedorSeleccionado('');
                setProductosCompra([]);
                setTotal(subtotalProductos.toString());

            }

            setErroresC(nuevosErrores);
            return;
        }


    };

    const getNameProductos = async () => {
        try {
            const respuesta = await axios.get(`${apiUrl}/api/productos`);
            const datosProductos = respuesta.data.reduce((acc, p) => {
                acc[p.idProducto] = p.nombreProducto; // Almacenar el nombre
                return acc;
            }, {});
            setProductosCompraName(datosProductos);
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
        }
    };

    const getCategoriasName = async () => {
        try {
            const respuesta = await axios.get(`${apiUrl}/api/categoriaProductos`);
            const datosCategorias = respuesta.data.reduce((acc, categoria) => {
                acc[categoria.idCategoriaProducto] = categoria.nombreCategoria; // Almacenar el nombre
                return acc;
            }, {});
            setCategoriaName(datosCategorias);
        } catch (error) {
            console.error('Error al obtener las categorias:', error.message);
        }
    };


    const getCategorias = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/categoriaProductos`);

            setCategoriaProductos(response.data);
        } catch (error) {
            console.error('Error al obtener las categorias de productos;', error.message);
        }
    };

    const filtrarProductosPorCategoria = (categoriaId) => {
        // Convertir categoriaId a número si es necesario
        const categoriaIdNumero = parseInt(categoriaId);

        // Filtrar productos por la categoría seleccionada
        const productosFiltrados = productos.filter(producto => producto.categoriaProducto_idCategoriaProducto === categoriaIdNumero);

        console.log(productosFiltrados);
        console.log(categoriaIdNumero);

        setProductosPorCategoria(productosFiltrados);
    };

    return (
        <div className='App' >
            <div className='container mt-5' >
                <div className='row' >
                    <div style={{ marginRight: 'auto', marginTop: '-5%', }}>
                        <h3>Agregar compra</h3>
                    </div>
                    <div className='col-md-6' >
                        <form onSubmit={guardarCompra} className="flex-grow-1 mr-3">
                            <div className="container">
                                <div className='input-group mb-3' id='container1' style={{ maxWidth: '55%', padding: '3.5%', marginTop: '-1%', marginLeft: '-2%' }} >

                                    <div className='input-group mb-3' >
                                        <label htmlFor='fechaCompra' className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></label>
                                        <input type='datetime-local' id='fechaCompra' className="form-control" value={fechaCompra} readOnly={true} onChange={(e) => setFechaCompra(e.target.value)} />
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='descripcion' className='input-group-text'><FontAwesomeIcon icon={faFileText} /></label>
                                        <input type='text' id='descripcion' placeholder='Descripcion' className={`form-control ${erroresC.descripcion.error ? 'is-invalid' : ''}`} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                        {erroresC.descripcion.error && (
                                            <div className="invalid-feedback">
                                                {erroresC.descripcion.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='proveedor' className='input-group-text'><FontAwesomeIcon icon={faTruckField} /></label>
                                        <select id='proveedor' className={`form-control ${erroresC.proveedorSeleccionado.error ? 'is-invalid' : ''}`} value={proveedorSeleccionado} onChange={(e) => setProveedorSeleccionado(e.target.value)}>
                                            <option value=''>Seleccione un proveedor</option>
                                            {proveedores.map((prov) => (
                                                <option key={prov.idProveedor} value={prov.idProveedor}>{prov.nombreProveedor}</option>
                                            ))}
                                        </select>
                                        {erroresC.proveedorSeleccionado.error && (
                                            <div className="invalid-feedback">
                                                {erroresC.proveedorSeleccionado.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <h4 style={{ marginRight: 'auto', }}>Productos</h4>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='idCategoriaProducto' className='input-group-text'><FontAwesomeIcon icon={faList} /></label>
                                        <select id='idCategoriaProducto' className={`form-control ${errores.idCategoriaProducto.error ? 'is-invalid' : ''}`} value={idCategoriaProducto} onChange={(e) => { setIdCategoriaProducto(e.target.value); filtrarProductosPorCategoria(e.target.value); }}>
                                            <option value=''>Seleccione una categoria</option>
                                            {categoriaProductos.map((pro) => (
                                                <option key={pro.idCategoriaProducto} value={pro.idCategoriaProducto}>{pro.nombreCategoria}</option>
                                            ))}
                                        </select>
                                        {errores.idCategoriaProducto.error && (
                                            <div className="invalid-feedback">
                                                {errores.idCategoriaProducto.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='idProducto' className='input-group-text'><FontAwesomeIcon icon={faBagShopping} /></label>
                                        <select
                                            id='productos'
                                            className={`form-control ${errores.productoSeleccionado.error ? 'is-invalid' : ''}`}
                                            value={productoSeleccionado}
                                            onChange={(e) => { setProductoSeleccionado(e.target.value); setIdProducto(e.target.value) }}>
                                            <option value=''>Seleccione un producto</option>
                                            {productosPorCategoria.map((producto) => (
                                                <option key={producto.idProducto} value={producto.idProducto}>{producto.nombreProducto}</option>
                                            ))}
                                        </select>
                                        {errores.productoSeleccionado.error && (
                                            <div className="invalid-feedback">
                                                {errores.productoSeleccionado.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='cantidad' className='input-group-text'><FontAwesomeIcon icon={faHashtag} /></label>
                                        <input type='number' min={0} className={`form-control ${errores.cantidad.error ? 'is-invalid' : ''}`} id='cantidad' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                        {errores.cantidad.error && (
                                            <div className="invalid-feedback">
                                                {errores.cantidad.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='preciocompra' className='input-group-text'><FontAwesomeIcon icon={faCartArrowDown} /></label>
                                        <input type='number' min={0} className={`form-control ${errores.preciocompra.error ? 'is-invalid' : ''}`} id='preciocompra' placeholder='Valor unitario' value={preciocompra} onChange={(e) => setPreciocompra(e.target.value)} />
                                        {errores.preciocompra.error && (
                                            <div className="invalid-feedback">
                                                {errores.preciocompra.mensaje}
                                            </div>
                                        )}
                                    </div>

                                    <div className='input-group mb-3' >
                                        <label htmlFor='precioventa' className='input-group-text'><FontAwesomeIcon icon={faTag} /></label>
                                        <input type='number' min={0} className={`form-control ${errores.precioventa.error ? 'is-invalid' : ''}`} id='precioventa' placeholder='Precio venta' value={precioventa} onChange={(e) => setPrecioventa(e.target.value)} />
                                        {errores.precioventa.error && (
                                            <div className="invalid-feedback">
                                                {errores.precioventa.mensaje}
                                            </div>
                                        )}
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
                                <label htmlFor='total' className='input-group-text'>Total</label>
                                <input type='number' min={0} className="form-control" id='total' value={total} />
                            </div>
                        </form>

                    </div>

                    <div className='col-md-6' >

                        <div id='container1' style={{ maxWidth: '135%', maxHeight: '430px', marginLeft: '-40%', padding: '3%', overflowY: 'auto' }}>
                            <h4>Productos agregados</h4>
                            <table className='table' style={{ width: '100%' }}>
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} >
                                    <tr>
                                        <th>Producto</th>
                                        <th>Valor unitario</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {productosCompra.map((producto, index) => (
                                        <tr key={index}>
                                            <td>{productosCompraName[producto.idProducto]}</td>
                                            <td>{producto.preciocompra}</td>
                                            <td>{producto.cantidad}</td>
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
