import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from 'dayjs'
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { faUserGear, faPlusCircle, faCalendar, faMotorcycle, faScrewdriverWrench, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { show_alerta } from 'src/fuctions.proyecto'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



dayjs.locale("es");

const Agendamiento = () => {
  const url = 'http://localhost:8081/api/agendamientos'
  const [agendamiento, setAgendamiento] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [selectEvent, setSelectEvent] = useState(null);
  const [hora, setHora] = useState("");
  const [id, setIdAgendamiento] = useState("");
  const [operation, setOperation] = useState(1)
  const [actualizacion, setActualizacion] = useState(false)
  const [selectedDateEdit, setSelectedDateEdit] = useState(null);


  //Vehiculos
  const [vehiculos, setVehiculos] = useState([])
  const [placa, setPlaca] = useState('')

  //Servicios
  const [servicios, setServicios] = useState([])
  const [idServicio, setIdServicio] = useState('')
  const [descripcion, setDescripcionServicio] = useState('');




  //Detalles
  const [mostrarServicio, setMostrarServicio] = useState([]);
  const [agendamientoServicios, setAgendamientoServicios] = useState([]);
  const getServiciosAsociados = async (idAgendamiento) => {


    try {
      // Obtener los detalles del agendamiento
      const response = await axios.get(`http://localhost:8081/api/agendamientos/${idAgendamiento}`);
      const detallesAgendamiento = response.data.detalleAgendamiento;

      // Cargar todos los servicios
      const responseServicios = await axios.get(`http://localhost:8081/api/servicio`);
      const servicios = responseServicios.data;

      // Mapear los nombres de los servicios a los detalles del agendamiento
      const detallesActualizados = detallesAgendamiento.map(detalle => {
        const servicio = servicios.find(servicio => servicio.idServicio == detalle.servicios_idServicio);
        return {
          ...detalle,
          nombreServicio: servicio ? servicio.nombreServicio : "Servicio no encontrado"
        };
      });


      setMostrarServicio(detallesActualizados);

    } catch (error) {
      console.error('Error al obtener los servicios asociados:', error.message);
    }
  };



  const eliminarServicio = (index) => {
    const nuevosServicios = [...agendamientoServicios];
    nuevosServicios.splice(index, 1);
    setAgendamientoServicios(nuevosServicios);

  };

  const eliminarServicioMostrar = async (idDetalleServicioAgendamiento) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/agendamientos/${idDetalleServicioAgendamiento}`);

      if (response.status !== 200) {
        throw new Error('Error al eliminar el servicio');
      }

      const nuevosServicios = mostrarServicio.filter(servicio => servicio.idDetalleServicioAgendamiento !== idDetalleServicioAgendamiento);
      setMostrarServicio(nuevosServicios);
      console.log(nuevosServicios);
    } catch (error) {
      console.error('Error al eliminar el servicio:', error.message);
    }
  };

  const eliminarServicioAgendamiento = (index) => {
    const nuevosServicios = [...agendamientoServicios];
    nuevosServicios.splice(index, 1);
    setAgendamientoServicios(nuevosServicios);
    console.log(nuevosServicios)
  };


  useEffect(() => {
    getAgendamientos()
    getVehiculos()
    getServicios()

  }, [])

  useEffect(() => {
    if (actualizacion) {
      getAgendamientos();
      setShowModal(false);
      setShowModalEdit(false);
      //window.location.reload();
    }
  }, [actualizacion]);

  const seleccionarServicio = (idServicio) => {
    setIdServicio(idServicio);

    const selectedServicio = servicios.find(s => s.idServicio == idServicio);
    if (selectedServicio) {
      setDescripcionServicio(selectedServicio.descripcion);
    } else {
      setDescripcionServicio("");
    }
  };


  const getAgendamientos = async () => {
    try {
      const response = await axios.get(url)
      setAgendamiento(response.data)
    } catch (error) {
      console.error('Error al obtener los Agendamientos:', error.message)
    }
  }

  const getVehiculos = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/vehiculo')
      setVehiculos(response.data)
    } catch (error) {
      console.error('Error al obtener los vehiculos:', error.message)
    }
  }

  const getServicios = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/servicio')
      setServicios(response.data)
    } catch (error) {
      console.error('Error al obtener los servicios:', error.message)
    }
  }

  const SeleccionarDia = (slotInfo) => {
    setShowModal(true);
    setSelectedDate(slotInfo.start);
    setSelectEvent(null);
    setIdAgendamiento('');
    setPlaca('');
    setDescripcionServicio('');
    setIdServicio('');
    setAgendamientoServicios([]);
    setHora(dayjs('').format('HH:mm'));
  };
  const SeleccionarEvento = (event) => {

    setShowModalEdit(true);
    setSelectEvent(event);
    setIdAgendamiento(event.id);
    setPlaca(event.title);
    const nuevaHora = dayjs(event.start).add(5, 'hour').format('HH:mm');
    setHora(nuevaHora);
    setSelectedDateEdit(event.start);
    getServiciosAsociados(event.id)

  };

  const localizer = dayjsLocalizer(dayjs)

  const eventosFiltrados = agendamiento.filter(item => item.estado);

  const events = eventosFiltrados.map(item => ({
    start: dayjs(item.fecha).toDate(),
    end: dayjs(item.fecha).add(1, 'hour').toDate(),
    title: item.vehiculos_placa,
    id: item.idAgendamiento
  }));

  const validar = (operation) => {
    var parametros;
    var metodo;


    if (operation === 1) {
      const fechaHora = selectedDate ? `${dayjs(selectedDate).format('YYYY-MM-DD')} ${hora}` : null;
      if (!fechaHora) {
        console.error('Por favor selecciona una fecha.');
        return;
      }

      const eventoExistente = agendamiento.find(item => dayjs(item.fecha).format('YYYY-MM-DD HH:mm') === fechaHora);
      if (eventoExistente) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya hay un agendamiento registrado para la misma hora en este día.',
        });
        return;
      }


      parametros = { estado: true,  fecha: fechaHora, vehiculos_placa: placa, detalleAgendamientos: agendamientoServicios };

      console.log(parametros)
      metodo = 'POST';
      setActualizacion(false);
      setTimeout(() => setActualizacion(true), 1000);
    } else if (operation === 2) {

      const fechaHora = selectedDateEdit ? `${dayjs(selectedDateEdit).format('YYYY-MM-DD')} ${hora}` : null;
    if (!fechaHora) {
      console.error('Por favor selecciona una fecha.');
      return;
    }
      parametros = { idAgendamiento: id, fecha: fechaHora, vehiculos_placa: placa, detalleAgendamiento: agendamientoServicios };
      metodo = 'PUT';
      setActualizacion(false);
      setTimeout(() => setActualizacion(true), 1000);
      console.log(parametros)
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
          title: "Agendamiento agregado con exito"
        });
        // document.getElementById('btnCerrar').click();
      }
      else if (metodo === 'PUT') {
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
          title: "Agendamiento editado con exito"
        });
        // document.getElementById('btnCerrar').click();
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
          title: "Agendamiento eliminado con exito"
        });
        setActualizacion(false);
      setTimeout(() => setActualizacion(true), 1000);
        // document.getElementById('btnCerrar').click();
      }



      if (tipo === 'success') {

      }
    })
      .catch(function (error) {
        show_alerta('Error en la solicitud', 'error');
        console.log(error);
      });
  }

  const deleteAgendamiento = (idAgendamiento) => {

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: '¿Seguro de eliminar este Agendamiento?',
      icon: 'question', text: 'No podra activar nuevamente el Agendamiento',
      showCancelButton: true, confirmButtonText: 'Aceptar', cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setIdAgendamiento(idAgendamiento);
        enviarSolicitud('DELETE', { idAgendamiento: id });
      } else {
        show_alerta('El agendamiento no fue eliminado', 'info')
      }
    });

  }

  const agregarServicio = () => {
    const servicioSeleccionado = servicios.find(servicio => servicio.idServicio == idServicio);
    if (idServicio && descripcion && servicioSeleccionado) {
      const nombreServicio = servicioSeleccionado.nombreServicio;
      setAgendamientoServicios([...agendamientoServicios, { idServicio, descripcion, nombreServicio }]);
      setDescripcionServicio('');
      setIdServicio('');
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Debe de seleccionar un servicio para agendar',
      });
    }
  }





  return (
    <div style={{ height: "500px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "50px" }}
        selectable={true}
        onSelectSlot={SeleccionarDia}
        onSelectEvent={SeleccionarEvento}
        messages={{
          allDay: 'Todo el día',
          previous: 'Anterior',
          next: 'Siguiente',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          showMore: total => `+ Ver más (${total})`
        }}

      />

      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <div className='modal-dialog modal-dialog-centered' style={{ maxWidth: '55%', maxHeight: '200%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Agregar Agendamiento
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEventTitle("");
                    setSelectEvent(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <section className="col-md-6">

                    <div className='input-group '>
                      {/* <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span> */}
                      <input
                        type='text'
                        id='id'
                        className='form-control'
                        placeholder='ID'
                        value={id}
                        onChange={(e) => setIdAgendamiento(e.target.value)}
                        hidden
                      />
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><FontAwesomeIcon icon={faMotorcycle} /></span>
                      <select id='placa' className='form-select' value={placa} onChange={(e) => setPlaca(e.target.value)} style={{ marginRight: '12px' }}>
                        <option value=''>Vehiculo</option>
                        {vehiculos.map((v) => (
                          <option key={v.placa} value={v.placa}>{v.placa}</option>
                        ))}
                      </select>
                      <button className='botones-azules'>
                        <FontAwesomeIcon icon={faPlusCircle} /> Añadir
                      </button>
                    </div>

                    <div className='input-group mb-3' >
                      <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                      <input
                        disabled
                        type='text'
                        className='form-control'
                        placeholder="Dia"
                        style={{ marginRight: '12px' }}
                        value={dayjs(selectedDate).format('DD/MM/YYYY')}
                      />
                      <input
                        type='time'
                        id='horaInicio'
                        className='form-control'
                        placeholder='Hora'
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                      />
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><FontAwesomeIcon icon={faScrewdriverWrench} /></span>
                      <select id='idServicio' className='form-select' value={idServicio} onClick={(e) => seleccionarServicio(e.target.value)} onChange={(e) => setIdServicio(e.target.value)} style={{ marginRight: '12px' }}>
                        <option value='' disabled>Servicios</option>
                        {servicios.map((s) => (
                          <option key={s.idServicio} value={s.idServicio}>{s.nombreServicio}</option>
                        ))}
                      </select>
                      <button className='botones-azules' onClick={() => agregarServicio()}  >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </button>
                    </div>

                    <div className='input-group mb-3'>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={descripcion}
                        onChange={(e) => setDescripcionServicio(e.target.value)}
                        disabled
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>
                  </section>

                  <section className="col-md-6" >


                    <div style={{ maxWidth: '135%', maxHeight: '200%', padding: '3%', overflow: 'auto' }}>
                      <h4>Servicios Agregados</h4>
                      <table className='table'>
                        <thead style={{ position: 'center', top: 0, backgroundColor: 'white' }} >
                          <tr >

                            <th>Servicio</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody >
                          {agendamientoServicios.map((agendamiento, index) => (
                            <tr key={index} >
                              <td>{agendamiento.nombreServicio}</td>
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

                  </section>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="botones-azules"
                  onClick={() => validar(1)}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {showModalEdit && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className='modal-dialog modal-dialog-centered' style={{ maxWidth: '55%', maxHeight: '200%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Editar Agendamiento
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModalEdit(false);
                    setEventTitle("");
                    setSelectEvent(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <section className="col-md-6">

                    <div className='input-group '>
                      {/* <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span> */}
                      <input
                        type='text'
                        id='id'
                        className='form-control'
                        placeholder='ID'
                        value={id}
                        onChange={(e) => setIdAgendamiento(e.target.value)}
                        hidden
                      />
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><FontAwesomeIcon icon={faMotorcycle} /></span>
                      <input id='placa' className='input-group-text' disabled value={placa}>
                      </input>
                    </div>

                    <div className='input-group mb-3' >
                      <span className='input-group-text'><FontAwesomeIcon icon={faCalendar} /></span>
                      <input
  type='date'
  className='form-control'
  placeholder="Dia"
  style={{ marginRight: '12px' }}
  value={selectedDateEdit ? dayjs(selectedDateEdit).format('YYYY-MM-DD') : ''}
  onChange={(e) => setSelectedDateEdit(dayjs(e.target.value))}
/>
                      <input
                        type='time'
                        id='horaInicio'
                        className='form-control'
                        placeholder='Hora'
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                      />
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><FontAwesomeIcon icon={faScrewdriverWrench} /></span>
                      <select id='idServicio' className='form-select' value={idServicio} onClick={(e) => seleccionarServicio(e.target.value)} onChange={(e) => setIdServicio(e.target.value)} style={{ marginRight: '12px' }}>
                        <option value='' disabled>Servicios</option>
                        {servicios.map((s) => (
                          <option key={s.idServicio} value={s.idServicio}>{s.nombreServicio}</option>
                        ))}
                      </select>
                      <button className='botones-azules' onClick={() => agregarServicio()}  >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </button>
                    </div>

                    <div className='input-group mb-3'>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={descripcion}
                        onChange={(e) => setDescripcionServicio(e.target.value)}
                        disabled
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>
                  </section>

                  <section className="col-md-6" >


                    <div style={{ maxWidth: '135%', maxHeight: '200%', padding: '3%', overflow: 'scroll' }}>
                      <h4>Servicios Agregados</h4>
                      <table className='table'>
                        <thead style={{ position: 'center', top: 0, backgroundColor: 'white' }} >
                          <tr >

                            <th>Servicio</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody >
                          {mostrarServicio.map((agendamiento) => (
                            <tr key={agendamiento.idDetalleServicioAgendamiento}>
                              <td>{agendamiento.nombreServicio}</td>
                              <td>
                                <button
                                  type='button'
                                  onClick={() => eliminarServicioMostrar(agendamiento.idDetalleServicioAgendamiento)}
                                  className='btn btn-danger'
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {agendamientoServicios.map((agendamiento, index) => (
                            <tr key={index} >
                              <td>{agendamiento.nombreServicio}</td>
                              <td>
                                <button
                                  type='button'
                                  onClick={() => eliminarServicioAgendamiento(index)}
                                  className='btn btn-danger'>
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </section>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="botones-azules"
                  onClick={() => validar(2)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="botones-rojos"
                  onClick={() => deleteAgendamiento(id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Agendamiento;