import React, { useState, useEffect } from 'react';
import Carrusel from './carrusel.proyecto';
const Inicio = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const local = new Date();
            const day = local.getDate();
            const month = local.getMonth();
            const year = local.getFullYear();
            const timeString = local.toLocaleTimeString();
            const dateString = `${day} ${monthNames[month]} ${year}`;

            setCurrentTime(timeString);
            setCurrentDate(dateString);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <>
        <div>
            <Carrusel/>
        </div>
        <div className="container-clock">
            <h1 id="time">{currentTime}</h1>
            <p id="date">{currentDate}</p>
        </div>
        </>
    );
};

export default Inicio;
