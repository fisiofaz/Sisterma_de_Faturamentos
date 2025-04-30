document.addEventListener('DOMContentLoaded', () => {
  carregarTabela();
});

function carregarTabela(filtroLoja = 'todas', filtroData = '') {
  const tabela = document.getElementById('tabela-geral');
  tabela.innerHTML = ''; // limpa a tabela

  const lojas = [
    { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
    { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
    { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
  ];

  lojas.forEach(loja => {
    if (filtroLoja !== 'todas' && filtroLoja !== loja.chave) return;

    const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];

    registros.forEach(registro => {
      if (filtroData && registro.data !== filtroData) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${loja.nome}</td>
        <td>${registro.data}</td>
        <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
      `;
      tabela.appendChild(tr);
    });
  });

  gerarGrafico(); 
}

function filtrar() {
  const loja = document.getElementById('filtro-loja').value;
  const data = document.getElementById('filtro-data').value;
  carregarTabela(loja, data);
}

function limparFiltros() {
  document.getElementById('filtro-loja').value = 'todas';
  document.getElementById('filtro-data').value = '';
  carregarTabela();
}

let chartInstance;

function gerarGrafico() {
  const lojas = [
    { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
    { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
    { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
  ];

  const datasUnicas = new Set();
  const dadosPorLoja = {};

  lojas.forEach(loja => {
    const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];

    registros.forEach(reg => {
      datasUnicas.add(reg.data);

      if (!dadosPorLoja[loja.nome]) {
        dadosPorLoja[loja.nome] = {};
      }

      dadosPorLoja[loja.nome][reg.data] = parseFloat(reg.valor);
    });
  });

  const datasOrdenadas = Array.from(datasUnicas).sort();

  const datasets = lojas.map(loja => {
    const valores = datasOrdenadas.map(data => dadosPorLoja[loja.nome]?.[data] || 0);

    return {
      label: loja.nome,
      data: valores,
      fill: false,
      borderColor: gerarCor(),
      tension: 0.1
    };
  });

  const ctx = document.getElementById('graficoFaturamento').getContext('2d');

  // Destrói o gráfico anterior se já existir
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line', // Você pode trocar para 'bar'
    data: {
      labels: datasOrdenadas,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolução do Faturamento por Loja'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: valor => 'R$ ' + valor.toFixed(2)
          }
        }
      }
    }
  });
}

function gerarCor() {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgb(${r}, ${g}, ${b})`;
}

