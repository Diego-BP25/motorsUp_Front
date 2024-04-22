import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { curveCardinal } from 'd3-shape';
import axios from 'axios'



const GraficaVentas = () => {
   
    const [ventas, setVentas] = useState([])

    const data = ventas.map(item =>({
        name: item.metodoPago, total: item.total
    }));



    useEffect(() => {
        getVentas()
    }, []);


const getVentas = async () => {
  try {
    const fecha_actual = new Date();
    const mes_actual = fecha_actual.getMonth() + 1; // Obtiene el mes actual (los meses en JavaScript van de 0 a 11)
    const anio_actual = fecha_actual.getFullYear(); // Obtiene el año actual

    const respuesta = await axios.get('http://localhost:8081/api/ventas', {});
    const ventasMensuales = respuesta.data.filter(venta => {
      const fechaVenta = new Date(venta.fecha);
      return fechaVenta.getMonth() + 1 === mes_actual && fechaVenta.getFullYear() === anio_actual && venta.estado === true;
    });

    setVentas(ventasMensuales); 

  } catch (error) {
    console.error('Error al obtener las ventas:', error.message);
  }
};




    const cardinal = curveCardinal.tension(0.2);

    return (
        <>

            <div className="card card-warning" style={{marginBottom: '8%'}}>
                <div className="card-header">
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus" />
                        </button>
                    </div>
                    <h3 className="card-title">Ventas Mensuales</h3>
                </div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                    
                            <Area type={cardinal} dataKey="total" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <p>
                        <strong>Total de Ventas:</strong> {data.length}
                    </p>
                </div>
            </div>
        </>
    );
};

export default GraficaVentas;