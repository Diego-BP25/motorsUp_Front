import { Calendar, dayjsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import dayjs from 'dayjs'
import "dayjs/locale/es";
import React, {useState} from 'react'

//Cambio a español
dayjs.locale("es");

function App() {
  //localizer formato para cambiar las fechas para que las reconozca el big calendar 
  const localizer = dayjsLocalizer(dayjs)
  const [setEvents] = useState([])
  const messages = {
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
  };

  const events =[
    //Eventos del calendario
    {
      start: dayjs('2024-02-28T12:00:00').toDate(),
      end:  dayjs('2024-02-28T13:00:00').toDate(),
      title: "UZI95F"
    },
    {
      start: dayjs('2024-02-25T15:00:00').toDate(),
      end:  dayjs('2024-02-25T18:00:00').toDate(),
      title: "HBB20G"
    },
    {
      start: dayjs('2024-02-25T22:00:00').toDate(),
      end:  dayjs('2024-02-25T23:00:00').toDate(),
      title: "JVM88G"
    },
    {
      start: dayjs('2024-02-25T22:00:00').toDate(),
      end:  dayjs('2024-02-25T23:00:00').toDate(),
      title: "JVM88G"
    }
    
  ]
  return(
    <div style={
      //Sirve para definir los estilos del calendario en este caso el tamaño
      {
        height: "95vh",
        width: "70vw"
      }
    }>
      
      <Calendar
        localizer={localizer}
        events={events}
        messages={messages}
        
        //Seleccionar vistas en este caso solo se filtra por mes
        //views={["month"]}
        //Filtro de Mes y Dias
        //views={["month","day"]}

        //Sirve para definir la vista por defecto del calendario al recargar la pagina
        //En este caso por dia
        //defaultView="day"

        //Filtro de tiempo por dia
        min={dayjs('2024-02-25T8:00:00').toDate()}
        max={dayjs('2024-02-25T17:00:00').toDate()}
      />
    </div>
  )
}
export default App