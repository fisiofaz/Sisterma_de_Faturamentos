import React from 'react';
import Button from './Button'; // Importe o componente Button

function Header({ title, description }) {
  return (
    <header className="app-header">
      <Button id="toggle-theme" title="Alternar tema">
        🌓
      </Button>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

export default Header;