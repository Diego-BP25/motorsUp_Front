import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from 'dayjs'
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { faUserGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
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

  //Vehiculos
  const [vehiculos, setVehiculos] = useState([])
  const [placa, setPlaca] = useState('')
  const [consecutivo, setConsecutivo] = useState(0);

  useEffect(() => {
    getAgendamientos()
    getVehiculos()

  }, [])

  useEffect(() => {
    if (actualizacion) {
      getAgendamientos();
      setShowModal(false);
      setShowModalEdit(false);
      window.location.reload();
    }
  }, [actualizacion]);


  useEffect(() => {
    if (operation === 1) {
      obtenerIdConsecutivo();
    }
  }, [operation]);


  const obtenerIdConsecutivo = async () => {
    try {
      const respuesta = await axios.get(url);
      const agendamiento = respuesta.data;
      if (agendamiento.length > 0) {
        const maxId = Math.max(...agendamiento.map(c => c.idAgendamiento));
        setConsecutivo(maxId + 1);
      } else {
        setConsecutivo(1);
      }
    } catch (error) {
      console.error('Error al obtener el número consecutivo más alto:', error.message);
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

  const SeleccionarDia = (slotInfo) => {
    setShowModal(true);
    setSelectedDate(slotInfo.start);
    setSelectEvent(null);
    setIdAgendamiento(''); 
    setPlaca(''); 
    setHora(dayjs('').format('HH:mm'));
  };
  const SeleccionarEvento = (event) => {
    setShowModalEdit(true);
    setSelectEvent(event);
    setIdAgendamiento(event.id); 
    setPlaca(event.title); 
    const nuevaHora = dayjs(event.start).add(5, 'hour').format('HH:mm');
    setHora(nuevaHora); 
  };
  




  const localizer = dayjsLocalizer(dayjs)

  const events = agendamiento.map(item => ({
    start: dayjs(item.fecha).toDate(),
    end: dayjs(item.fecha).add(1, 'hour').toDate(),
    title: item.vehiculos_placa,
    id: item.idAgendamiento
  }))

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


      parametros = { idAgendamiento: consecutivo, fecha: fechaHora, vehiculos_placa: placa };

      console.log(parametros)
      metodo = 'POST';
      setActualizacion(false);
      setTimeout(() => setActualizacion(true), 1000);
    } else if (operation === 2) {

      parametros = {idAgendamiento: id, fecha: `${dayjs(selectEvent.start).format('YYYY-MM-DD')} ${hora}`, vehiculos_placa: placa};
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Agendamiento agregado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        // document.getElementById('btnCerrar').click();
      }
       else if (metodo === 'PUT') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Agendamiento editado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        // document.getElementById('btnCerrar').click();
      }
      if (metodo === 'DELETE') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Agendamiento eliminado con exito",
          showConfirmButton: false,
          timer: 1500
        });
        // document.getElementById('btnCerrar').click();
      }

   

      if (tipo === 'success') {
        // document.getElementById('btnCerrar').click();
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
            right: 0,
          }}
        >
          <div className='modal-dialog modal-dialog-centered'>
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

                <div className='input-group mb-3'>
                  {/* <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span> */}
                  <input
                    type='text'
                    id='id'
                    className='form-control'
                    placeholder='ID'
                    value={consecutivo}
                    onChange={(e) => setIdAgendamiento(e.target.value)}
                    hidden
                  />
                </div>

                <div className='input-group mb-3'>
                  <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                  <select id='placa' className='form-select' value={placa} onChange={(e) => setPlaca(e.target.value)} style={{ marginRight: '12px' }}>
                    <option value='' disabled>Vehiculo</option>
                    {vehiculos.map((v) => (
                      <option key={v.placa} value={v.placa}>{v.placa}</option>
                    ))}
                  </select>
                  <button className='botones-azules' data-bs-toggle='modal' data-bs-target='#modalEmpleados'  >
                    <FontAwesomeIcon icon={faPlusCircle} /> Añadir
                  </button>
                </div>

                <div className='input-group mb-3'>
                  <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                  <input
                    type='time'
                    id='horaInicio'
                    className='form-control'
                    placeholder='Hora'
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
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
          <div className='modal-dialog modal-dialog-centered'>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Editar Agendamiento
                </h5>
                <button
                  id="btnCerrar"
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

                <div className='input-group mb-3'>
                  
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
                  <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                  <select id='placa' className='form-select' value={placa} onChange={(e) => setPlaca(e.target.value)} style={{ marginRight: '12px' }}>
                    <option value='' disabled>Vehiculo</option>
                    {vehiculos.map((v) => (
                      <option key={v.placa} value={v.placa}>{v.placa}</option>
                    ))}
                  </select>
                </div>

                <div className='input-group mb-3'>
                  <span className='input-group-text'><FontAwesomeIcon icon={faUserGear} /></span>
                  <input
                    type='time'
                    id='horaInicio'
                    className='form-control'
                    placeholder='Hora'
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                  />
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