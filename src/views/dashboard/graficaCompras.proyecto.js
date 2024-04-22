import React, { PureComponent, useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'


const GraficaCompras = () => {


  const [compras, setCompras] = useState([])

  useEffect(() => {
    getCompras()
    }, []);

  const getCompras = async () => {
    try {
      const fecha_actual = new Date();
      const mes_actual = fecha_actual.getMonth() + 1; // Obtener el mes actual
      const anio_actual = fecha_actual.getFullYear(); // Obtener el año actual
  
      const respuesta = await axios.get('http://localhost:8081/api/compras', {});
      const comprasMensuales = respuesta.data.filter(compra => {
        const fechaCompra = new Date(compra.fechaCompra);
        return fechaCompra.getMonth() + 1 === mes_actual && fechaCompra.getFullYear() === anio_actual && compra.estadoCompra == true;
      });
  
      console.log(comprasMensuales);
      setCompras(comprasMensuales); // Esto parece ser una llamada a una función que asigna las compras mensuales a algún estado o variable en tu aplicación
  
    } catch (error) {
      console.error('Error al obtener las compras:', error.message);
    }
  };

  const data = compras.map(item =>({
    name: item.descripcionCompra, total: item.total
}));





  return (
    <div className="card card-warning" style={{marginBottom: '8%'}}>
      <div className="card-header">
        <div className="card-tools">
          <button type="button" className="btn btn-tool" data-card-widget="collapse">
            <i className="fas fa-minus" />
          </button>
        </div>
        <h3 className="card-title">Compras Mensuales</h3>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <p>
          <strong>Total de Compras:</strong> {data.length}
        </p>
      </div>
    </div>
  );

}
export default GraficaCompras;
