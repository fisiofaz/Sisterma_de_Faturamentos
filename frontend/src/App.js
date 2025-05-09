import React, { useState } from 'react';
import './App.css';
import Button from './components/Button';
import Input from './components/Input';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Nome: ${nome}, Email: ${email}`);
  };

  return (
    <div className="App">
      <Header
        title="Sistema de Faturamento"       
      />
      <main className="App-main">
        <h2>Login</h2>
        <p>Bem-vindo de volta! Faça login para continuar.</p>
        <p id="mensagem-usuario"></p>
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Nome"
            id="nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
          />
          <Button type="submit" className="btn-login">
            Enviar
          </Button>
        </form>
      </main> 
      <Footer  copyright="© 2025 Sistema de Faturamento - Feito por: Fábio André Zatta" />
    </div>
  );
}

export default App;