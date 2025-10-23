import React, { useEffect } from 'react';

const DiventareVolontario = () => {
  useEffect(() => {
    document.title = "DIVENTA UNO DI NOI";
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-3">DIVENTA UNO DI NOI</h2>
      <div className="row g-4 align-items-stretch">
        <div className="col-md-6">
          <div className="volontario-showcase h-100">
            <div className="volontario-showcase__media">
              <img
                className="volontario-showcase__img"
                src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761251973/CERCHIAMO_INFERMIERI_jywywx.jpg"
                alt="Diventa volontario - Croce d'Oro Sud Pontino"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <p className="text-muted mb-4">Vuoi entrare a far parte della nostra Associazione? Compila il modulo di iscrizione, partecipa al colloquio e inizia il tuo percorso con noi!</p>
              <a href="/moduli/modulo-iscrizione.pdf" className="btn btn-primary" download>
                Scarica modulo di iscrizione (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiventareVolontario;

