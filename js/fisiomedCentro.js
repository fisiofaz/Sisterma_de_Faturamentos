// ../js/fisiomedCentro.js
import { carregarDadosGenerico, atualizarTotaisGenerico, editarRegistroGenerico, excluirRegistroGenerico, formatarDataBR, formatarDataISO } from './utils.js';


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('faturamento-form');
  const dataInput = document.getElementById('data');
  const valorInput = document.getElementById('valor');
  const tabela = document.getElementById('historico-tabela');
  const totalDiaSpan = document.getElementById('total-dia');
  const totalMesSpan = document.getElementById('total-mes');
  const STORAGE_KEY = 'faturamento_fisiomed_centro';

  window.editarRegistro = function(index) {
    const camposEdicao = {
      data: {
        solicitarValor: (valorAtual) => prompt('Editar data (aaaa-mm-dd):', valorAtual),
        validarValor: (novoValor) => /^\d{4}-\d{2}-\d{2}$/.test(novoValor),
      },
      valor: {
        solicitarValor: (valorAtual) => prompt('Editar valor:', valorAtual),
        validarValor: (novoValor) => !isNaN(parseFloat(novoValor)),
        formatarValor: (novoValor) => parseFloat(novoValor).toFixed(2),
      },
    };
    editarRegistroGenerico(STORAGE_KEY, index, camposEdicao, carregarDados);
  };

  window.excluirRegistro = function(index) {
    excluirRegistroGenerico(STORAGE_KEY, index, carregarDados);
  };
  
  function criarLinhaFisiomedCentro(linha, registro, index) {
    const celulaData = linha.insertCell();
    const celulaValor = linha.insertCell();
    const celulaAcoes = linha.insertCell();

    celulaData.textContent = formatarDataBR(registro.data);
    celulaValor.textContent = `R$ ${parseFloat(registro.valor).toFixed(2)}`;
    celulaAcoes.classList.add('acoes');
    celulaAcoes.innerHTML = `
      <button class="editar" onclick="editarRegistro(${index})" title="Editar">✏️</button>
      <button class="excluir" onclick="excluirRegistro(${index})" title="Excluir">🗑️</button>
    `;
  }

  function carregarDados() {
    carregarDadosGenerico(STORAGE_KEY, 'historico-tabela', criarLinhaFisiomedCentro);
    atualizarTotaisGenerico(STORAGE_KEY, 'total-dia', 'total-mes'); // Usa a função genérica
  }


    form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = dataInput.value;
    const valor = valorInput.value;

    if (!data || !valor) return;

    const novoRegistro = { data, valor };
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    registros.push(novoRegistro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));

    dataInput.value = '';
    valorInput.value = '';

    carregarDados();
  });

  // Chama a função para carregar os dados inicialmente
  carregarDados();
});