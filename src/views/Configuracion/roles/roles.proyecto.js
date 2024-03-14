import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from 'src/fuctions.proyecto'
import '@fortawesome/fontawesome-free'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MUIDataTable from "mui-datatables";
import { faEdit, faTrash, faPlusCircle, faFloppyDisk,faComment } from '@fortawesome/free-solid-svg-icons'

const Roles = () => {

  const url = 'http://localhost:8081/api/roles'
  const [rol, setRol] = useState([])
  const [idRol, setIdRol] = useState('')
  const [nombre, setNombre] = useState('')
  const [operation, setOperation] = useState(1)
  const [title, setTitle] = useState('')
  const [actualizacion, setActualizacion] = useState(false)


  useEffect(() => {
    getRoles()
    setActualizacion(false)
  }, [actualizacion ? rol : null])



  const getRoles = async () => {
    try {
      const respuesta = await axios.get(url, {})
      setRol(await respuesta.data)

    } catch (error) {
      console.error('Error al obtener los roles:', error.message)
    }
  }

  const openModal = (op, idRol, nombre) => {
    setIdRol('');
    setNombre('');

    if (op === 1) {
      setTitle('Registrar Rol')
    }
    else if (op === 2) {
      setTitle('Editar Rol')
      setIdRol(idRol);
      setNombre(nombre);
    }
    setOperation(op)
    window.setTimeout(function () {
      document.getElementById('idRol').focus();
    }, 500);
  }

  const validar = () => {
    var parametros;
    var metodo;


    if (operation === 1) {
      console.log(idRol)
      parametros = { idRol: idRol, nombre: nombre };
      metodo = 'POST';
    } else {
      console.log(idRol)
      parametros = { idRol: idRol, nombre: nombre };
      metodo = 'PUT';
    }
    enviarSolicitud(metodo, parametros);
  }

  const enviarSolicitud = async (metodo, parametros) => {
    await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
      var tipo = respuesta.data[0];
      if (metodo === 'POST') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Rol agregada con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      } else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Rol editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Rol eliminado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('btnCerrar').click();
      }

      setActualizacion(true)

      if (tipo === 'success') {
        document.getElementById('btnCerrar').click();
        getRoles();
      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteRol = (idRol) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este Rol?',
      icon: 'question', text: 'No podra activar nuevamente el Rol',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdRol(idRol);
        enviarSolicitud('DELETE', { idRol: idRol });
      } else {
        show_alerta('El Rol no fue eliminad0', 'info')
      }
    });

  }



  const columns = [
    {
      name: "idRol",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "nombre",
      label: "Nombre",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: 'Acciones',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const row = tableMeta.rowData;
          return (
            <>
              <button onClick={() => openModal(2, row[0], row[1])} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalRoles'>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              &nbsp;
              <button onClick={() => deleteRol(row[0])} className='btn btn-danger'>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          );
        }
      }
    },
  ];




  // const columns = [
  //   { name: 'ID', selector: row => row.idRol, sortable: true },
  //   { name: 'Nombre', selector: row => row.nombre, sortable: true },
  //   {
  //     name: 'Acciones',
  //     cell: row => (
  //       <>
  //         <button onClick={() => openModal(2, row.idRol, row.nombre)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalRoles'>
  //           <FontAwesomeIcon icon={faEdit} />
  //         </button>
  //         &nbsp;
  //         <button onClick={() => deleteRol(row.idRol)} className='btn btn-danger'>
  //           <FontAwesomeIcon icon={faTrash} />
  //         </button>
  //       </>
  //     ),
  //   },
  // ];

  // const customStyles = {
  //   headCells: {
  //     style: {
  //       border: '1px solid #000000',
  //       fontWeight: 'bold',
  //     },
  //   },
  //   cells: {
  //     style: {
  //       border: '1px solid #dee2e6',
  //     },
  //   },
  // };

  const options = {
    selectableRows: false
  };



  return (

    <div className='App'>
      <div className='container-fluid'>
        <div className='row mt-4'>
          <div style={{ display: 'flex', alignItems: 'center' }} id="Container">
            <div className='col-md-4 offset-md-5' >
              <h1>Roles</h1>
            </div>

            <div style={{ marginRight: 'auto' }}>
              <button onClick={() => openModal(1)} className='btn btn-success btn-custom' data-bs-toggle='modal' data-bs-target='#modalRoles'>
                <FontAwesomeIcon icon={faPlusCircle} /> Añadir
              </button>
            </div>
          </div>


          <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
            <MUIDataTable
              data={rol}
              columns={columns}
              options={options}
            />
            {/* <DataTable
              title=""
              columns={columns}
              data={rol}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              striped
              highlightOnHover

            /> */}
          </div>
        </div>
      </div>
      <div id='modalRoles' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
            </div>
            <div className='modal-body'>
              <input type='hidden' id='id' ></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='idRol' className='form-control' placeholder='ID' value={idRol} onChange={(e) => setIdRol(e.target.value)}></input>
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><FontAwesomeIcon icon={faComment} /></span>
                <input type='text' id='nombre' className='form-control' placeholder='Nombre Rol' value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
              </div>
              <div className='d-grid col-6 mx-auto'>
                <button onClick={() => validar()} className='btn btn-success'>
                  <FontAwesomeIcon icon={faFloppyDisk} /> Guardar
                </button>
              </div>
            </div>
            <div className='modal-footer'>
              <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roles