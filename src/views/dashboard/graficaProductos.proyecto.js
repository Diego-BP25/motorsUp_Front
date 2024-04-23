import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios'

const GraficaProductos = () => {
    const [productos, setProductos]= useState([])
    const data = productos.map(item =>({
        name: item.nombreProducto, value: item.saldoExistencias
    }));
    const dataa = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
      ];

      useEffect(() => {
        getProductos()
      }, []);

      const getProductos = async () => {
        try {
          
          const respuesta = await axios.get('http://localhost:8081/api/productos', {})
          
          setProductos(respuesta.data)
        } catch (error) {
          console.error('Error al obtener las ventas:', error.message)
        }
      }
    return (
        <>
            <div className="card card-warning">
                <div className="card-header">
                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus" />
                        </button>
                    </div>
                    <h3 className="card-title">Productos en Stock</h3>
                </div>
                <div className="card-body">
                <ResponsiveContainer width="100%" height={350}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="pink"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
                    <p>
                        <strong>Total de Productos:</strong> {data.length}
                    </p>
                </div>
            </div>
        </>
    );
};

export default GraficaProductos;