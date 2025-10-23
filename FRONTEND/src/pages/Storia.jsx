import React from 'react';

const Storia = () => {
  React.useEffect(() => { document.title = 'STORIA'; }, []);
  return (
    <div className="container mt-5">
      <h2>LA NOSTRA STORIA</h2>
      <p>
        La Croce d'Oro Sud Pontino nasce con l'obiettivo di servire la comunità attraverso la Protezione Civile,
        l'assistenza sanitaria e la promozione della cultura del volontariato. Negli anni abbiamo ampliato mezzi,
        competenze e attività sul territorio, collaborando con enti locali, associazioni e cittadini per rispondere
        ai bisogni emergenti.
      </p>
      <p>
        Continuiamo a crescere grazie all'impegno dei volontari e al sostegno della comunità, con iniziative,
        corsi di formazione e progetti orientati alla prevenzione e alla solidarietà.
      </p>
    </div>
  );
};

export default Storia;
