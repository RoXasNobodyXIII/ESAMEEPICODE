import React, { useEffect } from 'react';

const Mezzi = () => {
  useEffect(() => {
    document.title = "MEZZI";
  }, []);

  return (
    <>
      <section className="mezzi-hero-full">
        <span className="visually-hidden" role="img" aria-label="Parco mezzi della Croce d'Oro Sud Pontino"></span>
      </section>

      <div className="container mt-5">
        <h2 className="mb-3">I NOSTRI MEZZI</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-3">
              La nostra Associazione dispone di:
            </p>
            <ul className="mb-0">
              <h5 className="list-title">-3 Ambulanze</h5>
              <li>2 Peugeot Boxer</li>
              <li>1 Fiat Ducato</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mezzi;

