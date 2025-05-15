// Compoentes Geral das Lojas
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Importa o CSS global

function PaginaLoja(props) {
  const [data, setData] = useState('');
  const [valor, setValor] = useState('');
  const [historicoFaturamentos, setHistoricoFaturamentos] = useState([]);
  const [itemParaEditarIndex, setItemParaEditarIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar a abertura do menu
  const menuRef = useRef(null); // Referência para o menu lateral
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Estado do tema
  const [isLoading, setIsLoading] = useState(true); // Estado do preloader

  const chaveLocalStorage = `faturamentos-${props.nomeLoja.toLowerCase().replace(' ', '-')}`;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persiste a preferência
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (data && valor) {
      if (itemParaEditarIndex !== null) {
        const novoHistorico = [...historicoFaturamentos];
        novoHistorico[itemParaEditarIndex] = { data: data, valor: parseFloat(valor) };
        setHistoricoFaturamentos(novoHistorico);
        localStorage.setItem(chaveLocalStorage, JSON.stringify(novoHistorico));
        setItemParaEditarIndex(null);
      } else {
        const novoFaturamento = { data: data, valor: parseFloat(valor) };
        const historicoSalvo = localStorage.getItem(chaveLocalStorage);
        const historicoAtual = historicoSalvo ? JSON.parse(historicoSalvo) : [];
        const novoHistorico = [...historicoAtual, novoFaturamento];
        localStorage.setItem(chaveLocalStorage, JSON.stringify(novoHistorico));
        setHistoricoFaturamentos(novoHistorico);
      }
      setData('');
      setValor('');
    } else {
      alert('Por favor, preencha a data e o valor.');
    }
  };

  useEffect(() => {
    const historicoSalvo = localStorage.getItem(chaveLocalStorage);
    if (historicoSalvo) {
      setHistoricoFaturamentos(JSON.parse(historicoSalvo));
    }
    setIsLoading(false); // Define isLoading para false após tentar carregar os dados
  }, [chaveLocalStorage]);

  const handleExcluir = (index) => {
    const novoHistorico = [...historicoFaturamentos];
    novoHistorico.splice(index, 1);
    setHistoricoFaturamentos(novoHistorico);
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novoHistorico));
  };

  const handleEditar = (index) => {
    const faturamentoParaEditar = historicoFaturamentos[index];
    setData(faturamentoParaEditar.data);
    setValor(faturamentoParaEditar.valor.toString());
    setItemParaEditarIndex(index);
  };

  const handleCancelarEdicao = () => {
    setData('');
    setValor('');
    setItemParaEditarIndex(null);
  };

  // Lógica para fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && event.target !== document.getElementById('menuToggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.className = theme; // Aplica a classe do tema ao body
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}> {/* Adiciona uma classe para o container geral */}
      {isLoading && (
        <div id="preloader">
          <div className="loader"></div>
        </div>
      )}
      <button className="menu-toggle" id="menuToggle" aria-label="Abrir Menu" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <nav className={`menu-lateral ${menuOpen ? 'open' : ''}`} id="menu" ref={menuRef}>
        <ul>
          <li><Link to="/">Login</Link></li>
          <li><Link to="/inicial">Início</Link></li>
          <li><Link to="/ortofisius">Ortofisi’us</Link></li>
          <li><Link to="/fisiomed-centro">Fisiomed Centro</Link></li>
          <li><Link to="/fisiomed-camobi">Fisiomed Camobi</Link></li>
          <li><Link to="/historico-geral">Histórico Geral</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <header>
        <button id="toggle-theme" title="Alternar tema" aria-label="Alternar tema" onClick={toggleTheme}>
          🌓
        </button>
        <h1>Faturamento Diário - {props.nomeLoja}</h1>
        <p>Gerencie os registros de faturamento</p>
      </header>
      <main>
        <section className="form-section" onSubmit={handleSubmit}>
          <h2>Registrar Faturamento</h2>
          <p>Preencha os campos abaixo para registrar o faturamento diário.</p>
          <form id="faturamento-form">
            <label htmlFor="data">Data:</label>
            <input
              type="date"
              id="data"
              required
              value={data}
              onChange={(event) => setData(event.target.value)}
            />
            <label htmlFor="valor">Valor (R$):</label>
            <input
              type="number"
              id="valor"
              step="0.01"
              required
              value={valor}
              onChange={(event) => setValor(event.target.value)}
            />
            <button type="submit">{itemParaEditarIndex !== null ? 'Salvar Edição' : 'Salvar'}</button>
            {itemParaEditarIndex !== null && (
              <button type="button" onClick={handleCancelarEdicao}>Cancelar</button>
            )}
          </form>
        </section>
        <section className="tabela-section">
          <h2>Histórico de Faturamento</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Valor</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody id="historico-tabela">
              {historicoFaturamentos.map((faturamento, index) => (
                <tr key={index}>
                  <td>{faturamento.data}</td>
                  <td>R$ {faturamento.valor.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEditar(index)}>Editar</button>
                    <button onClick={() => handleExcluir(index)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section id="resumo-totais" className="totais">
          <p>
            <strong>Total do dia:</strong> R$ <span id="total-dia">0,00</span>
          </p>
          <p>
            <strong>Total do mês:</strong> R$ <span id="total-mes">0,00</span>
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; © 2025 Sistema de Faturamento - Feito por: Fábio André Zatta</p>
      </footer>
      {/* Os scripts serão gerenciados de outra forma no React */}
    </div>
  );
}

export default PaginaLoja;