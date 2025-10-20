import React, { useEffect } from 'react';

const DiventareVolontario = () => {
  useEffect(() => {
<<<<<<< HEAD
    document.title = "Diventa uno di noi";
=======
    document.title = "Come diventare volontario";
>>>>>>> d11cca6 (first commit)
  }, []);

  return (
    <div className="container mt-5">
<<<<<<< HEAD
      <h2>Diventa uno di noi</h2>
      <p className="text-muted">Requisiti, iter di iscrizione, formazione iniziale e contatti per candidarsi come volontario.</p>
      <div className="mt-4">
        <a href="/moduli/modulo-iscrizione.pdf" className="btn btn-primary" download>
          Scarica modulo di iscrizione (PDF)
        </a>
      </div>
=======
      <h2>Come diventare volontario</h2>
      <p className="text-muted">Requisiti, iter di iscrizione, formazione iniziale e contatti per candidarsi come volontario.</p>
>>>>>>> d11cca6 (first commit)
    </div>
  );
};

export default DiventareVolontario;
