import React, { useEffect } from 'react';

const RichiedereServizio = () => {
  useEffect(() => {
    document.title = "Come richiedere il servizio";
  }, []);

<<<<<<< HEAD
  const associationPhone = "+39XXXXXXXXXX";
  const prefilled = encodeURIComponent("Buongiorno, vorrei richiedere un servizio.");
  const waUrl = `https://wa.me/${associationPhone.replace(/\D/g, '')}?text=${prefilled}`;

  return (
    <div className="container mt-5">
      <h2>Come richiedere il servizio</h2>
      <p className="text-muted">Contattaci su WhatsApp per richiedere il servizio.</p>
      <div className="mt-4 d-flex gap-2">
        <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-success">
          WhatsApp
        </a>
      </div>
=======
  return (
    <div className="container mt-5">
      <h2>Come richiedere il servizio</h2>
      <p className="text-muted">Informazioni su come richiedere trasporti sanitari, assistenza eventi, servizi AIB e altre attività.</p>
>>>>>>> d11cca6 (first commit)
    </div>
  );
};

export default RichiedereServizio;
