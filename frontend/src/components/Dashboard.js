import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Chart } from 'chart.js/auto';
import { Link } from 'react-router-dom'; // Importamos Link

function Dashboard() {
  const [faturamentoOrtofisiusMes, setFaturamentoOrtofisiusMes] = useState(0);
  const [faturamentoFisiomedCentroMes, setFaturamentoFisiomedCentroMes] = useState(0);
  const [faturamentoFisiomedCamobiMes, setFaturamentoFisiomedCamobiMes] = useState(0);
  const graficoRef = useRef(null);
  const chartInstance = useRef(null);
  const [filtroMes, setFiltroMes] = useState('');
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
    const ortofisiusData = localStorage.getItem('faturamentos-ortofisius');
    const fisiomedCentroData = localStorage.getItem('faturamentos-fisiomed-centro');
    const fisiomedCamobiData = localStorage.getItem('faturamentos-fisiomed-camobi');

    const ortofisiusFaturamentos = ortofisiusData ? JSON.parse(ortofisiusData) : [];
    const fisiomedCentroFaturamentos = fisiomedCentroData ? JSON.parse(fisiomedCentroData) : [];
    const fisiomedCamobiFaturamentos = fisiomedCamobiData ? JSON.parse(fisiomedCamobiData) : [];

    const calcularTotalMes = (faturamentos, mesFiltro) => {
      return faturamentos.reduce((total, item) => {
        const data = new Date(item.data);
        const mes = data.toISOString().slice(0, 7); // FormatoYYYY-MM
        if (!mesFiltro || mes === mesFiltro) {
          return total + parseFloat(item.valor);
        }
        return total;
      }, 0);
    };

    setFaturamentoOrtofisiusMes(calcularTotalMes(ortofisiusFaturamentos, filtroMes));
    setFaturamentoFisiomedCentroMes(calcularTotalMes(fisiomedCentroFaturamentos, filtroMes));
    setFaturamentoFisiomedCamobiMes(calcularTotalMes(fisiomedCamobiFaturamentos, filtroMes));
    setIsLoading(false); // Define isLoading para false após os cálculos
  }, [filtroMes]);

  useEffect(() => {
    const canvas = graficoRef.current;
    if (!canvas) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Ortofisi’us', 'Fisiomed Centro', 'Fisiomed Camobi'],
        datasets: [
          {
            label: 'Faturamento Mensal (R$)',
            data: [faturamentoOrtofisiusMes, faturamentoFisiomedCentroMes, faturamentoFisiomedCamobiMes],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
          },
        ],
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
  }, [faturamentoOrtofisiusMes, faturamentoFisiomedCentroMes, faturamentoFisiomedCamobiMes]);

  const handleFiltrarMes = (event) => {
    setFiltroMes(event.target.value);
  };

  const handleExportarPDF = () => {
    import('html2pdf.js').then(html2pdf => {
      const element = document.querySelector('.dashboard-container');
      if (element) {
        html2pdf.default(element);
      } else {
        console.error('Elemento dashboard-container não encontrado.');
      }
    });
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
          <FontAwesomeIcon icon={faChartBar} /> Dashboard Geral
        </h1>
        <p>Resumo do faturamento das lojas</p>
        <button id="toggle-theme" aria-label="Alternar tema" title="Alternar tema" onClick={toggleTheme}>
          🌓
        </button>
      </header>
      <main className="dashboard-container">
        <h2>Filtros</h2>
        <p>Selecione os filtros desejados para visualizar o histórico de faturamentos.</p>
        <section className="filtros-exportar">
          <label htmlFor="mesFiltro">
            <FontAwesomeIcon icon={faFilePdf} /> Filtrar por Mês:
          </label>
          <input type="month" id="mesFiltro" value={filtroMes} onChange={handleFiltrarMes} />
          <button onClick={handleExportarPDF} aria-label="Exportar dashboard para PDF">
            <FontAwesomeIcon icon={faFilePdf} /> Exportar PDF
          </button>
        </section>

        <section className="resumos">
          <div id="destaques-mes">
            <h2>Resumo Mensal</h2>
            <div className="destaques-loja">
              <h3>Ortofisi’us</h3>
              <p>
                <strong>Total Mês:</strong> R$ {faturamentoOrtofisiusMes.toFixed(2)}
              </p>
            </div>
            <div className="destaques-loja">
              <h3>Fisiomed Centro</h3>
              <p>
                <strong>Total Mês:</strong> R$ {faturamentoFisiomedCentroMes.toFixed(2)}
              </p>
            </div>
            <div className="destaques-loja">
              <h3>Fisiomed Camobi</h3>
              <p>
                <strong>Total Mês:</strong> R$ {faturamentoFisiomedCamobiMes.toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        <section className="grafico-section">
          <h2>Gráfico de Desempenho Mensal</h2>
          <p>Visualize o gráfico comparativo de faturamento entre as lojas.</p>
          <canvas id="grafico-dashboard" ref={graficoRef} width="600" height="300"></canvas>
          <p id="descricao-grafico-dashboard" className="sr-only">
            Este gráfico de barras apresenta uma comparação do faturamento entre as lojas Ortofisi’us,
            Fisiomed Centro e Fisiomed Camobi para o mês selecionado. O eixo horizontal representa as lojas e o
            eixo vertical representa o valor do faturamento em reais. A altura de cada barra indica o faturamento
            mensal correspondente de cada loja, permitindo uma comparação visual rápida do desempenho financeiro
            de cada unidade.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;