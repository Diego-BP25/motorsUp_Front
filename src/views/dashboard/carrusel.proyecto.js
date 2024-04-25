import React from 'react';

const Carrusel = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="https://www.motor.com.co/__export/1648591021037/sites/motor/img/2022/03/29/istock-1325588832.jpg_1548795821.jpg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h5>Aceite</h5>
            <p>Se cambiara el aceite de acuerdo a la viscosidad y el kilometraje.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="https://autolla.co/wp-content/uploads/blog-medir-desgaste-moneda.jpg" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h5>llantas</h5>
            <p>Se mediran las llantas para verficar su uso.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="https://img.freepik.com/foto-gratis/mecanico-que-usa-tableta-digital_1170-1567.jpg?size=626&ext=jpg&ga=GA1.1.1488620777.1708300800&semt=ais" className="d-block w-100" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <h5>Ropa</h5>
            <p>Se utilizara ropa comoda y adecuada para los trabajos.</p>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carrusel;
