import React from 'react';
import CIcon from '@coreui/icons-react'
import { cilCart } from '@coreui/icons'
import Reportes from './reportes.proyecto';
import GraficaCompras from './graficaCompras.proyecto';
import GraficaVentas from './graficaVentas.proyecto'
import GraficaProductos from './graficaProductos.proyecto';
import GraficaCitas from './graficaCitas.proyecto';
const Dashboard = () => {
 

  return (
    <>
      <div className="row" style={{marginBottom:'4%'}}>
        <Reportes/>
      </div>
      <div className='scrollDashBoard'>
            <div className="content-wrapper">
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <GraficaVentas />
                            </div>
                            <div className="col-md-6">
                                <GraficaCompras />
                            </div>
                            <div className="col-md-6">
                            <GraficaProductos />
                            </div>

                            <div className="col-md-6">
                            <GraficaCitas />
                            </div>
                           
                        </div>
                    </div>
                </section >
            </div>
        </div>

    </>
  );
};

export default Dashboard;
