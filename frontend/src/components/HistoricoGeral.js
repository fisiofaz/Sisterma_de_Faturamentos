import React, { useState, useEffect, useRef } from 'react'; // Importamos useRef
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faPrint } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { Link } from 'react-router-dom'; // Importamos Link para a navegação

function HistoricoGeral() {
  const [historicoGeral, setHistoricoGeral] = useState([]);
  const [filtroLoja, setFiltroLoja] = useState('todas');
  const [filtroData, setFiltroData] = useState('');
  const graficoRef = useRef(null);
  const chartInstance = useRef(null);
  const [faturamentosFiltrados, setFaturamentosFiltrados] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // Estado do menu
  const menuRef = useRef(null); // Referência para o menu
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

  useEffect(() => {
    const lojas = ['ortofisius', 'fisiomed-centro', 'fisiomed-camobi'];
    const todosFaturamentos = [];

    lojas.forEach(loja => {
      const chaveLocalStorage = `faturamentos-${loja}`;
      const historicoLoja = localStorage.getItem(chaveLocalStorage);
      if (historicoLoja) {
        const faturamentos = JSON.parse(historicoLoja);
        faturamentos.forEach(faturamento => {
          todosFaturamentos.push({ ...faturamento, loja: loja.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) });
        });
      }
    });

    todosFaturamentos.sort((a, b) => new Date(b.data) - new Date(a.data));
    setHistoricoGeral(todosFaturamentos);
    setIsLoading(false); // Define isLoading para false após carregar os dados iniciais
  }, []);

  useEffect(() => {
    const filtrados = historicoGeral.filter(item => {
      const lojaCorresponde = filtroLoja === 'todas' || item.loja.toLowerCase().includes(filtroLoja.toLowerCase().replace('faturamento_', '').replace('_', ' '));
      const dataCorresponde = !filtroData || item.data === filtroData;
      return lojaCorresponde && dataCorresponde;
    });
    setFaturamentosFiltrados(filtrados);

    const canvas = graficoRef.current;
    if (!canvas) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = filtrados.map(item => item.data);
    const dataSets = [];
    const lojasUnicas = [...new Set(filtrados.map(item => item.loja))];

    lojasUnicas.forEach(loja => {
      const data = filtrados.filter(item => item.loja === loja).map(item => item.valor);
      dataSets.push({
        label: loja,
        data: data,
        borderColor: getRandomColor(),
        fill: false,
      });
    });

    chartInstance.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: dataSets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [historicoGeral, filtroLoja, filtroData]);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleLimparFiltros = () => {
    setFiltroLoja('todas');
    setFiltroData('');
  };

  const handleImprimir = () => {
    window.print();
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
    <div className={`app-container ${theme}`}> {/* Aplica a classe do tema ao div principal */}
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
          <li><Link to="/inicial">Início</Link></li>
          <li><Link to="/ortofisius">Ortofisi’us</Link></li>
          <li><Link to="/fisiomed-centro">Fisiomed Centro</Link></li>
          <li><Link to="/fisiomed-camobi">Fisiomed Camobi</Link></li>
          <li><Link to="/historico-geral">Histórico Geral</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <header>
        <h1>
          <FontAwesomeIcon icon={faChartLine} /> Histórico Geral de Faturamentos
        </h1>
        <p>Visualize o histórico de faturamentos das lojas</p>
        <button id="toggle-theme" aria-label="Alternar tema" title="Alternar tema" onClick={toggleTheme}>
          🌓
        </button>
      </header>
      <main className="dashboard-container">
        <section className="filtros-section">
          <h2>Filtros</h2>
          <p>Selecione os filtros desejados para visualizar o histórico de faturamentos.</p>
          <div className="filtros">
            <div className="filtros-container">
              <div>
                <label htmlFor="filtro-loja">Loja:</label>
                <select id="filtro-loja" value={filtroLoja} onChange={(e) => setFiltroLoja(e.target.value)}>
                  <option value="todas">Todas</option>
                  <option value="faturamento_ortofisius">Ortofisi’us</option>
                  <option value="faturamento_fisiomed_centro">Fisiomed Centro</option>
                  <option value="faturamento_fisiomed_camobi">Fisiomed Camobi</option>
                </select>
              </div>
              <div>
                <label htmlFor="filtro-data">Data:</label>
                <input type="date" id="filtro-data" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
              </div>
              <div>
                <button onClick={handleLimparFiltros} aria-label="limpar">
                  Limpar
                </button>
              </div>
            </div>
            <div className="impressao-controls">
              <button onClick={handleImprimir} className="btn-imprimir" aria-label="Imprimir Histórico">
                <FontAwesomeIcon icon={faPrint} /> Imprimir Histórico
              </button>
            </div>
          </div>
        </section>
        <section className="tabela-section">
          <h2>Histórico de Faturamento</h2>
          <p>Visualize o histórico de faturamentos das lojas.</p>
          <table>
            <thead>
              <tr>
                <th scope="col">Loja</th>
                <th scope="col">Data</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody id="tabela-geral">
              {faturamentosFiltrados.map((item, index) => (
                <tr key={index}>
                  <td>{item.loja}</td>
                  <td>{item.data}</td>
                  <td>{item.valor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {faturamentosFiltrados.length === 0 && <p>Nenhum faturamento encontrado com os filtros aplicados.</p>}
        </section>
        <section className="grafico-section">
          <h2>Gráfico Comparativo de Faturamento</h2>
          <p>Visualize o gráfico comparativo de faturamento entre as lojas.</p>
          <canvas ref={graficoRef} width="600" height="300"></canvas>
          <p id="descricao-grafico-historico" className="sr-only">
            Este gráfico de linhas exibe o histórico de faturamento ao longo do tempo. O eixo horizontal
            representa os períodos de tempo (dias, semanas ou meses, dependendo dos dados), e o eixo vertical
            representa o valor do faturamento em reais. Uma ou mais linhas no gráfico representam o faturamento
            de cada loja (ou o faturamento total, dependendo da visualização), permitindo a análise das tendências
            de faturamento e a comparação do desempenho ao longo do tempo.
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; © 2025 Sistema de Faturamento - Feito por: Fábio André Zatta</p>
      </footer>
      {/* Scripts serão gerenciados de outra forma */}
    </div>
  );
}

export default HistoricoGeral;