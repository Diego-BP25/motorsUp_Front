import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar, dayjsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import dayjs from 'dayjs'
import "dayjs/locale/es";

dayjs.locale("es");

const Agendamientos = () => {

  const url = 'http://localhost:8081/api/agendamientos'
  const [agendamiento, setAgendamiento] = useState([])
  const [SelectedDate, setSelectedDate] = useState(null);


  useEffect(() => {
    getAgendamientos()
  }, [])

  const getAgendamientos = async () => {
    try {
      const response = await axios.get(url)
      setAgendamiento(response.data)
    } catch (error) {
      console.error('Error al obtener los Agendamientos:', error.message)
    }
  }

  const localizer = dayjsLocalizer(dayjs)
  
  const events = agendamiento.map(item => ({
    start: dayjs(item.fecha).toDate(), 
    end: dayjs(item.fecha).add(1, 'hour').toDate(), 
    title: item.vehiculos_placa 
  }))

  return (
    <div style={{
      height: "95vh",
      width: "70vw"
    }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
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
    </div>
  )
}

export default Agendamientos
