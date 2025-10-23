import React, { useEffect } from 'react';

const CinquePerMille = () => {
  useEffect(() => {
    document.title = "5 x mille";
  }, []);

  return (
    <div className="container mt-5">
      <h2>5 X MILLE</h2>
      <p className="text-muted">Sostieni la Croce d'Oro Sud Pontino destinando il tuo 5 x mille. Codice fiscale: <strong>INSERT-CF</strong>.</p>

      <div className="cinque-showcase mt-4">
        <div className="cinque-showcase__media">
          <img
            className="cinque-showcase__img"
            src="https://res.cloudinary.com/dkbahjqa6/image/upload/v1761056751/IMG-20251020-WA0006_zvzdlv.jpg"
            alt="5 x mille - Croce d'Oro Sud Pontino"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default CinquePerMille;
