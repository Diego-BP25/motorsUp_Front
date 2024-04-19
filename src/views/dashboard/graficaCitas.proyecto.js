import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const GraficaCitas = () => {
  const [agendamientos, setAgendamientos] = useState([]);

  useEffect(() => {
    getAgendamientos();
  }, []);

  const getAgendamientos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:8081/api/agendamientos', {});
      setAgendamientos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener las citas:', error.message);
    }
  };

  // Función para filtrar agendamientos de la semana actual
  const filterCurrentWeekAgendamientos = () => {
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); 
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); 

    return agendamientos.filter(agendamiento => {
      const agendamientoDate = new Date(agendamiento.fecha);
      return agendamientoDate >= currentWeekStart && agendamientoDate <= currentWeekEnd;
    });
  };

  // Función para contar agendamientos por día de la semana
  const countAgendamientosByDay = () => {
    const currentWeekAgendamientos = filterCurrentWeekAgendamientos();
    const countByDay = {};

    currentWeekAgendamientos.forEach(agendamiento => {
      const agendamientoDate = new Date(agendamiento.fecha);
      const dayOfWeek = agendamientoDate.getDay(); // 
      countByDay[dayOfWeek] = (countByDay[dayOfWeek] || 0) + 1;
    });

    return countByDay;
  };

  // Generar datos para la gráfica
  const generateChartData = () => {
    const countByDay = countAgendamientosByDay();
    const data = [];

    for (let i = 0; i < 7; i++) {
      data.push({ name: getDayName(i), value: countByDay[i] || 0 });
    }

    return data;
  };

  // Obtener el nombre del día de la semana
  const getDayName = (dayIndex) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return days[dayIndex];
  };

  const data = generateChartData();

  return (
    <>
      <div className="card card-warning">
        <div className="card-header">
          <div className="card-tools">
            <button type="button" className="btn btn-tool" data-card-widget="collapse">
              <i className="fas fa-minus" />
            </button>
          </div>
          <h3 className="card-title">Citas Atendidas</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
          <p>
            <strong>Total de Citas:</strong> {data.reduce((total, day) => total + day.value, 0)}
          </p>
        </div>
      </div>
    </>
  );
};

export default GraficaCitas;
