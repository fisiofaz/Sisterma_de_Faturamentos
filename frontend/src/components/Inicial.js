import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Importa o CSS global
import Preloader from './Preloader'; // Importa o componente de preloader
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNotesMedical,
  faClinicMedical,
  faHospitalUser,
  faChartLine,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

function Inicial() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Estado do tema
  const [isLoading, setIsLoading] = useState(true); // Estado do preloader

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persiste a preferência
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('usuarioLogado');
    navigate('/inicial'); // Redireciona para a página inicial após o logout
  }, [navigate]);

  useEffect(() => {
    document.body.className = theme; // Aplica a classe do tema ao body

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
      navigate('/inicial'); // Redireciona para a página de login se não houver usuário logado
    } else {
      setNomeUsuario(usuarioLogado);
    }

    const logoutButton = document.getElementById('logout'); // Ref para o botão de logout no header
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }

    const logoutMenuButton = document.getElementById('logout-menu'); // Ref para o botão de logout no menu
    if (logoutMenuButton) {
      logoutMenuButton.addEventListener('click', handleLogout);
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && event.target !== document.getElementById('menuToggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Simula o carregamento (você pode remover isso se não tiver carregamento de dados específico)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer); // Limpa o timer se o componente for desmontado
      if (logoutButton) {
        logoutButton.removeEventListener('click', handleLogout);
      }
      if (logoutMenuButton) {
        logoutMenuButton.removeEventListener('click', handleLogout);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate, handleLogout, theme]);

  return (
    <div className={`app-container ${theme}`}> 
      <Preloader isLoading={isLoading} /> 
      <button className="menu-toggle" id="menuToggle" aria-label="Abrir Menu" onClick={toggleMenu}> {/* Adiciona onClick */}
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <nav className={`menu-lateral ${menuOpen ? 'open' : ''}`} id="menu" ref={menuRef}> {/* Classe dinâmica e ref */}
        <ul>
          <li><Link to="/inicial">Início</Link></li>
          <li><Link to="/ortofisius">Ortofisi’us</Link></li>
          <li><Link to="/fisiomed-centro">Fisiomed Centro</Link></li>
          <li><Link to="/fisiomed-camobi">Fisiomed Camobi</Link></li>
          <li><Link to="/historico-geral">Histórico Geral</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li>
            <button id="logout-menu" onClick={handleLogout} aria-label="Sair">
              <FontAwesomeIcon icon={faSignOutAlt} /> Sair
            </button>
          </li>
        </ul>
      </nav>
      <header>
        <button id="toggle-theme" aria-label="Alternar tema" title="Alternar tema" onClick={toggleTheme}> {/* Adiciona onClick */}
          🌓
        </button>
        <h1>
          Sistema de Faturamento - <span id="nome-usuario">{nomeUsuario}</span>
        </h1>
        <p>Gerencie os registros das lojas</p>
        <button id="logout" className="btn-logout" aria-label="Sair">
          <FontAwesomeIcon icon={faSignOutAlt} /> Sair
        </button>
      </header>
      <main className="menu-container">
        <section className="loja-1">
          <Link to="/ortofisius" className="btn-P loja-1">
            <FontAwesomeIcon icon={faNotesMedical} />
            Ortofisi’us
          </Link>
        </section>
        <section className="loja-2">
          <Link to="/fisiomed-centro" className="btn-P loja-2">
            <FontAwesomeIcon icon={faClinicMedical} />
            Fisiomed Centro
          </Link>
        </section>
        <section className="loja-3">
          <Link to="/fisiomed-camobi" className="btn-P loja-3">
            <FontAwesomeIcon icon={faHospitalUser} />
            Fisiomed Camobi
          </Link>
        </section>
        <section className="historico">
          <Link to="/historico-geral" className="btn-P historico">
            <FontAwesomeIcon icon={faChartLine} />
            Histórico Geral
          </Link>
        </section>
        <section className="dashboard">
          <Link to="/dashboard" className="btn-P dashboard">
            <FontAwesomeIcon icon={faChartLine} />
            Dashboard
          </Link>
        </section>
      </main>
      <footer>
        <p>© 2025 Sistema de Faturamento - Projeto de Fábio André Zatta</p>
      </footer>
      {/* Scripts serão gerenciados de outra forma */}
    </div>
  );
}

export default Inicial;