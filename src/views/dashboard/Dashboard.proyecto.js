import React, { useEffect, useRef, useState } from 'react'

const Dashboard = () => {


 
  
  return (
    <div className="card card-warning">
        <div className="card-header">
        <div className="card-tools">
        <button type="button" className="btn btn-tool" data-card-widget="collapse">
         <i className="fas fa-minus" />
         </button>
        </div>
        <h3 className="card-title"> Productos más vendidos</h3>

        </div>
       

        <div className="card-body"> 
        <canvas  style={{ minHeight: 350, height: 350, maxHeight: 350, maxWidth: '100%' }} />
      <p><strong>Total de productos:</strong> </p>
       
     </div>
    </div>
  )
}

export default Dashboard
