import React, { useEffect, useState } from 'react';

const Corsi = () => {
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    document.title = "I NOSTRI CORSI";
  }, []);

  return (
    <div className="container mt-5 position-relative">
      <h2>I NOSTRI CORSI</h2>
      <p className="text-muted">Informazioni sui corsi: PBLSD, PTC, corso soccorritore e formazione per la comunità.</p>

      <div className="corsi-layout">
        <div className="corsi-image-wrap">
          <img
            src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761085531/IMG-20251020-WA0034_wlnm0w.jpg"
            alt="Corsi - immagine"
            className="corsi-image"
            loading="lazy"
          />
        </div>
        <div className="corsi-text">
          <h3>Corsi di educazione sanitaria e di Primo Soccorso</h3>
          <p>
            Organizziamo corsi di formazione e aggiornamento in collaborazione con <strong>CSE FORMAZIONE</strong> rivolti sia al personale sanitario che alla popolazione,
            con l’obiettivo di diffondere la cultura della prevenzione, del primo soccorso e della sicurezza, migliorando la capacità di intervento e di aiuto reciproco in ogni situazione di emergenza.
          </p>
        </div>
      </div>

      {showInfo && (
        <div
          className="position-fixed"
          style={{ bottom: '16px', right: '16px', zIndex: 1030, maxWidth: '320px' }}
          aria-label="Richiedi informazioni"
        >
          <div className="card shadow position-relative">
            <div className="card-body p-3">
              <button
                type="button"
                className="btn-close position-absolute end-0 top-0 m-2"
                aria-label="Chiudi"
                onClick={() => setShowInfo(false)}
              ></button>
              <h3 className="card-title mb-2">Richiedi informazioni</h3>
              <p className="mb-2">Contattaci su WhatsApp oppure scrivici una email.</p>
              <div className="d-flex flex-wrap gap-2">
                <a
                  href="https://wa.me/393663283199"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:crocedorosudpontino@virgilio.it?subject=Informazioni%20corsi"
                  className="btn btn-outline-primary"
                >
                  Scrivi una email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Corsi;
