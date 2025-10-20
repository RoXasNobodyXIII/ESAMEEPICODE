import React from 'react';

const Galleria = () => {
<<<<<<< HEAD
  React.useEffect(() => {
    document.title = "Galleria";
  }, []);
=======
>>>>>>> d11cca6 (first commit)
  return (
    <div className="container mt-5">
      <h1>Galleria</h1>
      <p>Immagini e video delle nostre attività e interventi.</p>
<<<<<<< HEAD
=======
      <div className="row">
        <div className="col-md-4 mb-4">
          <img src="https://via.placeholder.com/300x200?text=Corso+Primo+Soccorso" className="img-fluid" alt="Corso Primo Soccorso" />
          <p className="text-center mt-2">Corso di Primo Soccorso</p>
        </div>
        <div className="col-md-4 mb-4">
          <img src="https://via.placeholder.com/300x200?text=Intervento+Alluvione" className="img-fluid" alt="Intervento Alluvione" />
          <p className="text-center mt-2">Intervento durante l'alluvione</p>
        </div>
        <div className="col-md-4 mb-4">
          <img src="https://via.placeholder.com/300x200?text=Giornata+Solidarieta" className="img-fluid" alt="Giornata Solidarietà" />
          <p className="text-center mt-2">Giornata di Solidarietà</p>
        </div>
      </div>
>>>>>>> d11cca6 (first commit)
    </div>
  );
};

export default Galleria;
