
import React from 'react';
import '../App.css'; // O preloader provavelmente usa estilos do App.css

function Preloader({ isLoading }) {
  if (!isLoading) {
    return null; // Não renderiza nada se não estiver carregando
  }

  return (
    <div id="preloader">
      <div className="loader"></div>
    </div>
  );
}

export default Preloader;