import { excluirRegistroGenerico, carregarTabelaGenerico, prepararDadosGrafico, gerarCorAleatoria  } from './utils.js'; // Importa a função utilitária

document.addEventListener('DOMContentLoaded', () => {
  carregarTabela();
});

const lojas = [
  { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
  { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
  { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
];

function criarLinhaHistoricoGeral(linha, registro, lojaNome, lojaChave, index) {
  linha.innerHTML = `
    <td>${lojaNome}</td>
    <td>${registro.data}</td>
    <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
    <td><button onclick="excluirRegistro('${lojaChave}', ${index})" title="Excluir registro">🗑️</button></td>
  `;
}

function carregarTabela(filtroLoja = 'todas', filtroData = '') {
  carregarTabelaGenerico(lojas, 'tabela-geral', criarLinhaHistoricoGeral, filtroLoja, filtroData);
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
  const dadosGrafico = prepararDadosGrafico(lojas);
  const ctx = document.getElementById('graficoFaturamento').getContext('2d');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: dadosGrafico,
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
  // Esta função foi movida para utils.js como gerarCorAleatoria
  return gerarCorAleatoria();
}

function excluirRegistro(lojaChave, index) {
  excluirRegistroGenerico(lojaChave, index, carregarTabela);
}