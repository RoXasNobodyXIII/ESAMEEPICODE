import React, { useEffect } from 'react';

const RichiedereServizio = () => {
  useEffect(() => {
    document.title = "Come richiedere il servizio";
  }, []);

  const waUrl = 'https://wa.me/393663283199';

  return (
    <div className="container richiesta-page">
      <h2>Come richiedere il servizio</h2>
      <div className="alert alert-warning py-2" role="alert">
        <strong>Importante:</strong> Precisiamo che, in caso di emergenza, la chiamata deve essere effettuata al numero nazionale <strong>112</strong>.
      </div>

      <div className="richiesta-layout">
        <div className="richiesta-image-wrap">
          <img
            className="richiesta-image"
            src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761056754/IMG-20251020-WA0029_hmhkmq.jpg"
            alt="Richiedere il servizio - Croce d'Oro Sud Pontino"
            loading="lazy"
          />
        </div>
        <div className="richiesta-card card">
          <div className="card-body p-2 text-center">
            <h3 className="card-title mb-1">Contatti</h3>
            <p className="mb-1">Invia un messaggio su WhatsApp oppure chiamaci.</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success"
              >
                WhatsApp
              </a>
              <a
                href="tel:+393663283199"
                className="btn btn-outline-primary"
              >
                Chiama
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichiedereServizio;
