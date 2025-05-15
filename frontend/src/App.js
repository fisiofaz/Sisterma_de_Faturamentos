import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaginaLoja from './components/PaginaLoja';
import HistoricoGeral from './components/HistoricoGeral';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Inicial from './components/Inicial';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="menu-lateral" id="menu">
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/inicial">Início</Link></li>
            <li><Link to="/ortofisius">Ortofisi'us</Link></li>
            <li><Link to="/fisiomed-centro">Fisiomed Centro</Link></li>
            <li><Link to="/fisiomed-camobi">Fisiomed Camobi</Link></li>
            <li><Link to="/historico-geral">Histórico Geral</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicial" element={<Inicial />} />
          <Route path="/ortofisius" element={<PaginaLoja nomeLoja="Ortofisi'us" />} />
          <Route path="/fisiomed-centro" element={<PaginaLoja nomeLoja="Fisiomed Centro" />} />
          <Route path="/fisiomed-camobi" element={<PaginaLoja nomeLoja="Fisiomed Camobi" />} />
          <Route path="/historico-geral" element={<HistoricoGeral />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;